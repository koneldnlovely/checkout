
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PixCopyPasteFieldProps {
  copyPasteKey: string;
}

export const PixCopyPasteField: React.FC<PixCopyPasteFieldProps> = ({ copyPasteKey }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = () => {
    if (!copyPasteKey || copyPasteKey.trim() === '') {
      toast({
        title: "Código PIX não disponível",
        description: "Não foi possível obter o código PIX para cópia",
        variant: "destructive",
      });
      return;
    }
    
    navigator.clipboard.writeText(copyPasteKey).then(
      () => {
        setCopied(true);
        toast({
          title: "Código PIX copiado!",
          description: "Cole no app do seu banco para pagar",
        });
        
        setTimeout(() => setCopied(false), 3000);
      },
      (err) => {
        console.error("Erro ao copiar para a área de transferência:", err);
        toast({
          title: "Erro ao copiar",
          description: "Não foi possível copiar o código. Tente selecionar e copiar manualmente.",
          variant: "destructive",
        });
      }
    );
  };
  
  if (!copyPasteKey || copyPasteKey.trim() === '') {
    return (
      <div className="flex items-center justify-center p-4 bg-gray-50 rounded border border-gray-200">
        <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
        <span className="text-sm text-gray-600">Código PIX não disponível</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-between p-2 bg-white rounded border">
      <div className="text-xs truncate flex-1 mr-2 font-mono break-all">
        {copyPasteKey}
      </div>
      <Button 
        size="sm" 
        variant="outline"
        onClick={copyToClipboard}
        className="min-w-[100px]"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 mr-1" />
            Copiado
          </>
        ) : (
          <>
            <Copy className="h-4 w-4 mr-1" />
            Copiar
          </>
        )}
      </Button>
    </div>
  );
};
