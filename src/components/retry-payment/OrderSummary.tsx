
import React from 'react';
import { Order } from '@/types/checkout';
import { ShoppingCart } from 'lucide-react';

interface OrderSummaryProps {
  order: Order | null;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ order }) => {
  if (!order) return null;
  
  return (
    <div className="p-4 bg-white rounded-lg border border-purple-100 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <ShoppingCart className="h-5 w-5 text-purple-600" />
        <p className="text-sm font-medium text-gray-500">Resumo do pedido</p>
      </div>
      <p className="mt-1 font-medium text-gray-800">{order.productName}</p>
      <p className="mt-1 text-lg font-bold text-purple-700">
        R$ {Number(order.productPrice).toFixed(2).replace('.', ',')}
      </p>
    </div>
  );
};
