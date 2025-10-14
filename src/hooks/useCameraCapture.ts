import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useCameraCapture = () => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      console.log('Iniciando processo de câmera...');
      
      // Primeiro ativa o estado para montar o elemento de vídeo
      setIsCameraActive(true);
      
      // Aguarda um momento para o elemento ser montado no DOM
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('Solicitando acesso à câmera...');
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      
      console.log('Permissão concedida, stream obtido:', stream);
      
      if (videoRef.current) {
        console.log('VideoRef disponível, configurando stream...');
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        // Garantir que o vídeo comece a reproduzir
        await videoRef.current.play();
        console.log('Vídeo iniciado com sucesso');
        
        toast({
          title: 'Câmera ativada',
          description: 'Câmera pronta para capturar',
        });
      } else {
        console.error('VideoRef não está disponível após timeout');
        setIsCameraActive(false);
        toast({
          title: 'Erro',
          description: 'Elemento de vídeo não encontrado',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erro ao acessar câmera:', error);
      setIsCameraActive(false);
      toast({
        title: 'Erro',
        description: 'Não foi possível acessar a câmera',
        variant: 'destructive',
      });
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        stopCamera();
        
        toast({
          title: 'Foto capturada',
          description: 'Foto do pedido médico salva com sucesso',
        });
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const clearImage = () => {
    setCapturedImage(null);
  };

  return {
    isCameraActive,
    capturedImage,
    videoRef,
    startCamera,
    capturePhoto,
    stopCamera,
    clearImage,
  };
};
