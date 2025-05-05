import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { handleApiError } from '@/utils/errorHandling';
import { BillingData, PixPaymentData, Order } from '@/types/checkout';
import { generatePixPayment } from '@/services/asaasService';
import { usePixStatusTracker } from '@/hooks/usePixStatusTracker';
import { usePaymentPixelTracker } from '@/hooks/usePaymentPixelTracker';
import { supabaseClientService } from '@/services/supabaseClientService';

export const usePaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<PixPaymentData | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Use the extracted hooks
  const { paymentStatus, isCheckingStatus, refreshStatus } = usePixStatusTracker(paymentData, order);
  usePaymentPixelTracker(order, paymentData, paymentStatus);
  
  useEffect(() => {
    console.group('PaymentPage Hook Debug');
    console.log("Location state:", location.state);
    console.log("Initial states:", { loading, paymentData, order, error });
    
    const billingData = location.state?.billingData as BillingData;
    const orderData = location.state?.order as Order;
    
    console.log("Billing Data:", billingData);
    console.log("Order Data:", orderData);
    
    if (!billingData || !orderData) {
      console.error("Missing required data for payment page", { 
        hasBillingData: !!billingData, 
        hasOrderData: !!orderData 
      });
      
      toast({
        title: "Erro",
        description: "Informações de pagamento não encontradas. Por favor, volte e tente novamente.",
        variant: "destructive",
      });
      setTimeout(() => navigate('/'), 1500);
      console.groupEnd();
      return;
    }
    
    setOrder(orderData);
    
    const fetchPixPayment = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log("Generating PIX payment for order:", orderData.id);
        
        const formattedBillingData = {
          customer: {
            name: billingData.customer?.name || '',
            cpfCnpj: (billingData.customer?.cpfCnpj || '').replace(/[^0-9]/g, ''),
            email: billingData.customer?.email || '',
            phone: (billingData.customer?.phone || '').replace(/[^0-9]/g, '')
          },
          orderId: orderData.id || billingData.orderId || `ordem-${Date.now()}`,
          value: parseFloat(String(billingData.value)) || 0,
          description: billingData.description || `Pedido ${orderData.id || 'novo'}`
        };
        
        console.log("Formatted billing data:", formattedBillingData);
        
        // Adicionar validação dos dados formatados antes de chamar a API
        if (!formattedBillingData.customer.name || !formattedBillingData.customer.cpfCnpj) {
          throw new Error("Dados do cliente incompletos");
        }
        
        if (!formattedBillingData.value || formattedBillingData.value <= 0) {
          throw new Error("Valor do pagamento inválido");
        }
        
        const data = await generatePixPayment(formattedBillingData);
        console.log("Payment data received:", data);
        
        // Verificação explícita se temos dados válidos retornados
        if (!data || typeof data !== 'object') {
          console.error("API returned invalid data:", data);
          throw new Error("Resposta inválida da API de pagamento");
        }
        
        // Update the order with the Asaas payment ID if it was generated
        if (data.paymentId && orderData.id) {
          try {
            const { error: updateError } = await supabase
              .from('orders')
              .update({ asaas_payment_id: data.paymentId })
              .eq('id', orderData.id);
              
            if (updateError) {
              console.error('Error updating order with Asaas payment ID:', updateError);
            } else {
              console.log('Order updated with Asaas payment ID:', data.paymentId);
              // Update the local order state with the payment ID
              setOrder(prev => prev ? { ...prev, asaasPaymentId: data.paymentId } : null);
            }
          } catch (updateError) {
            console.error('Exception updating order with Asaas payment ID:', updateError);
          }
        }
        
        // Send notification to Telegram about the new PIX payment
        if (data && orderData) {
          try {
            await supabaseClientService.sendPixPaymentNotification(orderData, data);
          } catch (notificationError) {
            console.error('Error sending PIX notification:', notificationError);
            // Non-critical error, don't throw
          }
        }
        
        // Verificar se o QR code está no formato correto
        let fixedQrCodeImage = data.qrCodeImage || '';
        // Se temos QR code mas não começa com data:image, adicionar o prefixo
        if (fixedQrCodeImage && !fixedQrCodeImage.startsWith('data:image')) {
          console.log("QR code image is not in the expected format, attempting to fix");
          fixedQrCodeImage = `data:image/png;base64,${fixedQrCodeImage}`;
          console.log("Fixed QR code image by adding proper prefix");
        }
        
        // Ensure payment data has valid values for all required fields, especially value
        const safePaymentData = {
          ...data,
          qrCodeImage: fixedQrCodeImage,
          qrCode: data.qrCode || '',
          copyPasteKey: data.copyPasteKey || '',
          expirationDate: data.expirationDate || new Date(Date.now() + 30 * 60 * 1000).toISOString(),
          paymentId: data.paymentId || data.payment?.id || '',
          value: typeof data.value === 'number' ? data.value : 
                 typeof data.value === 'string' ? parseFloat(data.value) : 
                 formattedBillingData.value,
          description: data.description || formattedBillingData.description,
          status: data.status || 'PENDING'
        };
        
        console.log("Safe response data prepared:", { 
          paymentId: safePaymentData.paymentId,
          value: safePaymentData.value,
          valueType: typeof safePaymentData.value,
          hasQRCode: !!safePaymentData.qrCode,
          hasQRImage: !!safePaymentData.qrCodeImage
        });
        
        // Verificar explicitamente se o QR code foi gerado
        console.log("QR Code Image:", safePaymentData.qrCodeImage ? `Received (${safePaymentData.qrCodeImage.substring(0, 30)}...)` : "Not received");
        console.log("QR Code:", safePaymentData.qrCode ? `Received (${safePaymentData.qrCode.substring(0, 30)}...)` : "Not received");
        console.log("Copy Paste Key:", safePaymentData.copyPasteKey ? `Received (${safePaymentData.copyPasteKey.substring(0, 30)}...)` : "Not received");
        
        setPaymentData(safePaymentData);
        
        console.groupEnd();
      } catch (error) {
        console.error("Error generating payment:", error);
        const errorMessage = handleApiError(error, {
          defaultMessage: "Não foi possível gerar o pagamento PIX. Por favor, tente novamente."
        });
        setError(errorMessage);
        
        toast({
          title: "Erro ao gerar pagamento",
          description: errorMessage,
          variant: "destructive",
        });
        
        console.groupEnd();
      } finally {
        setLoading(false);
      }
    };
    
    fetchPixPayment();
  }, [location.state, navigate, toast]);
  
  // Debug what's being rendered
  console.log("Rendering PaymentPage:", { 
    loading, 
    hasPaymentData: !!paymentData, 
    hasOrder: !!order, 
    error,
    paymentValue: paymentData?.value,
    paymentValueType: paymentData ? typeof paymentData.value : 'undefined',
    paymentStatus
  });
  
  return { 
    loading, 
    paymentData, 
    order, 
    error,
    paymentStatus,
    isCheckingStatus,
    refreshStatus
  };
};
