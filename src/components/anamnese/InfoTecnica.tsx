import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mic, Square, Loader2 } from 'lucide-react';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { useToast } from '@/hooks/use-toast';

interface InfoTecnicaProps {
  contrasteEndovenoso: boolean;
  contrasteOral: boolean;
  contrasteRetal: boolean;
  gelEndovaginal: boolean;
  tecnicoResponsavel: string;
  relatorioFinal: string;
  transcriptionUrl: string;
  onChange: (campo: string, valor: boolean | string) => void;
}

export const InfoTecnica = ({
  contrasteEndovenoso,
  contrasteOral,
  contrasteRetal,
  gelEndovaginal,
  tecnicoResponsavel,
  relatorioFinal,
  transcriptionUrl,
  onChange,
}: InfoTecnicaProps) => {
  const { isRecording, audioBlob, startRecording, stopRecording, clearAudio } = useAudioRecorder();
  const [isTranscribing, setIsTranscribing] = useState(false);
  const { toast } = useToast();

  const handleTranscription = async () => {
    if (!audioBlob) return;
    
    setIsTranscribing(true);
    
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = reader.result?.toString().split(',')[1];
        
        if (!base64Audio) {
          throw new Error('Falha ao converter áudio');
        }
        
        const response = await fetch(transcriptionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ audio: base64Audio }),
        });
        
        if (!response.ok) {
          throw new Error('Erro na transcrição');
        }
        
        const data = await response.json();
        const transcriptionText = data.text || data.transcription || '';
        
        // Adicionar transcrição ao texto existente
        const newText = relatorioFinal 
          ? `${relatorioFinal}\n\n${transcriptionText}` 
          : transcriptionText;
        
        onChange('relatorioFinal', newText);
        clearAudio();
        
        toast({
          title: 'Sucesso',
          description: 'Transcrição adicionada ao relatório',
        });
      };
    } catch (error) {
      console.error('Erro na transcrição:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível transcrever o áudio',
        variant: 'destructive',
      });
    } finally {
      setIsTranscribing(false);
    }
  };
  return (
    <Card className="border-2 border-primary/20">
      <CardContent className="pt-4 space-y-3">
        <div className="text-sm font-semibold text-foreground mb-3">
          Informações Técnicas
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="contrasteEndovenoso"
              checked={contrasteEndovenoso}
              onCheckedChange={(checked) => onChange('contrasteEndovenoso', !!checked)}
            />
            <Label
              htmlFor="contrasteEndovenoso"
              className="text-sm cursor-pointer"
            >
              Contraste Endovenoso
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="contrasteOral"
              checked={contrasteOral}
              onCheckedChange={(checked) => onChange('contrasteOral', !!checked)}
            />
            <Label
              htmlFor="contrasteOral"
              className="text-sm cursor-pointer"
            >
              Contraste Oral
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="contrasteRetal"
              checked={contrasteRetal}
              onCheckedChange={(checked) => onChange('contrasteRetal', !!checked)}
            />
            <Label
              htmlFor="contrasteRetal"
              className="text-sm cursor-pointer"
            >
              Contraste Retal
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="gelEndovaginal"
              checked={gelEndovaginal}
              onCheckedChange={(checked) => onChange('gelEndovaginal', !!checked)}
            />
            <Label
              htmlFor="gelEndovaginal"
              className="text-sm cursor-pointer"
            >
              Gel Endovaginal
            </Label>
          </div>
        </div>

        <div className="pt-2">
          <Label htmlFor="tecnicoResponsavel" className="text-sm">
            Clearance de Creatinina
          </Label>
          <Input
            id="tecnicoResponsavel"
            value={tecnicoResponsavel}
            onChange={(e) => onChange('tecnicoResponsavel', e.target.value)}
            placeholder="Ex: 90 mL/min"
            className="mt-1"
          />
        </div>

        <div className="pt-4 space-y-2">
          <Label htmlFor="relatorioFinal" className="text-sm font-semibold">
            Relatório Final
          </Label>
          <Textarea
            id="relatorioFinal"
            value={relatorioFinal}
            onChange={(e) => onChange('relatorioFinal', e.target.value)}
            placeholder="Digite ou transcreva o relatório final aqui..."
            className="min-h-[300px] text-sm"
          />
          
          <div className="flex gap-2">
            {!isRecording && !audioBlob && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={startRecording}
                className="flex-1"
              >
                <Mic className="h-4 w-4 mr-2" />
                Gravar Áudio
              </Button>
            )}
            
            {isRecording && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={stopRecording}
                className="flex-1"
              >
                <Square className="h-4 w-4 mr-2" />
                Parar Gravação
              </Button>
            )}
            
            {audioBlob && !isRecording && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleTranscription}
                  disabled={isTranscribing}
                  className="flex-1"
                >
                  {isTranscribing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Transcrevendo...
                    </>
                  ) : (
                    'Transcrever'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearAudio}
                >
                  Cancelar
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
