
import React from 'react';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Truck } from 'lucide-react';

interface ShippingMessageProps {
  show: boolean;
}

export const ShippingMessage: React.FC<ShippingMessageProps> = ({ show }) => {
  if (!show) return null;
  
  // Calculate delivery dates (between 3-7 days from now)
  const today = new Date();
  const minDeliveryDate = addDays(today, 3);
  const maxDeliveryDate = addDays(today, 7);
  
  // Format dates in Brazilian Portuguese format
  const minDeliveryDateFormatted = format(minDeliveryDate, "dd 'de' MMMM", { locale: ptBR });
  const maxDeliveryDateFormatted = format(maxDeliveryDate, "dd 'de' MMMM", { locale: ptBR });
  
  return (
    <div className="py-3 px-4 mt-2 mb-4 bg-green-50 text-green-800 rounded-md border border-green-200 flex items-center gap-2 animate-fadeIn shadow-sm">
      <Truck className="h-5 w-5 text-green-600" />
      <div className="flex flex-col">
        <span className="font-medium">Frete grátis para este endereço</span>
        <span className="text-sm">Entrega prevista entre {minDeliveryDateFormatted} e {maxDeliveryDateFormatted}</span>
      </div>
    </div>
  );
};
