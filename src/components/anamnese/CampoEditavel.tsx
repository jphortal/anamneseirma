import { useState } from 'react';
import { Edit2, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface CampoEditavelProps {
  label: string;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  tipo?: 'text' | 'textarea' | 'simNao' | 'radio' | 'checkbox';
  opcoes?: string[];
  obrigatorio?: boolean;
}

export const CampoEditavel = ({
  label,
  value,
  onChange,
  tipo = 'text',
  opcoes = [],
  obrigatorio = false,
}: CampoEditavelProps) => {
  const [editando, setEditando] = useState(false);
  const [valorTemp, setValorTemp] = useState(value);

  const handleSalvar = () => {
    onChange(valorTemp);
    setEditando(false);
  };

  const handleCancelar = () => {
    setValorTemp(value);
    setEditando(false);
  };

  const renderCampo = () => {
    if (!editando) {
      return (
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg border border-border">
          <div className="flex-1">
            <Label className="text-sm text-muted-foreground">{label}</Label>
            <p className="text-foreground mt-1">
              {Array.isArray(value) ? value.join(', ') : value || '—'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setEditando(true)}
            className="ml-2"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
      );
    }

    return (
      <div className="p-3 bg-background rounded-lg border-2 border-primary">
        <Label className="text-sm font-medium">
          {label}
          {obrigatorio && <span className="text-destructive ml-1">*</span>}
        </Label>

        <div className="mt-2 space-y-2">
          {tipo === 'text' && (
            <Input
              value={valorTemp as string}
              onChange={(e) => setValorTemp(e.target.value)}
              className="w-full"
            />
          )}

          {tipo === 'textarea' && (
            <Textarea
              value={valorTemp as string}
              onChange={(e) => setValorTemp(e.target.value)}
              rows={3}
              className="w-full"
            />
          )}

          {tipo === 'simNao' && (
            <RadioGroup
              value={valorTemp as string}
              onValueChange={(val) => setValorTemp(val)}
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Sim" id={`${label}-sim`} />
                  <Label htmlFor={`${label}-sim`}>Sim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Não" id={`${label}-nao`} />
                  <Label htmlFor={`${label}-nao`}>Não</Label>
                </div>
              </div>
            </RadioGroup>
          )}

          {tipo === 'checkbox' && (
            <div className="space-y-2">
              {opcoes.map((opcao) => (
                <div key={opcao} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`${label}-${opcao}`}
                    checked={(valorTemp as string[]).includes(opcao)}
                    onChange={(e) => {
                      const arr = valorTemp as string[];
                      if (e.target.checked) {
                        setValorTemp([...arr, opcao]);
                      } else {
                        setValorTemp(arr.filter((v) => v !== opcao));
                      }
                    }}
                    className="rounded border-input"
                  />
                  <Label htmlFor={`${label}-${opcao}`}>{opcao}</Label>
                </div>
              ))}
            </div>
          )}

          {tipo === 'radio' && (
            <RadioGroup
              value={valorTemp as string}
              onValueChange={(val) => setValorTemp(val)}
            >
              {opcoes.map((opcao) => (
                <div key={opcao} className="flex items-center space-x-2">
                  <RadioGroupItem value={opcao} id={`${label}-${opcao}`} />
                  <Label htmlFor={`${label}-${opcao}`}>{opcao}</Label>
                </div>
              ))}
            </RadioGroup>
          )}

          <div className="flex gap-2 mt-3">
            <Button onClick={handleSalvar} size="sm" className="flex-1">
              <Check className="h-4 w-4 mr-1" />
              Confirmar
            </Button>
            <Button onClick={handleCancelar} variant="outline" size="sm">
              <X className="h-4 w-4 mr-1" />
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return <div className="mb-4">{renderCampo()}</div>;
};
