
import { useState } from 'react';
import { PaymentStatus } from '@/types/checkout';
import { WebhookEventType } from '@/hooks/admin/webhook/types';

// Event options with friendly labels
export const eventOptions = [
  { value: 'PAYMENT_RECEIVED', label: 'Pagamento Recebido' },
  { value: 'PAYMENT_CONFIRMED', label: 'Pagamento Confirmado' },
  { value: 'PAYMENT_OVERDUE', label: 'Pagamento Vencido' },
  { value: 'PAYMENT_CANCELED', label: 'Pagamento Cancelado' },
  { value: 'PAYMENT_REFUSED', label: 'Pagamento Recusado' }
];

// Status options with friendly labels
export const statusOptions = [
  { value: 'ALL', label: 'Todos os status' },
  { value: 'PENDING', label: 'Pendente' },
  { value: 'CONFIRMED', label: 'Confirmado' },
  { value: 'RECEIVED', label: 'Recebido' },
  { value: 'CANCELLED', label: 'Cancelado' }
];

export const useWebhookState = () => {
  // Processing state for orders
  const [processingOrders, setProcessingOrders] = useState<Record<string, boolean>>({});
  
  // Filters and event selection
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'ALL'>('ALL');
  const [selectedEvent, setSelectedEvent] = useState<WebhookEventType>('PAYMENT_RECEIVED');

  return {
    // Processing state
    processingOrders,
    setProcessingOrders,
    
    // Filters and selection
    statusFilter,
    setStatusFilter,
    selectedEvent,
    setSelectedEvent,
    
    // Options for dropdowns
    eventOptions,
    statusOptions
  };
};
