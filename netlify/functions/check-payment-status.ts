
import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

export const handler: Handler = async (event) => {
  // Verificar se o método é GET
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Método não permitido. Use GET.' }),
    };
  }

  // Obter o ID do pagamento da query string
  const paymentId = event.queryStringParameters?.paymentId;
  
  if (!paymentId) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'ID do pagamento não fornecido.' }),
    };
  }

  try {
    // Inicializar cliente Supabase
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Credenciais do Supabase não configuradas');
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Erro de configuração do servidor' }),
      };
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Obter a configuração do Asaas
    console.log('Buscando configuração do Asaas do banco de dados...');
    const { data: asaasConfig, error: configError } = await supabase
      .from('asaas_config')
      .select('*')
      .limit(1)
      .single();
      
    if (configError) {
      console.error('Erro ao buscar configuração do Asaas:', configError);
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Erro ao buscar configuração do gateway de pagamento' }),
      };
    }
    
    // Determinar qual chave API usar com base no modo (sandbox/produção)
    const usesSandbox = asaasConfig.sandbox === true;
    const asaasApiKey = usesSandbox ? asaasConfig.sandbox_key : asaasConfig.production_key;
    
    const apiUrl = usesSandbox 
      ? 'https://sandbox.asaas.com/api/v3' 
      : 'https://www.asaas.com/api/v3';
    
    console.log(`Modo: ${usesSandbox ? 'Sandbox' : 'Produção'}`);
    console.log(`API URL: ${apiUrl}`);
    console.log(`Chave API definida: ${asaasApiKey ? 'Sim' : 'Não'}`);
    
    if (!asaasApiKey) {
      console.error(`Chave de API ${usesSandbox ? 'sandbox' : 'produção'} não configurada`);
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: `Chave de API ${usesSandbox ? 'sandbox' : 'produção'} não configurada` }),
      };
    }

    // Consultar o status do pagamento no Asaas
    console.log(`Consultando status do pagamento ${paymentId} no Asaas...`);
    console.log(`URL: ${apiUrl}/payments/${paymentId}`);
    
    const response = await fetch(`${apiUrl}/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'access_token': asaasApiKey,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
    
    if (!response.ok) {
      const statusText = response.statusText;
      const status = response.status;
      console.error(`Erro na resposta do Asaas: ${status} - ${statusText}`);
      
      let errorText;
      try {
        errorText = await response.text();
      } catch (e) {
        errorText = 'Não foi possível obter texto de erro';
      }
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText };
      }
      
      console.error('Erro detalhado:', errorData);
      throw new Error(`Erro ao consultar pagamento no Asaas: ${JSON.stringify(errorData)}`);
    }
    
    const paymentData = await response.json();
    const status = paymentData.status;
    
    console.log(`Payment status from Asaas API: ${status} for payment ${paymentId}`);
    
    // Atualizar o status do pagamento no Supabase
    const { data: asaasPayment, error: findError } = await supabase
      .from('asaas_payments')
      .select('order_id')
      .eq('payment_id', paymentId)
      .single();
    
    if (findError) {
      console.error('Erro ao buscar pagamento no Supabase:', findError);
    } else if (asaasPayment) {
      // Atualizar o status na tabela asaas_payments
      const { error: updatePaymentError } = await supabase
        .from('asaas_payments')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('payment_id', paymentId);
      
      if (updatePaymentError) {
        console.error('Erro ao atualizar status do pagamento:', updatePaymentError);
      } else {
        console.log(`Updated asaas_payments status to ${status}`);
      }
      
      // Atualizar o status na tabela orders
      const { error: updateOrderError } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', asaasPayment.order_id);
      
      if (updateOrderError) {
        console.error('Erro ao atualizar status do pedido:', updateOrderError);
      } else {
        console.log(`Updated orders status to ${status} for order ${asaasPayment.order_id}`);
      }
    }
    
    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      },
      body: JSON.stringify({
        paymentId,
        status,
        updatedAt: new Date().toISOString()
      }),
    };
    
  } catch (error) {
    console.error('Erro na função:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message || 'Erro interno no servidor' }),
    };
  }
}
