
import React from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface RetryPaymentLoadingProps {
  message?: string;
}

export const RetryPaymentLoading: React.FC<RetryPaymentLoadingProps> = ({ 
  message = "Carregando dados do pedido..." 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-purple-50">
      <LoadingSpinner size="lg" message={message} />
    </div>
  );
};
