import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Message, Patient } from '@/types/medical';
import { Mic, MicOff, Send, Loader2 } from 'lucide-react';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { ScrollArea } from '@/components/ui/scroll-area';
import { findPromptForExam } from '@/utils/examPrompts';

interface ChatInterfaceProps {
  patient: Patient;
  chatUrl: string;
  transcriptionUrl?: string;
  onReportGenerated: (report: string) => void;
}

export const ChatInterface = ({ patient, chatUrl, transcriptionUrl, onReportGenerated }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isRecording, audioBlob, startRecording, stopRecording, clearAudio } = useAudioRecorder();
  const systemPromptRef = useRef<string>('');

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send initial message when chat starts
  useEffect(() => {
    const initializeChat = () => {
      const examPrompt = findPromptForExam(patient.modality, patient.procedure);
      if (examPrompt) {
        systemPromptRef.current = examPrompt;
      }
      
      // Add friendly message to UI only
      const friendlyMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sou a Manuela assistente virtual e vou fazer algumas perguntas para coletar todas informações prévias importantes para realização do seu exame com segurança. Vamos cuidar de você. Fique à vontade para me responder em texto ou em áudio.',
        timestamp: new Date(),
      };
      setMessages([friendlyMessage]);
    };
    
    initializeChat();
  }, []); // Empty dependency array ensures this runs only once on mount

  const sendMessage = async (text: string, systemPrompt?: string, skipAddingToUI?: boolean) => {
    if (!text.trim()) return;

    // Only add to UI if not skipped (for initial technical message)
    if (!skipAddingToUI) {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: text,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
      setInputText('');
    }
    
    setLoading(true);

    try {
      const url = new URL(chatUrl);
      url.searchParams.append('message', text);
      url.searchParams.append('patientId', patient.id || patient.patientId || '');
      url.searchParams.append('patientName', patient.name || '');
      url.searchParams.append('patientControl', patient.patientId || '');
      url.searchParams.append('modality', patient.modality || '');
      url.searchParams.append('procedure', patient.procedure || '');
      url.searchParams.append('conversationHistory', JSON.stringify(messages));
      // Always include systemPrompt if available
      const promptToSend = systemPrompt || systemPromptRef.current;
      if (promptToSend) {
        url.searchParams.append('systemPrompt', promptToSend);
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', response.status, errorText);
        throw new Error('Erro ao enviar mensagem');
      }

      const data = await response.json();
      
      // Handle different response formats
      let responseContent = '';
      if (typeof data === 'string') {
        responseContent = data;
      } else if (data.output) {
        responseContent = data.output;
      } else if (data.response) {
        responseContent = data.response;
      } else if (data.message) {
        responseContent = data.message;
      } else if (data.choices?.[0]?.message?.content) {
        responseContent = data.choices[0].message.content;
      } else {
        responseContent = JSON.stringify(data);
      }
      
      // Robust final report detection
      const detectFinalReport = (content: string, dataObj: any): string | null => {
        console.log('=== DETECTANDO RELATÓRIO FINAL ===');
        console.log('Conteúdo:', content.substring(0, 200) + '...');
        
        // 1. Check explicit flags
        if (dataObj.isFinalReport || dataObj.isReport || dataObj.report) {
          console.log('Flag explícita detectada');
          if (typeof dataObj.report === 'string') {
            return dataObj.report;
          }
          if (dataObj.reportData || dataObj.formData) {
            return JSON.stringify(dataObj.reportData || dataObj.formData);
          }
        }
        
        // 2. Check for final report keywords
        const lowerContent = content.toLowerCase();
        const finalReportKeywords = [
          'relatório final',
          'relatorio final',
          'resumo final',
          'resumo da avaliação médica',
          'resumo da avaliacao medica',
          'resumo das informações coletadas',
          'resumo das informacoes coletadas',
          'resumo do atendimento',
          'resumo médico',
          'resumo medico',
          'resumo das suas respostas',
          'resumo das respostas',
          'para finalizar',
          'aqui está um resumo',
          'aqui esta um resumo'
        ];
        
        const hasFinalReportKeyword = finalReportKeywords.some(keyword => 
          lowerContent.includes(keyword)
        );
        
        if (hasFinalReportKeyword) {
          console.log('Palavra-chave de relatório final detectada');
          // Try to extract JSON from markdown code blocks
          const jsonMatch = content.match(/```json\s*\n?([\s\S]*?)\n?```/);
          if (jsonMatch) {
            console.log('JSON em markdown detectado');
            return jsonMatch[1].trim();
          }
          // If content itself is JSON
          if (content.trim().startsWith('{')) {
            console.log('Conteúdo é JSON direto');
            return content.trim();
          }
          // Return markdown text as-is (will be processed by Index)
          console.log('Retornando texto markdown completo');
          return content;
        }
        
        // 3. Check if content is JSON with medical fields
        if (content.trim().startsWith('{')) {
          try {
            const parsed = JSON.parse(content);
            // Check for common medical form fields
            const hasMedicalFields = parsed.motivoExame || parsed.problemaSaude || 
                                     parsed.localizacao || parsed.joelhoFalseia ||
                                     parsed.lado || parsed.tipoExame;
            if (hasMedicalFields) {
              console.log('JSON com campos médicos detectado');
              return content.trim();
            }
          } catch (e) {
            // Not valid JSON
          }
        }
        
        console.log('Nenhum relatório final detectado');
        return null;
      };
      
      const finalReport = detectFinalReport(responseContent, data);
      
      if (finalReport) {
        console.log('Final report detected, triggering navigation');
        onReportGenerated(finalReport);
        return; // Don't add the report to chat messages
      }
      
      // Only add assistant message if it's not a final report
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar a mensagem. Verifique a URL do webhook.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAudioSubmit = async () => {
    if (!audioBlob) return;

    if (!transcriptionUrl) {
      toast({
        title: 'Configuração Necessária',
        description: 'Configure a URL de transcrição nas configurações (ícone ⚙️)',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    console.log('=== INICIANDO ENVIO DE ÁUDIO ===');
    console.log('URL de transcrição:', transcriptionUrl);
    console.log('Tamanho do blob:', audioBlob.size, 'bytes');
    console.log('Tipo do blob:', audioBlob.type);
    
    try {
      // Cria o arquivo com nome e tipo corretos
      const file = new File([audioBlob], 'audio.webm', { 
        type: audioBlob.type || 'audio/webm' 
      });
      
      console.log('Arquivo criado:', {
        name: file.name,
        size: file.size,
        type: file.type
      });

      const formData = new FormData();
      formData.append('data00', file);
      formData.append('patientId', patient.id || patient.patientId || '');
      formData.append('patientName', patient.name || '');
      formData.append('patientControl', patient.patientId || '');
      formData.append('modality', patient.modality || '');
      formData.append('procedure', patient.procedure || '');
      formData.append('conversationHistory', JSON.stringify(messages));
      // Always include systemPrompt
      if (systemPromptRef.current) {
        formData.append('systemPrompt', systemPromptRef.current);
      }
      
      console.log('FormData criado com dados do paciente, enviando requisição...');

      const transcriptionResponse = await fetch(transcriptionUrl, {
        method: 'POST',
        body: formData,
      });

      console.log('Resposta recebida:', {
        status: transcriptionResponse.status,
        statusText: transcriptionResponse.statusText,
        headers: Object.fromEntries(transcriptionResponse.headers.entries())
      });

      if (!transcriptionResponse.ok) {
        const errorText = await transcriptionResponse.text().catch(() => '');
        console.error('Erro na resposta:', errorText);
        throw new Error(`Erro na transcrição (${transcriptionResponse.status}): ${errorText}`);
      }

      const contentType = transcriptionResponse.headers.get('content-type') || '';
      console.log('Content-Type da resposta:', contentType);
      
      let data;
      if (contentType.includes('application/json')) {
        data = await transcriptionResponse.json();
        console.log('Resposta JSON completa:', data);
      } else {
        const text = await transcriptionResponse.text();
        console.log('Resposta texto:', text);
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error('Resposta inválida do servidor');
        }
      }

      // O webhook retorna a pergunta da IA no campo 'output'
      const aiResponse = data.output || data.message || data.response || '';
      console.log('Resposta da IA extraída:', aiResponse);

      if (aiResponse) {
        // Check if audio response is a final report
        const detectFinalReport = (content: string, dataObj: any): string | null => {
          console.log('=== DETECTANDO RELATÓRIO FINAL (AUDIO) ===');
          if (dataObj.isFinalReport || dataObj.isReport || dataObj.report) {
            if (typeof dataObj.report === 'string') return dataObj.report;
            if (dataObj.reportData || dataObj.formData) return JSON.stringify(dataObj.reportData || dataObj.formData);
          }
          
          const lowerContent = content.toLowerCase();
          const finalReportKeywords = [
            'relatório final',
            'relatorio final',
            'resumo final',
            'resumo da avaliação médica',
            'resumo da avaliacao medica',
            'resumo das informações coletadas',
            'resumo das informacoes coletadas',
            'resumo do atendimento',
            'resumo médico',
            'resumo medico',
            'resumo das suas respostas',
            'resumo das respostas',
            'para finalizar',
            'aqui está um resumo',
            'aqui esta um resumo'
          ];
          
          if (finalReportKeywords.some(keyword => lowerContent.includes(keyword))) {
            console.log('Palavra-chave de relatório final detectada no áudio');
            const jsonMatch = content.match(/```json\s*\n?([\s\S]*?)\n?```/);
            if (jsonMatch) return jsonMatch[1].trim();
            if (content.trim().startsWith('{')) return content.trim();
            // Return markdown text as-is
            return content;
          }
          
          if (content.trim().startsWith('{')) {
            try {
              const parsed = JSON.parse(content);
              const hasMedicalFields = parsed.motivoExame || parsed.problemaSaude || 
                                       parsed.localizacao || parsed.joelhoFalseia ||
                                       parsed.lado || parsed.tipoExame;
              if (hasMedicalFields) return content.trim();
            } catch (e) {}
          }
          
          return null;
        };
        
        const finalReport = detectFinalReport(aiResponse, data);
        
        if (finalReport) {
          console.log('Final report detected from audio, triggering navigation');
          clearAudio();
          onReportGenerated(finalReport);
          return;
        }
        
        // Adiciona a resposta da IA ao chat
        const assistantMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        clearAudio();
        
        toast({
          title: 'Sucesso',
          description: 'Áudio processado com sucesso',
        });
      } else {
        throw new Error('Resposta vazia do servidor');
      }
    } catch (error) {
      console.error('=== ERRO NO PROCESSAMENTO DE ÁUDIO ===');
      console.error('Erro completo:', error);
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro desconhecido ao processar áudio',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      console.log('=== FIM DO PROCESSAMENTO ===');
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto h-[600px] flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="text-lg">
          Atendimento: {patient.name} (ID: {patient.patientId})
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        <div className="space-y-2">
          <div className="flex gap-2">
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="min-h-[80px]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(inputText, systemPromptRef.current);
                }
              }}
              disabled={loading}
            />
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => sendMessage(inputText, systemPromptRef.current)}
                disabled={loading || !inputText.trim()}
                size="icon"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
              <Button
                variant={isRecording ? 'destructive' : 'secondary'}
                onClick={isRecording ? stopRecording : startRecording}
                size="icon"
                disabled={loading}
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {audioBlob && (
            <div className="flex gap-2 items-center p-2 bg-muted rounded-lg">
              <audio src={URL.createObjectURL(audioBlob)} controls className="flex-1" />
              <Button onClick={handleAudioSubmit} disabled={loading}>
                Enviar Áudio
              </Button>
              <Button variant="ghost" onClick={clearAudio}>
                Cancelar
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};