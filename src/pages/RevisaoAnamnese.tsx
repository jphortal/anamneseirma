import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { salvarAnamneseNoHistorico } from '@/components/anamnese/HistoricoAnamneses';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Save, FileText, X, ArrowLeft, Sparkles, Camera, Trash2, Eye, Send } from 'lucide-react';
import { useCameraCapture } from '@/hooks/useCameraCapture';
import { TipoFormulario, FormData as AnamneseFormData, AnamneseData } from '@/types/anamnese';
import { FormularioDinamico } from '@/components/anamnese/FormularioDinamico';
import { CanvasMarcacao } from '@/components/anamnese/CanvasMarcacao';
import { InfoTecnica } from '@/components/anamnese/InfoTecnica';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  const [formData, setFormData] = useState<Partial<AnamneseFormData>>(estadoInicial.dados || {});
  const [imagemMarcada, setImagemMarcada] = useState<string>('');
  const [salvando, setSalvando] = useState(false);
  const [iaInsights, setIaInsights] = useState<string>('');
  const [carregandoIA, setCarregandoIA] = useState(false);
  const [gerandoPreview, setGerandoPreview] = useState(false);
  const [enviandoPDF, setEnviandoPDF] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string>('');
  const [pdfPreviewImage, setPdfPreviewImage] = useState<string>('');
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfNomeArquivo, setPdfNomeArquivo] = useState<string>('');
  const worklistData = estadoInicial.worklistData || null;
  
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
        dados: formData as AnamneseFormData,
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
      
      // Salvar no histórico
      salvarAnamneseNoHistorico(tipoFormulario, formData, worklistData);

      toast({
        title: 'Sucesso',
        description: 'Anamnese salva com sucesso!'
      });
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
  const handleGerarPreviewPDF = async () => {
    if (!contentRef.current) return;
    setGerandoPreview(true);
    
    try {
      // Expandir todos os elementos colapsáveis antes de gerar PDF
      const content = contentRef.current;
      const originalStyles = new Map<HTMLElement, string>();
      
      // Abrir todos os <details>
      const detailsElements = content.querySelectorAll('details');
      detailsElements.forEach(detail => {
        detail.setAttribute('open', '');
      });
      
      // Abrir todos os elementos com data-state="closed" (Radix Collapsible/Accordion)
      const closedElements = content.querySelectorAll('[data-state="closed"]');
      closedElements.forEach(el => {
        (el as HTMLElement).setAttribute('data-state', 'open');
      });
      
      // Forçar visibilidade de conteúdos colapsáveis
      const collapsibleContents = content.querySelectorAll('[data-radix-collapsible-content], [role="region"]');
      collapsibleContents.forEach(el => {
        const htmlEl = el as HTMLElement;
        originalStyles.set(htmlEl, htmlEl.style.cssText);
        htmlEl.style.height = 'auto';
        htmlEl.style.overflow = 'visible';
        htmlEl.style.display = 'block';
      });
      
      // Aumentar fonte de todos os textos para o PDF
      const textElements = content.querySelectorAll('p, span, div, label, input, textarea, li');
      textElements.forEach(el => {
        const htmlEl = el as HTMLElement;
        if (!originalStyles.has(htmlEl)) {
          originalStyles.set(htmlEl, htmlEl.style.cssText);
        }
        const currentSize = window.getComputedStyle(htmlEl).fontSize;
        const currentSizeNum = parseFloat(currentSize);
        htmlEl.style.fontSize = `${Math.max(currentSizeNum * 1.3, 14)}px`;
      });
      
      // Aguardar renderização
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const canvas = await html2canvas(content, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowHeight: content.scrollHeight,
        height: content.scrollHeight
      });
      
      // Restaurar estilos originais
      originalStyles.forEach((style, el) => {
        el.style.cssText = style;
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // Armazenar a imagem para preview
      setPdfPreviewImage(imgData);
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
      
      // Converter PDF para Blob binário
      const generatedPdfBlob = pdf.output('blob');
      
      // Criar URL para preview
      const previewUrl = URL.createObjectURL(generatedPdfBlob);
      
      // Armazenar dados para envio posterior
      setPdfBlob(generatedPdfBlob);
      setPdfNomeArquivo(nomeArquivo);
      setPdfPreviewUrl(previewUrl);
      setShowPreview(true);

      toast({
        title: 'Preview gerado',
        description: 'Revise o PDF antes de enviar'
      });
    } catch (error) {
      console.error('Erro ao gerar preview do PDF:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível gerar o preview do PDF',
        variant: 'destructive'
      });
    } finally {
      setGerandoPreview(false);
    }
  };

  const handleEnviarPDF = async () => {
    if (!pdfBlob || !pdfNomeArquivo) return;
    
    setEnviandoPDF(true);
    
    try {
      // Criar FormData para enviar arquivo binário e dados do worklist
      const uploadFormData = new FormData();
      uploadFormData.append('data', pdfBlob, pdfNomeArquivo);
      
      // Adicionar dados do worklist como JSON
      if (worklistData) {
        uploadFormData.append('worklistData', JSON.stringify(worklistData));
      }
      
      // Enviar para a API n8n
      const response = await fetch('https://jphortal.app.n8n.cloud/webhook-test/57ed4892-7c1d-4b38-9756-dc611daea8e1', {
        method: 'POST',
        body: uploadFormData
      });

      if (!response.ok) {
        throw new Error(`Erro ao enviar PDF: ${response.status}`);
      }

      toast({
        title: 'Sucesso',
        description: 'PDF enviado com sucesso para o sistema!'
      });
      
      // Fechar preview e limpar dados
      handleFecharPreview();
    } catch (error) {
      console.error('Erro ao enviar PDF:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar o PDF',
        variant: 'destructive'
      });
    } finally {
      setEnviandoPDF(false);
    }
  };

  const handleFecharPreview = () => {
    setShowPreview(false);
    if (pdfPreviewUrl) {
      URL.revokeObjectURL(pdfPreviewUrl);
    }
    setPdfPreviewUrl('');
    setPdfPreviewImage('');
    setPdfBlob(null);
    setPdfNomeArquivo('');
  };

  const handleAbrirPDFNovaAba = () => {
    if (pdfPreviewUrl) {
      window.open(pdfPreviewUrl, '_blank');
    }
  };

  const handleBaixarPDF = () => {
    if (pdfPreviewUrl && pdfNomeArquivo) {
      const link = document.createElement('a');
      link.href = pdfPreviewUrl;
      link.download = pdfNomeArquivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
                <CardContent className="max-h-none overflow-visible">
                  <div className="text-lg whitespace-pre-wrap text-foreground leading-relaxed">
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
              <div 
                onClick={startCamera}
                className="cursor-pointer border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 hover:border-primary transition-colors text-center"
              >
                <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium">Clique aqui para fotografar o pedido médico</p>
                <p className="text-sm text-muted-foreground mt-2">A câmera será aberta automaticamente</p>
              </div>
            )}

            {isCameraActive && (
              <div className="space-y-4">
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-auto max-h-[600px] object-contain"
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
                <div className="relative rounded-lg overflow-hidden border bg-black">
                  <img 
                    src={capturedImage} 
                    alt="Pedido médico capturado" 
                    className="w-full h-auto max-h-[600px] object-contain mx-auto"
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

          <Button onClick={handleGerarPreviewPDF} variant="outline" disabled={salvando || gerandoPreview}>
            <Eye className="h-4 w-4 mr-2" />
            {gerandoPreview ? 'Gerando Preview...' : 'Preview e Exportar PDF'}
          </Button>

          <Button onClick={handleSalvar} disabled={salvando} className="min-w-[150px]">
            {salvando ? <>Salvando...</> : <>
                <Save className="h-4 w-4 mr-2" />
                Salvar e Finalizar
              </>}
          </Button>
        </div>
      </div>

      {/* Dialog de Preview do PDF */}
      <Dialog open={showPreview} onOpenChange={(open) => !open && handleFecharPreview()}>
        <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Preview do PDF</DialogTitle>
            <DialogDescription>
              Revise o documento antes de enviar. Use os botões abaixo para visualizar ou baixar o PDF completo.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex gap-2 mb-4">
            <Button
              variant="outline"
              onClick={handleAbrirPDFNovaAba}
              className="flex-1"
            >
              <FileText className="h-4 w-4 mr-2" />
              Abrir PDF em Nova Aba
            </Button>
            <Button
              variant="outline"
              onClick={handleBaixarPDF}
              className="flex-1"
            >
              <FileText className="h-4 w-4 mr-2" />
              Baixar PDF
            </Button>
          </div>
          
          <div className="flex-1 overflow-auto border rounded-lg bg-white p-4">
            {pdfPreviewImage && (
              <img
                src={pdfPreviewImage}
                alt="Preview do documento"
                className="w-full h-auto"
              />
            )}
          </div>

          <DialogFooter className="gap-2 mt-4">
            <Button
              variant="outline"
              onClick={handleFecharPreview}
              disabled={enviandoPDF}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              onClick={handleEnviarPDF}
              disabled={enviandoPDF}
              className="min-w-[150px]"
            >
              {enviandoPDF ? (
                <>Enviando...</>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Confirmar e Enviar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>;
};
export default RevisaoAnamnese;