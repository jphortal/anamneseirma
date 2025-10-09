import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Save, FileText, X, ArrowLeft } from 'lucide-react';
import { TipoFormulario, FormData, AnamneseData } from '@/types/anamnese';
import { FormularioDinamico } from '@/components/anamnese/FormularioDinamico';
import { CanvasMarcacao } from '@/components/anamnese/CanvasMarcacao';
import { Label } from '@/components/ui/label';

const RevisaoAnamnese = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const estadoInicial = location.state || {};
  
  const [tipoFormulario, setTipoFormulario] = useState<TipoFormulario>(
    estadoInicial.tipo || 'punho'
  );
  const [formData, setFormData] = useState<Partial<FormData>>(
    estadoInicial.dados || {}
  );
  const [imagemMarcada, setImagemMarcada] = useState<string>('');
  const [salvando, setSalvando] = useState(false);

  const handleCampoChange = (campo: string, valor: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const validarCamposObrigatorios = (): { valido: boolean; faltando: string[] } => {
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
      mama: ['motivoExame'],
    };

    const campos = camposObrigatorios[tipoFormulario] || [];
    const faltando: string[] = [];

    campos.forEach((campo) => {
      const valor = (formData as any)[campo];
      if (!valor || (Array.isArray(valor) && valor.length === 0)) {
        faltando.push(campo);
      }
    });

    return {
      valido: faltando.length === 0,
      faltando,
    };
  };

  const handleSalvar = async () => {
    const validacao = validarCamposObrigatorios();
    
    if (!validacao.valido) {
      toast({
        title: 'Campos obrigatórios faltando',
        description: `Por favor, preencha: ${validacao.faltando.join(', ')}`,
        variant: 'destructive',
      });
      return;
    }

    setSalvando(true);

    try {
      const payload: AnamneseData = {
        tipo: tipoFormulario,
        dados: formData as FormData,
        imagemMarcada: imagemMarcada || undefined,
        timestamp: new Date().toISOString(),
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
        description: 'Anamnese salva com sucesso!',
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
        variant: 'destructive',
      });
    } finally {
      setSalvando(false);
    }
  };

  const handleExportarPDF = () => {
    toast({
      title: 'Em desenvolvimento',
      description: 'Funcionalidade de exportar PDF será implementada em breve',
    });
  };

  const handleCancelar = () => {
    if (confirm('Deseja realmente cancelar? As alterações não salvas serão perdidas.')) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
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

        {/* Seletor de Tipo de Formulário */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Tipo de Exame</CardTitle>
          </CardHeader>
          <CardContent>
            <Label>Selecione o tipo de exame</Label>
            <select
              value={tipoFormulario}
              onChange={(e) => setTipoFormulario(e.target.value as TipoFormulario)}
              className="w-full mt-2 p-2 rounded-md border border-input bg-background"
            >
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
              <CardHeader>
                <CardTitle>Dados do Paciente</CardTitle>
              </CardHeader>
              <CardContent>
                <FormularioDinamico
                  tipo={tipoFormulario}
                  dados={formData}
                  onChange={handleCampoChange}
                />
              </CardContent>
            </Card>
          </div>

          {/* Coluna Direita - Canvas */}
          <div className="lg:col-span-2">
            <CanvasMarcacao
              tipo={tipoFormulario}
              onImagemChange={setImagemMarcada}
            />
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="mt-8 flex flex-wrap gap-4 justify-end">
          <Button
            onClick={handleCancelar}
            variant="outline"
            disabled={salvando}
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>

          <Button
            onClick={handleExportarPDF}
            variant="outline"
            disabled={salvando}
          >
            <FileText className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>

          <Button
            onClick={handleSalvar}
            disabled={salvando}
            className="min-w-[150px]"
          >
            {salvando ? (
              <>Salvando...</>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar e Finalizar
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RevisaoAnamnese;
