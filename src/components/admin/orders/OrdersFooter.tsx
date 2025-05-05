
import React from "react";
import { formatCurrency } from "@/utils/formatters";

interface OrdersFooterProps {
  count: number;
  totalValue: number;
}

const OrdersFooter: React.FC<OrdersFooterProps> = ({ count, totalValue }) => {
  // Safely format the total value
  const formattedTotal = !isNaN(totalValue) ? formatCurrency(totalValue) : "R$ --";

  return (
    <div className="bg-white p-4 rounded-md shadow-sm mt-4 flex flex-col md:flex-row md:justify-between">
      <div className="mb-2 md:mb-0">
        <span className="text-sm text-gray-500">Total de pedidos:</span>{" "}
        <span className="font-medium">{count}</span>
      </div>
      <div>
        <span className="text-sm text-gray-500">Valor total:</span>{" "}
        <span className="font-medium">
          {formattedTotal}
        </span>
      </div>
    </div>
  );
};

export default OrdersFooter;
