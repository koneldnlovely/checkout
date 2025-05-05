
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useRetryValidation } from '@/hooks/useRetryValidation';
import { Order, PaymentStatus } from '@/types/checkout';
import { useOrderData } from '@/hooks/useOrderData';
import { useWhatsAppSupport } from '@/hooks/useWhatsAppSupport';
import { logPaymentError, PaymentErrorMessages } from '@/utils/paymentErrorHandler';

// Lista centralizada de status de pagamento que permitem retry
export const RETRYABLE_STATUSES: PaymentStatus[] = ['FAILED', 'DECLINED', 'CANCELLED'];

// Configuração padrão para limites de retry
export const DEFAULT_RETRY_CONFIG = {
  maxAttempts: 3,
  minMinutes: 5,
  enforceDelay: false
};

export const useRetryPaymentData = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { order, setOrder, loading, setLoading, fetchOrderById, getOrderIdFromUrl } = useOrderData();
  const [validationResult, setValidationResult] = useState<{
    canProceed: boolean;
    message?: string;
    remainingAttempts?: number;
    waitTime?: number;
  } | null>(null);
  
  const { validateRetryAttempt, isValidating } = useRetryValidation();
  const { hasWhatsappSupport, whatsappNumber } = useWhatsAppSupport(order?.productId);
  const [hasError, setHasError] = useState(false);
  const [autoRetry, setAutoRetry] = useState(false);
  // Use uma ref para rastrear se a validação já foi realizada para este orderId
  const validatedOrderIds = useRef<Set<string>>(new Set());
  // Use a ref to prevent multiple identical API calls in development due to React's StrictMode
  const initialLoadDone = useRef(false);

  // Fetch order data if not provided in location state
  useEffect(() => {
    // Avoid duplicate fetches in development strict mode
    if (initialLoadDone.current) return;
    initialLoadDone.current = true;
    
    const fetchOrder = async () => {
      setLoading(true);
      try {
        // Check if this is an auto-retry from a failed payment
        if (state?.autoRetry) {
          console.log('[RetryPaymentData] Auto-retry flag detected');
          setAutoRetry(true);
        }
        
        // If order is provided in location state, use it
        if (state?.order) {
          console.log('[RetryPaymentData] Using order from state:', state.order);
          setOrder(state.order);
          
          // Check if the order object has all required fields
          if (!state.order.id || !state.order.productPrice) {
            console.error('[RetryPaymentData] Order from state is missing required fields:', state.order);
            setHasError(true);
            toast({
              title: "Erro",
              description: "Dados do pedido incompletos",
              variant: "destructive",
            });
            return;
          }

          // Verificar se o status do pedido permite retry
          if (state.order.status && !RETRYABLE_STATUSES.includes(state.order.status as PaymentStatus)) {
            console.warn('[RetryPaymentData] Order status is not retryable:', state.order.status);
            // Não bloqueia o retry, apenas loga como alerta
          }
        } else {
          // Otherwise, get orderId from URL parameters
          const orderId = getOrderIdFromUrl();
          
          if (!orderId) {
            console.error('[RetryPaymentData] No orderId found in URL parameters');
            setHasError(true);
            toast({
              title: "Erro",
              description: PaymentErrorMessages.ORDER_NOT_FOUND,
              variant: "destructive",
            });
            return;
          }

          const fetchedOrder = await fetchOrderById(orderId);
          
          if (!fetchedOrder) {
            setHasError(true);
            toast({
              title: "Erro",
              description: PaymentErrorMessages.ORDER_NOT_FOUND,
              variant: "destructive",
            });
            return;
          }
          
          // Check if all required fields are present
          if (!fetchedOrder.id || !fetchedOrder.productPrice) {
            console.error('[RetryPaymentData] Fetched order is missing required fields:', fetchedOrder);
            setHasError(true);
            toast({
              title: "Erro",
              description: PaymentErrorMessages.INVALID_ORDER,
              variant: "destructive",
            });
            return;
          }

          // Verificar se o status do pedido permite retry
          if (fetchedOrder.status && !RETRYABLE_STATUSES.includes(fetchedOrder.status as PaymentStatus)) {
            console.warn('[RetryPaymentData] Order status is not retryable:', fetchedOrder.status);
            // Não bloqueia o retry, apenas loga como alerta
          }
          
          setOrder(fetchedOrder);
        }

        // Check retry limit for the order, only once
        const currentOrder = state?.order || order;
        if (currentOrder?.id) {
          await checkRetryLimit(currentOrder.id);
        }
      } catch (error) {
        logPaymentError("RetryPaymentData", error, "Error fetching order");
        setHasError(true);
        toast({
          title: "Erro",
          description: PaymentErrorMessages.LOAD_ERROR,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, []);  // Empty dependency array to run only once

  // Check if we can retry payment
  const checkRetryLimit = async (orderId: string) => {
    try {
      if (!orderId) return;
      
      // Avoid repeated validations for the same orderId
      if (validatedOrderIds.current.has(orderId)) {
        console.log('[RetryPaymentData] Skipping validation for already validated order:', orderId);
        return;
      }
      
      console.log('[RetryPaymentData] Checking retry limit for order:', orderId);
      
      const result = await validateRetryAttempt(orderId, DEFAULT_RETRY_CONFIG);
      
      console.log('[RetryPaymentData] Validation result:', result);
      
      setValidationResult(result);
      // Mark this orderId as already validated
      validatedOrderIds.current.add(orderId);
      
      if (!result.canProceed) {
        toast({
          title: "Limite atingido",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      logPaymentError("RetryPaymentData", error, "Error checking retry limit");
    }
  };

  return {
    order,
    loading,
    isSubmitting,
    setIsSubmitting,
    validationResult,
    isValidating,
    hasWhatsappSupport,
    whatsappNumber,
    validateRetryAttempt,
    checkRetryLimit,
    hasError,
    autoRetry
  };
};
