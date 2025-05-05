
import { Order, PaymentStatus } from "@/types/checkout";
import { orderAdminService } from "@/services/orders";
import { useToast } from "@/hooks/use-toast";

export function useOrdersActions(
  orders: Order[],
  paymentMethod: "pix" | "creditCard",
  fetchOrders: () => Promise<void>
) {
  const { toast } = useToast();

  // Update an order's status
  const updateOrderStatus = async (orderId: string, status: PaymentStatus) => {
    try {
      await orderAdminService.updateOrderStatus(orderId, status);
      toast({
        title: "Status atualizado",
        description: "O status do pedido foi atualizado com sucesso",
      });
      // Refresh orders after update
      fetchOrders();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar status",
        description: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  };

  // Delete a single order
  const deleteOrder = async (orderId: string) => {
    try {
      console.log("Attempting to delete order:", orderId);
      const result = await orderAdminService.deleteOrder(orderId);
      console.log("Delete order result:", result);
      
      toast({
        title: "Pedido excluído",
        description: "O pedido foi excluído com sucesso",
      });
      
      // Refresh orders after deletion
      fetchOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir pedido",
        description: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  };

  // Delete all orders for current payment method
  const deleteAllOrders = async () => {
    try {
      console.log(`Attempting to delete all ${paymentMethod} orders`);
      const result = await orderAdminService.deleteOrdersByPaymentMethod(paymentMethod);
      console.log("Delete all orders result:", result);
      
      toast({
        title: "Pedidos excluídos",
        description: `Todos os pedidos de ${paymentMethod === 'pix' ? 'PIX' : 'Cartão de Crédito'} foram excluídos`,
      });
      
      // Refresh the orders list
      fetchOrders();
    } catch (error) {
      console.error("Error deleting all orders:", error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir pedidos",
        description: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  };

  return {
    updateOrderStatus,
    deleteOrder,
    deleteAllOrders
  };
}
