
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const usePaymentSound = () => {
  useEffect(() => {
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
          // Toca um som de dinheiro
          const cashSound = new Audio('/cash-register.mp3');
          cashSound.play();

          // Mostra um toast personalizado
          toast.success('Novo Pagamento Confirmado!', {
            description: `Pagamento de R$ ${payload.new.product_price} confirmado`,
            icon: '💰'
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
};
