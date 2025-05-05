
import { supabase } from "@/integrations/supabase/client";
import { GetOrdersParams, OrderTransformed } from "./types";

export const getOrders = async ({
  paymentMethod,
  status,
  startDate,
  endDate,
}: GetOrdersParams): Promise<OrderTransformed[]> => {
  try {
    console.log("Iniciando busca de pedidos com parâmetros:", { paymentMethod, status, startDate, endDate });
    
    let query = supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    
    // Aplicar filtro de método de pagamento se fornecido
    if (paymentMethod) {
      query = query.eq("payment_method", paymentMethod);
    }

    // Aplicar filtro de status se não for "ALL"
    if (status && status !== "ALL") {
      query = query.eq("status", status);
    }

    // Aplicar filtro de data se ambas as datas forem fornecidas
    if (startDate && endDate) {
      // Garantir que as datas sejam convertidas corretamente para strings ISO
      const formatDate = (date: string | Date) => {
        if (typeof date === 'string') {
          return date; // Já é uma string
        } else if (date instanceof Date) {
          return date.toISOString(); // É um objeto Date
        } else {
          try {
            // Tentativa de conversão segura
            return new Date(date).toISOString();
          } catch (err) {
            console.error("Erro ao converter data:", date, err);
            return new Date().toISOString(); // Fallback para data atual
          }
        }
      };
      
      const startDateStr = formatDate(startDate);
      const endDateStr = formatDate(endDate);
      
      console.log("Aplicando filtros de data:", { startDateStr, endDateStr });
      
      query = query.gte("created_at", startDateStr);
      query = query.lte("created_at", endDateStr);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Erro ao buscar pedidos:", error);
      throw new Error(`Falha ao buscar pedidos: ${error.message}`);
    }

    console.log("Pedidos encontrados:", data?.length || 0);
    if (data && data.length > 0) {
      console.log("Exemplo do primeiro pedido:", data[0]);
    }
    
    // Validar e transformar os dados
    return (data || []).map(order => ({
      ...order,
      // Garantir que productPrice seja um número válido
      productPrice: typeof order.product_price === 'number' || !isNaN(Number(order.product_price)) 
        ? Number(order.product_price) 
        : 0,
      // Mapear colunas do banco de dados para propriedades do frontend
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      customerPhone: order.customer_phone,
      customerCpfCnpj: order.customer_cpf_cnpj,
      customerId: order.customer_id,
      productName: order.product_name,
      paymentMethod: order.payment_method,
      createdAt: order.created_at,
      status: order.status,
      asaasPaymentId: order.asaas_payment_id
    }));
  } catch (err) {
    console.error("Erro inesperado em getOrders:", err);
    // Retornar array vazio em caso de erro, mas logar o erro
    return [];
  }
}
