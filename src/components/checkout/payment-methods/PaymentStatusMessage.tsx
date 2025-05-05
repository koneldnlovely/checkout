
import React from 'react';
import { PaymentMethod } from '@/types/checkout';

interface PaymentStatusMessageProps {
  success: boolean;
  error: boolean;
  paymentMethod: PaymentMethod;
}

export const PaymentStatusMessage: React.FC<PaymentStatusMessageProps> = ({
  success,
  error,
  paymentMethod
}) => {
  // Only show success message for PIX payments 
  // For credit card, we'll handle success on redirect instead
  if (success && paymentMethod === 'pix') {
    return (
      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-800">
        Pagamento realizado com sucesso! Verifique seu e-mail.
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-800">
        Erro no pagamento. Verifique os dados.
      </div>
    );
  }
  
  return null;
};
