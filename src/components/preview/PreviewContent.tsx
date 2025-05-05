
import React from 'react';
import { CheckoutContent } from '@/components/checkout/CheckoutContent';
import { CheckoutCustomization, Product, AddressData } from '@/types/checkout';
import { PaymentMethod } from '@/types/checkout';
import { CustomerData } from '@/types/checkout';

interface PreviewContentProps {
  product: Product;
  customerData: CustomerData; // This now expects non-null CustomerData
  paymentMethod: PaymentMethod;
  isSubmitting: boolean;
  customization: CheckoutCustomization;
  onCustomerSubmit: (customerData: CustomerData) => void;
  onAddressSubmit?: (addressData: AddressData) => void;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onPaymentSubmit: () => void;
}

export const PreviewContent: React.FC<PreviewContentProps> = ({
  product,
  customerData,
  paymentMethod,
  isSubmitting,
  customization,
  onCustomerSubmit,
  onAddressSubmit,
  onPaymentMethodChange,
  onPaymentSubmit
}) => {
  return (
    <CheckoutContent 
      product={product}
      customerData={customerData}
      paymentMethod={paymentMethod}
      isSubmitting={isSubmitting}
      customization={customization}
      onCustomerSubmit={onCustomerSubmit}
      onAddressSubmit={onAddressSubmit}
      onPaymentMethodChange={onPaymentMethodChange}
      onPaymentSubmit={onPaymentSubmit}
    />
  );
};
