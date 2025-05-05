
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { WebhookEventType } from './types';
import { PaymentStatus } from '@/types/checkout';

export const useWebhookActions = (
  setProcessingOrders: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
  refetch: () => Promise<any>
) => {
  const { toast } = useToast();

  // Get event display name for notifications
  const getEventDisplayName = (event: WebhookEventType): string => {
    switch (event) {
      case 'PAYMENT_RECEIVED': return 'Recebido';
      case 'PAYMENT_CONFIRMED': return 'Confirmado';
      case 'PAYMENT_OVERDUE': return 'Vencido';
      case 'PAYMENT_CANCELED': return 'Cancelado';
      case 'PAYMENT_REFUSED': return 'Recusado';
      default: return event;
    }
  };

  // Map webhook event to new order status
  const mapEventToStatus = (event: WebhookEventType): PaymentStatus => {
    switch (event) {
      case 'PAYMENT_RECEIVED':
      case 'PAYMENT_CONFIRMED':
        return 'CONFIRMED';
      case 'PAYMENT_OVERDUE':
        return 'OVERDUE';
      case 'PAYMENT_CANCELED':
      case 'PAYMENT_REFUSED':
        return 'CANCELLED';
      default:
        return 'PENDING';
    }
  };

  // Function to simulate a webhook with the selected event
  const simulatePaymentWebhook = async (
    asaasPaymentId: string | null, 
    orderId: string, 
    selectedEvent: WebhookEventType,
    isManualCard: boolean = false
  ) => {
    if (!asaasPaymentId && !isManualCard) {
      toast({
        title: 'Erro',
        description: 'Este pedido não possui um ID de pagamento do Asaas.',
        variant: 'destructive'
      });
      return;
    }

    setProcessingOrders(prev => ({ ...prev, [orderId]: true }));

    try {
      // Determine the webhook endpoint based on environment
      // In production (Netlify), use the Netlify function path
      // In development, use the API route
      const isProduction = window.location.hostname !== 'localhost';
      const webhookEndpoint = isProduction 
        ? '/.netlify/functions/webhook-simulator'
        : '/api/webhook-simulator';
      
      console.log(`Using webhook endpoint: ${webhookEndpoint} for order ID: ${orderId}`);
      console.log(`Is manual card: ${isManualCard}, Asaas Payment ID: ${asaasPaymentId || 'None'}`);
      console.log(`Selected event: ${selectedEvent}`);
      
      // Determine the new status based on the event
      const newStatus = mapEventToStatus(selectedEvent);
      
      // Prepare payload based on whether this is a manual card or asaas payment
      const payload = isManualCard 
        ? {
            event: selectedEvent,
            payment: {
              id: "manual_card_payment",
              status: newStatus
            },
            orderId: orderId // Include orderId for manual card payments
          }
        : {
            event: selectedEvent,
            payment: {
              id: asaasPaymentId,
              status: newStatus
            }
          };
      
      // Send the simulated webhook
      const response = await fetch(webhookEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao simular webhook: ${errorText}`);
      }

      const result = await response.json();
      console.log('Webhook simulation result:', result);
      
      toast({
        title: 'Webhook simulado com sucesso',
        description: `O status do pedido foi atualizado para ${getEventDisplayName(selectedEvent)}.`,
      });
      
      // Update the orders list
      await refetch();
    } catch (error) {
      console.error('Erro ao simular webhook:', error);
      
      toast({
        title: 'Erro',
        description: 'Não foi possível simular o webhook.',
        variant: 'destructive'
      });
    } finally {
      setProcessingOrders(prev => ({ ...prev, [orderId]: false }));
    }
  };

  // Function to delete all webhook logs
  const deleteAllWebhookLogs = async () => {
    try {
      const { error } = await supabase
        .from('webhook_logs')
        .delete()
        .gte('id', 0);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Logs apagados',
        description: 'Todos os logs de webhook foram apagados com sucesso.',
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting webhook logs:', error);
      
      toast({
        title: 'Erro',
        description: 'Não foi possível apagar os logs de webhook.',
        variant: 'destructive'
      });
      
      return false;
    }
  };

  return {
    simulatePaymentWebhook,
    deleteAllWebhookLogs,
    getEventDisplayName
  };
};
