import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Settings, ClipboardList } from 'lucide-react';
import { useN8nConfig } from '@/hooks/useN8nConfig';
import { N8nConfigForm } from '@/components/N8nConfigForm';
import { PatientSelector } from '@/components/PatientSelector';
import { ChatInterface } from '@/components/ChatInterface';
import { ReportEditor } from '@/components/ReportEditor';
import { Patient } from '@/types/medical';

type AppState = 'config' | 'patient-selection' | 'chat' | 'report';

const Index = () => {
  const navigate = useNavigate();
  const { config, saveConfig, hasConfig } = useN8nConfig();
  const [appState, setAppState] = useState<AppState>(hasConfig ? 'patient-selection' : 'config');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [generatedReport, setGeneratedReport] = useState<string>('');

  const handleConfigSave = (newConfig: typeof config) => {
    saveConfig(newConfig!);
    setAppState('patient-selection');
  };

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setAppState('chat');
  };

  const handleReportGenerated = (report: string) => {
    console.log('=== RELATÓRIO FINAL RECEBIDO ===');
    console.log('Conteúdo:', report);
    console.log('Paciente:', selectedPatient);
    
    setGeneratedReport(report);
    
    // Try to parse JSON report and navigate to review with pre-filled data
    try {
      const reportData = JSON.parse(report);
      console.log('JSON parseado com sucesso:', reportData);
      
      // Determine exam type based on patient modality/procedure or JSON fields
      let examType: 'punho' | 'joelho' | 'abdome' | 'atm' | 'cabeca' | 'coluna' | 'cotovelo' | 'membros' | 'ombro' | 'quadril' | 'tornozelo' | 'mama' = 'punho';
      
      // Check if reportData has explicit tipo field
      if (reportData.tipo) {
        examType = reportData.tipo;
      }
      // Check patient modality and procedure for abdome/torax exams
      else if (selectedPatient) {
        const modality = selectedPatient.modality?.toUpperCase() || '';
        const procedure = selectedPatient.procedure?.toUpperCase() || '';
        
        if ((modality.includes('RESSONANCIA') || modality.includes('TOMOGRAFIA')) && 
            (procedure.includes('ABDOME') || procedure.includes('TORAX'))) {
          examType = 'abdome';
        }
      }
      // Fallback: check JSON fields to determine type
      if (examType === 'punho') {
        if (reportData.joelhoFalseia !== undefined || reportData.joelhoTrava !== undefined) {
          examType = 'joelho';
        } else if (reportData.tipoExame !== undefined || reportData.problemaSaude !== undefined) {
          examType = 'abdome';
        }
      }
      
      console.log('Tipo de exame determinado:', examType);
      
      // Navigate to review with pre-filled data
      navigate('/revisao-anamnese', {
        state: {
          tipo: examType,
          dados: {
            ...reportData,
            nome: selectedPatient?.name || '',
            paciente: selectedPatient?.name || '',
            idade: ''
          },
          patientId: selectedPatient?.patientId,
          patientName: selectedPatient?.name
        }
      });
      
      console.log('Navegando para revisão de anamnese...');
    } catch (error) {
      console.error('Erro ao fazer parse do relatório (não é JSON):', error);
      console.log('Processando como texto markdown...');
      
      // If not valid JSON (markdown text), determine type from patient data
      let examType: 'punho' | 'joelho' | 'abdome' | 'atm' | 'cabeca' | 'coluna' | 'cotovelo' | 'membros' | 'ombro' | 'quadril' | 'tornozelo' | 'mama' = 'abdome';
      
      if (selectedPatient) {
        const modality = selectedPatient.modality?.toUpperCase() || '';
        const procedure = selectedPatient.procedure?.toUpperCase() || '';
        
        // Check for abdome/torax exams
        if ((modality.includes('RESSONANCIA') || modality.includes('TOMOGRAFIA')) && 
            (procedure.includes('ABDOME') || procedure.includes('TORAX'))) {
          examType = 'abdome';
        }
        // Check for joint exams
        else if (procedure.includes('JOELHO')) {
          examType = 'joelho';
        } else if (procedure.includes('PUNHO')) {
          examType = 'punho';
        } else if (procedure.includes('OMBRO')) {
          examType = 'ombro';
        } else if (procedure.includes('TORNOZELO')) {
          examType = 'tornozelo';
        } else if (procedure.includes('QUADRIL')) {
          examType = 'quadril';
        }
      }
      
      console.log('Tipo de exame determinado (markdown):', examType);
      
      // Navigate to review with markdown text in observacoes
      navigate('/revisao-anamnese', {
        state: {
          tipo: examType,
          dados: {
            nome: selectedPatient?.name || '',
            paciente: selectedPatient?.name || '',
            idade: '',
            observacoes: report
          },
          patientId: selectedPatient?.patientId,
          patientName: selectedPatient?.name
        }
      });
      
      console.log('Navegando para revisão de anamnese com markdown...');
    }
  };

  const handleReportSubmitted = () => {
    setSelectedPatient(null);
    setGeneratedReport('');
    setAppState('patient-selection');
  };

  const handleBackToPatientSelection = () => {
    setSelectedPatient(null);
    setGeneratedReport('');
    setAppState('patient-selection');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Sistema de Laudos Médicos</h1>
            <p className="text-muted-foreground">Interface conversacional com IA</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate('/revisao-anamnese')}
            >
              <ClipboardList className="h-5 w-5 mr-2" />
              Revisão de Anamnese
            </Button>
            {hasConfig && appState !== 'config' && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setAppState('config')}
              >
                <Settings className="h-5 w-5" />
              </Button>
            )}
          </div>
        </header>

        <main>
          {appState === 'config' && (
            <N8nConfigForm onSave={handleConfigSave} />
          )}

          {appState === 'patient-selection' && config && (
            <PatientSelector
              worklistUrl={config.worklistUrl}
              onSelectPatient={handlePatientSelect}
            />
          )}

          {appState === 'chat' && selectedPatient && config && (
            <div className="space-y-4">
              <Button
                variant="outline"
                onClick={handleBackToPatientSelection}
              >
                ← Voltar para Seleção
              </Button>
              <ChatInterface
                patient={selectedPatient}
                chatUrl={config.chatUrl}
                transcriptionUrl={config.transcriptionUrl}
                onReportGenerated={handleReportGenerated}
              />
            </div>
          )}

          {appState === 'report' && selectedPatient && config && (
            <ReportEditor
              patient={selectedPatient}
              initialReport={generatedReport}
              reportUrl={config.reportUrl}
              onSubmitted={handleReportSubmitted}
              onCancel={() => setAppState('chat')}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
