
import { PaymentStatus } from "@/types/checkout";
import { supabase } from "@/integrations/supabase/client";
import { orderAdminService as orderServices } from "./orders";

/**
 * This file is maintained for backward compatibility.
 * For new code, please import directly from './orders' instead.
 */

// Re-export the individual services
export const orderAdminService = {
  /**
   * Fetches orders based on provided filters
   */
  getOrders: orderServices.getOrders,
  
  /**
   * Updates the status of an order
   */
  updateOrderStatus: orderServices.updateOrderStatus,
  
  /**
   * Deletes a single order and its associated records
   */
  deleteOrder: orderServices.deleteOrder,
  
  /**
   * Deletes all orders with a specific payment method
   */
  deleteOrdersByPaymentMethod: orderServices.deleteOrdersByPaymentMethod
};
