import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Message, Patient } from '@/types/medical';
import { Mic, MicOff, Send, Loader2 } from 'lucide-react';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { ScrollArea } from '@/components/ui/scroll-area';

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

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const response = await fetch(chatUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          patientId: patient.id,
          patientName: patient.name,
          conversationHistory: messages,
        }),
      });

      if (!response.ok) throw new Error('Erro ao enviar mensagem');

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || data.message || '',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Check if this is the final report
      if (data.isFinalReport || data.report) {
        onReportGenerated(data.response || data.report);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar a mensagem',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAudioSubmit = async () => {
    if (!audioBlob) return;

    setLoading(true);
    try {
      let transcriptionText = '';

      if (transcriptionUrl) {
        // Send to n8n for transcription
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');

        const transcriptionResponse = await fetch(transcriptionUrl, {
          method: 'POST',
          body: formData,
        });

        if (transcriptionResponse.ok) {
          const transcriptionData = await transcriptionResponse.json();
          transcriptionText = transcriptionData.text || transcriptionData.transcription || '';
        }
      }

      if (transcriptionText) {
        await sendMessage(transcriptionText);
      } else {
        toast({
          title: 'Aviso',
          description: 'Configure a URL de transcrição para usar áudio',
          variant: 'destructive',
        });
      }

      clearAudio();
    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível processar o áudio',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
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
                  sendMessage(inputText);
                }
              }}
              disabled={loading}
            />
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => sendMessage(inputText)}
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