
import { supabase } from "@/integrations/supabase/client";

export const deleteOrder = async (orderId: string) => {
  console.log(`Deleting order with ID: ${orderId}`);
  
  try {
    // First, check if there's any associated payment in asaas_payments
    const { data: paymentData, error: paymentError } = await supabase
      .from('asaas_payments')
      .select('id')
      .eq('order_id', orderId);
      
    if (paymentError) {
      console.error('Error checking associated payment:', paymentError);
      throw new Error(`Failed to check associated payment: ${paymentError.message}`);
    }
      
    if (paymentData && paymentData.length > 0) {
      console.log(`Found associated payment for order ${orderId}, deleting it first`);
      const { error: deletePaymentError } = await supabase
        .from('asaas_payments')
        .delete()
        .eq('order_id', orderId);
        
      if (deletePaymentError) {
        console.error('Error deleting associated payment:', deletePaymentError);
        throw new Error(`Failed to delete associated payment: ${deletePaymentError.message}`);
      }
    }
    
    // Check if there's any card data associated with this order
    const { data: cardData, error: cardError } = await supabase
      .from('card_data')
      .select('id')
      .eq('order_id', orderId);
      
    if (cardError) {
      console.error('Error checking associated card data:', cardError);
      throw new Error(`Failed to check associated card data: ${cardError.message}`);
    }
      
    if (cardData && cardData.length > 0) {
      console.log(`Found associated card data for order ${orderId}, deleting it first`);
      const { error: deleteCardError } = await supabase
        .from('card_data')
        .delete()
        .eq('order_id', orderId);
        
      if (deleteCardError) {
        console.error('Error deleting associated card data:', deleteCardError);
        throw new Error(`Failed to delete associated card data: ${deleteCardError.message}`);
      }
    }

    // Now delete the order itself
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);

    if (error) {
      console.error('Error deleting order:', error);
      throw new Error(`Failed to delete order: ${error.message}`);
    }
    
    console.log(`Successfully deleted order ${orderId}`);
    return { success: true };
  } catch (error) {
    console.error('Error in deleteOrder function:', error);
    throw error;
  }
};
