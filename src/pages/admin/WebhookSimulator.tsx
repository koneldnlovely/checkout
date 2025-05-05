
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Filter, Trash2 } from 'lucide-react';
import { useWebhookSimulator } from '@/hooks/admin/useWebhookSimulator';
import OrdersTable from '@/components/admin/webhook/OrdersTable';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DeleteConfirmModal } from '@/components/admin/orders/OrderModals';

const WebhookSimulator = () => {
  const {
    orders,
    isLoading,
    processingOrders,
    statusFilter,
    setStatusFilter,
    selectedEvent,
    setSelectedEvent,
    eventOptions,
    statusOptions,
    simulatePaymentWebhook,
    refetch,
    deleteAllWebhookLogs,
    getEventDisplayName
  } = useWebhookSimulator();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeleteAll = async () => {
    await deleteAllWebhookLogs();
    setIsDeleteModalOpen(false);
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Simulador de Webhook</h1>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select 
              value={statusFilter} 
              onValueChange={(value) => setStatusFilter(value as any)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Select 
              value={selectedEvent} 
              onValueChange={(value) => setSelectedEvent(value as any)}
            >
              <SelectTrigger className="w-full sm:w-[220px]">
                <SelectValue placeholder="Selecionar evento" />
              </SelectTrigger>
              <SelectContent>
                {eventOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={() => refetch()} variant="outline" size="sm" className="ml-auto sm:ml-0">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button 
            onClick={() => setIsDeleteModalOpen(true)} 
            variant="destructive"
            size="sm"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Apagar Tudo
          </Button>
        </div>
      </div>

      <OrdersTable
        orders={orders || []}
        isLoading={isLoading}
        processingOrders={processingOrders}
        onSimulatePayment={simulatePaymentWebhook}
        selectedEvent={selectedEvent}
        getEventDisplayName={getEventDisplayName}
      />

      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAll}
        isDeleteAll={true}
      />
    </div>
  );
};

export default WebhookSimulator;
