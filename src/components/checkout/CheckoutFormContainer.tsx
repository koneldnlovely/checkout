
import React, { useRef } from 'react';
import { CustomerData, CheckoutCustomization, PaymentMethod } from '@/types/checkout';
import { PersonalInfoSection } from '@/components/checkout/PersonalInfoSection';
import { TestimonialSection } from '@/components/checkout/TestimonialSection';
import { PaymentMethodSection } from '@/components/checkout/payment-methods/PaymentMethodSection';

interface CheckoutFormContainerProps {
  customerData: CustomerData | null;
  paymentMethod: PaymentMethod;
  isSubmitting: boolean;
  headingColor?: string;
  buttonColor?: string;
  buttonText?: string;
  onCustomerSubmit: (data: CustomerData) => void;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onPaymentSubmit: () => void;
}

export const CheckoutFormContainer: React.FC<CheckoutFormContainerProps> = ({
  customerData,
  paymentMethod,
  isSubmitting,
  headingColor,
  buttonColor,
  buttonText,
  onCustomerSubmit,
  onPaymentMethodChange,
  onPaymentSubmit
}) => {
  // Create a ref for the customer form
  const customerFormRef = useRef<HTMLFormElement>(null);

  return (
    <div className="space-y-8">
      <PersonalInfoSection 
        onSubmit={onCustomerSubmit} 
        headingColor={headingColor || '#000000'} 
        formRef={customerFormRef}
      />
      
      <TestimonialSection headingColor={headingColor || '#000000'} />
      
      {/* Add the missing props: customerFormRef and onCustomerDataSubmit */}
      <PaymentMethodSection
        id="payment-section"
        paymentMethod={paymentMethod}
        customerFormRef={customerFormRef}  // Add this prop
        onPaymentMethodChange={onPaymentMethodChange}
        onSubmit={onPaymentSubmit}
        onCustomerDataSubmit={onCustomerSubmit}  // Add this prop
        isSubmitting={isSubmitting}
        headingColor={headingColor || '#000000'}
        buttonColor={buttonColor || '#6E59A5'} 
        buttonText={paymentMethod === 'pix' ? 'Pagar com PIX' : (buttonText || 'Finalizar Compra')}
        productPrice={0} // Adding default value for productPrice
      />
    </div>
  );
};
