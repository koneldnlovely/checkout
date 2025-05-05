
import { checkPaymentStatus } from '@/services/asaasService';
import { Order, PaymentStatus } from '@/types/checkout';

// Payment status constants
const FAILURE_STATUSES: PaymentStatus[] = ['DECLINED', 'FAILED', 'CANCELLED'];
const SUCCESS_STATUSES: PaymentStatus[] = ['CONFIRMED'];

/**
 * Hook for checking payment status in various sources
 */
export const usePaymentStatusChecker = () => {

  /**
   * Check if the order already has a terminal status
   */
  const hasTerminalStatus = (order: Order): { hasTerminalStatus: boolean; isSuccess: boolean } => {
    // Check for failure statuses
    if (order.status && FAILURE_STATUSES.includes(order.status as PaymentStatus)) {
      return { hasTerminalStatus: true, isSuccess: false };
    }

    // Check for success statuses
    if (order.status && SUCCESS_STATUSES.includes(order.status as PaymentStatus)) {
      return { hasTerminalStatus: true, isSuccess: true };
    }

    return { hasTerminalStatus: false, isSuccess: false };
  };

  /**
   * Check order status in database
   */
  const checkOrderStatusInDatabase = async (
    currentOrder: Order,
    fetchOrderById: (id: string) => Promise<Order | null>
  ): Promise<{ statusChanged: boolean; updatedOrder?: Order; isSuccess?: boolean }> => {
    try {
      // Ensure the order ID is available and not undefined
      if (!currentOrder.id) {
        console.log('[PaymentAnalysis] Order ID is undefined, skipping database check');
        return { statusChanged: false };
      }
      
      const refreshedOrder = await fetchOrderById(currentOrder.id);
      
      if (!refreshedOrder) {
        return { statusChanged: false };
      }
      
      if (FAILURE_STATUSES.includes(refreshedOrder.status as PaymentStatus)) {
        console.log('[PaymentAnalysis] Order status updated to failed in database');
        return { 
          statusChanged: true, 
          updatedOrder: refreshedOrder, 
          isSuccess: false 
        };
      }
      
      // If status has been updated to confirmed, go to success page
      if (SUCCESS_STATUSES.includes(refreshedOrder.status as PaymentStatus)) {
        console.log('[PaymentAnalysis] Order confirmed in database');
        return { 
          statusChanged: true, 
          updatedOrder: refreshedOrder, 
          isSuccess: true 
        };
      }
      
      return { statusChanged: false };
    } catch (err) {
      console.error('[PaymentAnalysis] Error checking order status in database:', err);
      return { statusChanged: false };
    }
  };

  /**
   * Check payment status in Asaas
   */
  const checkPaymentStatusInAsaas = async (
    currentOrder: Order,
    checkCount: number
  ): Promise<{ statusChanged: boolean; status?: PaymentStatus }> => {
    // Only check payment status in Asaas if we have a valid payment ID (not temp)
    if (!currentOrder.asaasPaymentId || 
        currentOrder.asaasPaymentId.startsWith('temp_') || 
        currentOrder.asaasPaymentId.startsWith('temp_retry_')) {
      
      console.log('[PaymentAnalysis] Using temporary ID, waiting for backend update: ' + currentOrder.asaasPaymentId);
      return { statusChanged: false };
    }
    
    const status = await checkPaymentStatus(currentOrder.asaasPaymentId);
    console.log(`[PaymentAnalysis] Payment status check #${checkCount}:`, status);
    
    // If payment status is now CONFIRMED, return success
    if (typeof status === 'string' && SUCCESS_STATUSES.includes(status as PaymentStatus)) {
      return { statusChanged: true, status: status as PaymentStatus };
    }
    
    // If payment status is FAILED, CANCELLED, or DECLINED, return failure
    if (typeof status === 'string' && FAILURE_STATUSES.includes(status as PaymentStatus)) {
      return { statusChanged: true, status: status as PaymentStatus };
    }
    
    return { statusChanged: false };
  };

  return {
    hasTerminalStatus,
    checkOrderStatusInDatabase,
    checkPaymentStatusInAsaas,
    FAILURE_STATUSES,
    SUCCESS_STATUSES
  };
};
