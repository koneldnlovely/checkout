
import React from 'react';
import { CreditCard } from 'lucide-react';
import { PaymentMethod } from '@/types/checkout';

interface PaymentMethodHeaderProps {
  paymentMethod: PaymentMethod;
  className?: string;
}

export const PaymentMethodHeader: React.FC<PaymentMethodHeaderProps> = ({ 
  paymentMethod,
  className = ''
}) => {
  return (
    <div className={`flex justify-between items-center mb-4 ${className}`}>
      <div></div>
      <div className="text-sm font-medium text-gray-600">
        {paymentMethod === 'creditCard' ? 'Cartão de crédito' : 'PIX'}
      </div>
    </div>
  );
};
