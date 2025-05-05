
import { useNavigate } from 'react-router-dom';
import { Order } from '@/types/checkout';

/**
 * Hook to handle payment-related navigation
 */
export const usePaymentNavigation = () => {
  const navigate = useNavigate();

  /**
   * Navigate to success page with appropriate props
   */
  const navigateToSuccess = (order: Order, hasWhatsappSupport?: boolean, whatsappNumber?: string) => {
    console.log('[usePaymentNavigation] Navegando para success com WhatsApp:', {
      hasWhatsappSupport,
      whatsappNumber: whatsappNumber || order.whatsapp_number
    });
    
    navigate('/success', { 
      state: { 
        order,
        has_whatsapp_support: hasWhatsappSupport || order.has_whatsapp_support || false,
        whatsapp_number: whatsappNumber || order.whatsapp_number || ''
      }
    });
  };

  /**
   * Navigate to retry-payment page with appropriate props
   */
  const navigateToRetryPayment = (order: Order) => {
    console.log('[usePaymentNavigation] Navegando para retry-payment com WhatsApp:', {
      whatsapp_number: order.whatsapp_number
    });
    
    navigate('/retry-payment', { 
      state: { 
        order,
        autoRetry: true,
        whatsapp_number: order.whatsapp_number || ''
      }
    });
  };

  /**
   * Navigate to home page with error message
   */
  const navigateToHomeWithError = (errorMessage: string) => {
    setTimeout(() => {
      navigate('/', {
        state: {
          errorMessage
        }
      });
    }, 2000);
  };

  return {
    navigateToSuccess,
    navigateToRetryPayment,
    navigateToHomeWithError
  };
};
