
import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { sendTelegramNotification } from './telegram-notification';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Define the type for the expected payload structure
interface WebhookPayload {
  event?: string;
  payment?: {
    id: string;
    status: string;
  };
  orderId?: string; // Add orderId for manual card payments
  [key: string]: any; // Allow other properties
}

// Email para notificações administrativas
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';

// Função para enviar email de notificação
async function sendAdminNotification(payment: any, orderData: any) {
  try {
    // Verificar se o status é CONFIRMED e se temos um email de administrador
    if (payment.status !== 'CONFIRMED' || !ADMIN_EMAIL) {
      return;
    }

    const formattedValue = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(orderData?.product_price || 0);

    const customerName = orderData?.customer_name || 'Cliente';
    const productName = orderData?.product_name || 'Produto';
    const paymentMethod = orderData?.payment_method || 'Desconhecido';

    // Enviar email via Netlify Function
    try {
      const emailResponse = await fetch('/.netlify/functions/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: ADMIN_EMAIL,
          subject: `🎉 [SIMULADO] Pagamento Confirmado: ${formattedValue}`,
          message: `
            <h2>Novo pagamento confirmado (simulado)!</h2>
            <p><strong>Cliente:</strong> ${customerName}</p>
            <p><strong>Produto:</strong> ${productName}</p>
            <p><strong>Valor:</strong> ${formattedValue}</p>
            <p><strong>Método:</strong> ${paymentMethod}</p>
            <p><strong>ID Pagamento:</strong> ${payment.id}</p>
            <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
            <p><em>Este é um pagamento simulado através do painel de administração.</em></p>
          `
        })
      });

      if (!emailResponse.ok) {
        console.error('Erro ao enviar notificação por email (simulação):', await emailResponse.text());
      } else {
        console.log('Notificação de pagamento simulado enviada com sucesso para', ADMIN_EMAIL);
      }
    } catch (error) {
      console.error('Erro ao enviar notificação de simulação:', error);
    }
  } catch (error) {
    console.error('Erro ao enviar notificação:', error);
  }
}

export const handler: Handler = async (event) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  console.log('[AUDIT] Webhook simulator function called');

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  try {
    // Parse the request body
    const payload = JSON.parse(event.body || '{}') as WebhookPayload;
    console.log('[AUDIT] Webhook simulator payload:', payload);

    if (payload.event && payload.payment) {
      // Check if this is a manual card payment (special case)
      const isManualCardPayment = payload.payment.id === 'manual_card_payment' && payload.orderId;
      
      // Log payload details for debugging
      if (isManualCardPayment) {
        console.log(`[AUDIT] Processing manual card webhook for order ${payload.orderId} with event ${payload.event}`);
      } else {
        console.log(`[AUDIT] Processing webhook for payment ${payload.payment.id} with event ${payload.event} and status ${payload.payment.status}`);
      }
      
      const newStatus = payload.payment.status;
      const updateTimestamp = new Date().toISOString();
      
      // 1. Update order status - handle both asaas_payment_id and manual card (orderId)
      let orderData;
      let orderError;
      
      if (isManualCardPayment && payload.orderId) {
        // For manual card payments, use the orderId directly
        const result = await supabase
          .from('orders')
          .update({ 
            status: newStatus,
            updated_at: updateTimestamp
          })
          .eq('id', payload.orderId)
          .select();
          
        orderData = result.data;
        orderError = result.error;
      } else {
        // For regular Asaas payments, use the payment_id
        const result = await supabase
          .from('orders')
          .update({ 
            status: newStatus,
            updated_at: updateTimestamp
          })
          .eq('asaas_payment_id', payload.payment.id)
          .select();
          
        orderData = result.data;
        orderError = result.error;
      }

      if (orderError) {
        console.error('[AUDIT] Error updating order:', orderError);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ 
            message: 'Error updating order', 
            error: orderError.message 
          })
        };
      }

      console.log('[AUDIT] Successfully updated order:', orderData);
      
      // 2. Update asaas_payments table if it exists and if this is not a manual card payment
      if (!isManualCardPayment) {
        const { error: paymentsError } = await supabase
          .from('asaas_payments')
          .update({ 
            status: newStatus,
            updated_at: updateTimestamp
          })
          .eq('payment_id', payload.payment.id);
          
        if (paymentsError) {
          console.log('[AUDIT] Note: Could not update asaas_payments table:', paymentsError.message);
        } else {
          console.log('[AUDIT] Successfully updated asaas_payments table');
        }
      }

      // 3. Log the webhook event
      await supabase
        .from('asaas_webhook_logs')
        .insert({
          event_type: payload.event,
          payment_id: isManualCardPayment ? `manual_${payload.orderId}` : payload.payment.id,
          status: newStatus,
          payload: payload
        });

      // 4. Send Telegram notification if status is CONFIRMED
      if (newStatus === 'CONFIRMED' && orderData && orderData.length > 0) {
        await sendAdminNotification(payload.payment, orderData[0]);
        
        // Send Telegram notification
        try {
          const order = orderData[0];
          const formattedValue = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(order?.product_price || 0);
          
          const paymentMethod = order.payment_method === 'pix' ? 'PIX' : 
                               order.payment_method === 'creditCard' ? 'Cartão de Crédito' : 
                               order.payment_method;
          
          const message = `✅ <b>Pagamento ${paymentMethod} Confirmado!</b>
           
📋 <b>Pedido:</b> ${order.id}
👤 <b>Cliente:</b> ${order.customer_name}
📱 <b>Telefone:</b> ${order.customer_phone || 'Não informado'}
📧 <b>Email:</b> ${order.customer_email || 'Não informado'}
💰 <b>Valor:</b> ${formattedValue}
🛒 <b>Produto:</b> ${order.product_name}

⏰ <b>Data:</b> ${new Date().toLocaleString('pt-BR')}`;
          
          await sendTelegramNotification(message);
          console.log('[AUDIT] Telegram notification sent for webhook event');
        } catch (notificationError) {
          console.error('[AUDIT] Error sending Telegram notification:', notificationError);
        }
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          message: 'Webhook processed successfully',
          updatedOrder: orderData,
          timestamp: updateTimestamp,
          isManualCard: isManualCardPayment,
          event: payload.event
        })
      };
    } else {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Invalid webhook payload' })
      };
    }
  } catch (error) {
    console.error('[AUDIT] Error processing webhook:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        message: 'Error processing webhook', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      })
    };
  }
};
