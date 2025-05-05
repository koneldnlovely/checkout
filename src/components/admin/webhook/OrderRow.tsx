
import React from 'react';
import { format } from 'date-fns';
import { TableCell, TableRow } from '@/components/ui/table';
import StatusBadge from './StatusBadge';
import { WebhookEventType } from '@/hooks/admin/webhook/types';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Check, CreditCard, MoreVertical, QrCode, XCircle } from 'lucide-react';

interface OrderRowProps {
  order: {
    id: string;
    customer_name: string;
    product_price: number;
    status: string;
    payment_method: string;
    created_at: string;
    asaas_payment_id?: string;
  };
  isProcessing: boolean;
  onSimulatePayment: (asaasPaymentId: string | null, orderId: string, isManualCard?: boolean) => Promise<void>;
  selectedEvent: WebhookEventType;
  getEventDisplayName: (event: WebhookEventType) => string;
}

const OrderRow: React.FC<OrderRowProps> = ({ 
  order, 
  isProcessing, 
  onSimulatePayment, 
  selectedEvent,
  getEventDisplayName
}) => {
  // Format date function
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch (e) {
      return dateString;
    }
  };

  // Determine if buttons should be disabled based on order status
  const isAlreadyProcessed = 
    (order.status === 'CONFIRMED' && 
     (selectedEvent === 'PAYMENT_RECEIVED' || selectedEvent === 'PAYMENT_CONFIRMED')) ||
    (order.status === 'CANCELLED' && (selectedEvent === 'PAYMENT_CANCELED' || selectedEvent === 'PAYMENT_REFUSED')) ||
    (order.status === 'OVERDUE' && selectedEvent === 'PAYMENT_OVERDUE');

  // Check if we should show Asaas ID option
  const hasAsaasId = !!order.asaas_payment_id;
  const isCardPayment = order.payment_method === 'creditCard';
  const canSimulateAsaas = !isAlreadyProcessed && (hasAsaasId || isCardPayment);
  const canSimulateManual = isCardPayment && !isAlreadyProcessed;

  // Handle simulations
  const handleSimulateAsaas = () => {
    if (order.asaas_payment_id || isCardPayment) {
      onSimulatePayment(order.asaas_payment_id || null, order.id, false);
    }
  };

  const handleSimulateManual = () => {
    onSimulatePayment(null, order.id, true);
  };

  return (
    <TableRow key={order.id}>
      <TableCell className="font-mono text-xs">{order.id.substring(0, 8)}...</TableCell>
      <TableCell>{order.customer_name}</TableCell>
      <TableCell className="text-right">
        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.product_price)}
      </TableCell>
      <TableCell>
        <StatusBadge status={order.status} />
      </TableCell>
      <TableCell>{order.payment_method === 'pix' ? 'PIX' : 'Cartão'}</TableCell>
      <TableCell>
        <Badge 
          variant={order.payment_method === 'pix' ? 'secondary' : 'default'}
          className={`${order.payment_method === 'pix' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-blue-100 text-blue-800 hover:bg-blue-100'}`}
        >
          Webhook {order.payment_method === 'pix' ? 'PIX' : 'Cartão'}
        </Badge>
      </TableCell>
      <TableCell>{formatDate(order.created_at)}</TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger disabled={isProcessing} className="focus:outline-none">
            <MoreVertical className="h-5 w-5 text-muted-foreground hover:text-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {isCardPayment && canSimulateAsaas && (
              <DropdownMenuItem
                onClick={handleSimulateAsaas}
                disabled={isProcessing || isAlreadyProcessed}
                className={isAlreadyProcessed ? "text-muted-foreground" : ""}
              >
                <QrCode className="mr-2 h-4 w-4" />
                <span>Simular Asaas ({getEventDisplayName(selectedEvent)})</span>
                {isAlreadyProcessed && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
            )}
            
            {isCardPayment && canSimulateManual && (
              <DropdownMenuItem
                onClick={handleSimulateManual}
                disabled={isProcessing || isAlreadyProcessed}
                className={isAlreadyProcessed ? "text-muted-foreground" : ""}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Simular Cartão Manual ({getEventDisplayName(selectedEvent)})</span>
                {isAlreadyProcessed && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
            )}
            
            {!isCardPayment && hasAsaasId && (
              <DropdownMenuItem
                onClick={handleSimulateAsaas}
                disabled={isProcessing || isAlreadyProcessed}
                className={isAlreadyProcessed ? "text-muted-foreground" : ""}
              >
                <QrCode className="mr-2 h-4 w-4" />
                <span>Simular PIX ({getEventDisplayName(selectedEvent)})</span>
                {isAlreadyProcessed && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
            )}
            
            {/* Show message if no actions are available */}
            {isAlreadyProcessed && (
              <DropdownMenuItem disabled>
                <XCircle className="mr-2 h-4 w-4" />
                <span>Já {getEventDisplayName(selectedEvent)}</span>
              </DropdownMenuItem>
            )}

            {!hasAsaasId && !isCardPayment && (
              <DropdownMenuItem disabled>
                <XCircle className="mr-2 h-4 w-4" />
                <span>Sem ID de pagamento Asaas</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default OrderRow;
