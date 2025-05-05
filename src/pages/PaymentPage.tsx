
import React, { useEffect } from 'react';
import { usePaymentPage } from '@/hooks/usePaymentPage';
import { PaymentHeader } from '@/components/checkout/payment-methods/PaymentHeader';
import { PaymentFooter } from '@/components/checkout/payment-methods/PaymentFooter';
import { PaymentContent } from '@/components/checkout/payment-methods/PaymentContent';
import { PaymentDecorativeElements } from '@/components/checkout/payment-methods/PaymentDecorativeElements';

const PaymentPage = () => {
  const { loading, paymentData, order, error, paymentStatus, isCheckingStatus, refreshStatus } = usePaymentPage();
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Adicionar logs para diagnosticar problemas na renderização
  useEffect(() => {
    console.group('PaymentPage Component');
    console.log('Loading:', loading);
    console.log('Has payment data:', !!paymentData);
    console.log('Has order:', !!order);
    console.log('Error:', error);
    console.log('Payment status:', paymentStatus);
    
    if (paymentData) {
      console.log('Payment data details:', {
        paymentId: paymentData.paymentId,
        hasQRCode: !!paymentData.qrCode,
        hasQRCodeImage: !!paymentData.qrCodeImage,
        hasCopyPasteKey: !!paymentData.copyPasteKey,
        qrCodeImageLength: paymentData.qrCodeImage ? paymentData.qrCodeImage.length : 0,
        qrCodeImageStart: paymentData.qrCodeImage ? paymentData.qrCodeImage.substring(0, 30) + '...' : 'N/A'
      });
    }
    
    if (order) {
      console.log('Order details:', {
        id: order.id,
        status: order.status,
        value: order.productPrice
      });
    }
    
    console.groupEnd();
  }, [loading, paymentData, order, error, paymentStatus]);
  
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-white via-green-50/20 to-white">
      <div className="w-full max-w-4xl px-3 sm:px-4 py-4 sm:py-8">
        <PaymentHeader />
        
        <div className="relative mt-4 sm:mt-6">
          <PaymentDecorativeElements />
          
          <PaymentContent 
            loading={loading}
            error={error}
            paymentData={paymentData}
            order={order}
            paymentStatus={paymentStatus}
            isCheckingStatus={isCheckingStatus}
            refreshStatus={refreshStatus}
          />
        </div>
        
        {paymentData && order && <PaymentFooter />}
      </div>
    </div>
  );
};

export default PaymentPage;
