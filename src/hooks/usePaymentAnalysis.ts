import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useOrderData } from '@/hooks/useOrderData';
import { Order, PaymentStatus } from '@/types/checkout';
import { logPaymentError } from '@/utils/paymentErrorHandler';
import { usePaymentStatusChecker } from './payment/usePaymentStatusChecker';
import { usePaymentNavigation } from './payment/usePaymentNavigation';
import { usePaymentPolling } from './payment/usePaymentPolling';

interface UsePaymentAnalysisProps {
  initialOrder?: Order;
  hasWhatsappSupport?: boolean;
  whatsappNumber?: string;
  product?: {
    has_whatsapp_support?: boolean;
    whatsapp_number?: string;
  };
}

export const usePaymentAnalysis = ({
  initialOrder,
  hasWhatsappSupport,
  whatsappNumber,
  product
}: UsePaymentAnalysisProps = {}) => {
  const { toast } = useToast();
  const { fetchOrderById, getOrderIdFromUrl } = useOrderData();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { hasTerminalStatus } = usePaymentStatusChecker();
  const { navigateToSuccess, navigateToRetryPayment, navigateToHomeWithError } = usePaymentNavigation();
  const { createPollingInterval } = usePaymentPolling({ fetchOrderById });

  // Load order data from props or URL
  const loadOrderData = async (): Promise<NodeJS.Timeout | null> => {
    try {
      let currentOrder = null;

      // First try to get order from initialOrder prop
      if (initialOrder) {
        console.log('[PaymentAnalysis] Using order from props:', initialOrder);
        currentOrder = initialOrder;
        
        // Check if order already has terminal status
        const status = hasTerminalStatus(currentOrder);
        if (status.hasTerminalStatus) {
          setLoading(false);
          
          if (status.isSuccess) {
            navigateToSuccess(currentOrder, hasWhatsappSupport, whatsappNumber);
          } else {
            navigateToRetryPayment(currentOrder);
          }
          
          return null; // Order has been processed, no need to continue
        }
      } else {
        // Otherwise try to get from URL parameters
        const orderId = getOrderIdFromUrl();
        
        if (!orderId) {
          console.error('[PaymentAnalysis] No order ID found');
          throw new Error("Order ID not found");
        }
        
        console.log('[PaymentAnalysis] Fetching order with ID:', orderId);
        currentOrder = await fetchOrderById(orderId);
        
        if (!currentOrder) {
          console.error('[PaymentAnalysis] Order not found with ID:', orderId);
          throw new Error("Order not found");
        }
        
        // Check if order already has terminal status
        const status = hasTerminalStatus(currentOrder);
        if (status.hasTerminalStatus) {
          setLoading(false);
          
          if (status.isSuccess) {
            navigateToSuccess(currentOrder, hasWhatsappSupport, whatsappNumber);
          } else {
            navigateToRetryPayment(currentOrder);
          }
          
          return null; // Order has been processed, no need to continue
        }
      }
      
      setOrder(currentOrder);
      
      // Start polling for payment status and return the interval ID
      return createPollingInterval(currentOrder);
    } catch (error) {
      logPaymentError('PaymentAnalysis', error, 'Error loading order data');
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do pedido",
        variant: "destructive",
      });
      
      // Navigate to homepage on error
      navigateToHomeWithError("Falha ao processar pagamento. Tente novamente.");
      
      return null; // Return null in case of error
    } finally {
      setLoading(false);
    }
  };
  
  // Effect to load and monitor payment status
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    
    // Call loadOrderData and store the interval ID
    const initializePaymentAnalysis = async () => {
      intervalId = await loadOrderData();
    };
    
    initializePaymentAnalysis();
    
    // Cleanup function
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [initialOrder, hasWhatsappSupport, whatsappNumber, product]);

  return { order, loading };
};
