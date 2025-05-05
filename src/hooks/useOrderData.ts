
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Order, PaymentMethod } from '@/types/checkout';
import { logPaymentError } from '@/utils/paymentErrorHandler';

export const useOrderData = () => {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchOrderById = async (orderId: string) => {
    setLoading(true);
    try {
      console.log('[useOrderData] Fetching order with ID:', orderId);
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
        
      if (error) {
        logPaymentError('useOrderData', error, { orderId });
        toast({
          title: "Erro ao carregar pedido",
          description: "Não foi possível recuperar os dados do seu pedido.",
          variant: "destructive",
        });
        return null;
      }
      
      if (data) {
        const fetchedOrder: Order = {
          id: data.id,
          customerId: data.customer_id,
          customerName: data.customer_name,
          customerEmail: data.customer_email,
          customerCpfCnpj: data.customer_cpf_cnpj,
          customerPhone: data.customer_phone,
          productId: data.product_id,
          productName: data.product_name,
          productPrice: data.product_price,
          status: data.status,
          paymentMethod: data.payment_method as PaymentMethod,
          asaasPaymentId: data.asaas_payment_id,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        };
        
        console.log('[useOrderData] Fetched order from database:', fetchedOrder);
        return fetchedOrder;
      }
      
      return null;
    } catch (error) {
      logPaymentError('useOrderData', error, { orderId });
      toast({
        title: "Erro ao carregar pedido",
        description: "Ocorreu um erro ao buscar os dados do pedido.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getOrderIdFromUrl = () => {
    return searchParams.get('orderId');
  };

  return {
    order,
    setOrder,
    loading,
    setLoading,
    fetchOrderById,
    getOrderIdFromUrl
  };
};
