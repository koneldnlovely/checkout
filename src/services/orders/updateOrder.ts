
import { supabase } from "@/integrations/supabase/client";
import { PaymentStatus } from "@/types/checkout";

export const updateOrderStatus = async (
  orderId: string,
  status: PaymentStatus
) => {
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) {
    console.error("Error updating order status:", error);
    throw new Error(`Failed to update order status: ${error.message}`);
  }

  return data;
};
