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
  return (
    <Card className="border-2 border-primary/20">
      <CardContent className="pt-4 space-y-3">
        <div className="text-sm font-semibold text-foreground mb-3">
          Informações Técnicas
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="contrasteEndovenoso"
              checked={contrasteEndovenoso}
              onCheckedChange={(checked) => onChange('contrasteEndovenoso', !!checked)}
            />
            <Label
              htmlFor="contrasteEndovenoso"
              className="text-sm cursor-pointer"
            >
              Contraste Endovenoso
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="contrasteOral"
              checked={contrasteOral}
              onCheckedChange={(checked) => onChange('contrasteOral', !!checked)}
            />
            <Label
              htmlFor="contrasteOral"
              className="text-sm cursor-pointer"
            >
              Contraste Oral
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="contrasteRetal"
              checked={contrasteRetal}
              onCheckedChange={(checked) => onChange('contrasteRetal', !!checked)}
            />
            <Label
              htmlFor="contrasteRetal"
              className="text-sm cursor-pointer"
            >
              Contraste Retal
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="gelEndovaginal"
              checked={gelEndovaginal}
              onCheckedChange={(checked) => onChange('gelEndovaginal', !!checked)}
            />
            <Label
              htmlFor="gelEndovaginal"
              className="text-sm cursor-pointer"
            >
              Gel Endovaginal
            </Label>
          </div>
        </div>

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
