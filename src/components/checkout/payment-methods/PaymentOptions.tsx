
import React from 'react';
import { CreditCard } from 'lucide-react';
import { RadioGroup } from '@/components/ui/radio-group';
import { PaymentMethod } from '@/types/checkout';

interface PaymentOptionsProps {
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (method: PaymentMethod) => void;
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({ 
  paymentMethod, 
  onPaymentMethodChange 
}) => {
  return (
    <RadioGroup
      value={paymentMethod}
      onValueChange={(value: PaymentMethod) => onPaymentMethodChange(value)}
      className="flex flex-row gap-2 mb-6"
    >
      <div
        className={`flex-1 cursor-pointer p-4 flex justify-center items-center border rounded-md ${
          paymentMethod === 'creditCard' 
            ? 'bg-green-100 border-green-500 shadow-sm' 
            : 'bg-white border-gray-300'
        }`}
        onClick={() => onPaymentMethodChange('creditCard')}
      >
        <div className="flex items-center">
          <CreditCard className={`${paymentMethod === 'creditCard' ? 'text-green-600' : 'text-gray-600'}`} size={24} />
          <span className="ml-2 font-medium">Cartão de crédito</span>
        </div>
      </div>
      
      <div
        className={`flex-1 cursor-pointer p-4 flex justify-center items-center border rounded-md ${
          paymentMethod === 'pix' 
            ? 'bg-white border-green-500 shadow-sm' 
            : 'bg-white border-gray-300'
        }`}
        onClick={() => onPaymentMethodChange('pix')}
      >
        <img 
          src="https://pay.kirvano.com/img/pix.svg" 
          alt="PIX" 
          className="h-6 w-6"
        />
      </div>
    </RadioGroup>
  );
};

export default PaymentOptions;
