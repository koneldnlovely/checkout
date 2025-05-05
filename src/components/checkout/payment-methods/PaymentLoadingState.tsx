
import React from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export const PaymentLoadingState: React.FC = () => {
  return (
    <div className="w-full max-w-md h-64 flex items-center justify-center bg-white rounded-xl shadow-lg border border-gray-100">
      <LoadingSpinner message="Gerando pagamento PIX..." />
    </div>
  );
};
