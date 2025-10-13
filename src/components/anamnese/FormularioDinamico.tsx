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
    const toNumber = (v: any) => {
      if (v === undefined || v === null) return 0;
      const s = String(v).trim().replace(',', '.').replace(/[^0-9.]/g, '');
      const n = parseFloat(s);
      return isNaN(n) ? 0 : n;
    };
    const idade = toNumber((dados as any).idade);
    const peso = toNumber((dados as any).peso);
    const creatinina = toNumber((dados as any).creatinina);
    const sexo = (dados as any).sexo || '';
    console.log('Cálculo ClCr - Valores:', { idade, peso, creatinina, sexo });

    if (idade > 0 && peso > 0 && creatinina > 0 && sexo) {
      let clcr = ((140 - idade) * peso) / (72 * creatinina);
      
      // Ajuste para sexo feminino
      if (sexo === 'Feminino') {
        clcr = clcr * 0.85;
      }

      console.log('ClCr calculado:', clcr.toFixed(1));
      setClearanceCreatinina(clcr.toFixed(1));
    } else {
      console.log('ClCr não calculado - campos faltando');
      setClearanceCreatinina('');
    }
  }, [(dados as any).idade, (dados as any).peso, (dados as any).creatinina, (dados as any).sexo]);

  // Componente para o campo de exame que aparecerá em todos os templates
  const CampoExame = () => (
    <CampoEditavel
      label="Exame"
      value={(dados as any).exame || ''}
      onChange={(v) => onChange('exame', v as string)}
      tipo="textarea"
    />
  );

  // Componente para os campos clínicos que aparecerão em todos os templates
  const CamposClinicosComuns = () => (
    <>
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
        <div className="p-3 bg-success/10 border-success/20 rounded-lg">
          <p className="text-sm font-medium">
            Clearance de creatinina estimado (Cockcroft-Gault): <span className="text-lg font-bold">{clearanceCreatinina} mL/min</span>
          </p>
        </div>
      )}
    </>
  );

  const renderFormulario = () => {
    switch (tipo) {
      case 'punho':
      case 'abdome':
      case 'atm':
      case 'cabeca':
      case 'coluna':
      case 'cotovelo':
      case 'joelho':
      case 'membros':
      case 'ombro':
      case 'quadril':
      case 'tornozelo':
      case 'mama':
        return (
          <>
            <CampoExame />
            <CamposClinicosComuns />
            <CampoEditavel
              label="Relatório da anamnese"
              value={(dados as any).informacoesAdicionais || ''}
              onChange={(v) => onChange('informacoesAdicionais', v as string)}
              tipo="textarea"
              sempreAberto={true}
              rows={10}
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
