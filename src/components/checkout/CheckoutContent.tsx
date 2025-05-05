
import React, { useRef, useState } from 'react';
import { CheckoutCustomization, CustomerData, PaymentMethod, Product, AddressData } from '@/types/checkout';
import { PersonalInfoSection } from './PersonalInfoSection';
import { TestimonialSection } from './TestimonialSection';
import { PaymentMethodSection } from './payment-methods/PaymentMethodSection';
import { OrderSummary } from './OrderSummary';
import { AddressForm } from './address/AddressForm';
import { useShippingMessage } from './address/useShippingMessage';
import { RandomVisitorsMessage } from './RandomVisitorsMessage';

interface CheckoutContentProps {
  product: Product;
  customerData: CustomerData | null;
  paymentMethod: PaymentMethod;
  isSubmitting: boolean;
  customization: CheckoutCustomization;
  onCustomerSubmit: (customerData: CustomerData) => void;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onPaymentSubmit: (data?: any) => void;
  onAddressSubmit?: (addressData: AddressData) => void;
}

export const CheckoutContent: React.FC<CheckoutContentProps> = ({
  product,
  customerData,
  paymentMethod,
  isSubmitting,
  customization,
  onCustomerSubmit,
  onPaymentMethodChange,
  onPaymentSubmit,
  onAddressSubmit
}) => {
  const customerFormRef = useRef<HTMLFormElement>(null);
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const [showFreeShipping, setShowFreeShipping] = useState(false);
  
  // Determine if product is physical based on the product type
  const isPhysicalProduct = product.type === 'physical';
  
  const handleAddressSubmit = (data: AddressData) => {
    setAddressData(data);
    if (data.cep && data.number) {
      setShowFreeShipping(true);
    }
    if (onAddressSubmit) {
      onAddressSubmit(data);
    }
  };

  return (
    <div className="space-y-4">
      {/* Add the Random Visitors Message component just below the banner */}
      <RandomVisitorsMessage min={1} max={20} />
      
      <PersonalInfoSection 
        onSubmit={onCustomerSubmit}
        headingColor={customization.headingColor}
        formRef={customerFormRef}
      />
      
      {/* Show testimonials only for digital products */}
      {!isPhysicalProduct && (
        <TestimonialSection
          headingColor={customization.headingColor}
        />
      )}
      
      {/* Show address form only for physical products */}
      {isPhysicalProduct && (
        <AddressForm
          onAddressSubmit={handleAddressSubmit}
          headingColor={customization.headingColor}
        />
      )}
      
      <PaymentMethodSection
        id="payment-section"
        paymentMethod={paymentMethod}
        customerFormRef={customerFormRef}
        onPaymentMethodChange={onPaymentMethodChange}
        onSubmit={onPaymentSubmit}
        onCustomerDataSubmit={onCustomerSubmit}
        isSubmitting={isSubmitting}
        headingColor={customization.headingColor}
        buttonColor={customization.buttonColor}
        buttonText={customization.buttonText}
        productPrice={product.price}
      />
      
      <OrderSummary 
        product={product}
        isDigitalProduct={!isPhysicalProduct}
        showFreeShipping={showFreeShipping}
      />
    </div>
  );
};
