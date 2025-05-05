
import { getOrders } from "./getOrders";
import { updateOrderStatus } from "./updateOrder";
import { deleteOrder } from "./deleteOrder";
import { deleteOrdersByPaymentMethod } from "./deleteOrdersBulk";

export const orderAdminService = {
  getOrders,
  updateOrderStatus,
  deleteOrder,
  deleteOrdersByPaymentMethod
};
