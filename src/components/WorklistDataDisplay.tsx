import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface WorklistDataDisplayProps {
  data: any[];
  onClose: () => void;
}

export const WorklistDataDisplay = ({ data, onClose }: WorklistDataDisplayProps) => {
  if (!data || data.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Dados do Worklist</CardTitle>
          <CardDescription>Nenhum dado retornado</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Pegar o primeiro item para exibir as chaves disponíveis
  const firstItem = data[0];
  const keys = Object.keys(firstItem);

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Dados Retornados do Worklist</CardTitle>
            <CardDescription>
              Total de registros: <Badge variant="secondary">{data.length}</Badge>
            </CardDescription>
          </div>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Campos Disponíveis */}
          <div>
            <h3 className="font-semibold mb-2">Campos Disponíveis no Retorno:</h3>
            <div className="flex flex-wrap gap-2">
              {keys.map((key) => (
                <Badge key={key} variant="outline">
                  {key}
                </Badge>
              ))}
            </div>
          </div>

          {/* Tabela com os dados */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campo</TableHead>
                  <TableHead>Valor (Primeiro Registro)</TableHead>
                  <TableHead>Tipo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keys.map((key) => {
                  const value = firstItem[key];
                  const valueType = typeof value;
                  const displayValue = value === null || value === undefined 
                    ? <span className="text-muted-foreground italic">null</span>
                    : String(value);
                  
                  return (
                    <TableRow key={key}>
                      <TableCell className="font-medium">{key}</TableCell>
                      <TableCell className="max-w-md truncate">{displayValue}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{valueType}</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mapeamento Atual */}
          <div>
            <h3 className="font-semibold mb-3">Mapeamento Atual para o Sistema:</h3>
            <div className="bg-muted p-4 rounded-lg space-y-2 text-sm font-mono">
              <div><span className="text-blue-600">id:</span> cd_atendimento || id || gerado</div>
              <div><span className="text-blue-600">name:</span> ds_paciente || name</div>
              <div><span className="text-blue-600">birthDate:</span> birth_date || birthDate</div>
              <div><span className="text-blue-600">patientId:</span> cd_paciente || patientId || prontuário</div>
              <div><span className="text-blue-600">studyDescription:</span> ds_procedimento || studyDescription</div>
              <div><span className="text-blue-600">modality:</span> ds_modalidade || modality</div>
              <div><span className="text-blue-600">procedure:</span> ds_procedimento || procedure</div>
              <div className="pt-2 border-t mt-2">
                <span className="text-muted-foreground">Campos preservados originais:</span>
                <div className="ml-4 mt-1">
                  <div>• ds_paciente</div>
                  <div>• nr_controle</div>
                  <div>• cd_atendimento</div>
                  <div>• ds_modalidade</div>
                  <div>• ds_procedimento</div>
                </div>
              </div>
            </div>
          </div>

          {/* JSON Completo */}
          {data.length > 0 && (
            <details className="space-y-2">
              <summary className="cursor-pointer font-semibold hover:text-primary">
                Ver JSON Completo do Primeiro Registro
              </summary>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                {JSON.stringify(firstItem, null, 2)}
              </pre>
            </details>
          )}

          {/* Todos os registros */}
          {data.length > 1 && (
            <details className="space-y-2">
              <summary className="cursor-pointer font-semibold hover:text-primary">
                Ver Todos os {data.length} Registros
              </summary>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs max-h-96">
                {JSON.stringify(data, null, 2)}
              </pre>
            </details>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
