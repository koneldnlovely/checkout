
import { useToast } from '@/hooks/use-toast';
import { PaymentStatus } from '@/types/checkout';

/**
 * Common error messages for payment failures
 */
export const PaymentErrorMessages = {
  GENERIC: "Ocorreu um erro inesperado. Tente novamente.",
  CARD_DECLINED: "Seu cartão foi recusado pela operadora.",
  INSUFFICIENT_FUNDS: "Cartão com limite insuficiente.",
  INVALID_DATA: "Dados do cartão inválidos ou incompletos.",
  ORDER_NOT_FOUND: "Pedido não encontrado.",
  RETRY_LIMIT_REACHED: "Você atingiu o limite de tentativas de pagamento.",
  LOAD_ERROR: "Não foi possível carregar os dados do pedido.",
  INVALID_ORDER: "Dados do pedido incompletos ou inválidos.",
  PAYMENT_TIMEOUT: "O tempo para pagamento expirou.",
};

/**
 * Maps payment status to user-friendly error messages
 */
export const getPaymentStatusErrorMessage = (status: PaymentStatus): string => {
  const statusMessages: Record<string, string> = {
    'CANCELLED': 'O pagamento foi cancelado',
    'REFUNDED': 'O pagamento foi estornado',
    'OVERDUE': 'O prazo de pagamento expirou',
    'ERROR': 'Ocorreu um erro no processamento do pagamento',
    'DECLINED': 'O pagamento foi recusado pela operadora',
    'PENDING': 'O pagamento está pendente de processamento'
  };

  return statusMessages[status] || `Status de pagamento: ${status}`;
};

/**
 * Displays a payment error toast message
 */
export const showPaymentErrorToast = (
  toast: ReturnType<typeof useToast>['toast'],
  message: string,
  title = "Erro no pagamento"
) => {
  toast({
    title,
    description: message,
    variant: "destructive",
  });
};

/**
 * Validates if an order has all required fields
 */
export const validateOrderData = (order: any) => {
  if (!order) {
    return { valid: false, message: PaymentErrorMessages.ORDER_NOT_FOUND };
  }

  if (!order.id) {
    return { valid: false, message: PaymentErrorMessages.INVALID_ORDER };
  }

  if (!order.customerName || !order.customerEmail || !order.productPrice) {
    return { 
      valid: false, 
      message: PaymentErrorMessages.INVALID_ORDER,
      missingFields: [
        !order.customerName && 'customerName',
        !order.customerEmail && 'customerEmail',
        !order.productPrice && 'productPrice'
      ].filter(Boolean)
    };
  }

  return { valid: true };
};

/**
 * Logs payment errors with consistent format
 */
export const logPaymentError = (source: string, error: any, additionalInfo?: any) => {
  console.error(`[${source}] Payment Error:`, error);
  
  if (additionalInfo) {
    console.error(`[${source}] Additional Info:`, additionalInfo);
  }
};
