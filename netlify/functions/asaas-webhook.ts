import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { sendTelegramNotification } from './telegram-notification';

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

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';

// Função para enviar email de notificação
async function sendAdminNotification(payload: AsaasWebhookPayload, orderDetails: any) {
  try {
    if (payload.payment.status !== 'CONFIRMED' || !ADMIN_EMAIL) return;

    const formattedValue = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(payload.payment.value);

    const customerName = orderDetails?.customer_name || 'Cliente';
    const productName = orderDetails?.product_name || 'Produto';
    const paymentMethod = orderDetails?.payment_method || 'Desconhecido';

    const emailResponse = await fetch('/.netlify/functions/send-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Método não permitido' })
    };
  }

  try {
    const payload: AsaasWebhookPayload = JSON.parse(event.body || '{}');
    console.log('Webhook recebido do Asaas:', payload);

    if (payload.event && payload.payment) {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('asaas_payment_id', payload.payment.id)
        .single();

      if (orderError) {
        console.error('Erro ao buscar detalhes do pedido:', orderError);
      }

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
          body: JSON.stringify({ message: 'Erro ao processar webhook' })
        };
      }

      await supabase.from('asaas_webhook_logs').insert({
        event_type: payload.event,
        payment_id: payload.payment.id,
        status: payload.payment.status,
        payload: payload
      });

      if (payload.payment.status === 'CONFIRMED') {
        await sendAdminNotification(payload, orderData);

        const formattedValue = new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(payload.payment.value);

        const customerName = orderData?.customer_name || 'Cliente';

        await sendTelegramNotification(`✅ <b>Pagamento Confirmado!</b>

📋 <b>Pedido:</b> ${orderData.id}
👤 <b>Cliente:</b> ${customerName}
💰 <b>Valor:</b> ${formattedValue}
🛒 <b>Produto:</b> ${orderData.product_name}`);

        // Enviar conversão para UTMFY
        try {
          const utmfyToken = process.env.UTMFY_API_KEY;

          if (!utmfyToken) {
            console.warn('UTMFY_API_KEY não definido nas variáveis de ambiente');
          } else {
            const conversionPayload = {
              order_id: orderData.id,
              value: orderData.product_price,
              currency: 'BRL',
              utm_source: orderData.utm_source,
              utm_medium: orderData.utm_medium,
              utm_campaign: orderData.utm_campaign,
              utm_term: orderData.utm_term,
              utm_content: orderData.utm_content
            };

            const utmfyRes = await fetch('https://utmfy.com/api/track', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${utmfyToken}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(conversionPayload)
            });

            if (!utmfyRes.ok) {
              const errText = await utmfyRes.text();
              console.error('Erro ao enviar conversão para UTMFY:', errText);
            } else {
              console.log('Conversão enviada para UTMFY com sucesso');
            }
          }
        } catch (utmfyErr) {
          console.error('Erro no envio da conversão para UTMFY:', utmfyErr);
        }
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Webhook processado com sucesso' })
    };
  } catch (error) {
    console.error('Erro no processamento do webhook:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Erro interno do servidor' })
    };
  }
};