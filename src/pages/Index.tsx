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
    
    // Parser inteligente para extrair informações do relatório markdown
    const parseMarkdownReport = (markdown: string) => {
      const dados: any = {
        nome: selectedPatient?.name || '',
        paciente: selectedPatient?.name || '',
      };

      // Função auxiliar para extrair respostas de perguntas numeradas ou com bullet points
      const extrairResposta = (perguntaRegex: RegExp): string => {
        const match = markdown.match(perguntaRegex);
        if (match && match[1]) {
          return match[1].trim().replace(/^[-\s*]+/, '').replace(/\n/g, ' ').trim();
        }
        return '';
      };

      // Função para detectar Sim/Não nas respostas
      const detectarSimNao = (texto: string): 'Sim' | 'Não' => {
        const textoLower = texto.toLowerCase();
        if (textoLower.includes('sim') || textoLower.includes('yes')) return 'Sim';
        if (textoLower.includes('não') || textoLower.includes('nao') || textoLower.includes('no')) return 'Não';
        return 'Não';
      };

      // Extrair idade
      const idadeResp = extrairResposta(/(?:idade|anos?)[:?\s]*([^\n]+)/i);
      if (idadeResp) {
        const idadeNum = idadeResp.match(/\d+/);
        dados.idade = idadeNum ? idadeNum[0] : idadeResp;
      }

      // Extrair trabalho/profissão
      const trabalhoResp = extrairResposta(/(?:trabalho|profissão|profissao|ocupação|ocupacao)[:?\s]*([^\n]+)/i);
      if (trabalhoResp) dados.trabalho = trabalhoResp;

      // Extrair motivo do exame / queixa principal
      let motivoExame = extrairResposta(/(?:motivo|queixa principal|por que está fazendo|razão do exame)[:?\s]*([^\n]+)/i);
      if (!motivoExame) {
        motivoExame = extrairResposta(/(?:\*\*Queixa Principal:\*\*|\*\*Motivo:\*\*)[\s\-]*(.+?)(?=\n\n|\*\*|$)/is);
      }
      if (motivoExame) dados.motivoExame = motivoExame;

      // Extrair localização da dor
      const localizacaoResp = extrairResposta(/(?:onde.*?dor|localização|localizacao)[:?\s]*([^\n]+)/i);
      if (localizacaoResp) {
        dados.localizacao = localizacaoResp;
        dados.localizacaoDor = localizacaoResp;
      }

      // Extrair tempo com dor
      const tempoDorResp = extrairResposta(/(?:quanto tempo.*?dor|há quanto tempo|desde quando)[:?\s]*([^\n]+)/i);
      if (tempoDorResp) dados.tempoComDor = tempoDorResp;

      // Extrair lado (direito/esquerdo)
      const ladoResp = extrairResposta(/(?:qual lado|lado)[:?\s]*([^\n]+)/i);
      if (ladoResp) {
        const ladoLower = ladoResp.toLowerCase();
        if (ladoLower.includes('direito')) dados.lado = 'Direito';
        else if (ladoLower.includes('esquerdo')) dados.lado = 'Esquerdo';
      }

      // Extrair problemas de saúde / histórico médico
      let problemaSaude = extrairResposta(/(?:problemas? de saúde|histórico médico|condições? de saúde|doenças?)[:?\s]*([^\n]+)/i);
      if (!problemaSaude) {
        problemaSaude = extrairResposta(/(?:\*\*Histórico Médico:\*\*|\*\*Problemas:\*\*)[\s\-]*(.+?)(?=\n\n|\*\*|$)/is);
      }
      if (problemaSaude) dados.problemaSaude = problemaSaude;

      // Extrair cirurgias
      const cirurgiaResp = extrairResposta(/(?:já foi operado|cirurgia|operação|operacao)[:?\s]*([^\n]+)/i);
      if (cirurgiaResp) {
        dados.jaFoiOperado = detectarSimNao(cirurgiaResp);
        if (dados.jaFoiOperado === 'Sim') {
          // Tentar extrair detalhes da cirurgia
          const detalhesMatch = markdown.match(/(?:qual|que tipo|o que foi feito).*?cirurgia[:?\s]*([^\n]+)/i);
          if (detalhesMatch) {
            dados.cirurgias = detalhesMatch[1].trim();
            dados.oqueFeitoCircurgia = detalhesMatch[1].trim();
          } else if (!cirurgiaResp.toLowerCase().match(/^(sim|yes)$/)) {
            dados.cirurgias = cirurgiaResp;
            dados.oqueFeitoCircurgia = cirurgiaResp;
          }
        }
      }

      // Extrair quimioterapia
      const quimioResp = extrairResposta(/(?:quimioterapia|quimio)[:?\s]*([^\n]+)/i);
      if (quimioResp) {
        dados.quimioterapia = detectarSimNao(quimioResp);
        if (dados.quimioterapia === 'Sim') {
          const quandoMatch = markdown.match(/quando.*?quimio[:?\s]*([^\n]+)/i);
          if (quandoMatch) dados.quandoQuimio = quandoMatch[1].trim();
        }
      }

      // Extrair radioterapia
      const radioResp = extrairResposta(/(?:radioterapia|radio)[:?\s]*([^\n]+)/i);
      if (radioResp) {
        dados.radioterapia = detectarSimNao(radioResp);
        if (dados.radioterapia === 'Sim') {
          const quandoMatch = markdown.match(/quando.*?radio[:?\s]*([^\n]+)/i);
          if (quandoMatch) dados.quandoRadio = quandoMatch[1].trim();
          const regiaoMatch = markdown.match(/(?:região|regiao|local).*?radio[:?\s]*([^\n]+)/i);
          if (regiaoMatch) dados.regiaoRadio = regiaoMatch[1].trim();
        }
      }

      // Extrair tabagismo
      const fumaResp = extrairResposta(/(?:fuma|cigarro|tabaco)[:?\s]*([^\n]+)/i);
      if (fumaResp) {
        dados.fuma = detectarSimNao(fumaResp);
        if (dados.fuma === 'Sim') {
          const tempoMatch = markdown.match(/(?:quanto tempo|há quanto tempo).*?fum[:?\s]*([^\n]+)/i);
          if (tempoMatch) dados.tempoFumando = tempoMatch[1].trim();
        }
      }

      // Extrair perda de peso
      const pesoResp = extrairResposta(/(?:perd.*?peso|emagre)[:?\s]*([^\n]+)/i);
      if (pesoResp) {
        dados.estaPerdendoPeso = detectarSimNao(pesoResp);
        if (dados.estaPerdendoPeso === 'Sim') {
          const tempoMatch = markdown.match(/(?:quanto tempo|há quanto).*?peso[:?\s]*([^\n]+)/i);
          if (tempoMatch) dados.tempoPerdendoPeso = tempoMatch[1].trim();
        }
      }

      // Extrair exames anteriores
      const examesResp = extrairResposta(/(?:já fez.*?(?:ressonância|tomografia|exame)|exames anteriores)[:?\s]*([^\n]+)/i);
      if (examesResp) {
        dados.jaFezRMouTC = detectarSimNao(examesResp);
        dados.jaFezTCouRM = detectarSimNao(examesResp);
        if (dados.jaFezRMouTC === 'Sim') {
          const ondeMatch = markdown.match(/(?:onde|qual serviço|em que lugar)[:?\s]*([^\n]+)/i);
          if (ondeMatch) dados.ondeRealizou = ondeMatch[1].trim();
        }
      }

      // Extrair trauma
      const traumaResp = extrairResposta(/(?:trauma|acidente|lesão|lesao)[:?\s]*([^\n]+)/i);
      if (traumaResp) {
        dados.historiaTrauma = detectarSimNao(traumaResp);
        if (dados.historiaTrauma === 'Sim') {
          const quandoMatch = markdown.match(/quando.*?(?:trauma|acidente)[:?\s]*([^\n]+)/i);
          if (quandoMatch) dados.quandoTrauma = quandoMatch[1].trim();
        }
      }

      // Extrair esporte
      const esporteResp = extrairResposta(/(?:pratica.*?esporte|atividade física)[:?\s]*([^\n]+)/i);
      if (esporteResp) {
        dados.praticaEsporte = detectarSimNao(esporteResp);
        if (dados.praticaEsporte === 'Sim') {
          const qualMatch = markdown.match(/qual.*?esporte[:?\s]*([^\n]+)/i);
          if (qualMatch) {
            dados.qualEsporte = qualMatch[1].trim();
            dados.esporte = 'Sim';
          }
        }
      }

      // Extrair informações específicas de joelho
      const subirEscadaResp = extrairResposta(/(?:dói.*?subir|subir.*?escada)[:?\s]*([^\n]+)/i);
      if (subirEscadaResp) dados.doiSubirEscada = detectarSimNao(subirEscadaResp);

      const tempoSentadoResp = extrairResposta(/(?:dói.*?sentado|tempo sentado)[:?\s]*([^\n]+)/i);
      if (tempoSentadoResp) dados.doiTempoSentado = detectarSimNao(tempoSentadoResp);

      const falsearResp = extrairResposta(/(?:falseia|instável)[:?\s]*([^\n]+)/i);
      if (falsearResp) dados.joelhoFalseia = detectarSimNao(falsearResp);

      const travaResp = extrairResposta(/(?:trava|bloqueia)[:?\s]*([^\n]+)/i);
      if (travaResp) dados.joelhoTrava = detectarSimNao(travaResp);

      // Extrair derrame articular
      const derrameResp = extrairResposta(/(?:derrame|inchaço|inchaco)[:?\s]*([^\n]+)/i);
      if (derrameResp) {
        dados.teveDerrame = detectarSimNao(derrameResp);
        if (dados.teveDerrame === 'Sim') {
          const quandoMatch = markdown.match(/quando.*?derrame[:?\s]*([^\n]+)/i);
          if (quandoMatch) dados.quandoDerrame = quandoMatch[1].trim();
        }
      }

      // Extrair infiltração
      const infiltracaoResp = extrairResposta(/(?:infiltração|infiltracao|injeção|injecao)[:?\s]*([^\n]+)/i);
      if (infiltracaoResp) {
        dados.fezInfiltracao = detectarSimNao(infiltracaoResp);
        if (dados.fezInfiltracao === 'Sim') {
          const quandoMatch = markdown.match(/quando.*?infiltr[:?\s]*([^\n]+)/i);
          if (quandoMatch) dados.quandoInfiltracao = quandoMatch[1].trim();
        }
      }

      // Informações ginecológicas
      const menstruacaoResp = extrairResposta(/(?:última menstruação|data.*?menstruação)[:?\s]*([^\n]+)/i);
      if (menstruacaoResp) dados.dataUltimaMenstruacao = menstruacaoResp;

      const gestacoesResp = extrairResposta(/(?:número.*?gestações|quantas.*?gravidez)[:?\s]*([^\n]+)/i);
      if (gestacoesResp) dados.numeroGestacoes = gestacoesResp;

      const cesareasResp = extrairResposta(/(?:cesáreas|cesareas)[:?\s]*([^\n]+)/i);
      if (cesareasResp) dados.numeroCesareas = cesareasResp;

      // Informações de próstata
      const biopsiaResp = extrairResposta(/(?:biópsia|biopsia)[:?\s]*([^\n]+)/i);
      if (biopsiaResp) dados.jaFezBiopsia = biopsiaResp;

      const gleasonResp = extrairResposta(/(?:gleason)[:?\s]*([^\n]+)/i);
      if (gleasonResp) dados.gleason = gleasonResp;

      const psaResp = extrairResposta(/(?:PSA)[:?\s]*([^\n]+)/i);
      if (psaResp) dados.valorPSA = psaResp;

      // Adicionar o markdown completo como observações apenas se não tiver muitas informações extraídas
      const camposPreenchidos = Object.keys(dados).filter(k => dados[k] && dados[k] !== '').length;
      if (camposPreenchidos < 5) {
        dados.observacoes = markdown;
      } else {
        dados.observacoes = '';
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
