import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, FileText, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AnamneseHistorico {
  id: string;
  timestamp: number;
  tipo: string;
  dados: any;
  worklistData?: any;
}

interface HistoricoAnamnesesProps {
  onCarregarAnamnese: (anamnese: AnamneseHistorico) => void;
}

export const HistoricoAnamneses = ({ onCarregarAnamnese }: HistoricoAnamnesesProps) => {
  const historico = getHistoricoAnamneses();

  const handleExcluir = (id: string) => {
    const updatedHistorico = historico.filter(item => item.id !== id);
    localStorage.setItem('anamneses_historico', JSON.stringify(updatedHistorico));
    window.location.reload();
  };

  if (historico.length === 0) {
    return null;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Histórico de Anamneses
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-2">
            {historico.map((anamnese) => (
              <Card 
                key={anamnese.id} 
                className="cursor-pointer hover:bg-accent transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">
                          {anamnese.dados.nomeCompleto || anamnese.dados.nome || 'Sem nome'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Tipo: {formatarTipo(anamnese.tipo)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(anamnese.timestamp, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onCarregarAnamnese(anamnese)}
                      >
                        Carregar
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExcluir(anamnese.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export const salvarAnamneseNoHistorico = (
  tipo: string,
  dados: any,
  worklistData?: any
) => {
  const historico = getHistoricoAnamneses();
  const novaAnamnese: AnamneseHistorico = {
    id: `anamnese-${Date.now()}`,
    timestamp: Date.now(),
    tipo,
    dados,
    worklistData
  };
  
  historico.unshift(novaAnamnese);
  
  // Manter apenas as últimas 50 anamneses
  const historicoLimitado = historico.slice(0, 50);
  localStorage.setItem('anamneses_historico', JSON.stringify(historicoLimitado));
};

export const getHistoricoAnamneses = (): AnamneseHistorico[] => {
  try {
    const stored = localStorage.getItem('anamneses_historico');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const formatarTipo = (tipo: string): string => {
  const tipos: Record<string, string> = {
    punho: 'Punho',
    joelho: 'Joelho',
    abdome: 'Abdome',
    atm: 'ATM',
    cabeca: 'Cabeça/Crânio',
    coluna: 'Coluna',
    cotovelo: 'Cotovelo',
    membros: 'Membros',
    ombro: 'Ombro',
    quadril: 'Quadril',
    tornozelo: 'Tornozelo',
    mama: 'Mama'
  };
  return tipos[tipo] || tipo;
};
