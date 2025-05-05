import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from './sendEmail';
import { sendTelegramNotification } from './telegram-notification';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Método não permitido. Use POST.' }),
    };
  }

  try {
    const { orderId } = JSON.parse(event.body || '{}');
    if (!orderId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'orderId é obrigatório.' }),
      };
    }

    // Buscar pedido
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Pedido não encontrado.' }),
      };
    }

    // Atualizar status do pedido para CONFIRMED
    await supabase
      .from('orders')
      .update({ status: 'CONFIRMED', updated_at: new Date().toISOString() })
      .eq('id', orderId);

    // Criar senha aleatória de 8 dígitos
    const password = Math.floor(10000000 + Math.random() * 90000000).toString();

    // Criar usuário
    await supabase.from('users').insert({
      email: order.customer_email,
      name: order.customer_name,
      password,
    });

    // Buscar URL de entrega do produto
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('delivery_url')
      .eq('id', order.product_id)
      .single();

    const deliveryUrl = product?.delivery_url
      ? `${product.delivery_url}?email=${encodeURIComponent(order.customer_email)}`
      : null;

    // Enviar email
    await sendEmail({
      to: order.customer_email,
      subject: '✅ Acesso ao seu produto foi liberado!',
      html: `
        <h2>Olá, ${order.customer_name}!</h2>
        <p>Seu pagamento foi confirmado com sucesso.</p>
        <p>Acesse seu produto clicando no botão abaixo:</p>
        <p style="margin-top:16px;">
          <a href="${deliveryUrl}" target="_blank" style="padding: 12px 24px; background-color: #22c55e; color: white; text-decoration: none; border-radius: 6px;">
            Acessar agora
          </a>
        </p>
        <p style="margin-top: 24px;"><strong>Usuário:</strong> ${order.customer_email}<br><strong>Senha:</strong> ${password}</p>
        <p style="margin-top: 24px;">Qualquer dúvida, estamos à disposição no WhatsApp!</p>
      `,
    });

    // Notificação Telegram
    const formattedValue = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(order.product_price);

    await sendTelegramNotification(`✅ <b>Pagamento Confirmado (Cartão)</b>
    
📋 <b>Pedido:</b> ${order.id}
👤 <b>Cliente:</b> ${order.customer_name}
💰 <b>Valor:</b> ${formattedValue}
🛒 <b>Produto:</b> ${order.product_name}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Pagamento finalizado com sucesso.' }),
    };
  } catch (error) {
    console.error('[finalize-card-payment] Erro:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Erro ao finalizar pagamento.' }),
    };
  }
};
