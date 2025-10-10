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
    
    // Parser para extrair informações do relatório markdown
    const parseMarkdownReport = (markdown: string) => {
      const dados: any = {
        nome: selectedPatient?.name || '',
        idade: '',
        trabalho: '',
        motivoExame: '',
        problemaSaude: '',
        jaFoiOperado: 'Não',
        cirurgias: '',
        quimioterapia: 'Não',
        quandoQuimio: '',
        radioterapia: 'Não',
        quandoRadio: '',
        regiaoRadio: '',
        fuma: 'Não',
        tempoFumando: '',
        estaPerdendoPeso: 'Não',
        tempoPerdendoPeso: '',
        jaFezRMouTC: 'Não',
        ondeRealizou: '',
        observacoes: markdown
      };

      // Extrair queixa principal / motivo
      const queixaMatch = markdown.match(/\*\*Queixa Principal:\*\*\s*[-\s]*(.+?)(?=\n\n|\*\*)/s);
      if (queixaMatch) {
        dados.motivoExame = queixaMatch[1].trim().replace(/^-\s*/, '');
      }

      // Extrair histórico da queixa
      const historiaMatch = markdown.match(/\*\*História da Queixa:\*\*\s*(.+?)(?=\n\n|\*\*)/s);
      if (historiaMatch) {
        const historia = historiaMatch[1];
        dados.motivoExame += (dados.motivoExame ? '\n\n' : '') + 'História: ' + historia.trim();
      }

      // Extrair histórico médico / problemas
      const historicoMatch = markdown.match(/\*\*Histórico Médico:\*\*\s*(.+?)(?=\n\n|\*\*)/s);
      if (historicoMatch) {
        const historico = historicoMatch[1];
        dados.problemaSaude = historico.trim();

        // Verificar cirurgias
        if (historico.toLowerCase().includes('cirurgia') || historico.toLowerCase().includes('operado')) {
          const semRegex = /sem.*?cirurgia|não.*?operado/i;
          if (!semRegex.test(historico)) {
            dados.jaFoiOperado = 'Sim';
            const cirurgiaMatch = historico.match(/cirurgia[s]?[:\s]+(.+?)(?=\.|$)/i);
            if (cirurgiaMatch) dados.cirurgias = cirurgiaMatch[1].trim();
          }
        }

        // Verificar gravidez
        if (historico.toLowerCase().includes('grávida') || historico.toLowerCase().includes('gravida')) {
          const naoGravidaRegex = /não\s+está\s+grávida|não\s+grávida/i;
          dados.estaGravida = naoGravidaRegex.test(historico) ? 'Não' : 'Sim';
        }

        // Verificar alergias
        const alergiaMatch = historico.match(/alergia[s]?[:\s]*(.+?)(?=\.|$)/i);
        if (alergiaMatch) {
          const alergiaText = alergiaMatch[1].toLowerCase();
          dados.temAlergia = alergiaText.includes('sem') || alergiaText.includes('não') || alergiaText.includes('nenhuma') ? 'Não' : 'Sim';
          if (dados.temAlergia === 'Sim') {
            dados.quaisAlergias = alergiaMatch[1].trim();
          }
        }
      }

      // Extrair exames anteriores
      const examesMatch = markdown.match(/\*\*Exames Anteriores:\*\*\s*(.+?)(?=\n\n|\*\*)/s);
      if (examesMatch) {
        const exames = examesMatch[1];
        const naoRealizouRegex = /não\s+realizou|sem\s+exames/i;
        
        if (!naoRealizouRegex.test(exames)) {
          dados.jaFezRMouTC = 'Sim';
          const ondeMatch = exames.match(/(?:em|no|na)\s+([^\n.]+)/i);
          if (ondeMatch) dados.ondeRealizou = ondeMatch[1].trim();
        } else {
          dados.jaFezRMouTC = 'Não';
        }
      }

      // Extrair condições de saúde / doenças crônicas
      const condicoesMatch = markdown.match(/\*\*Condições de saúde:\*\*\s*(.+?)(?=\n\n|\*\*|$)/s);
      if (condicoesMatch) {
        const condicoes = condicoesMatch[1].trim();
        if (dados.problemaSaude) {
          dados.problemaSaude += '\n\nCondições crônicas: ' + condicoes;
        } else {
          dados.problemaSaude = condicoes;
        }
      }

      // Extrair tabagismo
      const secaoCompleta = markdown.toLowerCase();
      if (secaoCompleta.includes('fuma')) {
        const fumaMatch = markdown.match(/fuma[r]?[:\s?]*([^\n.]+)/i);
        if (fumaMatch) {
          const fumaText = fumaMatch[1].toLowerCase();
          dados.fuma = fumaText.includes('não') || fumaText.includes('nao') || fumaText.includes('não fuma') ? 'Não' : 'Sim';
          
          if (dados.fuma === 'Sim') {
            const tempoMatch = fumaText.match(/(\d+\s*(?:ano|mes|dia)s?)/i);
            if (tempoMatch) dados.tempoFumando = tempoMatch[1];
          }
        }
      }

      // Extrair perda de peso
      if (secaoCompleta.includes('peso')) {
        const pesoMatch = markdown.match(/(?:perdendo|perda\s+de)\s*peso[:\s?]*([^\n.]+)/i);
        if (pesoMatch) {
          const pesoText = pesoMatch[1].toLowerCase();
          dados.estaPerdendoPeso = pesoText.includes('não') || pesoText.includes('nao') ? 'Não' : 'Sim';
          
          if (dados.estaPerdendoPeso === 'Sim') {
            const tempoMatch = pesoText.match(/(\d+\s*(?:ano|mes|dia|semana)s?)/i);
            if (tempoMatch) dados.tempoPerdendoPeso = tempoMatch[1];
          }
        }
      }

      return dados;
    };
    
    // Try to parse JSON report first
    try {
      const reportData = JSON.parse(report);
      console.log('JSON parseado com sucesso:', reportData);
      
      let examType: 'punho' | 'joelho' | 'abdome' | 'atm' | 'cabeca' | 'coluna' | 'cotovelo' | 'membros' | 'ombro' | 'quadril' | 'tornozelo' | 'mama' = 'abdome';
      
      if (reportData.tipo) {
        examType = reportData.tipo;
      } else if (selectedPatient) {
        const modality = selectedPatient.modality?.toUpperCase() || '';
        const procedure = selectedPatient.procedure?.toUpperCase() || '';
        
        if ((modality.includes('RESSONANCIA') || modality.includes('TOMOGRAFIA')) && 
            (procedure.includes('ABDOME') || procedure.includes('TORAX'))) {
          examType = 'abdome';
        }
      }
      
      navigate('/revisao-anamnese', {
        state: {
          tipo: examType,
          dados: {
            ...reportData,
            nome: selectedPatient?.name || '',
            paciente: selectedPatient?.name || ''
          },
          patientId: selectedPatient?.patientId,
          patientName: selectedPatient?.name
        }
      });
      
    } catch (error) {
      console.log('Não é JSON, fazendo parse do markdown...');
      
      // Parse markdown and extract data
      const dadosParsed = parseMarkdownReport(report);
      
      let examType: 'punho' | 'joelho' | 'abdome' | 'atm' | 'cabeca' | 'coluna' | 'cotovelo' | 'membros' | 'ombro' | 'quadril' | 'tornozelo' | 'mama' = 'abdome';
      
      if (selectedPatient) {
        const modality = selectedPatient.modality?.toUpperCase() || '';
        const procedure = selectedPatient.procedure?.toUpperCase() || '';
        
        if ((modality.includes('RESSONANCIA') || modality.includes('TOMOGRAFIA')) && 
            (procedure.includes('ABDOME') || procedure.includes('TORAX'))) {
          examType = 'abdome';
        } else if (procedure.includes('JOELHO')) {
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
      
      console.log('Dados extraídos do markdown:', dadosParsed);
      
      navigate('/revisao-anamnese', {
        state: {
          tipo: examType,
          dados: dadosParsed,
          patientId: selectedPatient?.patientId,
          patientName: selectedPatient?.name
        }
      });
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
