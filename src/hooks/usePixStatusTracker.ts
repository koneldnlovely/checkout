
import { useState, useEffect, useCallback } from 'react';
import { PixPaymentData, Order, PaymentStatus } from '@/types/checkout';
import { checkPaymentStatus } from '@/services/asaasService';
import { handleApiError } from '@/utils/errorHandling';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const usePixStatusTracker = (
  paymentData: PixPaymentData | null,
  order: Order | null
) => {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Extract the status normalization logic to a separate function
  const normalizePaymentStatus = (result: any): PaymentStatus | null => {
    if (typeof result === 'string') {
      return result as PaymentStatus;
    } else if (result && typeof result === 'object') {
      // If result is an object with a status property
      if ('status' in result) {
        return (result as { status: PaymentStatus }).status;
      }
    }
    return null;
  };

  // Extract the logic to check if payment is confirmed
  const isPaymentConfirmed = (result: any): boolean => {
    return result === 'CONFIRMED' || 
      (typeof result === 'object' && 
       result && 
       'status' in result && 
       result.status === 'CONFIRMED');
  };

  // Show success toast when payment is confirmed
  const showConfirmationToast = () => {
    toast({
      title: "Pagamento confirmado!",
      description: "Seu pagamento foi recebido com sucesso.",
      variant: "default",
    });
  };

  // Handle redirection to success page when payment is confirmed
  const handlePaymentConfirmed = useCallback(() => {
    // Only proceed with navigation if we have a valid order
    if (order) {
      console.log('Payment confirmed! Redirecting to success page...');
      
      // Prepare product info to pass to success page
      const productInfo = {
        has_whatsapp_support: order.has_whatsapp_support || false,
        whatsapp_number: order.whatsapp_number || '',
        type: order.productType || 'physical'
      };
      
      // Navigate to success page with order and product info
      setTimeout(() => {
        navigate('/success', { 
          state: { 
            order,
            product: productInfo
          } 
        });
      }, 1000); // Add slight delay to ensure toast is visible
    } else {
      console.error('Cannot navigate to success: missing order data');
    }
  }, [order, navigate]);

  // Process the payment status result
  const processPaymentStatusResult = useCallback((result: any) => {
    const status = normalizePaymentStatus(result);
    if (status) {
      setPaymentStatus(status);
      
      // Log the status change for debugging
      console.log(`Payment status updated to: ${status}`);
    }

    // Check if payment is confirmed to show toast and navigate
    if (isPaymentConfirmed(result)) {
      showConfirmationToast();
      handlePaymentConfirmed();
    }
  }, [handlePaymentConfirmed]);

  // Check payment status, memoize this function so it can be safely used in useEffect and as a callback
  const performStatusCheck = useCallback(async (paymentId: string) => {
    setIsCheckingStatus(true);
    try {
      console.log(`Checking status for payment ID: ${paymentId}`);
      const result = await checkPaymentStatus(paymentId);
      console.log(`Status check result:`, result);
      processPaymentStatusResult(result);
    } catch (error) {
      console.error("Error checking payment status:", error);
      handleApiError(error, {
        defaultMessage: "Não foi possível verificar o status do pagamento."
      });
    } finally {
      setIsCheckingStatus(false);
    }
  }, [processPaymentStatusResult]);

  // Auto-polling mechanism for status checks
  useEffect(() => {
    if (!paymentData?.paymentId || !order) {
      console.log("Missing payment ID or order data for auto-polling");
      return;
    }

    // Initial check
    console.log("Starting auto-polling for payment status");
    performStatusCheck(paymentData.paymentId);
    
    // Set up polling interval (check every 10 seconds)
    const pollingInterval = setInterval(() => {
      if (paymentStatus !== 'CONFIRMED' && paymentStatus !== 'RECEIVED') {
        console.log("Auto-polling: checking payment status");
        performStatusCheck(paymentData.paymentId);
      } else {
        console.log("Payment confirmed, stopping auto-polling");
        clearInterval(pollingInterval);
      }
    }, 10000);
    
    return () => {
      console.log("Cleaning up payment status polling");
      clearInterval(pollingInterval);
    };
  }, [paymentData?.paymentId, order, performStatusCheck, paymentStatus]);

  // Public method to manually refresh status
  const refreshStatus = async () => {
    if (!paymentData?.paymentId) {
      console.log("Cannot refresh status: missing payment ID");
      return;
    }
    console.log("Manual refresh of payment status requested");
    performStatusCheck(paymentData.paymentId);
  };

  return {
    paymentStatus,
    isCheckingStatus,
    refreshStatus
  };
};
