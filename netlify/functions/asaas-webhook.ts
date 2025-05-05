
import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

// Inicializar cliente Supabase
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Definir tipos para o payload do webhook
interface AsaasWebhookPayload {
  event: string;
  payment: {
    id: string;
    status: string;
    value: number;
    dateCreated: string;
    invoiceUrl?: string;
    billingType: string;
    externalReference?: string;
  };
}

// Email para notificações administrativas
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';

// Função para enviar email de notificação
async function sendAdminNotification(payload: AsaasWebhookPayload, orderDetails: any) {
  try {
    // Verificar se o status é CONFIRMED e se temos um email de administrador
    if (payload.payment.status !== 'CONFIRMED' || !ADMIN_EMAIL) {
      return;
    }

    const formattedValue = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(payload.payment.value);

    const customerName = orderDetails?.customer_name || 'Cliente';
    const productName = orderDetails?.product_name || 'Produto';
    const paymentMethod = orderDetails?.payment_method || 'Desconhecido';

    // Enviar email via Netlify Function
    const emailResponse = await fetch('/.netlify/functions/send-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: ADMIN_EMAIL,
        subject: `🎉 Pagamento Confirmado: ${formattedValue}`,
        message: `
          <h2>Novo pagamento confirmado!</h2>
          <p><strong>Cliente:</strong> ${customerName}</p>
          <p><strong>Produto:</strong> ${productName}</p>
          <p><strong>Valor:</strong> ${formattedValue}</p>
          <p><strong>Método:</strong> ${paymentMethod}</p>
          <p><strong>ID Asaas:</strong> ${payload.payment.id}</p>
          <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
        `
      })
    });

    if (!emailResponse.ok) {
      console.error('Erro ao enviar notificação por email:', await emailResponse.text());
    } else {
      console.log('Notificação de pagamento enviada com sucesso para', ADMIN_EMAIL);
    }
  } catch (error) {
    console.error('Erro ao enviar notificação:', error);
  }
}

import { sendTelegramNotification } from './telegram-notification';

export const handler: Handler = async (event) => {
  // Garantir que apenas solicitações POST sejam processadas
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Método não permitido' }),
    };
  }

  try {
    // Parsear o corpo da requisição
    const payload: AsaasWebhookPayload = JSON.parse(event.body || '{}');
    
    console.log('Webhook recebido do Asaas:', payload);

    // Verificar se o evento é relacionado a pagamento
    if (payload.event && payload.payment) {
      // Buscar detalhes do pedido para a notificação
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('asaas_payment_id', payload.payment.id)
        .single();

      if (orderError) {
        console.error('Erro ao buscar detalhes do pedido:', orderError);
      }

      // Atualizar o status do pedido no Supabase
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: payload.payment.status,
          updated_at: new Date().toISOString()
        })
        .eq('asaas_payment_id', payload.payment.id);

      if (error) {
        console.error('Erro ao atualizar pedido:', error);
        return {
          statusCode: 500,
          body: JSON.stringify({ message: 'Erro ao processar webhook' }),
        };
      }

      // Registrar o evento do webhook
      await supabase
        .from('asaas_webhook_logs')
        .insert({
          event_type: payload.event,
          payment_id: payload.payment.id,
          status: payload.payment.status,
          payload: payload
        });

      // Enviar notificação para o administrador se o status for CONFIRMED
      if (payload.payment.status === 'CONFIRMED') {
        await sendAdminNotification(payload, orderData);
        
        // Enviar notificação via Telegram
        const formattedValue = new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(payload.payment.value);
        
        const customerName = orderData?.customer_name || 'Cliente';
        
        await sendTelegramNotification(
          `✅ <b>Pagamento Confirmado!</b>
           
📋 <b>Pedido:</b> ${orderData.id}
👤 <b>Cliente:</b> ${customerName}
💰 <b>Valor:</b> ${formattedValue}
🛒 <b>Produto:</b> ${orderData.product_name}`
        );
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Webhook processado com sucesso' }),
    };
  } catch (error) {
    console.error('Erro no processamento do webhook:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Erro interno do servidor' }),
    };
  }
};
