
import React from 'react';
import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import { CalendarClock, Receipt, Clock } from 'lucide-react';

interface PixPaymentDetailsProps {
  value: number;
  description: string;
  expirationDate: string;
}

export const PixPaymentDetails: React.FC<PixPaymentDetailsProps> = ({
  value,
  description,
  expirationDate
}) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch (e) {
      return 'Data inválida';
    }
  };

  return (
    <Card className="p-4 sm:p-6 border border-gray-200 shadow-sm bg-white rounded-xl">
      <div className="flex items-center mb-3 sm:mb-4 text-gray-700">
        <Receipt className="mr-2 h-4 sm:h-5 w-4 sm:w-5 text-green-600" />
        <h3 className="text-base sm:text-lg font-medium">Detalhes do pagamento</h3>
      </div>
      
      <div className="space-y-3">
        <div>
          <div className="text-xs text-gray-500 mb-1">Total a pagar:</div>
          <div className="flex items-baseline">
            <span className="text-xs text-gray-500 mr-1">R$</span>
            <span className="text-lg sm:text-xl font-bold text-gray-800">{formatCurrency(value).replace('R$ ', '')}</span>
          </div>
        </div>

        {description && (
          <div>
            <div className="text-xs text-gray-500 mb-1">Descrição:</div>
            <div className="text-sm text-gray-700">{description}</div>
          </div>
        )}

        <div>
          <div className="flex items-center text-xs text-gray-500 mb-1">
            <CalendarClock className="h-3 w-3 mr-1 text-gray-400" />
            <span>Validade:</span>
          </div>
          <div className="text-sm text-gray-700">{formatDate(expirationDate)}</div>
        </div>
        
        <div className="pt-2 mt-2 border-t border-gray-100">
          <div className="bg-yellow-50 border border-yellow-100 rounded-md p-2.5">
            <div className="flex text-yellow-700">
              <Clock className="h-4 w-4 mr-1.5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs">
                O pagamento será confirmado automaticamente assim que realizado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
