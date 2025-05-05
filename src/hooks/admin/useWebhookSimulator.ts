
import { useWebhookState } from './webhook/useWebhookState';
import { useWebhookData } from './webhook/useWebhookData';
import { useWebhookActions } from './webhook/useWebhookActions';
import { WebhookEventType } from './webhook/types';

export type { WebhookEventType };

export const useWebhookSimulator = () => {
  // Get state management
  const {
    processingOrders,
    setProcessingOrders,
    statusFilter,
    setStatusFilter,
    selectedEvent,
    setSelectedEvent,
    eventOptions,
    statusOptions
  } = useWebhookState();

  // Get data with the current filters
  const { data: orders, isLoading, refetch } = useWebhookData(statusFilter);

  // Get actions with the required dependencies
  const { 
    simulatePaymentWebhook: rawSimulatePaymentWebhook, 
    deleteAllWebhookLogs,
    getEventDisplayName 
  } = useWebhookActions(setProcessingOrders, refetch);

  // Wrap the simulatePaymentWebhook to include the selectedEvent
  const simulatePaymentWebhook = (
    asaasPaymentId: string | null, 
    orderId: string, 
    isManualCard: boolean = false
  ) => rawSimulatePaymentWebhook(asaasPaymentId, orderId, selectedEvent, isManualCard);

  return {
    // Data
    orders,
    isLoading,
    
    // State
    processingOrders,
    statusFilter,
    setStatusFilter,
    selectedEvent,
    setSelectedEvent,
    
    // Options
    eventOptions,
    statusOptions,
    
    // Actions
    simulatePaymentWebhook,
    deleteAllWebhookLogs,
    getEventDisplayName,
    refetch
  };
};
