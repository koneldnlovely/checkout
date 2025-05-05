
import { Order, PaymentStatus } from "@/types/checkout";

export type DateRangeType = "7days" | "30days" | "custom";

export interface OrdersFilterState {
  paymentMethod: "pix" | "creditCard";
  statusFilter: PaymentStatus | "ALL";
  dateRange: DateRangeType;
  customDateRange: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  };
}

export interface OrdersSummary {
  count: number;
  totalValue: number;
}

export interface UseOrdersReturn {
  orders: Order[];
  loading: boolean;
  paymentMethod: "pix" | "creditCard";
  statusFilter: PaymentStatus | "ALL";
  dateRange: DateRangeType;
  customDateRange: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  };
  ordersSummary: OrdersSummary;
  setStatusFilter: (status: PaymentStatus | "ALL") => void;
  setDateRange: (range: DateRangeType) => void;
  setCustomDateRange: (range: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  }) => void;
  changePaymentMethod: (method: "pix" | "creditCard") => void;
  updateOrderStatus: (orderId: string, status: PaymentStatus) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  deleteAllOrders: () => Promise<void>;
  fetchOrders: () => Promise<void>;
}
