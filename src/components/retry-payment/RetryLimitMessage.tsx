
import React from 'react';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export interface RetryLimitMessageProps {
  message?: string;
}

export const RetryLimitMessage: React.FC<RetryLimitMessageProps> = ({ message }) => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-6">
      <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold mb-2">Não é possível tentar novamente</h3>
      <p className="text-muted-foreground mb-4">
        {message || "Limite de tentativas excedido."}
      </p>
      <Button
        onClick={() => navigate('/')}
        className="bg-slate-100 text-slate-800 px-4 py-2 rounded hover:bg-slate-200 transition-colors"
      >
        Voltar para Início
      </Button>
    </div>
  );
};
