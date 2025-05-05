
import { useState, useEffect, useRef } from "react";
import { Order, PaymentStatus } from "@/types/checkout";
import { orderAdminService } from "@/services/orders";
import { useToast } from "@/hooks/use-toast";
import { calculateDateFilters } from "./dateUtils";
import { calculateOrdersSummary } from "./orderSummary";
import { DateRangeType, OrdersFilterState, UseOrdersReturn } from "./types";

export function useOrdersState(initialPaymentMethod: "pix" | "creditCard" = "pix"): UseOrdersReturn {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<OrdersFilterState>({
    paymentMethod: initialPaymentMethod,
    statusFilter: "ALL",
    dateRange: "7days",
    customDateRange: {
      startDate: undefined,
      endDate: undefined,
    }
  });
  const { toast } = useToast();
  const isMounted = useRef(true);
  const isFirstRender = useRef(true);
  const previousFilterRef = useRef<string>('');
  const fetchingRef = useRef<boolean>(false);
  const requestIdRef = useRef<number>(0);
  const lastRequestIdProcessedRef = useRef<number>(0);

  // Calcular filtros de data baseados na seleção
  const dateFilters = calculateDateFilters(filters.dateRange, filters.customDateRange);

  // Cálculos de resumo
  const ordersSummary = calculateOrdersSummary(orders);

  // Buscar pedidos com filtros atuais
  const fetchOrders = async () => {
    try {
      // Evitar chamadas simultâneas
      if (fetchingRef.current) {
        console.log("Já existe uma busca em andamento, ignorando solicitação");
        return;
      }

      // Criar ID de solicitação único para esta chamada
      const currentRequestId = ++requestIdRef.current;

      // Preparar dados para comparação
      const filterForComparison = {
        paymentMethod: filters.paymentMethod,
        statusFilter: filters.statusFilter,
        startDate: dateFilters.startDate ? new Date(dateFilters.startDate).getTime() : undefined,
        endDate: dateFilters.endDate ? new Date(dateFilters.endDate).getTime() : undefined
      };
      
      // Criar uma string para comparação de filtros
      const currentFilterString = JSON.stringify(filterForComparison);

      // Se os filtros não mudaram, não refazer a busca
      if (currentFilterString === previousFilterRef.current && !isFirstRender.current) {
        console.log("Filtros não mudaram, ignorando busca duplicada");
        return;
      }

      console.log("Buscando pedidos com filtros:", { 
        paymentMethod: filters.paymentMethod, 
        statusFilter: filters.statusFilter, 
        dateFilters
      });
      
      setLoading(true);
      fetchingRef.current = true;
      previousFilterRef.current = currentFilterString;
      isFirstRender.current = false;

      const data = await orderAdminService.getOrders({
        paymentMethod: filters.paymentMethod,
        status: filters.statusFilter,
        startDate: dateFilters.startDate,
        endDate: dateFilters.endDate,
      });
      
      // Só atualize os dados se este for o request mais recente e o componente estiver montado
      if (!isMounted.current) {
        console.log("Componente desmontado, ignorando resultado da busca");
        fetchingRef.current = false;
        return;
      }
      
      // Verificar se este request é mais recente do que o último processado
      if (currentRequestId < lastRequestIdProcessedRef.current) {
        console.log("Ignorando resultado de busca mais antigo");
        fetchingRef.current = false;
        return;
      }
      
      // Marcar este request como o último processado
      lastRequestIdProcessedRef.current = currentRequestId;
      
      console.log("Pedidos obtidos:", data);
      
      // Converter OrderTransformed[] para Order[]
      const transformedOrders: Order[] = data.map(order => ({
        id: order.id,
        customerId: order.customerId,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        customerCpfCnpj: order.customerCpfCnpj,
        productId: order.productId,
        productName: order.productName,
        productPrice: order.productPrice,
        status: order.status as PaymentStatus,
        paymentMethod: order.paymentMethod as "pix" | "creditCard",
        asaasPaymentId: order.asaasPaymentId || undefined,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      }));
      
      setOrders(transformedOrders);
      setLoading(false);
      fetchingRef.current = false;
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      if (isMounted.current) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar pedidos",
          description: error instanceof Error ? error.message : "Erro desconhecido",
        });
        // Definindo orders como array vazio em caso de erro
        setOrders([]);
        setLoading(false);
        fetchingRef.current = false;
      }
    }
  };

  // Atualizar filtros
  const setStatusFilter = (status: PaymentStatus | "ALL") => {
    setFilters(prev => ({ ...prev, statusFilter: status }));
  };

  const setDateRange = (range: DateRangeType) => {
    setFilters(prev => ({ ...prev, dateRange: range }));
  };

  const setCustomDateRange = (range: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  }) => {
    setFilters(prev => ({ ...prev, customDateRange: range }));
  };

  const changePaymentMethod = (method: "pix" | "creditCard") => {
    setFilters(prev => ({ ...prev, paymentMethod: method }));
  };

  // Buscar pedidos quando os filtros mudarem
  useEffect(() => {
    isMounted.current = true;
    fetchOrders();
    
    // Função de limpeza para evitar atualizações de estado após desmontagem
    return () => {
      isMounted.current = false;
    };
  }, [
    filters.paymentMethod, 
    filters.statusFilter, 
    filters.dateRange,
    JSON.stringify(filters.customDateRange)
  ]);

  return {
    orders,
    loading,
    paymentMethod: filters.paymentMethod,
    statusFilter: filters.statusFilter,
    dateRange: filters.dateRange,
    customDateRange: filters.customDateRange,
    ordersSummary,
    setStatusFilter,
    setDateRange,
    setCustomDateRange,
    changePaymentMethod,
    updateOrderStatus: async () => {}, // Será implementado em useOrdersActions
    deleteOrder: async () => {}, // Será implementado em useOrdersActions
    deleteAllOrders: async () => {}, // Será implementado em useOrdersActions
    fetchOrders,
  };
}
