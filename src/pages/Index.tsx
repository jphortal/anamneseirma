import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { useN8nConfig } from '@/hooks/useN8nConfig';
import { N8nConfigForm } from '@/components/N8nConfigForm';
import { PatientSelector } from '@/components/PatientSelector';
import { ChatInterface } from '@/components/ChatInterface';
import { ReportEditor } from '@/components/ReportEditor';
import { Patient } from '@/types/medical';

type AppState = 'config' | 'patient-selection' | 'chat' | 'report';

const Index = () => {
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
    setGeneratedReport(report);
    setAppState('report');
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
          {hasConfig && appState !== 'config' && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setAppState('config')}
            >
              <Settings className="h-5 w-5" />
            </Button>
          )}
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
