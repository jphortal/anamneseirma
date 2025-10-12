import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Patient } from '@/types/medical';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
interface PatientSelectorProps {
  worklistUrl: string;
  onSelectPatient: (patient: Patient) => void;
}
export const PatientSelector = ({
  worklistUrl,
  onSelectPatient
}: PatientSelectorProps) => {
  const [prontuario, setProntuario] = useState('');
  const [loading, setLoading] = useState(false);
  const [exams, setExams] = useState<Patient[]>([]);
  const {
    toast
  } = useToast();
  const fetchPatient = async () => {
    if (!prontuario.trim()) {
      toast({
        title: 'Atenção',
        description: 'Por favor, informe o número do prontuário',
        variant: 'destructive'
      });
      return;
    }
    setLoading(true);
    try {
      const url = new URL(worklistUrl);
      url.searchParams.append('prontuario', prontuario);
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Erro ao buscar paciente');
      const data = await response.json();

      // Map n8n response to Patient interface
      const patientList = Array.isArray(data) ? data : [data];
      if (!patientList || patientList.length === 0) {
        toast({
          title: 'Paciente não encontrado',
          description: 'Verifique o número do prontuário e tente novamente',
          variant: 'destructive'
        });
        return;
      }
      const mappedPatients: Patient[] = patientList.map((patientData, index) => ({
        id: patientData.cd_atendimento || patientData.id || `patient-${Date.now()}-${index}`,
        name: patientData.ds_paciente || patientData.name || 'Sem nome',
        birthDate: patientData.birth_date || patientData.birthDate || '',
        patientId: patientData.cd_paciente?.toString() || patientData.patientId || prontuario,
        studyDescription: patientData.ds_procedimento || patientData.studyDescription || '',
        modality: patientData.ds_modalidade || patientData.modality || '',
        procedure: patientData.ds_procedimento || patientData.procedure || '',
        ds_paciente: patientData.ds_paciente,
        nr_controle: patientData.nr_controle,
        cd_atendimento: patientData.cd_atendimento,
        ds_modalidade: patientData.ds_modalidade,
        ds_procedimento: patientData.ds_procedimento
      }));
      setExams(mappedPatients);
    } catch (error) {
      console.error('Error fetching patient:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível buscar os dados do paciente',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  return <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="bg-green-400">
        <CardTitle>Buscar Paciente</CardTitle>
        <CardDescription>
          {exams.length === 0 ? 'Informe o número do prontuário para iniciar o atendimento' : 'Selecione o exame desejado'}
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-green-400">
        {exams.length === 0 ? <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prontuario">Número do Prontuário</Label>
              <Input id="prontuario" type="text" placeholder="Digite o número do prontuário" value={prontuario} onChange={e => setProntuario(e.target.value)} onKeyDown={e => {
            if (e.key === 'Enter') {
              fetchPatient();
            }
          }} disabled={loading} />
            </div>
            <Button className="w-full" onClick={fetchPatient} disabled={loading}>
              {loading ? <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Buscando...
                </> : 'Buscar Paciente'}
            </Button>
          </div> : <div className="space-y-4">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {exams.map((exam, index) => <Card key={exam.id} className="cursor-pointer hover:bg-accent transition-colors" onClick={() => onSelectPatient(exam)}>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-lg">{exam.name}</h4>
                          <span className="text-sm text-muted-foreground">#{exam.patientId}</span>
                        </div>
                        <div className="space-y-1 text-sm">
                          <p><span className="font-medium">Modalidade:</span> {exam.modality}</p>
                          <p><span className="font-medium">Procedimento:</span> {exam.procedure}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>)}
              </div>
            </ScrollArea>
            <Button variant="outline" className="w-full" onClick={() => {
          setExams([]);
          setProntuario('');
        }}>
              Buscar outro paciente
            </Button>
          </div>}
      </CardContent>
    </Card>;
};