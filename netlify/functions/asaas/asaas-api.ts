
import { 
  AsaasCustomerRequest, 
  AsaasCustomerResponse, 
  AsaasPaymentResponse,
  AsaasPixQrCodeResponse,
  AsaasApiError
} from './types';

export async function createAsaasCustomer(
  data: AsaasCustomerRequest, 
  apiKey: string,
  apiUrl: string = 'https://sandbox.asaas.com/api/v3'
): Promise<AsaasCustomerResponse> {
  // Format phone: remove all non-numeric characters
  const formattedPhone = data.phone.replace(/\D/g, '');
  
  const customerData = {
    name: data.name,
    cpfCnpj: data.cpfCnpj.replace(/\D/g, ''), // Remove non-numeric characters
    email: data.email,
    phone: formattedPhone,
    mobilePhone: formattedPhone,
    notificationDisabled: false
  };
  
  try {
    console.log(`Enviando requisição para ${apiUrl}/customers`);
    console.log('Dados do cliente:', customerData);
    console.log('Usando chave API:', apiKey ? `${apiKey.substring(0, 8)}...` : 'Não definida');
    
    const response = await fetch(`${apiUrl}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': apiKey
      },
      body: JSON.stringify(customerData)
    });
    
    const statusText = response.statusText;
    const status = response.status;
    console.log(`Resposta da API: ${status} - ${statusText}`);
    
    if (!response.ok) {
      const errorResponse = await handleApiError(response, 'criar cliente no Asaas');
      throw new AsaasApiError(`Erro ao criar cliente no Asaas: ${errorResponse.message || statusText}`, errorResponse);
    }
    
    const responseData = await response.json();
    console.log('Cliente criado com sucesso:', responseData.id);
    return responseData;
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    throw error;
  }
}

export async function createAsaasPayment(
  customerId: string, 
  value: number, 
  description: string,
  externalReference: string,
  apiKey: string,
  apiUrl: string = 'https://sandbox.asaas.com/api/v3'
): Promise<AsaasPaymentResponse> {
  // Set due date to today
  const today = new Date();
  const dueDate = today.toISOString().split('T')[0]; // Format YYYY-MM-DD
  
  const paymentData = {
    customer: customerId,
    billingType: 'PIX',
    value: value,
    dueDate: dueDate,
    description: description,
    externalReference: externalReference,
    postalService: false
  };
  
  try {
    console.log(`Enviando requisição para ${apiUrl}/payments`);
    console.log('Dados do pagamento:', paymentData);
    console.log('Usando chave API:', apiKey ? `${apiKey.substring(0, 8)}...` : 'Não definida');
    
    const response = await fetch(`${apiUrl}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': apiKey
      },
      body: JSON.stringify(paymentData)
    });
    
    const statusText = response.statusText;
    const status = response.status;
    console.log(`Resposta da API (pagamento): ${status} - ${statusText}`);
    
    if (!response.ok) {
      const errorResponse = await handleApiError(response, 'criar pagamento PIX no Asaas');
      throw new AsaasApiError(`Erro ao criar pagamento PIX no Asaas: ${errorResponse.message || statusText}`, errorResponse);
    }
    
    const responseData = await response.json();
    console.log('Pagamento criado com sucesso:', responseData.id);
    return responseData;
  } catch (error) {
    console.error('Erro ao criar pagamento:', error);
    throw error;
  }
}

export async function getAsaasPixQrCode(
  paymentId: string, 
  apiKey: string,
  apiUrl: string = 'https://sandbox.asaas.com/api/v3'
): Promise<AsaasPixQrCodeResponse> {
  try {
    console.log(`Requesting QR code for payment ID: ${paymentId}`);
    console.log(`API URL: ${apiUrl}/payments/${paymentId}/pixQrCode`);
    console.log('Usando chave API:', apiKey ? `${apiKey.substring(0, 8)}...` : 'Não definida');
    
    const response = await fetch(`${apiUrl}/payments/${paymentId}/pixQrCode`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'access_token': apiKey
      }
    });
    
    const statusText = response.statusText;
    const status = response.status;
    console.log(`Resposta da API (QR Code): ${status} - ${statusText}`);
    
    if (!response.ok) {
      const errorResponse = await handleApiError(response, 'buscar QR Code PIX');
      throw new AsaasApiError(`Erro ao buscar QR Code PIX: ${errorResponse.message || statusText}`, errorResponse);
    }
    
    const data = await response.json();
    
    // Log information about the QR code
    console.log(`QR code received successfully. Encoded image length: ${data.encodedImage ? data.encodedImage.length : 0}`);
    
    return data;
  } catch (error) {
    console.error('Erro ao buscar QR Code:', error);
    throw error;
  }
}

export async function handleApiError(response: Response, operation: string) {
  let errorText;
  try {
    errorText = await response.text();
    console.log(`Texto de erro completo para ${operation}:`, errorText);
  } catch (e) {
    errorText = `Não foi possível obter texto de erro: ${e.message}`;
  }
  
  let errorData;
  
  try {
    errorData = JSON.parse(errorText);
  } catch (e) {
    errorData = { message: errorText };
  }
  
  console.error(`Erro ao ${operation}:`, {
    status: response.status,
    statusText: response.statusText,
    errorData: errorData
  });
  
  // Log more detailed information for debugging
  if (errorData && errorData.errors) {
    console.error('Detalhes específicos dos erros:', errorData.errors);
  }
  
  return errorData;
}
