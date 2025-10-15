import { useState } from 'react';
import { Edit2, Check, X, Mic, Square } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { useToast } from '@/hooks/use-toast';
import { useN8nConfig } from '@/hooks/useN8nConfig';
interface CampoEditavelProps {
  label: string;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  tipo?: 'text' | 'textarea' | 'simNao' | 'radio' | 'checkbox';
  opcoes?: string[];
  obrigatorio?: boolean;
  permiteTextoAdicional?: boolean;
  sempreAberto?: boolean;
  rows?: number;
}
export const CampoEditavel = ({
  label,
  value,
  onChange,
  tipo = 'text',
  opcoes = [],
  obrigatorio = false,
  permiteTextoAdicional = true,
  sempreAberto = false,
  rows = 3
}: CampoEditavelProps) => {
  const [editando, setEditando] = useState(sempreAberto);
  const [valorTemp, setValorTemp] = useState(value);
  const [textoAdicional, setTextoAdicional] = useState('');
  const [transcrevendo, setTranscrevendo] = useState(false);
  const {
    isRecording,
    audioBlob,
    startRecording,
    stopRecording,
    clearAudio
  } = useAudioRecorder();
  const {
    toast
  } = useToast();
  const {
    config
  } = useN8nConfig();
  const handleSalvar = () => {
    // Se houver texto adicional, concatena com a resposta principal
    let valorFinal = valorTemp;
    if (textoAdicional.trim() && tipo !== 'text' && tipo !== 'textarea') {
      if (typeof valorTemp === 'string') {
        valorFinal = `${valorTemp} - ${textoAdicional}`;
      } else if (Array.isArray(valorTemp)) {
        valorFinal = [...valorTemp, `Obs: ${textoAdicional}`];
      }
    }
    onChange(valorFinal);
    setEditando(false);
    setTextoAdicional('');
  };
  const handleCancelar = () => {
    setValorTemp(value);
    setTextoAdicional('');
    setEditando(false);
    clearAudio();
  };
  const handleAudioTranscription = async () => {
    if (!audioBlob) return;
    if (!config.transcriptionUrl) {
      toast({
        title: 'URL não configurada',
        description: 'Configure a URL de transcrição nas configurações',
        variant: 'destructive'
      });
      return;
    }
    setTranscrevendo(true);
    try {
      // Envia o áudio como arquivo (multipart/form-data)
      const file = new File([audioBlob], 'audio.webm', {
        type: audioBlob.type || 'audio/webm'
      });
      const formData = new FormData();
      // Usamos a mesma chave que o chat usa para compatibilidade com o webhook
      formData.append('data00', file);
      const response = await fetch(config.transcriptionUrl, {
        method: 'POST',
        body: formData
      });
      console.log('Resposta da transcrição - Status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new Error(`Erro ao transcrever áudio (${response.status}): ${errorText}`);
      }

      // Primeiro obtém o texto da resposta
      const responseText = await response.text();
      console.log('Resposta da transcrição - Texto:', responseText);

      // Verifica se a resposta não está vazia
      if (!responseText || responseText.trim() === '') {
        throw new Error('Resposta vazia do servidor de transcrição. Verifique se o webhook n8n está configurado para retornar JSON com o texto transcrito.');
      }

      // Tenta fazer parse do JSON
      let data: any;
      try {
        data = JSON.parse(responseText);
        console.log('Resposta da transcrição - JSON parseado:', data);
      } catch (parseError) {
        console.error('Erro ao fazer parse do JSON:', parseError);
        console.log('Resposta recebida (não é JSON):', responseText);
        // Se não for JSON, tenta usar o texto diretamente
        data = { text: responseText };
      }
      
      // Tenta extrair o texto de várias possíveis estruturas de resposta
      const textoTranscrito = 
        data.text || 
        data.output || 
        data.message || 
        data.response || 
        data.transcription ||
        data.result ||
        (typeof data === 'string' ? data : '');
      
      console.log('Texto transcrito extraído:', textoTranscrito);
      
      if (!textoTranscrito || textoTranscrito.trim() === '') {
        console.error('Estrutura da resposta:', data);
        throw new Error('Não foi possível extrair o texto da resposta. Estrutura: ' + JSON.stringify(data).substring(0, 100));
      }

      // Adiciona ao campo principal se for text/textarea, ou ao campo adicional para outros tipos
      if (tipo === 'text' || tipo === 'textarea') {
        const valorAtual = typeof valorTemp === 'string' ? valorTemp : '';
        const novoValor = valorAtual ? `${valorAtual} ${textoTranscrito}` : textoTranscrito;
        setValorTemp(novoValor);
      } else {
        const valorAdicionalAtual = textoAdicional;
        const novoValorAdicional = valorAdicionalAtual ? `${valorAdicionalAtual} ${textoTranscrito}` : textoTranscrito;
        setTextoAdicional(novoValorAdicional);
      }
      clearAudio();
      toast({
        title: 'Áudio transcrito',
        description: 'O texto foi adicionado ao campo'
      });
    } catch (error) {
      console.error('Erro na transcrição:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível transcrever o áudio',
        variant: 'destructive'
      });
    } finally {
      setTranscrevendo(false);
    }
  };
  const handleMicClick = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  };
  const renderCampo = () => {
    if (!editando && !sempreAberto) {
      const displayValue = Array.isArray(value) ? value.join(', ') : value || '';
      const isLongText = displayValue.length > 50;
      return <div className="space-y-2">
          <Label className="text-sm font-medium">{label}</Label>
          <div className="flex gap-2">
            {isLongText ? <Textarea value={displayValue} disabled className="flex-1 min-h-[60px] resize-none" rows={Math.min(Math.ceil(displayValue.length / 50), 10)} /> : <Input value={displayValue} disabled className="flex-1" />}
            <Button variant="ghost" size="icon" onClick={() => setEditando(true)} className="self-start">
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        </div>;
    }
    return <div className="p-3 rounded-lg border-2 border-primary bg-black/0">
        <Label className="text-sm font-medium">
          {label}
          {obrigatorio && <span className="text-destructive ml-1">*</span>}
        </Label>

        <div className="mt-2 space-y-2">
          {tipo === 'text' && <div className="flex gap-2">
              <Input value={valorTemp as string} onChange={e => setValorTemp(e.target.value)} className="w-full" />
              <Button type="button" size="icon" variant={isRecording ? 'destructive' : 'outline'} onClick={handleMicClick} disabled={transcrevendo}>
                {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            </div>}

          {tipo === 'textarea' && <div className="space-y-2">
              <div className="flex gap-2">
                <Textarea value={valorTemp as string} onChange={e => setValorTemp(e.target.value)} rows={rows} className="w-full" />
                <Button type="button" size="icon" variant={isRecording ? 'destructive' : 'outline'} onClick={handleMicClick} disabled={transcrevendo}>
                  {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              </div>
              {audioBlob && !isRecording && <Button type="button" size="sm" onClick={handleAudioTranscription} disabled={transcrevendo} className="w-full">
                  {transcrevendo ? 'Transcrevendo...' : 'Transcrever Áudio'}
                </Button>}
            </div>}

          {tipo === 'simNao' && <>
              <RadioGroup value={valorTemp as string} onValueChange={val => setValorTemp(val)}>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Sim" id={`${label}-sim`} />
                    <Label htmlFor={`${label}-sim`}>Sim</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Não" id={`${label}-nao`} />
                    <Label htmlFor={`${label}-nao`}>Não</Label>
                  </div>
                </div>
              </RadioGroup>
              {permiteTextoAdicional && <div className="mt-2 space-y-2">
                  <Label className="text-xs text-muted-foreground">Observações adicionais</Label>
                  <div className="flex gap-2">
                    <Textarea value={textoAdicional} onChange={e => setTextoAdicional(e.target.value)} rows={2} className="w-full" placeholder="Adicione detalhes se necessário..." />
                    <Button type="button" size="icon" variant={isRecording ? 'destructive' : 'outline'} onClick={handleMicClick} disabled={transcrevendo}>
                      {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                  </div>
                  {audioBlob && !isRecording && <Button type="button" size="sm" onClick={handleAudioTranscription} disabled={transcrevendo} className="w-full">
                      {transcrevendo ? 'Transcrevendo...' : 'Transcrever Áudio'}
                    </Button>}
                </div>}
            </>}

          {tipo === 'checkbox' && <>
              <div className="space-y-2">
                {opcoes.map(opcao => <div key={opcao} className="flex items-center space-x-2">
                    <input type="checkbox" id={`${label}-${opcao}`} checked={(valorTemp as string[]).includes(opcao)} onChange={e => {
                const arr = valorTemp as string[];
                if (e.target.checked) {
                  setValorTemp([...arr, opcao]);
                } else {
                  setValorTemp(arr.filter(v => v !== opcao));
                }
              }} className="rounded border-input" />
                    <Label htmlFor={`${label}-${opcao}`}>{opcao}</Label>
                  </div>)}
              </div>
              {permiteTextoAdicional && <div className="mt-2 space-y-2">
                  <Label className="text-xs text-muted-foreground">Observações adicionais</Label>
                  <div className="flex gap-2">
                    <Textarea value={textoAdicional} onChange={e => setTextoAdicional(e.target.value)} rows={2} className="w-full" placeholder="Adicione detalhes se necessário..." />
                    <Button type="button" size="icon" variant={isRecording ? 'destructive' : 'outline'} onClick={handleMicClick} disabled={transcrevendo}>
                      {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                  </div>
                  {audioBlob && !isRecording && <Button type="button" size="sm" onClick={handleAudioTranscription} disabled={transcrevendo} className="w-full">
                      {transcrevendo ? 'Transcrevendo...' : 'Transcrever Áudio'}
                    </Button>}
                </div>}
            </>}

          {tipo === 'radio' && <>
              <RadioGroup value={valorTemp as string} onValueChange={val => setValorTemp(val)}>
                {opcoes.map(opcao => <div key={opcao} className="flex items-center space-x-2">
                    <RadioGroupItem value={opcao} id={`${label}-${opcao}`} />
                    <Label htmlFor={`${label}-${opcao}`}>{opcao}</Label>
                  </div>)}
              </RadioGroup>
              {permiteTextoAdicional && <div className="mt-2 space-y-2">
                  <Label className="text-xs text-muted-foreground">Observações adicionais</Label>
                  <div className="flex gap-2">
                    <Textarea value={textoAdicional} onChange={e => setTextoAdicional(e.target.value)} rows={2} className="w-full" placeholder="Adicione detalhes se necessário..." />
                    <Button type="button" size="icon" variant={isRecording ? 'destructive' : 'outline'} onClick={handleMicClick} disabled={transcrevendo}>
                      {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                  </div>
                  {audioBlob && !isRecording && <Button type="button" size="sm" onClick={handleAudioTranscription} disabled={transcrevendo} className="w-full">
                      {transcrevendo ? 'Transcrevendo...' : 'Transcrever Áudio'}
                    </Button>}
                </div>}
            </>}

          {audioBlob && !isRecording && tipo === 'text' && <Button type="button" size="sm" onClick={handleAudioTranscription} disabled={transcrevendo} className="w-full">
              {transcrevendo ? 'Transcrevendo...' : 'Transcrever Áudio'}
            </Button>}

          {!sempreAberto && <div className="flex gap-2 mt-3">
              <Button onClick={handleSalvar} size="sm" className="flex-1">
                <Check className="h-4 w-4 mr-1" />
                Confirmar
              </Button>
              <Button onClick={handleCancelar} variant="outline" size="sm">
                <X className="h-4 w-4 mr-1" />
                Cancelar
              </Button>
            </div>}
        </div>
      </div>;
  };
  return <div className="mb-4">{renderCampo()}</div>;
};