import { TipoFormulario, FormData } from '@/types/anamnese';
import { CampoEditavel } from './CampoEditavel';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';

interface FormularioDinamicoProps {
  tipo: TipoFormulario;
  dados: Partial<FormData>;
  onChange: (campo: string, valor: string | string[]) => void;
}

export const FormularioDinamico = ({ tipo, dados, onChange }: FormularioDinamicoProps) => {
  const [clearanceCreatinina, setClearanceCreatinina] = useState<string>('');

  // Cálculo automático do clearance de creatinina usando Cockcroft-Gault
  useEffect(() => {
    const idade = parseFloat((dados as any).idade || '0');
    const peso = parseFloat((dados as any).peso || '0');
    const creatinina = parseFloat((dados as any).creatinina || '0');
    const sexo = (dados as any).sexo || '';

    if (idade > 0 && peso > 0 && creatinina > 0 && sexo) {
      let clcr = ((140 - idade) * peso) / (72 * creatinina);
      
      // Ajuste para sexo feminino
      if (sexo === 'Feminino') {
        clcr = clcr * 0.85;
      }

      setClearanceCreatinina(clcr.toFixed(1));
    } else {
      setClearanceCreatinina('');
    }
  }, [(dados as any).idade, (dados as any).peso, (dados as any).creatinina, (dados as any).sexo]);

  // Componente para os campos clínicos que aparecerão em todos os templates
  const CamposClinicosComuns = () => (
    <Card className="p-4 mb-6 bg-primary/5 border-primary/20">
      <h3 className="text-lg font-semibold mb-4 text-primary">Dados Clínicos do Paciente</h3>
      <div className="space-y-4">
        <CampoEditavel
          label="Nome completo"
          value={(dados as any).nomeCompleto || ''}
          onChange={(v) => onChange('nomeCompleto', v as string)}
        />
        <CampoEditavel
          label="Idade (anos)"
          value={(dados as any).idade || ''}
          onChange={(v) => onChange('idade', v as string)}
          tipo="text"
        />
        <CampoEditavel
          label="Sexo ao nascimento"
          value={(dados as any).sexo || ''}
          onChange={(v) => onChange('sexo', v as string)}
          tipo="radio"
          opcoes={['Masculino', 'Feminino']}
        />
        <CampoEditavel
          label="Peso corporal (kg)"
          value={(dados as any).peso || ''}
          onChange={(v) => onChange('peso', v as string)}
          tipo="text"
        />
        <CampoEditavel
          label="Creatinina sérica (mg/dL)"
          value={(dados as any).creatinina || ''}
          onChange={(v) => onChange('creatinina', v as string)}
          tipo="text"
        />
        {clearanceCreatinina && (
          <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm font-medium text-green-900 dark:text-green-100">
              Clearance de creatinina estimado (Cockcroft-Gault): <span className="text-lg font-bold">{clearanceCreatinina} mL/min</span>
            </p>
          </div>
        )}
      </div>
    </Card>
  );

  const renderFormulario = () => {
    switch (tipo) {
      case 'punho':
        return (
          <>
            <CampoEditavel
              label="Qual o lado afetado?"
              value={(dados as any).lado || ''}
              onChange={(v) => onChange('lado', v as string)}
              tipo="radio"
              opcoes={['Direito', 'Esquerdo']}
            />
            <CampoEditavel
              label="Há quanto tempo sente dor?"
              value={(dados as any).tempoComDor || ''}
              onChange={(v) => onChange('tempoComDor', v as string)}
            />
            <CampoEditavel
              label="Onde exatamente sente a dor?"
              value={(dados as any).localizacao || ''}
              onChange={(v) => onChange('localizacao', v as string)}
            />
            <CampoEditavel
              label="Pratica esportes?"
              value={(dados as any).praticaEsporte || 'Não'}
              onChange={(v) => onChange('praticaEsporte', v as string)}
              tipo="simNao"
            />
            <CampoEditavel
              label="Trabalha digitando com frequência?"
              value={(dados as any).ehDigitador || 'Não'}
              onChange={(v) => onChange('ehDigitador', v as string)}
              tipo="simNao"
            />
            <CampoEditavel
              label="Possui limitação de movimento?"
              value={(dados as any).limitacaoMovimento || 'Não'}
              onChange={(v) => onChange('limitacaoMovimento', v as string)}
              tipo="simNao"
            />
            <CampoEditavel
              label="Já teve derrame?"
              value={(dados as any).teveDerrame || 'Não'}
              onChange={(v) => onChange('teveDerrame', v as string)}
              tipo="simNao"
            />
            <CampoEditavel
              label="Nota alteração de sensibilidade?"
              value={(dados as any).alteracaoSensibilidade || 'Não'}
              onChange={(v) => onChange('alteracaoSensibilidade', v as string)}
              tipo="simNao"
            />
            <CampoEditavel
              label="Possui doença reumática?"
              value={(dados as any).doencaReumatica || 'Não'}
              onChange={(v) => onChange('doencaReumatica', v as string)}
              tipo="simNao"
            />
            <CampoEditavel
              label="Já teve algum trauma?"
              value={(dados as any).historiaTrauma || 'Não'}
              onChange={(v) => onChange('historiaTrauma', v as string)}
              tipo="simNao"
            />
            <CampoEditavel
              label="Já foi operado(a) dessa região?"
              value={(dados as any).jaFoiOperado || 'Não'}
              onChange={(v) => onChange('jaFoiOperado', v as string)}
              tipo="simNao"
            />
            <CampoEditavel
              label="Sabe o que foi feito na cirurgia?"
              value={(dados as any).oqueFeitoCircurgia || ''}
              onChange={(v) => onChange('oqueFeitoCircurgia', v as string)}
            />
            <CampoEditavel
              label="Deseja acrescentar alguma observação?"
              value={(dados as any).observacoes || ''}
              onChange={(v) => onChange('observacoes', v as string)}
              tipo="textarea"
            />
          </>
        );

      case 'abdome':
        return (
          <>
            <CampoEditavel
              label="Qual é o seu trabalho e função?"
              value={(dados as any).trabalho || ''}
              onChange={(v) => onChange('trabalho', v as string)}
            />
            <CampoEditavel
              label="Qual o motivo principal deste exame? (Resuma a queixa principal)"
              value={(dados as any).motivoExame || ''}
              onChange={(v) => onChange('motivoExame', v as string)}
              tipo="textarea"
            />
            <CampoEditavel
              label="Possui outros problemas de saúde conhecidos?"
              value={(dados as any).problemaSaude || ''}
              onChange={(v) => onChange('problemaSaude', v as string)}
              tipo="textarea"
            />
            <CampoEditavel
              label="Já foi operado(a)? Quais cirurgias e há quanto tempo?"
              value={(dados as any).cirurgias || ''}
              onChange={(v) => onChange('cirurgias', v as string)}
              tipo="textarea"
            />
            <CampoEditavel
              label="Já fez quimioterapia ou radioterapia? Quando e em qual região?"
              value={(dados as any).quimioRadio || ''}
              onChange={(v) => onChange('quimioRadio', v as string)}
              tipo="textarea"
            />
            <CampoEditavel
              label="(Mulheres) Quantas gestações e cesáreas teve? Teve abortos com curetagem? Data da última menstruação? Faz reposição hormonal?"
              value={(dados as any).historicoMulheres || ''}
              onChange={(v) => onChange('historicoMulheres', v as string)}
              tipo="textarea"
            />
            <CampoEditavel
              label="(Homens) Já fez biópsia de próstata? Quando? Qual o resultado (Gleason)? Qual o valor atual e anterior do PSA?"
              value={(dados as any).historicoHomens || ''}
              onChange={(v) => onChange('historicoHomens', v as string)}
              tipo="textarea"
            />
            <CampoEditavel
              label="Fuma? Há quanto tempo?"
              value={(dados as any).fuma || ''}
              onChange={(v) => onChange('fuma', v as string)}
            />
            <CampoEditavel
              label="Está perdendo peso? Há quanto tempo?"
              value={(dados as any).perdendoPeso || ''}
              onChange={(v) => onChange('perdendoPeso', v as string)}
            />
            <CampoEditavel
              label="Já fez ressonância ou tomografia? Em qual serviço?"
              value={(dados as any).examesAnteriores || ''}
              onChange={(v) => onChange('examesAnteriores', v as string)}
            />
          </>
        );

      case 'atm':
        return (
          <>
            <CampoEditavel
              label="Qual o seu trabalho e função?"
              value={(dados as any).trabalho || ''}
              onChange={(v) => onChange('trabalho', v as string)}
            />
            <CampoEditavel
              label="Qual o motivo principal do exame e a queixa principal?"
              value={(dados as any).motivoExame || ''}
              onChange={(v) => onChange('motivoExame', v as string)}
              tipo="textarea"
            />
            <CampoEditavel
              label="Já foi operado(a)? Quais cirurgias e há quanto tempo?"
              value={(dados as any).cirurgias || ''}
              onChange={(v) => onChange('cirurgias', v as string)}
              tipo="textarea"
            />
            <CampoEditavel
              label="Já fez quimioterapia ou radioterapia? Quando e em qual região?"
              value={(dados as any).quimioRadio || ''}
              onChange={(v) => onChange('quimioRadio', v as string)}
              tipo="textarea"
            />
            <CampoEditavel
              label="Tem ou teve algum problema de saúde importante?"
              value={(dados as any).problemaSaude || ''}
              onChange={(v) => onChange('problemaSaude', v as string)}
              tipo="textarea"
            />
            <CampoEditavel
              label="Já fez biópsia? Quando?"
              value={(dados as any).biopsia || ''}
              onChange={(v) => onChange('biopsia', v as string)}
            />
            <CampoEditavel
              label="Fuma? Há quanto tempo?"
              value={(dados as any).fuma || ''}
              onChange={(v) => onChange('fuma', v as string)}
            />
            <CampoEditavel
              label="Está perdendo peso? Há quanto tempo?"
              value={(dados as any).perdendoPeso || ''}
              onChange={(v) => onChange('perdendoPeso', v as string)}
            />
            <CampoEditavel
              label="Data da última menstruação (se aplicável)"
              value={(dados as any).ultimaMenstruacao || ''}
              onChange={(v) => onChange('ultimaMenstruacao', v as string)}
            />
            <CampoEditavel
              label="Já fez tomografia ou ressonância? Onde?"
              value={(dados as any).examesAnteriores || ''}
              onChange={(v) => onChange('examesAnteriores', v as string)}
            />
          </>
        );

      case 'cabeca':
        return (
          <>
            <CampoEditavel
              label="Qual o seu trabalho e função?"
              value={(dados as any).trabalho || ''}
              onChange={(v) => onChange('trabalho', v as string)}
            />
            <CampoEditavel
              label="Qual o motivo do exame e quando começaram os sintomas?"
              value={(dados as any).motivoSintomas || ''}
              onChange={(v) => onChange('motivoSintomas', v as string)}
              tipo="textarea"
            />
            <CampoEditavel
              label="Se houver cefaleia: onde dói, qual o tipo e duração da dor?"
              value={(dados as any).cefaleia || ''}
              onChange={(v) => onChange('cefaleia', v as string)}
              tipo="textarea"
            />
            <CampoEditavel
              label="Se há convulsões: como percebe que vai ter crise? Alguém presenciou? Quantas crises no último mês? Houve aumento da frequência?"
              value={(dados as any).convulsoes || ''}
              onChange={(v) => onChange('convulsoes', v as string)}
              tipo="textarea"
            />
            <CampoEditavel
              label="Trouxe EEG?"
              value={(dados as any).trouxeEEG || 'Não'}
              onChange={(v) => onChange('trouxeEEG', v as string)}
              tipo="simNao"
            />
            <CampoEditavel
              label="Tem algum dos seguintes sintomas: tontura, desmaio, náuseas, perda de força, confusão mental, etc.?"
              value={(dados as any).outrosSintomas || ''}
              onChange={(v) => onChange('outrosSintomas', v as string)}
              tipo="textarea"
            />
            <CampoEditavel
              label="Usa medicamentos? Quais?"
              value={(dados as any).medicamentos || ''}
              onChange={(v) => onChange('medicamentos', v as string)}
            />
            <CampoEditavel
              label="Já fez cirurgia na cabeça? Quando?"
              value={(dados as any).cirurgias || ''}
              onChange={(v) => onChange('cirurgias', v as string)}
            />
            <CampoEditavel
              label="Já fez radio ou quimioterapia? Quando e onde?"
              value={(dados as any).quimioRadio || ''}
              onChange={(v) => onChange('quimioRadio', v as string)}
            />
            <CampoEditavel
              label="Fuma? Há quanto tempo?"
              value={(dados as any).fuma || ''}
              onChange={(v) => onChange('fuma', v as string)}
            />
            <CampoEditavel
              label="Está perdendo peso? Há quanto tempo?"
              value={(dados as any).perdendoPeso || ''}
              onChange={(v) => onChange('perdendoPeso', v as string)}
            />
            <CampoEditavel
              label="(Crianças) A gestação foi normal? Houve atraso no desenvolvimento?"
              value={(dados as any).historicoInfantil || ''}
              onChange={(v) => onChange('historicoInfantil', v as string)}
              tipo="textarea"
            />
            <CampoEditavel
              label="Já fez tomografia ou ressonância? Onde?"
              value={(dados as any).examesAnteriores || ''}
              onChange={(v) => onChange('examesAnteriores', v as string)}
            />
          </>
        );

      case 'coluna':
        return (
          <>
            <CampoEditavel
              label="Quando começaram os sintomas?"
              value={(dados as any).inicioSintomas || ''}
              onChange={(v) => onChange('inicioSintomas', v as string)}
            />
            <CampoEditavel
              label="Qual seu trabalho e função?"
              value={(dados as any).trabalho || ''}
              onChange={(v) => onChange('trabalho', v as string)}
            />
            <CampoEditavel
              label="Tipo de dor (peso, queimação, latejante, lancinante)?"
              value={(dados as any).tipoDor || ''}
              onChange={(v) => onChange('tipoDor', v as string)}
            />
            <CampoEditavel
              label="Há sintomas associados (formigamento, perda de força, tontura, impotência)?"
              value={(dados as any).sintomasAssociados || ''}
              onChange={(v) => onChange('sintomasAssociados', v as string)}
              tipo="textarea"
            />
            <CampoEditavel
              label="O que melhora e o que piora a dor?"
              value={(dados as any).fatoresDor || ''}
              onChange={(v) => onChange('fatoresDor', v as string)}
              tipo="textarea"
            />
            <CampoEditavel
              label="Já fez cirurgia da coluna? Quando?"
              value={(dados as any).cirurgias || ''}
              onChange={(v) => onChange('cirurgias', v as string)}
            />
            <CampoEditavel
              label="Já teve trauma? Quando?"
              value={(dados as any).trauma || ''}
              onChange={(v) => onChange('trauma', v as string)}
            />
            <CampoEditavel
              label="Fez quimioterapia ou radioterapia? Quando?"
              value={(dados as any).quimioRadio || ''}
              onChange={(v) => onChange('quimioRadio', v as string)}
            />
            <CampoEditavel
              label="Há perda ou aumento de sensibilidade?"
              value={(dados as any).alteracaoSensibilidade || ''}
              onChange={(v) => onChange('alteracaoSensibilidade', v as string)}
            />
            <CampoEditavel
              label="Fuma? Há quanto tempo?"
              value={(dados as any).fuma || ''}
              onChange={(v) => onChange('fuma', v as string)}
            />
            <CampoEditavel
              label="Está perdendo peso? Há quanto tempo?"
              value={(dados as any).perdendoPeso || ''}
              onChange={(v) => onChange('perdendoPeso', v as string)}
            />
            <CampoEditavel
              label="Data da última menstruação"
              value={(dados as any).ultimaMenstruacao || ''}
              onChange={(v) => onChange('ultimaMenstruacao', v as string)}
            />
            <CampoEditavel
              label="Já fez tomografia ou ressonância?"
              value={(dados as any).examesAnteriores || ''}
              onChange={(v) => onChange('examesAnteriores', v as string)}
            />
          </>
        );

      case 'cotovelo':
        return (
          <>
            <CampoEditavel
              label="Qual o seu trabalho e função?"
              value={(dados as any).trabalho || ''}
              onChange={(v) => onChange('trabalho', v as string)}
            />
            <CampoEditavel
              label="Há quanto tempo sente dor?"
              value={(dados as any).tempoComDor || ''}
              onChange={(v) => onChange('tempoComDor', v as string)}
            />
            <CampoEditavel
              label="Onde é a dor (interna ou externa)?"
              value={(dados as any).localizacaoDor || ''}
              onChange={(v) => onChange('localizacaoDor', v as string)}
            />
            <CampoEditavel
              label="Pratica esportes? Quais?"
              value={(dados as any).esportes || ''}
              onChange={(v) => onChange('esportes', v as string)}
            />
            <CampoEditavel
              label="Tem limitação de movimento?"
              value={(dados as any).limitacaoMovimento || 'Não'}
              onChange={(v) => onChange('limitacaoMovimento', v as string)}
              tipo="simNao"
            />
            <CampoEditavel
              label="Já teve derrame?"
              value={(dados as any).derrame || ''}
              onChange={(v) => onChange('derrame', v as string)}
            />
            <CampoEditavel
              label="Já teve trauma? Quando?"
              value={(dados as any).trauma || ''}
              onChange={(v) => onChange('trauma', v as string)}
            />
            <CampoEditavel
              label="Já foi operado do cotovelo?"
              value={(dados as any).jaFoiOperado || 'Não'}
              onChange={(v) => onChange('jaFoiOperado', v as string)}
              tipo="simNao"
            />
            <CampoEditavel
              label="Sabe o que foi feito na cirurgia?"
              value={(dados as any).oqueFeitoCircurgia || ''}
              onChange={(v) => onChange('oqueFeitoCircurgia', v as string)}
            />
            <CampoEditavel
              label="Data da última menstruação (se aplicável)"
              value={(dados as any).ultimaMenstruacao || ''}
              onChange={(v) => onChange('ultimaMenstruacao', v as string)}
            />
            <CampoEditavel
              label="Já fez RM ou TC? Onde?"
              value={(dados as any).examesAnteriores || ''}
              onChange={(v) => onChange('examesAnteriores', v as string)}
            />
          </>
        );

      case 'joelho':
        return (
          <>
            <CampoEditavel
              label="Qual o seu trabalho e função?"
              value={(dados as any).trabalho || ''}
              onChange={(v) => onChange('trabalho', v as string)}
            />
            <CampoEditavel
              label="Há quanto tempo sente dor?"
              value={(dados as any).tempoComDor || ''}
              onChange={(v) => onChange('tempoComDor', v as string)}
            />
            <CampoEditavel
              label="Onde é a dor (interna, externa, anterior, posterior)?"
              value={(dados as any).localizacaoDor || ''}
              onChange={(v) => onChange('localizacaoDor', v as string)}
            />
            <CampoEditavel
              label="Dói ao subir escadas?"
              value={(dados as any).doiSubirEscada || 'Não'}
              onChange={(v) => onChange('doiSubirEscada', v as string)}
              tipo="simNao"
            />
            <CampoEditavel
              label="Dói quando fica muito tempo sentado?"
              value={(dados as any).doiTempoSentado || 'Não'}
              onChange={(v) => onChange('doiTempoSentado', v as string)}
              tipo="simNao"
            />
            <CampoEditavel
              label="Já teve derrame articular?"
              value={(dados as any).derrameArticular || ''}
              onChange={(v) => onChange('derrameArticular', v as string)}
            />
            <CampoEditavel
              label="O joelho falseia ou trava?"
              value={(dados as any).falseiaTrava || ''}
              onChange={(v) => onChange('falseiaTrava', v as string)}
            />
            <CampoEditavel
              label="Já teve trauma? Quando?"
              value={(dados as any).trauma || ''}
              onChange={(v) => onChange('trauma', v as string)}
            />
            <CampoEditavel
              label="Já foi operado ou fez artroscopia? Sabe o que foi feito?"
              value={(dados as any).cirurgias || ''}
              onChange={(v) => onChange('cirurgias', v as string)}
              tipo="textarea"
            />
            <CampoEditavel
              label="Já fez infiltração? Quando?"
              value={(dados as any).infiltracao || ''}
              onChange={(v) => onChange('infiltracao', v as string)}
            />
            <CampoEditavel
              label="Data da última menstruação"
              value={(dados as any).ultimaMenstruacao || ''}
              onChange={(v) => onChange('ultimaMenstruacao', v as string)}
            />
            <CampoEditavel
              label="Já fez TC ou RM? Onde?"
              value={(dados as any).examesAnteriores || ''}
              onChange={(v) => onChange('examesAnteriores', v as string)}
            />
          </>
        );

      case 'membros':
        return (
          <>
            <CampoEditavel
              label="Qual o segmento corporal afetado (braço, antebraço, coxa, perna)?"
              value={(dados as any).segmento || ''}
              onChange={(v) => onChange('segmento', v as string)}
            />
            <CampoEditavel
              label="Qual o seu trabalho e função?"
              value={(dados as any).trabalho || ''}
              onChange={(v) => onChange('trabalho', v as string)}
            />
            <CampoEditavel
              label="Qual o motivo do exame e principal queixa?"
              value={(dados as any).motivoQueixa || ''}
              onChange={(v) => onChange('motivoQueixa', v as string)}
              tipo="textarea"
            />
            <CampoEditavel
              label="Já foi operado(a)? Quais cirurgias e há quanto tempo?"
              value={(dados as any).cirurgias || ''}
              onChange={(v) => onChange('cirurgias', v as string)}
              tipo="textarea"
            />
            <CampoEditavel
              label="Já fez quimio ou radioterapia? Quando e onde?"
              value={(dados as any).quimioRadio || ''}
              onChange={(v) => onChange('quimioRadio', v as string)}
            />
            <CampoEditavel
              label="Já teve trauma? Quando?"
              value={(dados as any).trauma || ''}
              onChange={(v) => onChange('trauma', v as string)}
            />
            <CampoEditavel
              label="Possui diabetes ou infecção recente?"
              value={(dados as any).diabetesInfeccao || ''}
              onChange={(v) => onChange('diabetesInfeccao', v as string)}
            />
            <CampoEditavel
              label="Está perdendo peso? Há quanto tempo?"
              value={(dados as any).perdendoPeso || ''}
              onChange={(v) => onChange('perdendoPeso', v as string)}
            />
            <CampoEditavel
              label="Pratica esportes? Quais?"
              value={(dados as any).esportes || ''}
              onChange={(v) => onChange('esportes', v as string)}
            />
            <CampoEditavel
              label="Tem lesões cutâneas visíveis? Onde?"
              value={(dados as any).lesoesCutaneas || ''}
              onChange={(v) => onChange('lesoesCutaneas', v as string)}
            />
            <CampoEditavel
              label="Já fez TC ou RM? Onde?"
              value={(dados as any).examesAnteriores || ''}
              onChange={(v) => onChange('examesAnteriores', v as string)}
            />
            <CampoEditavel
              label="Data da última menstruação"
              value={(dados as any).ultimaMenstruacao || ''}
              onChange={(v) => onChange('ultimaMenstruacao', v as string)}
            />
          </>
        );

      case 'ombro':
        return (
          <>
            <CampoEditavel
              label="Qual o lado do ombro afetado?"
              value={(dados as any).lado || ''}
              onChange={(v) => onChange('lado', v as string)}
              tipo="radio"
              opcoes={['Direito', 'Esquerdo']}
            />
            <CampoEditavel
              label="Qual o seu trabalho e função?"
              value={(dados as any).trabalho || ''}
              onChange={(v) => onChange('trabalho', v as string)}
            />
            <CampoEditavel
              label="Há quanto tempo sente dor?"
              value={(dados as any).tempoComDor || ''}
              onChange={(v) => onChange('tempoComDor', v as string)}
            />
            <CampoEditavel
              label="Tem dor à noite?"
              value={(dados as any).dorNoite || 'Não'}
              onChange={(v) => onChange('dorNoite', v as string)}
              tipo="simNao"
            />
            <CampoEditavel
              label="Pratica esportes? Quais?"
              value={(dados as any).esportes || ''}
              onChange={(v) => onChange('esportes', v as string)}
            />
            <CampoEditavel
              label="Já teve luxação? Quando foi a última?"
              value={(dados as any).luxacao || ''}
              onChange={(v) => onChange('luxacao', v as string)}
            />
            <CampoEditavel
              label="Teve derrame?"
              value={(dados as any).derrame || ''}
              onChange={(v) => onChange('derrame', v as string)}
            />
            <CampoEditavel
              label="Tem dificuldade para colocar a mão na cabeça, nas costas ou no outro ombro?"
              value={(dados as any).dificuldadeMovimento || ''}
              onChange={(v) => onChange('dificuldadeMovimento', v as string)}
            />
            <CampoEditavel
              label="Já teve trauma? Quando?"
              value={(dados as any).trauma || ''}
              onChange={(v) => onChange('trauma', v as string)}
            />
            <CampoEditavel
              label="Já foi operado ou fez artroscopia? Sabe o que foi feito?"
              value={(dados as any).cirurgias || ''}
              onChange={(v) => onChange('cirurgias', v as string)}
              tipo="textarea"
            />
            <CampoEditavel
              label="Já fez infiltração? Quando?"
              value={(dados as any).infiltracao || ''}
              onChange={(v) => onChange('infiltracao', v as string)}
            />
          </>
        );

      case 'quadril':
        return (
          <>
            <CampoEditavel
              label="Qual o lado afetado?"
              value={(dados as any).lado || ''}
              onChange={(v) => onChange('lado', v as string)}
              tipo="radio"
              opcoes={['Direito', 'Esquerdo']}
            />
            <CampoEditavel
              label="Qual o seu trabalho e função?"
              value={(dados as any).trabalho || ''}
              onChange={(v) => onChange('trabalho', v as string)}
            />
            <CampoEditavel
              label="Há quanto tempo e onde sente dor?"
              value={(dados as any).tempoDor || ''}
              onChange={(v) => onChange('tempoDor', v as string)}
            />
            <CampoEditavel
              label="Dói com as pernas cruzadas, ao deitar ou ao apertar a lateral do quadril?"
              value={(dados as any).situacoesDor || ''}
              onChange={(v) => onChange('situacoesDor', v as string)}
              tipo="textarea"
            />
            <CampoEditavel
              label="Pratica esportes? Quais?"
              value={(dados as any).esportes || ''}
              onChange={(v) => onChange('esportes', v as string)}
            />
            <CampoEditavel
              label="Teve doença no quadril na infância?"
              value={(dados as any).doencaInfancia || ''}
              onChange={(v) => onChange('doencaInfancia', v as string)}
            />
            <CampoEditavel
              label="Possui alguma doença de base?"
              value={(dados as any).doencaBase || ''}
              onChange={(v) => onChange('doencaBase', v as string)}
            />
            <CampoEditavel
              label="Já teve trauma? Quando?"
              value={(dados as any).trauma || ''}
              onChange={(v) => onChange('trauma', v as string)}
            />
            <CampoEditavel
              label="Já foi operado? Sabe o que foi feito?"
              value={(dados as any).cirurgias || ''}
              onChange={(v) => onChange('cirurgias', v as string)}
              tipo="textarea"
            />
            <CampoEditavel
              label="Já fez quimio ou radioterapia? Onde?"
              value={(dados as any).quimioRadio || ''}
              onChange={(v) => onChange('quimioRadio', v as string)}
            />
            <CampoEditavel
              label="Já fez TC ou RM? Onde?"
              value={(dados as any).examesAnteriores || ''}
              onChange={(v) => onChange('examesAnteriores', v as string)}
            />
            <CampoEditavel
              label="Data da última menstruação"
              value={(dados as any).ultimaMenstruacao || ''}
              onChange={(v) => onChange('ultimaMenstruacao', v as string)}
            />
          </>
        );

      case 'tornozelo':
        return (
          <>
            <CampoEditavel
              label="Qual o lado afetado?"
              value={(dados as any).lado || ''}
              onChange={(v) => onChange('lado', v as string)}
              tipo="radio"
              opcoes={['Direito', 'Esquerdo', 'Ambos']}
            />
            <CampoEditavel
              label="Qual o seu trabalho e função?"
              value={(dados as any).trabalho || ''}
              onChange={(v) => onChange('trabalho', v as string)}
            />
            <CampoEditavel
              label="Há quanto tempo sente dor?"
              value={(dados as any).tempoComDor || ''}
              onChange={(v) => onChange('tempoComDor', v as string)}
            />
            <CampoEditavel
              label="Você tem diabetes?"
              value={(dados as any).diabetes || 'Não'}
              onChange={(v) => onChange('diabetes', v as string)}
              tipo="simNao"
            />
            <CampoEditavel
              label="Possui outros problemas de saúde?"
              value={(dados as any).outrosProblemas || ''}
              onChange={(v) => onChange('outrosProblemas', v as string)}
            />
            <CampoEditavel
              label="Onde exatamente localiza a dor?"
              value={(dados as any).localizacaoDor || ''}
              onChange={(v) => onChange('localizacaoDor', v as string)}
            />
            <CampoEditavel
              label="Já teve entorse? Quando foi e quantas vezes?"
              value={(dados as any).entorse || ''}
              onChange={(v) => onChange('entorse', v as string)}
            />
            <CampoEditavel
              label="Sente dor ao caminhar?"
              value={(dados as any).dorCaminhar || 'Não'}
              onChange={(v) => onChange('dorCaminhar', v as string)}
              tipo="simNao"
            />
            <CampoEditavel
              label="Já teve fratura nessa região?"
              value={(dados as any).fratura || ''}
              onChange={(v) => onChange('fratura', v as string)}
            />
            <CampoEditavel
              label="O tornozelo costuma falsear (ficar instável)?"
              value={(dados as any).instabilidade || ''}
              onChange={(v) => onChange('instabilidade', v as string)}
            />
            <CampoEditavel
              label="Sente dor entre os dedos?"
              value={(dados as any).dorDedos || ''}
              onChange={(v) => onChange('dorDedos', v as string)}
            />
            <CampoEditavel
              label="Já teve algum trauma? Quando ocorreu?"
              value={(dados as any).trauma || ''}
              onChange={(v) => onChange('trauma', v as string)}
            />
            <CampoEditavel
              label="Já foi operado(a)? Sabe o que foi feito na cirurgia?"
              value={(dados as any).cirurgias || ''}
              onChange={(v) => onChange('cirurgias', v as string)}
              tipo="textarea"
            />
            <CampoEditavel
              label="Data da última menstruação (se aplicável)"
              value={(dados as any).ultimaMenstruacao || ''}
              onChange={(v) => onChange('ultimaMenstruacao', v as string)}
            />
            <CampoEditavel
              label="Já fez tomografia ou ressonância magnética? Em qual serviço?"
              value={(dados as any).examesAnteriores || ''}
              onChange={(v) => onChange('examesAnteriores', v as string)}
            />
          </>
        );

      case 'mama':
        return (
          <>
            <CampoEditavel
              label="Por que está realizando este exame?"
              value={(dados as any).motivoExame || ''}
              onChange={(v) => onChange('motivoExame', v as string)}
              tipo="textarea"
            />
            <CampoEditavel
              label="Qual o lado afetado?"
              value={(dados as any).lado || ''}
              onChange={(v) => onChange('lado', v as string)}
              tipo="radio"
              opcoes={['Direito', 'Esquerdo', 'Ambos']}
            />
            <CampoEditavel
              label="Já fez mamografia antes?"
              value={(dados as any).jaFezMamografia || 'Não'}
              onChange={(v) => onChange('jaFezMamografia', v as string)}
              tipo="simNao"
            />
            <CampoEditavel
              label="Trouxe exames anteriores?"
              value={(dados as any).trouxeExames || 'Não'}
              onChange={(v) => onChange('trouxeExames', v as string)}
              tipo="simNao"
            />
            <CampoEditavel
              label="Tem filhos? Se sim, com quantos anos teve o primeiro filho?"
              value={(dados as any).filhos || ''}
              onChange={(v) => onChange('filhos', v as string)}
            />
            <CampoEditavel
              label="Qual a data da última menstruação? (Se não menstrua mais, há quanto tempo?)"
              value={(dados as any).ultimaMenstruacao || ''}
              onChange={(v) => onChange('ultimaMenstruacao', v as string)}
            />
            <CampoEditavel
              label="Faz reposição hormonal para menopausa?"
              value={(dados as any).reposicaoHormonal || 'Não'}
              onChange={(v) => onChange('reposicaoHormonal', v as string)}
              tipo="simNao"
            />
            <CampoEditavel
              label="Há casos de câncer de mama ou ovário na família? Quem teve e com que idade?"
              value={(dados as any).historiaFamiliar || ''}
              onChange={(v) => onChange('historiaFamiliar', v as string)}
              tipo="textarea"
            />
            <CampoEditavel
              label="Já operou a mama? Qual o motivo e há quanto tempo?"
              value={(dados as any).cirurgiaMama || ''}
              onChange={(v) => onChange('cirurgiaMama', v as string)}
              tipo="textarea"
            />
            <CampoEditavel
              label="Já fez biópsia da mama? Em qual lado e qual foi o resultado?"
              value={(dados as any).biopsia || ''}
              onChange={(v) => onChange('biopsia', v as string)}
              tipo="textarea"
            />
            <CampoEditavel
              label="Já fez radioterapia da mama? Quando e em qual lado?"
              value={(dados as any).radioterapia || ''}
              onChange={(v) => onChange('radioterapia', v as string)}
            />
            <CampoEditavel
              label="Tem algum outro problema de saúde? Qual?"
              value={(dados as any).outrosProblemas || ''}
              onChange={(v) => onChange('outrosProblemas', v as string)}
            />
            <CampoEditavel
              label="Deseja acrescentar alguma observação?"
              value={(dados as any).observacoes || ''}
              onChange={(v) => onChange('observacoes', v as string)}
              tipo="textarea"
            />
          </>
        );

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
