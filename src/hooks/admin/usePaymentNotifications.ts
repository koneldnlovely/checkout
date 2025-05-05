
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PaymentStatus } from '@/types/checkout';

export const usePaymentNotifications = () => {
  const [lastNotifiedPayment, setLastNotifiedPayment] = useState<string | null>(null);
  const { toast } = useToast();

  // Formatação de valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Verificar novos pagamentos confirmados a cada intervalo
  useEffect(() => {
    // Função para buscar os pedidos recentemente confirmados
    const checkForConfirmedPayments = async () => {
      try {
        // Buscar apenas pedidos confirmados nos últimos 5 minutos
        const fiveMinutesAgo = new Date();
        fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
        
        const { data: orders, error } = await supabase
          .from('orders')
          .select('*')
          .eq('status', 'CONFIRMED')
          .gt('updated_at', fiveMinutesAgo.toISOString())
          .order('updated_at', { ascending: false });
        
        if (error) {
          console.error('Erro ao verificar pagamentos:', error);
          return;
        }
        
        if (orders && orders.length > 0) {
          // Verificar se já notificamos sobre este pagamento
          const latestOrder = orders[0];
          
          if (latestOrder.id !== lastNotifiedPayment) {
            // Atualizar o último pagamento notificado
            setLastNotifiedPayment(latestOrder.id);
            
            // Mostrar toast de notificação
            toast({
              title: "Pagamento Confirmado! 🎉",
              description: `${latestOrder.customer_name} - ${formatCurrency(Number(latestOrder.product_price))}`,
              variant: "default",
            });
          }
        }
      } catch (error) {
        console.error('Erro ao verificar novos pagamentos:', error);
      }
    };

    // Verificar ao montar o componente
    checkForConfirmedPayments();
    
    // Configurar verificação periódica (a cada 30 segundos)
    const interval = setInterval(checkForConfirmedPayments, 30000);
    
    return () => {
      clearInterval(interval);
    };
  }, [toast, lastNotifiedPayment]);

  // Também podemos assinar mudanças em tempo real usando o Supabase Realtime
  useEffect(() => {
    // Inscrever-se para atualizações em tempo real na tabela de pedidos
    const channel = supabase
      .channel('payment-status-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: 'status=eq.CONFIRMED'
        },
        (payload) => {
          // Verificar se este é um pedido que acabou de ser confirmado
          const order = payload.new as any;
          
          // Evitar duplicação de notificações
          if (order.id !== lastNotifiedPayment) {
            setLastNotifiedPayment(order.id);
            
            toast({
              title: "Novo Pagamento Confirmado! 🎉",
              description: `${order.customer_name} - ${formatCurrency(Number(order.product_price))}`,
              variant: "default",
            });
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast, lastNotifiedPayment]);

  return null; // Este hook não precisa retornar nada, apenas produzir efeitos colaterais
};
