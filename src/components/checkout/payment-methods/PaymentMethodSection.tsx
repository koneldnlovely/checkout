
import React from 'react';
import { SectionTitle } from '../SectionTitle';
import { CreditCard } from 'lucide-react';
import { PaymentMethod } from '@/types/checkout';
import { CustomerData } from '@/types/checkout';
import { useCustomerDataExtractor } from '@/hooks/useCustomerDataExtractor';
import { PaymentMethodHeader } from './PaymentMethodHeader';
import { PaymentMethodContent } from './PaymentMethodContent';
import { PaymentProcessor } from './PaymentProcessor';

interface PaymentMethodSectionProps {
  id: string;
  paymentMethod: PaymentMethod;
  customerFormRef: React.RefObject<HTMLFormElement>;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onSubmit: (data?: any) => void;
  onCustomerDataSubmit: (data: CustomerData) => void;
  isSubmitting: boolean;
  headingColor: string;
  buttonColor: string;
  buttonText: string;
  productPrice?: number;
}

export const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({
  id,
  paymentMethod,
  customerFormRef,
  onPaymentMethodChange,
  onSubmit,
  onCustomerDataSubmit,
  isSubmitting,
  headingColor,
  buttonColor,
  buttonText,
  productPrice = 0
}) => {
  const { customerData, hasValidCustomerData } = useCustomerDataExtractor(
    customerFormRef, 
    onCustomerDataSubmit
  );

  return (
    <section id={id} className="mb-4 bg-white rounded-lg border border-[#E0E0E0] p-6">
      <SectionTitle 
        title="Pagamento" 
        showNumberBadge={false} 
        icon={<CreditCard className="text-gray-700" size={20} />} 
      />
      
      <div className="mt-4">
        <PaymentMethodHeader paymentMethod={paymentMethod} />
        
        <PaymentProcessor
          paymentMethod={paymentMethod}
          hasValidCustomerData={hasValidCustomerData}
          onSubmit={onSubmit}
        >
          {({ handleSubmit, isProcessing, paymentSuccess, paymentError }) => (
            <PaymentMethodContent
              paymentMethod={paymentMethod}
              onPaymentMethodChange={onPaymentMethodChange}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting || isProcessing}
              buttonColor={buttonColor}
              buttonText={buttonText}
              productPrice={productPrice}
              paymentSuccess={paymentSuccess}
              paymentError={paymentError}
              hasValidCustomerData={hasValidCustomerData}
            />
          )}
        </PaymentProcessor>
      </div>
    </section>
  );
};
