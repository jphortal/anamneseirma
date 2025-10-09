import { TipoFormulario, FormData } from '@/types/anamnese';
import { CampoEditavel } from './CampoEditavel';

interface FormularioDinamicoProps {
  tipo: TipoFormulario;
  dados: Partial<FormData>;
  onChange: (campo: string, valor: string | string[]) => void;
}

export const FormularioDinamico = ({ tipo, dados, onChange }: FormularioDinamicoProps) => {
  const renderFormulario = () => {
    switch (tipo) {
      case 'punho':
        return (
          <>
            <CampoEditavel
              label="Nome do Paciente"
              value={(dados as any).paciente || ''}
              onChange={(v) => onChange('paciente', v as string)}
              obrigatorio
            />
            <CampoEditavel
              label="Idade"
              value={(dados as any).idade || ''}
              onChange={(v) => onChange('idade', v as string)}
              obrigatorio
            />
            <CampoEditavel
              label="Contraste"
              value={(dados as any).contraste || 'Não'}
              onChange={(v) => onChange('contraste', v as string)}
              tipo="simNao"
            />
            <CampoEditavel
              label="Lado"
              value={(dados as any).lado || 'Direito'}
              onChange={(v) => onChange('lado', v as string)}
              tipo="radio"
              opcoes={['Direito', 'Esquerdo']}
            />
            <CampoEditavel
              label="Tempo com dor"
              value={(dados as any).tempoComDor || ''}
              onChange={(v) => onChange('tempoComDor', v as string)}
            />
            <CampoEditavel
              label="Localização da dor"
              value={(dados as any).localizacao || ''}
              onChange={(v) => onChange('localizacao', v as string)}
              tipo="textarea"
            />
            <CampoEditavel
              label="Pratica esporte?"
              value={(dados as any).praticaEsporte || 'Não'}
              onChange={(v) => onChange('praticaEsporte', v as string)}
              tipo="simNao"
            />
            {(dados as any).praticaEsporte === 'Sim' && (
              <CampoEditavel
                label="Qual esporte?"
                value={(dados as any).qualEsporte || ''}
                onChange={(v) => onChange('qualEsporte', v as string)}
              />
            )}
            <CampoEditavel
              label="É digitador?"
              value={(dados as any).ehDigitador || 'Não'}
              onChange={(v) => onChange('ehDigitador', v as string)}
              tipo="simNao"
            />
            <CampoEditavel
              label="Limitação de movimento?"
              value={(dados as any).limitacaoMovimento || 'Não'}
              onChange={(v) => onChange('limitacaoMovimento', v as string)}
              tipo="simNao"
            />
            <CampoEditavel
              label="Teve derrame articular?"
              value={(dados as any).teveDerrame || 'Não'}
              onChange={(v) => onChange('teveDerrame', v as string)}
              tipo="simNao"
            />
            {(dados as any).teveDerrame === 'Sim' && (
              <CampoEditavel
                label="Quando teve derrame?"
                value={(dados as any).quandoDerrame || ''}
                onChange={(v) => onChange('quandoDerrame', v as string)}
              />
            )}
            <CampoEditavel
              label="Alteração de sensibilidade?"
              value={(dados as any).alteracaoSensibilidade || 'Não'}
              onChange={(v) => onChange('alteracaoSensibilidade', v as string)}
              tipo="simNao"
            />
            <CampoEditavel
              label="Doença reumática?"
              value={(dados as any).doencaReumatica || 'Não'}
              onChange={(v) => onChange('doencaReumatica', v as string)}
              tipo="simNao"
            />
            <CampoEditavel
              label="História de trauma?"
              value={(dados as any).historiaTrauma || 'Não'}
              onChange={(v) => onChange('historiaTrauma', v as string)}
              tipo="simNao"
            />
            {(dados as any).historiaTrauma === 'Sim' && (
              <CampoEditavel
                label="Quando foi o trauma?"
                value={(dados as any).quandoTrauma || ''}
                onChange={(v) => onChange('quandoTrauma', v as string)}
              />
            )}
            <CampoEditavel
              label="Já foi operado?"
              value={(dados as any).jaFoiOperado || 'Não'}
              onChange={(v) => onChange('jaFoiOperado', v as string)}
              tipo="simNao"
            />
            {(dados as any).jaFoiOperado === 'Sim' && (
              <CampoEditavel
                label="O que foi feito na cirurgia?"
                value={(dados as any).oqueFeitoCircurgia || ''}
                onChange={(v) => onChange('oqueFeitoCircurgia', v as string)}
                tipo="textarea"
              />
            )}
            <CampoEditavel
              label="Observações"
              value={(dados as any).observacoes || ''}
              onChange={(v) => onChange('observacoes', v as string)}
              tipo="textarea"
            />
          </>
        );

      case 'joelho':
        return (
          <>
            <CampoEditavel
              label="Nome do Paciente"
              value={(dados as any).nome || ''}
              onChange={(v) => onChange('nome', v as string)}
              obrigatorio
            />
            <CampoEditavel
              label="Idade"
              value={(dados as any).idade || ''}
              onChange={(v) => onChange('idade', v as string)}
              obrigatorio
            />
            <CampoEditavel
              label="Lado"
              value={(dados as any).lado || 'Direito'}
              onChange={(v) => onChange('lado', v as string)}
              tipo="radio"
              opcoes={['Direito', 'Esquerdo']}
            />
            <CampoEditavel
              label="Trabalho/Profissão"
              value={(dados as any).trabalho || ''}
              onChange={(v) => onChange('trabalho', v as string)}
            />
            <CampoEditavel
              label="Há quanto tempo tem dor?"
              value={(dados as any).tempoComDor || ''}
              onChange={(v) => onChange('tempoComDor', v as string)}
            />
            <CampoEditavel
              label="Localização da dor"
              value={(dados as any).localizacaoDor || ''}
              onChange={(v) => onChange('localizacaoDor', v as string)}
              tipo="textarea"
            />
            <CampoEditavel
              label="Dói ao subir escada?"
              value={(dados as any).doiSubirEscada || 'Não'}
              onChange={(v) => onChange('doiSubirEscada', v as string)}
              tipo="simNao"
            />
            <CampoEditavel
              label="Dói após tempo sentado?"
              value={(dados as any).doiTempoSentado || 'Não'}
              onChange={(v) => onChange('doiTempoSentado', v as string)}
              tipo="simNao"
            />
            <CampoEditavel
              label="Teve derrame?"
              value={(dados as any).teveDerrame || 'Não'}
              onChange={(v) => onChange('teveDerrame', v as string)}
              tipo="simNao"
            />
            <CampoEditavel
              label="Joelho falseia?"
              value={(dados as any).joelhoFalseia || 'Não'}
              onChange={(v) => onChange('joelhoFalseia', v as string)}
              tipo="simNao"
            />
            <CampoEditavel
              label="Joelho trava?"
              value={(dados as any).joelhoTrava || 'Não'}
              onChange={(v) => onChange('joelhoTrava', v as string)}
              tipo="simNao"
            />
            <CampoEditavel
              label="História de trauma?"
              value={(dados as any).historiaTrauma || 'Não'}
              onChange={(v) => onChange('historiaTrauma', v as string)}
              tipo="simNao"
            />
            {(dados as any).historiaTrauma === 'Sim' && (
              <CampoEditavel
                label="Quando foi o trauma?"
                value={(dados as any).quandoTrauma || ''}
                onChange={(v) => onChange('quandoTrauma', v as string)}
              />
            )}
            <CampoEditavel
              label="Já foi operado?"
              value={(dados as any).jaFoiOperado || 'Não'}
              onChange={(v) => onChange('jaFoiOperado', v as string)}
              tipo="simNao"
            />
            {(dados as any).jaFoiOperado === 'Sim' && (
              <CampoEditavel
                label="O que foi feito?"
                value={(dados as any).oqueFeitoCircurgia || ''}
                onChange={(v) => onChange('oqueFeitoCircurgia', v as string)}
                tipo="textarea"
              />
            )}
            <CampoEditavel
              label="Fez infiltração?"
              value={(dados as any).fezInfiltracao || 'Não'}
              onChange={(v) => onChange('fezInfiltracao', v as string)}
              tipo="simNao"
            />
            {(dados as any).fezInfiltracao === 'Sim' && (
              <CampoEditavel
                label="Quando fez infiltração?"
                value={(dados as any).quandoInfiltracao || ''}
                onChange={(v) => onChange('quandoInfiltracao', v as string)}
              />
            )}
          </>
        );

      case 'abdome':
        return (
          <>
            <CampoEditavel
              label="Nome do Paciente"
              value={(dados as any).nome || ''}
              onChange={(v) => onChange('nome', v as string)}
              obrigatorio
            />
            <CampoEditavel
              label="Idade"
              value={(dados as any).idade || ''}
              onChange={(v) => onChange('idade', v as string)}
              obrigatorio
            />
            <CampoEditavel
              label="Tipo de Exame"
              value={(dados as any).tipoExame || []}
              onChange={(v) => onChange('tipoExame', v)}
              tipo="checkbox"
              opcoes={['Abdome Superior', 'Próstata', 'Pelve', 'Tórax', 'Angio', 'Outros']}
            />
            <CampoEditavel
              label="Trabalho/Profissão"
              value={(dados as any).trabalho || ''}
              onChange={(v) => onChange('trabalho', v as string)}
            />
            <CampoEditavel
              label="Motivo do exame"
              value={(dados as any).motivoExame || ''}
              onChange={(v) => onChange('motivoExame', v as string)}
              tipo="textarea"
            />
            <CampoEditavel
              label="Problemas de saúde"
              value={(dados as any).problemaSaude || ''}
              onChange={(v) => onChange('problemaSaude', v as string)}
              tipo="textarea"
            />
            <CampoEditavel
              label="Já foi operado?"
              value={(dados as any).jaFoiOperado || 'Não'}
              onChange={(v) => onChange('jaFoiOperado', v as string)}
              tipo="simNao"
            />
            {(dados as any).jaFoiOperado === 'Sim' && (
              <CampoEditavel
                label="Quais cirurgias?"
                value={(dados as any).cirurgias || ''}
                onChange={(v) => onChange('cirurgias', v as string)}
                tipo="textarea"
              />
            )}
            <CampoEditavel
              label="Fez quimioterapia?"
              value={(dados as any).quimioterapia || 'Não'}
              onChange={(v) => onChange('quimioterapia', v as string)}
              tipo="simNao"
            />
            {(dados as any).quimioterapia === 'Sim' && (
              <CampoEditavel
                label="Quando fez quimioterapia?"
                value={(dados as any).quandoQuimio || ''}
                onChange={(v) => onChange('quandoQuimio', v as string)}
              />
            )}
            <CampoEditavel
              label="Fez radioterapia?"
              value={(dados as any).radioterapia || 'Não'}
              onChange={(v) => onChange('radioterapia', v as string)}
              tipo="simNao"
            />
            {(dados as any).radioterapia === 'Sim' && (
              <>
                <CampoEditavel
                  label="Quando fez radioterapia?"
                  value={(dados as any).quandoRadio || ''}
                  onChange={(v) => onChange('quandoRadio', v as string)}
                />
                <CampoEditavel
                  label="Região da radioterapia"
                  value={(dados as any).regiaoRadio || ''}
                  onChange={(v) => onChange('regiaoRadio', v as string)}
                />
              </>
            )}
            <CampoEditavel
              label="Fuma?"
              value={(dados as any).fuma || 'Não'}
              onChange={(v) => onChange('fuma', v as string)}
              tipo="simNao"
            />
            {(dados as any).fuma === 'Sim' && (
              <CampoEditavel
                label="Há quanto tempo fuma?"
                value={(dados as any).tempoFumando || ''}
                onChange={(v) => onChange('tempoFumando', v as string)}
              />
            )}
            <CampoEditavel
              label="Está perdendo peso?"
              value={(dados as any).estaPerdendoPeso || 'Não'}
              onChange={(v) => onChange('estaPerdendoPeso', v as string)}
              tipo="simNao"
            />
          </>
        );

      // Formulário simplificado para outros tipos
      default:
        return (
          <>
            <CampoEditavel
              label="Nome do Paciente"
              value={(dados as any).nome || (dados as any).paciente || ''}
              onChange={(v) => onChange('nome', v as string)}
              obrigatorio
            />
            <CampoEditavel
              label="Idade"
              value={(dados as any).idade || ''}
              onChange={(v) => onChange('idade', v as string)}
              obrigatorio
            />
            <CampoEditavel
              label="Motivo do Exame"
              value={(dados as any).motivoExame || ''}
              onChange={(v) => onChange('motivoExame', v as string)}
              tipo="textarea"
            />
            <CampoEditavel
              label="Observações"
              value={(dados as any).observacoes || ''}
              onChange={(v) => onChange('observacoes', v as string)}
              tipo="textarea"
            />
          </>
        );
    }
  };

  return <div className="space-y-4">{renderFormulario()}</div>;
};
