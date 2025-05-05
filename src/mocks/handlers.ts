
import { PaymentStatus } from "@/types/checkout";

// Mock Asaas API response data with all necessary fields
export const mockAsaasPaymentResponse = {
  paymentId: 'mock_payment_123',
  qrCode: '00020101021226890014br.gov.bcb.pix2554qrcodepix.exemplo.bcb.gov.br/teste12345678901234567890204000053039865802BR5924Mock Pagador6009Sao Paulo62070503***6304B13E',
  qrCodeImage: '/placeholder.svg', // Use local placeholder SVG
  qrCodeImageUrl: '/placeholder.svg', // Use local placeholder SVG
  copyPasteKey: '00020101021226890014br.gov.bcb.pix2554qrcodepix.exemplo.bcb.gov.br/teste12345678901234567890204000053039865802BR5924Mock Pagador6009Sao Paulo62070503***6304B13E',
  expirationDate: new Date(Date.now() + 30 * 60000).toISOString(), // 30 minutes from now
  status: 'PENDING' as PaymentStatus,
};

// Handler function for mock Asaas payment API
export async function mockAsaasPaymentHandler(req: Request) {
  // Log the request for debugging
  console.log('Mock payment API request received:', req.url, req.method);
  
  try {
    // Parse the request body if it exists
    const body = req.method === 'POST' ? await req.json() : null;
    console.log('Request body:', body);
    
    // Generate a unique payment ID with prefix and timestamp
    const uniquePaymentId = `pay_${Math.random().toString(36).substring(2, 12)}`;
    
    // Create a new response with dynamic expiration date
    const responseData = {
      ...mockAsaasPaymentResponse,
      payment: {
        id: uniquePaymentId,
        status: 'PENDING'
      },
      paymentId: uniquePaymentId,
      qrCodeImage: '/placeholder.svg',
      qrCodeImageUrl: '/placeholder.svg',
      expirationDate: new Date(Date.now() + 30 * 60000).toISOString(),
      value: body?.value || 99.90,
      description: body?.description || 'Pagamento de teste'
    };
    
    // Return mock response
    return new Response(
      JSON.stringify(responseData),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in mock handler:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// Check payment status mock handler
export async function mockCheckPaymentStatusHandler(req: Request) {
  try {
    // Extract payment ID from URL
    const url = new URL(req.url);
    const paymentId = url.searchParams.get('paymentId');
    
    console.log('Mock payment status check for ID:', paymentId);
    
    if (!paymentId) {
      return new Response(
        JSON.stringify({ error: 'Missing payment ID' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    
    // Get latest status from Supabase if connected
    try {
      const { supabase } = await import('../integrations/supabase/client');
      
      // Check orders table first (most up-to-date)
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('status')
        .eq('asaas_payment_id', paymentId)
        .maybeSingle();
        
      if (!orderError && orderData?.status) {
        console.log(`Found payment status in database: ${orderData.status}`);
        
        return new Response(
          JSON.stringify({
            status: orderData.status,
            paymentId: paymentId,
            updatedAt: new Date().toISOString()
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
      
      // Try asaas_payments table as fallback
      const { data: paymentData, error: paymentError } = await supabase
        .from('asaas_payments')
        .select('status')
        .eq('payment_id', paymentId)
        .maybeSingle();
        
      if (!paymentError && paymentData?.status) {
        console.log(`Found payment status in asaas_payments table: ${paymentData.status}`);
        
        return new Response(
          JSON.stringify({
            status: paymentData.status,
            paymentId: paymentId,
            updatedAt: new Date().toISOString()
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
    } catch (error) {
      console.log('Could not check Supabase for status:', error);
    }
    
    // If we couldn't find status in database or there was an error, use default
    return new Response(
      JSON.stringify({ 
        status: 'PENDING',
        paymentId: paymentId,
        updatedAt: new Date().toISOString()
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in mock status check handler:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
