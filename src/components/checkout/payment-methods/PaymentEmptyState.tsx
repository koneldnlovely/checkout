
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const PaymentEmptyState: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="w-full max-w-md h-64 flex items-center justify-center bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="text-center p-6">
        <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <p className="text-gray-700 font-medium text-lg mb-2">Dados de pagamento incompletos</p>
        <p className="text-sm text-muted-foreground mb-4">
          Não foi possível carregar os dados necessários para o pagamento.
        </p>
        <Button 
          onClick={() => navigate('/')} 
          className="mt-2 bg-asaas-primary hover:bg-asaas-secondary transition-colors"
        >
          Voltar ao início
        </Button>
      </div>
    </div>
  );
};
