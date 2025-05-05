
import { useOrdersState } from "./orders/useOrdersState";
import { useOrdersActions } from "./orders/useOrdersActions";
import { UseOrdersReturn } from "./orders/types";

export function useOrders(initialPaymentMethod: "pix" | "creditCard" = "pix"): UseOrdersReturn {
  const ordersState = useOrdersState(initialPaymentMethod);
  const ordersActions = useOrdersActions(
    ordersState.orders, 
    ordersState.paymentMethod, 
    ordersState.fetchOrders
  );

  return {
    ...ordersState,
    updateOrderStatus: ordersActions.updateOrderStatus,
    deleteOrder: ordersActions.deleteOrder,
    deleteAllOrders: ordersActions.deleteAllOrders,
  };
}
