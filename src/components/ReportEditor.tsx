import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Patient, ReportData } from '@/types/medical';
import { Loader2, Send } from 'lucide-react';

interface ReportEditorProps {
  patient: Patient;
  initialReport: string;
  reportUrl: string;
  onSubmitted: () => void;
  onCancel: () => void;
}

export const ReportEditor = ({ patient, initialReport, reportUrl, onSubmitted, onCancel }: ReportEditorProps) => {
  const [report, setReport] = useState(initialReport);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!report.trim()) {
      toast({
        title: 'Erro',
        description: 'O relatório não pode estar vazio',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const reportData: ReportData = {
        patientId: patient.patientId,
        patientName: patient.name,
        content: report,
        timestamp: new Date().toISOString(),
      };

      const response = await fetch(reportUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) throw new Error('Erro ao enviar relatório');

      toast({
        title: 'Sucesso',
        description: 'Relatório enviado para o sistema da clínica',
      });

      onSubmitted();
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar o relatório',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Editar Relatório Final</CardTitle>
        <CardDescription>
          Paciente: {patient.name} (ID: {patient.patientId})
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={report}
          onChange={(e) => setReport(e.target.value)}
          className="min-h-[400px] font-mono text-sm"
          placeholder="Edite o relatório antes de enviar..."
        />
        
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !report.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Enviar para Sistema
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};