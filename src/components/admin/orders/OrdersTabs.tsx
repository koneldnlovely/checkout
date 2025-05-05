
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrdersFilters from "./OrdersFilters";
import OrdersTable from "./OrdersTable";
import OrdersFooter from "./OrdersFooter";
import { Order, PaymentStatus } from "@/types/checkout";

interface OrdersTabsProps {
  paymentMethod: "pix" | "creditCard";
  orders: Order[];
  loading: boolean;
  statusFilter: PaymentStatus | "ALL";
  dateRange: "7days" | "30days" | "custom";
  customDateRange: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  };
  ordersSummary: {
    count: number;
    totalValue: number;
  };
  onChangePaymentMethod: (method: "pix" | "creditCard") => void;
  setStatusFilter: (status: PaymentStatus | "ALL") => void;
  setDateRange: (range: "7days" | "30days" | "custom") => void;
  setCustomDateRange: (range: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  }) => void;
  onViewCustomer: (order: Order) => void;
  onViewPayment: (order: Order) => void;
  onEditStatus: (order: Order) => void;
  onDeleteOrder: (orderId: string) => void;
}

const OrdersTabs: React.FC<OrdersTabsProps> = ({
  paymentMethod,
  orders,
  loading,
  statusFilter,
  dateRange,
  customDateRange,
  ordersSummary,
  onChangePaymentMethod,
  setStatusFilter,
  setDateRange,
  setCustomDateRange,
  onViewCustomer,
  onViewPayment,
  onEditStatus,
  onDeleteOrder,
}) => {
  return (
    <Tabs 
      defaultValue={paymentMethod} 
      onValueChange={(value) => onChangePaymentMethod(value as "pix" | "creditCard")}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="pix">Pedidos PIX</TabsTrigger>
        <TabsTrigger value="creditCard">Pedidos Cartão</TabsTrigger>
      </TabsList>
      
      {["pix", "creditCard"].map((method) => (
        <TabsContent key={method} value={method} className="mt-4">
          <OrdersFilters
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            dateRange={dateRange}
            setDateRange={setDateRange}
            customDateRange={customDateRange}
            setCustomDateRange={setCustomDateRange}
          />
          
          <OrdersTable
            orders={orders}
            loading={loading}
            onViewCustomer={onViewCustomer}
            onViewPayment={onViewPayment}
            onEditStatus={onEditStatus}
            onDeleteOrder={onDeleteOrder}
          />
          
          <OrdersFooter
            count={ordersSummary.count}
            totalValue={ordersSummary.totalValue}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default OrdersTabs;
