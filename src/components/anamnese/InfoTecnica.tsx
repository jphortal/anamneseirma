import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface InfoTecnicaProps {
  contrasteEndovenoso: boolean;
  contrasteOral: boolean;
  contrasteRetal: boolean;
  gelEndovaginal: boolean;
  tecnicoResponsavel: string;
  onChange: (campo: string, valor: boolean | string) => void;
}

export const InfoTecnica = ({
  contrasteEndovenoso,
  contrasteOral,
  contrasteRetal,
  gelEndovaginal,
  tecnicoResponsavel,
  onChange,
}: InfoTecnicaProps) => {
  const contrastes = [
    { id: 'contrasteEndovenoso', label: 'Contraste Endovenoso', checked: contrasteEndovenoso },
    { id: 'contrasteOral', label: 'Contraste Oral', checked: contrasteOral },
    { id: 'contrasteRetal', label: 'Contraste Retal', checked: contrasteRetal },
    { id: 'gelEndovaginal', label: 'Gel Endovaginal', checked: gelEndovaginal },
  ];

  const contrastesSelecionados = contrastes.filter(c => c.checked);
  const temContrasteSelecionado = contrastesSelecionados.length > 0;

  return (
    <Card className="border-2 border-primary/20">
      <CardContent className="pt-4 space-y-3">
        <div className="text-sm font-semibold text-foreground mb-3">
          Informações Técnicas
        </div>
        
        <div className="space-y-2">
          {contrastes.map((contraste) => (
            <div key={contraste.id} className="flex items-center space-x-2">
              <Checkbox
                id={contraste.id}
                checked={contraste.checked}
                onCheckedChange={(checked) => onChange(contraste.id, !!checked)}
              />
              <Label
                htmlFor={contraste.id}
                className="text-sm cursor-pointer"
              >
                {contraste.label}
              </Label>
            </div>
          ))}
        </div>

        {temContrasteSelecionado && (
          <div className="p-2 bg-muted/50 rounded-md">
            <div className="text-sm font-medium">Selecionados:</div>
            <div className="text-sm text-muted-foreground">
              {contrastesSelecionados.map(c => c.label).join(', ')}
            </div>
          </div>
        )}

        <div className="pt-2">
          <Label htmlFor="tecnicoResponsavel" className="text-sm">
            Técnico Responsável
          </Label>
          <Input
            id="tecnicoResponsavel"
            value={tecnicoResponsavel}
            onChange={(e) => onChange('tecnicoResponsavel', e.target.value)}
            placeholder="Nome do técnico"
            className="mt-1"
          />
        </div>
      </CardContent>
    </Card>
  );
};
