
import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { validateEnvironmentVariables, parseAndValidateRequestData, createErrorResponse } from './asaas/validation';
import { processPaymentFlow } from './asaas/payment-processor';

export const handler: Handler = async (event) => {
  try {
    // Validate HTTP method
    if (event.httpMethod !== 'POST') {
      return createErrorResponse(405, 'Método não permitido. Use POST.');
    }

    // Initialize Supabase client with environment variables
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Credenciais do Supabase não configuradas');
      return createErrorResponse(500, 'Erro de configuração do servidor');
    }
    
    console.log('Inicializando cliente Supabase...');
    console.log(`URL Supabase: ${supabaseUrl.substring(0, 10)}...`);
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Obter a configuração do Asaas do banco de dados
    console.log('Buscando configuração do Asaas do banco de dados...');
    const { data: asaasConfig, error: configError } = await supabase
      .from('asaas_config')
      .select('*')
      .limit(1)
      .single();
      
    if (configError) {
      console.error('Erro ao buscar configuração do Asaas:', configError);
      return createErrorResponse(500, 'Erro ao buscar configuração do gateway de pagamento');
    }
    
    if (!asaasConfig) {
      console.error('Configuração do Asaas não encontrada');
      return createErrorResponse(500, 'Configuração do gateway de pagamento não encontrada');
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
      const modoAtual = usesSandbox ? 'sandbox' : 'produção';
      console.error(`Chave de API ${modoAtual} não configurada`);
      return createErrorResponse(500, `Chave de API ${modoAtual} não configurada. Por favor, configure a chave ${modoAtual} no painel administrativo.`);
    }

    // Log do corpo da requisição para inspeção
    console.log('Corpo da requisição recebida:', event.body);
    
    // Parse and validate request data
    const requestData = parseAndValidateRequestData(event);
    console.log('Dados processados e validados:', requestData);

    // Main process flow
    try {
      const result = await processPaymentFlow(requestData, asaasApiKey, supabase, apiUrl);
      
      // Return successful response
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result),
      };
    } catch (processingError) {
      console.error('Erro no processamento do pagamento:', processingError);
      
      let errorMessage = 'Erro ao processar o pagamento';
      if (processingError.name === 'AsaasApiError') {
        errorMessage = processingError.message;
        
        // Log de detalhes específicos para diagnóstico
        if (processingError.details) {
          console.error('Detalhes do erro da API Asaas:', JSON.stringify(processingError.details, null, 2));
          
          // Se houver mensagens de erro específicas da API, incluí-las na resposta
          if (processingError.details.errors && Array.isArray(processingError.details.errors)) {
            const errorDetails = processingError.details.errors.map(e => e.description || e.message).join('; ');
            errorMessage += `: ${errorDetails}`;
          }
        }
      }
      
      return createErrorResponse(500, errorMessage);
    }
  } catch (error) {
    console.error('Erro na função:', error);
    
    // Create appropriate error response
    return createErrorResponse(
      error instanceof Error && error.name === 'ConfigurationError' ? 400 : 500,
      error.message || 'Erro interno no servidor',
      process.env.NODE_ENV === 'development' ? error.stack : undefined
    );
  }
};
