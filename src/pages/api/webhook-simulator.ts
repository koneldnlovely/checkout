
// Define a type for the expected payload structure
interface WebhookPayload {
  event?: string;
  payment?: {
    id: string;
    status: string;
  };
  orderId?: string; // Add orderId for manual card payments
  [key: string]: any; // Allow other properties
}

export async function handler(req: Request) {
  console.log('Webhook simulator API called');

  try {
    // Parse the request body and type cast it
    const rawPayload = await req.json();
    const payload = rawPayload as WebhookPayload;
    console.log('Webhook simulator payload:', payload);

    // We need to use a relative import path to avoid the vite error
    const { supabase } = await import('../../integrations/supabase/client');
    
    if (payload.event && payload.payment) {
      // Check if this is a manual card payment (special case)
      const isManualCardPayment = payload.payment.id === 'manual_card_payment' && payload.orderId;
      
      // Log payload details for debugging
      if (isManualCardPayment) {
        console.log(`Processing manual card webhook for order ${payload.orderId} with event ${payload.event}`);
      } else {
        console.log(`Processing webhook for payment ${payload.payment.id} with event ${payload.event} and status ${payload.payment.status}`);
      }
      
      const newStatus = payload.payment.status;
      const updateTimestamp = new Date().toISOString();
      
      // 1. Update order status - handle both asaas_payment_id and manual card (orderId)
      let orderQuery;
      
      if (isManualCardPayment && payload.orderId) {
        // For manual card payments, use the orderId directly
        orderQuery = supabase
          .from('orders')
          .update({ 
            status: newStatus,
            updated_at: updateTimestamp
          })
          .eq('id', payload.orderId)
          .select();
      } else {
        // For regular Asaas payments, use the payment_id
        orderQuery = supabase
          .from('orders')
          .update({ 
            status: newStatus,
            updated_at: updateTimestamp
          })
          .eq('asaas_payment_id', payload.payment.id)
          .select();
      }
      
      const { data: orderData, error: orderError } = await orderQuery;

      if (orderError) {
        console.error('Error updating order:', orderError);
        return new Response(
          JSON.stringify({ 
            message: 'Error updating order', 
            error: orderError.message 
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      console.log('Successfully updated order:', orderData);
      
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
          console.log('Note: Could not update asaas_payments table:', paymentsError.message);
        } else {
          console.log('Successfully updated asaas_payments table');
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

      // Add CORS headers for browser compatibility
      const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      };

      return new Response(
        JSON.stringify({ 
          message: 'Webhook processed successfully',
          updatedOrder: orderData,
          timestamp: updateTimestamp,
          isManualCard: isManualCardPayment,
          event: payload.event
        }),
        {
          status: 200,
          headers: headers,
        }
      );
    } else {
      return new Response(
        JSON.stringify({ message: 'Invalid webhook payload' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ 
        message: 'Error processing webhook', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
