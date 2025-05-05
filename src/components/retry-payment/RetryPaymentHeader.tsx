
import React from 'react';
import { CreditCard } from 'lucide-react';
import { CardTitle, CardDescription } from '@/components/ui/card';

export const RetryPaymentHeader: React.FC = () => {
  return (
    <>
      <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-purple-100">
        <CreditCard className="h-8 w-8 text-purple-600" />
      </div>
      <CardTitle className="text-2xl font-bold text-gray-800">Nova tentativa de pagamento</CardTitle>
      <CardDescription className="text-gray-600 text-lg mt-2">
        Por favor, utilize outro cartão para tentar novamente.
      </CardDescription>
    </>
  );
};
