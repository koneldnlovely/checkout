
import React from 'react';
import { PixPayment } from '@/components/checkout/payment-methods/PixPayment';
import { PaymentLoadingState } from '@/components/checkout/payment-methods/PaymentLoadingState';
import { PaymentErrorState } from '@/components/checkout/payment-methods/PaymentErrorState';
import { PaymentEmptyState } from '@/components/checkout/payment-methods/PaymentEmptyState';
import { Order, PixPaymentData, PaymentStatus } from '@/types/checkout';

interface PaymentContentProps {
  loading: boolean;
  error: string | null;
  paymentData: PixPaymentData | null;
  order: Order | null;
  paymentStatus: PaymentStatus | null;
  isCheckingStatus: boolean;
  refreshStatus: () => Promise<void>;
}

export const PaymentContent: React.FC<PaymentContentProps> = ({ 
  loading, 
  error, 
  paymentData, 
  order,
  paymentStatus,
  isCheckingStatus,
  refreshStatus
}) => {
  console.log("PaymentContent - Props:", { 
    loading, 
    hasError: !!error, 
    hasPaymentData: !!paymentData, 
    hasOrder: !!order,
    paymentStatus,
    isCheckingStatus,
    paymentValue: paymentData?.value,
    paymentValueType: paymentData ? typeof paymentData.value : 'undefined',
    productType: order?.productType
  });
  
  if (loading) {
    return <PaymentLoadingState />;
  }
  
  if (error) {
    return <PaymentErrorState errorMessage={error} />;
  }
  
  if (!paymentData || !order) {
    console.warn("PaymentContent - Dados incompletos:", { 
      paymentData: paymentData ? "presente" : "ausente", 
      order: order ? "presente" : "ausente" 
    });
    return <PaymentEmptyState />;
  }
  
  console.log("PaymentContent - Renderizando PixPayment com dados:", {
    orderId: order.id || "N/A",
    paymentId: paymentData.paymentId || "N/A",
    qrCodeLength: paymentData.qrCode?.length || 0,
    imageLength: paymentData.qrCodeImage?.length || 0,
    copyPasteKeyLength: paymentData.copyPasteKey?.length || 0,
    value: paymentData.value,
    valueType: typeof paymentData.value,
    productType: order.productType
  });
  
  // Ensure we have valid values for all required props
  // More robust validation for value - ensure it's a valid number
  const safeValue = typeof paymentData.value === 'number' && !isNaN(paymentData.value) ? 
    paymentData.value : 
    (typeof paymentData.value === 'string' ? parseFloat(paymentData.value) || 0 : 0);
    
  const safeDescription = paymentData.description || 'Pagamento';
  
  return (
    <div className="animate-fade-in w-full max-w-md">
      <PixPayment 
        orderId={order.id || ''} 
        qrCode={paymentData.qrCode || ''}
        qrCodeImage={paymentData.qrCodeImage || ''}
        copyPasteKey={paymentData.copyPasteKey || ''}
        expirationDate={paymentData.expirationDate || new Date().toISOString()}
        value={safeValue}
        description={safeDescription}
        paymentId={paymentData.paymentId || ''}
        productType={order.productType}
        status={paymentStatus}
        isCheckingStatus={isCheckingStatus}
        onCheckStatus={refreshStatus}
      />
    </div>
  );
};
