
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface PaymentErrorStateProps {
  errorMessage: string;
}

export const PaymentErrorState: React.FC<PaymentErrorStateProps> = ({ errorMessage }) => {
  const navigate = useNavigate();
  
  return (
    <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg text-center border border-red-100">
      <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <p className="text-red-500 font-medium text-lg mb-2">Erro ao gerar pagamento</p>
      <p className="text-sm text-muted-foreground mb-4">{errorMessage}</p>
      <Button 
        onClick={() => navigate('/')} 
        className="mt-2 bg-asaas-primary hover:bg-asaas-secondary transition-colors"
      >
        Tentar novamente
      </Button>
    </div>
  );
};
