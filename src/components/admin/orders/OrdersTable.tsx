
import React, { useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Eye, Trash2, Edit, DollarSign, CreditCard, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Order } from "@/types/checkout";
import StatusBadge from "./StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/utils/formatters";

interface OrdersTableProps {
  orders: Order[];
  onViewCustomer: (order: Order) => void;
  onViewPayment: (order: Order) => void;
  onEditStatus: (order: Order) => void;
  onDeleteOrder: (orderId: string) => void;
  loading: boolean;
}

const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  onViewCustomer,
  onViewPayment,
  onEditStatus,
  onDeleteOrder,
  loading,
}) => {
  // Adicionar logs para diagnóstico
  useEffect(() => {
    console.log("OrdersTable renderizado com estado:", { 
      quantidadePedidos: orders?.length, 
      carregando: loading,
      tipoDosPedidos: orders && orders.length > 0 ? typeof orders[0] : 'sem pedidos'
    });
    
    if (orders && orders.length > 0) {
      console.log("Exemplo do primeiro pedido:", orders[0]);
    }
  }, [orders, loading]);

  if (loading) {
    return (
      <div className="py-10 text-center">
        <div className="flex justify-center items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-gray-500 font-medium">Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white p-8 text-center rounded-md shadow-sm">
        <AlertTriangle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
        <p className="text-gray-700 font-medium">Nenhum pedido encontrado.</p>
        <p className="text-gray-500 mt-2">
          Verifique os filtros aplicados ou se existem pedidos no sistema.
        </p>
      </div>
    );
  }

  // Helper function to safely format price
  const formatPrice = (price: any): string => {
    const numericPrice = Number(price);
    return !isNaN(numericPrice) ? formatCurrency(numericPrice) : "R$ --";
  };

  // Helper function to safely format date
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "Data não disponível";
    
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm", {
        locale: ptBR,
      });
    } catch (error) {
      console.error("Error formatting date:", error, dateString);
      return "Data inválida";
    }
  };

  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  {order.customerName || "Nome não disponível"}
                </TableCell>
                <TableCell>{order.customerEmail || "Email não disponível"}</TableCell>
                <TableCell>
                  {formatPrice(order.productPrice)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={order.status} />
                </TableCell>
                <TableCell>
                  {formatDate(order.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onViewCustomer(order)}
                      title="Ver dados do cliente"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onViewPayment(order)}
                      title="Ver dados de pagamento"
                    >
                      {order.paymentMethod === "pix" ? (
                        <DollarSign className="h-4 w-4 text-green-600" />
                      ) : (
                        <CreditCard className="h-4 w-4 text-blue-600" />
                      )}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onEditStatus(order)}
                      title="Editar status"
                    >
                      <Edit className="h-4 w-4 text-amber-600" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onDeleteOrder(order.id!)}
                      title="Excluir pedido"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrdersTable;
