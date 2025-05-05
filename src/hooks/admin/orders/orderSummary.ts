
import { Order } from "@/types/checkout";
import { OrdersSummary } from "./types";

export const calculateOrdersSummary = (orders: Order[]): OrdersSummary => {
  const total = orders.reduce((sum, order) => sum + Number(order.productPrice), 0);
  
  return {
    count: orders.length,
    totalValue: total,
  };
};
