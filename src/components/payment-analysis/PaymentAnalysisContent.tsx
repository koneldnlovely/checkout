
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Loader2, Clock } from 'lucide-react';

interface PaymentAnalysisContentProps {
  order: {
    id: string;
  } | null;
}

export const PaymentAnalysisContent: React.FC<PaymentAnalysisContentProps> = ({ order }) => {
  return (
    <Card className="max-w-md w-full shadow-xl border border-purple-100 rounded-xl overflow-hidden">
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2 w-full" />
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-yellow-100">
          <Clock className="h-8 w-8 text-yellow-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Analisando pagamento</h2>
        <p className="text-gray-600 text-lg mt-2">
          Seu pagamento está sendo processado. Por favor, aguarde.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6 flex flex-col items-center">
        <div className="flex items-center justify-center my-8">
          <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
        </div>
        
        <div className="text-center text-sm text-gray-500">
          <p>Isso pode levar alguns instantes.</p>
          <p>Não recarregue nem feche esta página.</p>
        </div>
        
        {order && (
          <div className="w-full mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              Pedido #{order.id}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
