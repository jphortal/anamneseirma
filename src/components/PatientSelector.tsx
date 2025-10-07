import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Patient } from '@/types/medical';
import { Loader2 } from 'lucide-react';

interface PatientSelectorProps {
  worklistUrl: string;
  onSelectPatient: (patient: Patient) => void;
}

export const PatientSelector = ({ worklistUrl, onSelectPatient }: PatientSelectorProps) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await fetch(worklistUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Erro ao buscar pacientes');

      const data = await response.json();
      setPatients(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar a lista de pacientes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Selecionar Paciente</CardTitle>
        <CardDescription>
          Escolha o paciente para iniciar o atendimento
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {patients.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhum paciente encontrado na lista de trabalho
            </p>
          ) : (
            patients.map((patient) => (
              <Button
                key={patient.id}
                variant="outline"
                className="w-full justify-start text-left h-auto py-4"
                onClick={() => onSelectPatient(patient)}
              >
                <div className="flex flex-col gap-1">
                  <div className="font-semibold">{patient.name}</div>
                  <div className="text-sm text-muted-foreground">
                    ID: {patient.patientId} | Nascimento: {patient.birthDate}
                  </div>
                  {patient.studyDescription && (
                    <div className="text-xs text-muted-foreground">
                      {patient.studyDescription}
                    </div>
                  )}
                </div>
              </Button>
            ))
          )}
        </div>
        <Button
          variant="ghost"
          className="w-full mt-4"
          onClick={fetchPatients}
        >
          Recarregar Lista
        </Button>
      </CardContent>
    </Card>
  );
};