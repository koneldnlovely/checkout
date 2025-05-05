
import React, { useEffect, useState } from 'react';
import { PaymentStatus } from '@/types/checkout';
import { PixPaymentContainer } from './qr-code/PixPaymentContainer';

interface PixPaymentProps {
  orderId: string;
  paymentId: string;
  qrCode: string;
  qrCodeImage: string;
  copyPasteKey: string;
  expirationDate: string;
  value: number;
  description: string;
  productType?: 'digital' | 'physical';
  status?: PaymentStatus | null;
  isCheckingStatus?: boolean;
  onCheckStatus?: () => void;
}

export const PixPayment: React.FC<PixPaymentProps> = ({
  orderId,
  paymentId,
  qrCode,
  qrCodeImage,
  copyPasteKey,
  expirationDate,
  value,
  description,
  productType = 'physical',
  status = null,
  isCheckingStatus = false,
  onCheckStatus = () => {}
}) => {
  // Ensure value is a valid number
  const safeValue = typeof value === 'number' && !isNaN(value) ? value : 0;
  
  // Calculate the time left in seconds (15 minutes = 900 seconds)
  const [timeLeft, setTimeLeft] = useState<number>(900);
  const [isExpired, setIsExpired] = useState(false);
  
  // Initialize timer on component mount
  useEffect(() => {
    // Start with 15 minutes (900 seconds)
    setTimeLeft(900);
    
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setIsExpired(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  console.log("PixPayment - Rendering with props:", {
    orderId,
    paymentId: paymentId || "N/A",
    hasQRCode: !!qrCode,
    hasQRImage: !!qrCodeImage,
    hasCopyPasteKey: !!copyPasteKey,
    expirationDate,
    value: safeValue, // Log the actual safe value
    valueType: typeof safeValue,
    description,
    productType,
    status,
    isCheckingStatus,
    timeLeft
  });
  
  // Ensure we have valid values for all props before passing them to child components
  const safeDescription = description || 'Pagamento PIX';
  
  // Log when payment status changes
  useEffect(() => {
    console.log(`Payment status in PixPayment component: ${status}`);
  }, [status]);
  
  return (
    <PixPaymentContainer
      orderId={orderId}
      paymentId={paymentId}
      qrCode={qrCode}
      qrCodeImage={qrCodeImage}
      copyPasteKey={copyPasteKey}
      expirationDate={expirationDate}
      value={safeValue}
      description={safeDescription}
      status={status || "PENDING"}
      isCheckingStatus={isCheckingStatus}
      timeLeft={timeLeft.toString()} 
      isExpired={isExpired}
      onCheckStatus={onCheckStatus}
      productType={productType}
    />
  );
};
