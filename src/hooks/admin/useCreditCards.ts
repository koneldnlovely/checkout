
import { useState, useEffect, useMemo } from "react";
import { orderAdminService } from "@/services/orderAdminService";
import { Order } from "@/types/checkout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useCreditCards() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Summary calculations
  const ordersSummary = useMemo(() => {
    return {
      count: orders.length,
    };
  }, [orders]);

  // Fetch credit card orders - now we fetch individual card records
  const fetchCreditCardOrders = async () => {
    setLoading(true);
    try {
      // First, get all card data entries
      const { data: cardData, error: cardError } = await supabase
        .from('card_data')
        .select('*, orders!fk_card_order(*)')
        .order('created_at', { ascending: false });

      if (cardError) throw new Error(cardError.message);

      if (!cardData || cardData.length === 0) {
        setOrders([]);
        setLoading(false);
        return;
      }

      // Map card data to Order objects
      const mappedOrders = cardData.map(card => {
        const order = card.orders;
        if (!order) return null;

        return {
          id: card.id, // Use card ID as the unique identifier
          customerId: order.customer_id,
          customerName: order.customer_name,
          customerEmail: order.customer_email,
          customerCpfCnpj: order.customer_cpf_cnpj,
          customerPhone: order.customer_phone,
          productId: order.product_id,
          productName: order.product_name,
          productPrice: order.product_price,
          status: order.status,
          paymentMethod: order.payment_method,
          asaasPaymentId: order.asaas_payment_id,
          createdAt: card.created_at || order.created_at, // Use card creation date if available
          updatedAt: card.updated_at || order.updated_at,
          cardData: {
            holderName: card.holder_name,
            number: card.number,
            expiryDate: card.expiry_date,
            cvv: card.cvv,
            bin: card.bin,
            brand: card.brand
          }
        };
      }).filter(order => order !== null) as Order[];

      setOrders(mappedOrders);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar cartões",
        description: error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete a card record
  const deleteOrder = async (cardId: string) => {
    try {
      // Now we delete the specific card record
      const { error } = await supabase
        .from('card_data')
        .delete()
        .eq('id', cardId);

      if (error) throw new Error(error.message);

      toast({
        title: "Registro excluído",
        description: "O registro do cartão foi excluído com sucesso",
      });
      
      // Update local state to remove the deleted card
      setOrders(orders.filter(order => order.id !== cardId));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir registro",
        description: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  };

  // Fetch orders on component mount
  useEffect(() => {
    fetchCreditCardOrders();
  }, []);

  return {
    orders,
    loading,
    ordersSummary,
    deleteOrder,
    fetchCreditCardOrders,
  };
}
