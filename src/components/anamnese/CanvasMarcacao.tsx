import { useRef, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Undo2, Trash2, Paintbrush } from 'lucide-react';
import { TipoFormulario, ImagemAnatomica } from '@/types/anamnese';
import { imagensAnatomicas } from './ImagensAnatomicas';
interface CanvasMarcacaoProps {
  tipo: TipoFormulario;
  onImagemChange?: (imagemData: string) => void;
}
export const CanvasMarcacao = ({
  tipo,
  onImagemChange
}: CanvasMarcacaoProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [modoDesenho, setModoDesenho] = useState(false);
  const [corDesenho, setCorDesenho] = useState('#EF4444');
  const [espessura, setEspessura] = useState(3);
  const [desenhando, setDesenhando] = useState(false);
  const [imagemSelecionada, setImagemSelecionada] = useState<ImagemAnatomica>(imagensAnatomicas[tipo][0]);
  const [historicoDesenhos, setHistoricoDesenhos] = useState<ImageData[]>([]);
  const imagens = imagensAnatomicas[tipo] || [];
  useEffect(() => {
    setImagemSelecionada(imagensAnatomicas[tipo][0]);
  }, [tipo]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Carregar imagem anatômica real
    const img = new Image();
    img.src = imagemSelecionada.url;
    img.onload = () => {
      // Limpar canvas
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Desenhar imagem ajustada ao canvas
      const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
      const x = (canvas.width - img.width * scale) / 2;
      const y = (canvas.height - img.height * scale) / 2;
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    };
    img.onerror = () => {
      // Fallback se imagem não carregar
      ctx.fillStyle = '#F3F4F6';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#9CA3AF';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Imagem não disponível', canvas.width / 2, canvas.height / 2);
    };
  }, [imagemSelecionada]);
  const salvarEstado = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistoricoDesenhos(prev => [...prev, imageData]);
  };
  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return {
      x: 0,
      y: 0
    };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!modoDesenho) return;
    salvarEstado();
    setDesenhando(true);
    const pos = getMousePos(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!desenhando || !modoDesenho) return;
    const pos = getMousePos(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = corDesenho;
    ctx.lineWidth = espessura;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };
  const stopDrawing = () => {
    setDesenhando(false);
    if (onImagemChange && canvasRef.current) {
      onImagemChange(canvasRef.current.toDataURL('image/png'));
    }
  };
  const desfazerUltimo = () => {
    const canvas = canvasRef.current;
    if (!canvas || historicoDesenhos.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const ultimo = historicoDesenhos[historicoDesenhos.length - 1];
    ctx.putImageData(ultimo, 0, 0);
    setHistoricoDesenhos(prev => prev.slice(0, -1));
  };
  const limparCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Recarregar imagem base
    const img = new Image();
    img.src = imagemSelecionada.url;
    img.onload = () => {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
      const x = (canvas.width - img.width * scale) / 2;
      const y = (canvas.height - img.height * scale) / 2;
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    };
    setHistoricoDesenhos([]);
  };
  return <Card className="bg-[#2bcc2b]">
      <CardHeader className="bg-[#29c929]">
        <CardTitle>Marcação Anatômica</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 bg-[#29cf29]">
        <div>
          <Label>Selecionar Imagem Anatômica</Label>
          <select value={imagemSelecionada.id} onChange={e => {
          const img = imagens.find(i => i.id === e.target.value);
          if (img) setImagemSelecionada(img);
        }} className="w-full mt-1 p-2 rounded-md border border-input bg-background">
            {imagens.map(img => <option key={img.id} value={img.id}>
                {img.nome}
              </option>)}
          </select>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setModoDesenho(!modoDesenho)} variant={modoDesenho ? 'default' : 'outline'} size="sm">
            <Paintbrush className="h-4 w-4 mr-1" />
            {modoDesenho ? 'Desenho Ativado' : 'Ativar Desenho'}
          </Button>

          <Button onClick={desfazerUltimo} variant="outline" size="sm">
            <Undo2 className="h-4 w-4 mr-1" />
            Desfazer
          </Button>

          <Button onClick={limparCanvas} variant="outline" size="sm">
            <Trash2 className="h-4 w-4 mr-1" />
            Limpar
          </Button>
        </div>

        {modoDesenho && <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <Label>Cor:</Label>
              <input type="color" value={corDesenho} onChange={e => setCorDesenho(e.target.value)} className="h-8 w-16 rounded border border-input" />
            </div>

            <div className="flex items-center gap-2 flex-1">
              <Label>Espessura:</Label>
              <input type="range" min="1" max="10" value={espessura} onChange={e => setEspessura(Number(e.target.value))} className="flex-1" />
              <span className="text-sm text-muted-foreground">{espessura}px</span>
            </div>
          </div>}

        <canvas ref={canvasRef} width={400} height={500} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} className={`border-2 border-border rounded-lg w-full ${modoDesenho ? 'cursor-crosshair' : 'cursor-default'}`} />
      </CardContent>
    </Card>;
};