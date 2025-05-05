
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCheckoutState } from '@/hooks/useCheckoutState';
import { usePreviewCustomization } from '@/hooks/usePreviewCustomization';
import { CheckoutContent } from '@/components/checkout/CheckoutContent';
import { PreviewLoading } from '@/components/preview/PreviewLoading';
import { CountdownBanner } from '@/components/CountdownBanner';
import CheckoutContainer from '@/components/checkout/CheckoutContainer';

const CheckoutPreview: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const { customization, demoProduct } = usePreviewCustomization(searchParams);

  const {
    customerData,
    paymentMethod,
    isSubmitting,
    handleCustomerSubmit,
    setPaymentMethod,
    handlePaymentSubmit
  } = useCheckoutState(demoProduct);

  useEffect(() => {
    // Set loading to false once customization is loaded
    setLoading(false);
  }, [customization]);

  if (loading) {
    return <PreviewLoading />;
  }

  // Update customization to use new image and message
  const updatedCustomization = {
    ...customization,
    topMessage: 'Oferta por tempo limitado!',
    bannerImageUrl: '/lovable-uploads/ccce08a6-444b-4ccf-8231-b7270b25fd30.png', // Usar a nova imagem
    showRandomVisitors: true // Enable random visitors by default in preview
  };

  // Sample date for the countdown - 24 hours from now
  const countdownEndTime = new Date(Date.now() + 24 * 60 * 60 * 1000);

  return (
    <div className="flex flex-col bg-white max-w-full overflow-x-hidden">
      <div className="w-full flex justify-center">
        <div className="w-full mx-auto bg-white">
          {/* Banner at the top of the page */}
          <CountdownBanner 
            message="Oferta por tempo limitado!"
            endTime={countdownEndTime}
            bannerImageUrl={updatedCustomization.bannerImageUrl}
            containerClassName="w-full"
          />
          
          {/* Removido o espaço em branco no mobile */}
          <div className="w-full md:w-3/4 max-w-4xl mx-auto px-4 md:px-6 bg-white py-2 md:py-4">
            <CheckoutContent 
              product={demoProduct}
              customerData={customerData}
              paymentMethod={paymentMethod}
              isSubmitting={isSubmitting}
              customization={updatedCustomization}
              onCustomerSubmit={handleCustomerSubmit}
              onPaymentMethodChange={setPaymentMethod}
              onPaymentSubmit={handlePaymentSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPreview;
