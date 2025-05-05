
import { deleteOrder } from "./deleteOrder";
import { supabase } from "@/integrations/supabase/client";
import { DeleteOrderResult } from "./types";

export const deleteOrdersByPaymentMethod = async (
  paymentMethod: 'pix' | 'creditCard'
): Promise<DeleteOrderResult> => {
  console.log(`Deleting all orders with payment method: ${paymentMethod}`);
  
  try {
    // First, get all the order IDs with this payment method
    const { data: orders, error: fetchError } = await supabase
      .from('orders')
      .select('id, asaas_payment_id')
      .eq('payment_method', paymentMethod);
      
    if (fetchError) {
      console.error('Error fetching orders to delete:', fetchError);
      throw new Error(`Failed to fetch orders to delete: ${fetchError.message}`);
    }
    
    if (!orders || orders.length === 0) {
      console.log(`No ${paymentMethod} orders found to delete`);
      return { success: true, count: 0 };
    }
    
    console.log(`Found ${orders.length} ${paymentMethod} orders to delete`);
    
    // Delete each order individually to ensure related records are properly deleted
    let deletedCount = 0;
    let errors = [];
    
    for (const order of orders) {
      try {
        await deleteOrder(order.id);
        deletedCount++;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error(`Failed to delete order ${order.id}:`, errorMessage);
        errors.push({ orderId: order.id, error: errorMessage });
      }
    }
    
    if (errors.length > 0) {
      console.warn(`Completed with ${errors.length} errors:`, errors);
      return { 
        success: deletedCount > 0, 
        count: deletedCount,
        errors: errors
      };
    }
    
    console.log(`Successfully deleted ${deletedCount} orders`);
    return { success: true, count: deletedCount };
  } catch (error) {
    console.error('Error in deleteOrdersByPaymentMethod function:', error);
    throw error;
  }
};
