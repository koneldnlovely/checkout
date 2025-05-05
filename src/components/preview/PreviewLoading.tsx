
import React from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export const PreviewLoading: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner message="Carregando prévia do checkout..." />
    </div>
  );
};
