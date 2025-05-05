
import { useState } from 'react';
import { Order, PaymentStatus } from '@/types/checkout';
import { usePaymentStatusChecker } from './usePaymentStatusChecker';
import { usePaymentNavigation } from './usePaymentNavigation';

export interface UsePaymentPollingProps {
  maxChecks?: number;
  pollingInterval?: number;
  fetchOrderById: (id: string) => Promise<Order | null>;
}

/**
 * Hook for polling payment status with configurable settings
 */
export const usePaymentPolling = ({
  maxChecks = 10,
  pollingInterval = 3000,
  fetchOrderById
}: UsePaymentPollingProps) => {
  const [checkCount, setCheckCount] = useState(0);
  const { checkOrderStatusInDatabase, checkPaymentStatusInAsaas } = usePaymentStatusChecker();
  const { navigateToSuccess, navigateToRetryPayment } = usePaymentNavigation();

  /**
   * Handle temporary payment IDs with delayed success
   */
  const handleTemporaryPaymentId = (order: Order): ReturnType<typeof setTimeout> | null => {
    if (order.asaasPaymentId && 
        (order.asaasPaymentId.startsWith('temp_') || 
         order.asaasPaymentId.startsWith('temp_retry_'))) {
      console.log('[PaymentAnalysis] Using temporary ID, proceeding to success after delay');
      
      // Short delay to allow for simulation time
      return setTimeout(() => {
        navigateToSuccess(order);
      }, 2000);
    }
    
    return null;
  };

  /**
   * Create polling interval for checking payment status
   */
  const createPollingInterval = (order: Order): NodeJS.Timeout | null => {
    // Skip polling for temporary payment IDs and simulate success after delay
    const timeoutId = handleTemporaryPaymentId(order);
    if (timeoutId) return null;
    
    // Start polling interval for real payment IDs
    const interval = setInterval(async () => {
      try {
        const newCount = checkCount + 1;
        setCheckCount(newCount);
        
        // Check if we've reached max checks
        if (newCount >= maxChecks) {
          clearInterval(interval);
          console.log('[PaymentAnalysis] Max checks reached, navigating to success');
          navigateToSuccess(order);
          return;
        }
        
        // First check status in our database
        const dbResult = await checkOrderStatusInDatabase(order, fetchOrderById);
        
        if (dbResult.statusChanged && dbResult.updatedOrder) {
          clearInterval(interval);
          
          if (dbResult.isSuccess) {
            navigateToSuccess(dbResult.updatedOrder);
          } else {
            navigateToRetryPayment(dbResult.updatedOrder);
          }
          return;
        }
        
        // Then check in Asaas if needed
        const asaasResult = await checkPaymentStatusInAsaas(order, newCount);
        
        if (asaasResult.statusChanged) {
          clearInterval(interval);
          
          if (asaasResult.status && ['CONFIRMED'].includes(asaasResult.status)) {
            navigateToSuccess(order);
          } else {
            navigateToRetryPayment({
              ...order,
              status: asaasResult.status || order.status
            });
          }
        }
      } catch (error) {
        console.error('[PaymentAnalysis] Error checking payment status:', error);
      }
    }, pollingInterval);
    
    return interval;
  };

  return {
    checkCount,
    setCheckCount,
    createPollingInterval,
    handleTemporaryPaymentId
  };
};
