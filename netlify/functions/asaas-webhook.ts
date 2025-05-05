import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { sendTelegramNotification } from './telegram-notification';
import { sendEmail } from './sendEmail';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
        const formattedValue = new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(payload.payment.value);

        const customerName = orderData?.customer_name || 'Cliente';

        await sendTelegramNotification(`✅ <b>Pagamento Confirmado!</b>\n\n📋 <b>Pedido:</b> ${orderData.id}\n👤 <b>Cliente:</b> ${customerName}\n💰 <b>Valor:</b> ${formattedValue}\n🛒 <b>Produto:</b> ${orderData.product_name}`);

        // Gerar senha numérica aleatória de 8 dígitos
        const generatedPassword = Math.floor(10000000 + Math.random() * 90000000).toString();

        // Criar usuário no Supabase
        await supabase.from('users').insert({
          email: orderData.customer_email,
          name: orderData.customer_name,
          password: generatedPassword
        });

        // Buscar o link de entrega do produto
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('delivery_url')
          .eq('id', orderData.product_id)
          .single();

        if (productError || !productData?.delivery_url) {
          console.warn('Produto sem link de entrega configurado');
        } else {
          const deliveryUrl = `${productData.delivery_url}?email=${encodeURIComponent(orderData.customer_email)}`;

          await sendEmail({
            to: orderData.customer_email,
            subject: '✅ Acesso ao seu produto foi liberado!',
            html: `
              <h2>Olá, ${orderData.customer_name}!</h2>
              <p>Seu pagamento foi confirmado com sucesso.</p>
              <p>Acesse seu produto clicando no botão abaixo:</p>
              <p style="margin-top:16px;">
                <a href="${deliveryUrl}" target="_blank" style="padding: 12px 24px; background-color: #22c55e; color: white; text-decoration: none; border-radius: 6px;">
                  Acessar agora
                </a>
              </p>
              <p style="margin-top: 24px;"><strong>Usuário:</strong> ${orderData.customer_email}<br><strong>Senha:</strong> ${generatedPassword}</p>
              <p style="margin-top: 24px;">Qualquer dúvida, estamos à disposição no WhatsApp!</p>
            `
          });
        }

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