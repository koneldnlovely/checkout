
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { Order } from '@/types/checkout';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { validateOrderData, logPaymentError } from '@/utils/paymentErrorHandler';

interface RetryPaymentButtonProps {
  order: Order | null;
  isLoading: boolean;
}

const RetryPaymentButton: React.FC<RetryPaymentButtonProps> = ({ order, isLoading }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRetry = () => {
    const validation = validateOrderData(order);
    
    if (!validation.valid) {
      logPaymentError('RetryPaymentButton', validation.message, { orderId: order?.id });
      toast({
        title: "Erro",
        description: validation.message,
        variant: "destructive",
      });
      return;
    }

    console.log('[RetryPaymentButton] Navigating to retry-payment with order ID:', order!.id);
    
    // Create a simplified safe order object with only essential data
    const safeOrderData = {
      id: order!.id,
      customerId: order!.customerId || '',
      customerName: order!.customerName,
      customerEmail: order!.customerEmail,
      customerCpfCnpj: order!.customerCpfCnpj || '',
      customerPhone: order!.customerPhone || '',
      productId: order!.productId || '',
      productName: order!.productName || '',
      productPrice: order!.productPrice,
      status: order!.status || 'PENDING',
      paymentMethod: order!.paymentMethod || 'creditCard',
      createdAt: order!.createdAt,
      updatedAt: order!.updatedAt,
      // Only include these if they exist as primitive values
      has_whatsapp_support: typeof order!.has_whatsapp_support === 'boolean' ? order!.has_whatsapp_support : false,
      whatsapp_number: typeof order!.whatsapp_number === 'string' ? order!.whatsapp_number : ''
    };
    
    // Log the safe object for verification
    console.log('[RetryPaymentButton] Complete order object for retry:', safeOrderData);
    
    // Navigate with the safe order object in state AND include orderId in URL
    navigate(`/retry-payment?orderId=${order!.id}`, { 
      state: { 
        order: safeOrderData
      } 
    });
  };

  return (
    <Button 
      onClick={handleRetry} 
      className="w-full flex items-center gap-2 bg-green-500 hover:bg-green-600"
      variant="default"
      disabled={isLoading}
    >
      <RefreshCcw className="h-5 w-5" />
      Tentar com outro cartão
    </Button>
  );
};

export default RetryPaymentButton;
