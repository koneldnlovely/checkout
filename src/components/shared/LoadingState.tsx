
import React from 'react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Carregando...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-16 h-16 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
};
