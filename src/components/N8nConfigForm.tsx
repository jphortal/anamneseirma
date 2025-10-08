import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { N8nConfig } from '@/types/medical';

interface N8nConfigFormProps {
  onSave: (config: N8nConfig) => void;
}

export const N8nConfigForm = ({ onSave }: N8nConfigFormProps) => {
  const [worklistUrl, setWorklistUrl] = useState('');
  const [chatUrl, setChatUrl] = useState('https://jphortal.app.n8n.cloud/webhook-test/7ce83803-a02b-4ce9-9732-a07adb3b0127');
  const [reportUrl, setReportUrl] = useState('');
  const [transcriptionUrl, setTranscriptionUrl] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!worklistUrl || !chatUrl || !reportUrl) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha todas as URLs do n8n',
        variant: 'destructive',
      });
      return;
    }

    onSave({
      worklistUrl,
      chatUrl,
      reportUrl,
      transcriptionUrl: transcriptionUrl || undefined,
    });

    toast({
      title: 'Configuração salva',
      description: 'URLs do n8n configuradas com sucesso',
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Configuração do n8n</CardTitle>
        <CardDescription>
          Configure os endpoints do n8n para conectar com o sistema da clínica
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="worklistUrl">URL do Worklist *</Label>
            <Input
              id="worklistUrl"
              type="url"
              placeholder="https://seu-n8n.com/webhook/worklist"
              value={worklistUrl}
              onChange={(e) => setWorklistUrl(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="chatUrl">URL do Chat IA *</Label>
            <Input
              id="chatUrl"
              type="url"
              placeholder="https://seu-n8n.com/webhook/chat"
              value={chatUrl}
              onChange={(e) => setChatUrl(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reportUrl">URL de Envio do Relatório *</Label>
            <Input
              id="reportUrl"
              type="url"
              placeholder="https://seu-n8n.com/webhook/report"
              value={reportUrl}
              onChange={(e) => setReportUrl(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="transcriptionUrl">URL de Transcrição (opcional)</Label>
            <Input
              id="transcriptionUrl"
              type="url"
              placeholder="https://seu-n8n.com/webhook/transcribe"
              value={transcriptionUrl}
              onChange={(e) => setTranscriptionUrl(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full">
            Salvar Configuração
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};