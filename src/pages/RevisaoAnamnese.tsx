import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Save, FileText, X, ArrowLeft, Sparkles, Camera, Trash2 } from 'lucide-react';
import { useCameraCapture } from '@/hooks/useCameraCapture';
import { TipoFormulario, FormData, AnamneseData } from '@/types/anamnese';
import { FormularioDinamico } from '@/components/anamnese/FormularioDinamico';
import { CanvasMarcacao } from '@/components/anamnese/CanvasMarcacao';
import { InfoTecnica } from '@/components/anamnese/InfoTecnica';
import { Label } from '@/components/ui/label';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
const RevisaoAnamnese = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    toast
  } = useToast();
  const estadoInicial = location.state || {};
  const contentRef = useRef<HTMLDivElement>(null);
  const [tipoFormulario, setTipoFormulario] = useState<TipoFormulario>(estadoInicial.tipo || 'punho');
  const [formData, setFormData] = useState<Partial<FormData>>(estadoInicial.dados || {});
  const [imagemMarcada, setImagemMarcada] = useState<string>('');
  const [salvando, setSalvando] = useState(false);
  const [iaInsights, setIaInsights] = useState<string>('');
  const [carregandoIA, setCarregandoIA] = useState(false);
  const [exportandoPDF, setExportandoPDF] = useState(false);
  
  // Camera capture hook
  const { 
    isCameraActive, 
    capturedImage, 
    videoRef, 
    startCamera, 
    capturePhoto, 
    stopCamera, 
    clearImage 
  } = useCameraCapture();

  // Informações técnicas
  const [contrasteEndovenoso, setContrasteEndovenoso] = useState(false);
  const [contrasteOral, setContrasteOral] = useState(false);
  const [contrasteRetal, setContrasteRetal] = useState(false);
  const [gelEndovaginal, setGelEndovaginal] = useState(false);
  const [tecnicoResponsavel, setTecnicoResponsavel] = useState('');
  const handleCampoChange = (campo: string, valor: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [campo]: valor
    }));
  };
  const handleInfoTecnicaChange = (campo: string, valor: boolean | string) => {
    switch (campo) {
      case 'contrasteEndovenoso':
        setContrasteEndovenoso(valor as boolean);
        break;
      case 'contrasteOral':
        setContrasteOral(valor as boolean);
        break;
      case 'contrasteRetal':
        setContrasteRetal(valor as boolean);
        break;
      case 'gelEndovaginal':
        setGelEndovaginal(valor as boolean);
        break;
      case 'tecnicoResponsavel':
        setTecnicoResponsavel(valor as string);
        break;
    }
  };
  const validarCamposObrigatorios = (): {
    valido: boolean;
    faltando: string[];
  } => {
    const camposObrigatorios: Record<string, string[]> = {
      punho: ['paciente', 'idade'],
      abdome: ['nome', 'idade'],
      atm: ['nome', 'idade'],
      cabeca: ['paciente', 'idade'],
      coluna: ['paciente', 'idade'],
      cotovelo: ['nome', 'idade'],
      joelho: ['nome', 'idade'],
      membros: ['trabalho'],
      ombro: ['paciente', 'idade'],
      quadril: ['nome', 'idade'],
      tornozelo: ['nome', 'idade'],
      mama: ['motivoExame']
    };
    const campos = camposObrigatorios[tipoFormulario] || [];
    const faltando: string[] = [];
    campos.forEach(campo => {
      const valor = (formData as any)[campo];
      if (!valor || Array.isArray(valor) && valor.length === 0) {
        faltando.push(campo);
      }
    });
    return {
      valido: faltando.length === 0,
      faltando
    };
  };
  const handleSalvar = async () => {
    const validacao = validarCamposObrigatorios();
    if (!validacao.valido) {
      toast({
        title: 'Campos obrigatórios faltando',
        description: `Por favor, preencha: ${validacao.faltando.join(', ')}`,
        variant: 'destructive'
      });
      return;
    }
    setSalvando(true);
    try {
      const payload: AnamneseData = {
        tipo: tipoFormulario,
        dados: formData as FormData,
        imagemMarcada: imagemMarcada || undefined,
        pedidoMedico: capturedImage || undefined,
        timestamp: new Date().toISOString(),
        contrasteEndovenoso,
        contrasteOral,
        contrasteRetal,
        gelEndovaginal,
        tecnicoResponsavel
      };

      // Aqui você pode enviar para o webhook N8N
      // const response = await fetch('SEU_WEBHOOK_N8N/anamnese-salvar', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload)
      // });

      console.log('Payload para salvar:', payload);
      toast({
        title: 'Sucesso',
        description: 'Anamnese salva com sucesso!'
      });

      // Redirecionar para dashboard ou próxima página
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar a anamnese',
        variant: 'destructive'
      });
    } finally {
      setSalvando(false);
    }
  };
  const handleExportarPDF = async () => {
    if (!contentRef.current) return;
    setExportandoPDF(true);
    try {
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      const nomeArquivo = `Anamnese_${tipoFormulario}_${(formData as any).nome || (formData as any).paciente || 'paciente'}_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`;
      pdf.save(nomeArquivo);
      toast({
        title: 'Sucesso',
        description: 'PDF exportado com sucesso!'
      });
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível exportar o PDF',
        variant: 'destructive'
      });
    } finally {
      setExportandoPDF(false);
    }
  };
  const handleCancelar = () => {
    if (confirm('Deseja realmente cancelar? As alterações não salvas serão perdidas.')) {
      navigate('/');
    }
  };
  const handleGerarInsights = async () => {
    setCarregandoIA(true);
    setIaInsights('');
    try {
      // Coletar todo o texto do formulário
      const textoCompleto = Object.entries(formData).filter(([_, valor]) => valor).map(([campo, valor]) => {
        const label = campo.charAt(0).toUpperCase() + campo.slice(1).replace(/([A-Z])/g, ' $1');
        return `${label}: ${Array.isArray(valor) ? valor.join(', ') : valor}`;
      }).join('\n');

      // Usar GET com query parameters
      const params = new URLSearchParams({
        tipo: tipoFormulario,
        dados: textoCompleto,
        timestamp: new Date().toISOString()
      });
      const response = await fetch(`https://jphortal.app.n8n.cloud/webhook/c314a3bb-6d2c-48d0-94a2-1287a5ecf858?${params.toString()}`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro da API:', response.status, errorText);
        throw new Error(`Erro ao obter insights da IA: ${response.status}`);
      }
      const responseText = await response.text();
      console.log('Resposta recebida:', responseText);
      let insights = '';
      try {
        const data = JSON.parse(responseText);
        // Extrair o conteúdo do objeto de resposta
        if (typeof data === 'string') {
          insights = data;
        } else if (data.message?.content) {
          // Resposta do n8n com formato {message: {content: "..."}}
          insights = data.message.content;
        } else if (data.content) {
          insights = typeof data.content === 'string' ? data.content : JSON.stringify(data.content);
        } else if (data.output) {
          insights = typeof data.output === 'string' ? data.output : JSON.stringify(data.output);
        } else if (data.insights) {
          insights = typeof data.insights === 'string' ? data.insights : JSON.stringify(data.insights);
        } else if (data.message) {
          insights = typeof data.message === 'string' ? data.message : JSON.stringify(data.message);
        } else {
          insights = JSON.stringify(data, null, 2);
        }
      } catch (parseError) {
        // Se não for JSON válido, usar o texto bruto
        insights = responseText;
      }
      setIaInsights(insights);
      toast({
        title: 'Insights gerados',
        description: 'Hipóteses diagnósticas obtidas com sucesso!'
      });
    } catch (error) {
      console.error('Erro ao gerar insights:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível gerar os insights da IA',
        variant: 'destructive'
      });
    } finally {
      setCarregandoIA(false);
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background p-4 md:p-8" ref={contentRef}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-3xl font-bold text-foreground">
              Revisão de Anamnese Radiológica
            </h1>
            <p className="text-muted-foreground mt-2">
              Revise e edite os dados coletados antes de finalizar
            </p>
          </div>
          
          {/* Info Técnica no canto superior direito */}
          <div className="w-full md:w-80 flex-shrink-0">
            <InfoTecnica contrasteEndovenoso={contrasteEndovenoso} contrasteOral={contrasteOral} contrasteRetal={contrasteRetal} gelEndovaginal={gelEndovaginal} tecnicoResponsavel={tecnicoResponsavel} onChange={handleInfoTecnicaChange} />
          </div>
        </div>

        {/* Seletor de Tipo de Formulário */}
        <Card className="mb-6 bg-[#11d411]">
          <CardHeader className="bg-[#10d110]">
            <CardTitle>Tipo de Exame</CardTitle>
          </CardHeader>
          <CardContent>
            <Label>Selecione o tipo de exame</Label>
            <select value={tipoFormulario} onChange={e => setTipoFormulario(e.target.value as TipoFormulario)} className="w-full mt-2 p-2 rounded-md border border-input bg-background">
              <option value="punho">Punho/Mão</option>
              <option value="abdome">Abdome/Medicina Interna</option>
              <option value="atm">ATM/Pescoço</option>
              <option value="cabeca">Cabeça</option>
              <option value="coluna">Coluna</option>
              <option value="cotovelo">Cotovelo</option>
              <option value="joelho">Joelho</option>
              <option value="membros">Membros</option>
              <option value="ombro">Ombro/Escápula</option>
              <option value="quadril">Bacia/Quadril</option>
              <option value="tornozelo">Tornozelo/Pé</option>
              <option value="mama">Mamografia</option>
            </select>
          </CardContent>
        </Card>

        {/* Layout Principal - Desktop 2 colunas, Mobile empilhado */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Coluna Esquerda - Formulário */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader className="bg-[#32cf32]">
                <CardTitle>Dados do Paciente</CardTitle>
              </CardHeader>
              <CardContent className="bg-[#2ecf2e]">
                <FormularioDinamico tipo={tipoFormulario} dados={formData} onChange={handleCampoChange} />
              </CardContent>
            </Card>
          </div>

          {/* Coluna Direita - Canvas e IA Insights */}
          <div className="lg:col-span-2 space-y-6">
            <CanvasMarcacao tipo={tipoFormulario} onImagemChange={setImagemMarcada} />
            
            {/* Botão de IA Insights */}
            <Button onClick={handleGerarInsights} disabled={carregandoIA} className="w-full" variant="outline">
              <Sparkles className="h-4 w-4 mr-2" />
              {carregandoIA ? 'Gerando Insights...' : 'Gerar Hipóteses Diagnósticas (IA)'}
            </Button>

            {/* Exibição dos Insights */}
            {iaInsights && <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    IA Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm whitespace-pre-wrap text-muted-foreground">
                    {iaInsights}
                  </div>
                </CardContent>
              </Card>}
          </div>
        </div>

        {/* Seção de Captura de Pedido Médico */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Pedido Médico
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!capturedImage && !isCameraActive && (
              <Button 
                onClick={startCamera} 
                variant="outline" 
                className="w-full"
              >
                <Camera className="h-4 w-4 mr-2" />
                Fotografar Pedido Médico
              </Button>
            )}

            {isCameraActive && (
              <div className="space-y-4">
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-auto"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={capturePhoto} className="flex-1">
                    <Camera className="h-4 w-4 mr-2" />
                    Capturar Foto
                  </Button>
                  <Button onClick={stopCamera} variant="outline">
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              </div>
            )}

            {capturedImage && (
              <div className="space-y-4">
                <div className="relative rounded-lg overflow-hidden border">
                  <img 
                    src={capturedImage} 
                    alt="Pedido médico capturado" 
                    className="w-full h-auto"
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={clearImage} 
                    variant="outline" 
                    className="flex-1"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remover Foto
                  </Button>
                  <Button 
                    onClick={startCamera} 
                    variant="outline"
                    className="flex-1"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Tirar Nova Foto
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="mt-8 flex flex-wrap gap-4 justify-end">
          <Button onClick={handleCancelar} variant="outline" disabled={salvando}>
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>

          <Button onClick={handleExportarPDF} variant="outline" disabled={salvando || exportandoPDF}>
            <FileText className="h-4 w-4 mr-2" />
            {exportandoPDF ? 'Exportando...' : 'Exportar PDF'}
          </Button>

          <Button onClick={handleSalvar} disabled={salvando} className="min-w-[150px]">
            {salvando ? <>Salvando...</> : <>
                <Save className="h-4 w-4 mr-2" />
                Salvar e Finalizar
              </>}
          </Button>
        </div>
      </div>
    </div>;
};
export default RevisaoAnamnese;