
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface CheckoutErrorProps {
  message?: string;
}

export const CheckoutError: React.FC<CheckoutErrorProps> = ({ 
  message = "Erro ao carregar o produto."
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      <p className="text-red-500">{message}</p>
      <Button onClick={() => navigate('/')}>
        Voltar para a página inicial
      </Button>
    </div>
  );
};
