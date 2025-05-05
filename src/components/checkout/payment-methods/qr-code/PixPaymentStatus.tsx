
import React from 'react';
import { PaymentStatus } from '@/types/checkout';
import { Check, AlertCircle, Clock, AlertTriangle, ShieldCheck, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface PixPaymentStatusProps {
  status: PaymentStatus;
  orderId?: string;
  onContinue?: () => void;
}

export const PixPaymentStatus: React.FC<PixPaymentStatusProps> = ({ 
  status, 
  orderId,
  onContinue 
}) => {
  const navigate = useNavigate();
  
  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    } else if (orderId) {
      // Navigate to success page if no custom handler is provided
      navigate('/success', { 
        state: { 
          order: { id: orderId }
        } 
      });
    }
  };
  
  if (status === "CONFIRMED" || status === "RECEIVED") {
    return (
      <div className="text-center p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 shadow-md animate-fade-in">
        <div className="relative">
          <div className="absolute inset-0 bg-green-400 rounded-full blur-md opacity-30 animate-pulse"></div>
          <div className="relative mx-auto w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-md mb-4">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-green-700 mb-2">Pagamento Confirmado!</h3>
        <p className="text-green-600 mb-6">Seu pagamento foi processado com sucesso.</p>
        
        <Button
          onClick={handleContinue}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 font-medium text-lg"
          size="lg"
        >
          Continuar
        </Button>
        
        <div className="mt-6 flex items-center justify-center text-green-500 text-sm">
          <ShieldCheck className="w-4 h-4 mr-1" />
          <span>Compra protegida</span>
        </div>
      </div>
    );
  }
  
  if (status === "CANCELLED" || status === "REFUNDED") {
    return (
      <div className="text-center p-8 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200 shadow-md animate-fade-in">
        <div className="relative">
          <div className="absolute inset-0 bg-red-400 rounded-full blur-md opacity-30"></div>
          <div className="relative w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
            <AlertCircle className="w-10 h-10 text-white" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-red-700 mb-2">Pagamento Cancelado</h3>
        <p className="text-red-600 mb-4">Este pagamento foi cancelado ou estornado.</p>
        
        <Button
          onClick={() => navigate('/')}
          variant="outline"
          className="border-red-300 text-red-700 hover:bg-red-50"
        >
          Voltar ao início
        </Button>
      </div>
    );
  }
  
  if (status === "OVERDUE") {
    return (
      <div className="text-center p-8 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200 shadow-md animate-fade-in">
        <div className="relative">
          <div className="absolute inset-0 bg-amber-400 rounded-full blur-md opacity-30"></div>
          <div className="relative w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
            <AlertTriangle className="w-10 h-10 text-white" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-amber-700 mb-2">Pagamento Expirado</h3>
        <p className="text-amber-600 mb-4">O tempo para este pagamento expirou.</p>
        
        <Button
          onClick={() => navigate('/')}
          variant="outline"
          className="border-amber-300 text-amber-700 hover:bg-amber-50"
        >
          Tentar novamente
        </Button>
      </div>
    );
  }
  
  return null;
};
