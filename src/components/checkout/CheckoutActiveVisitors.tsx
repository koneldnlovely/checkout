
import React from 'react';
import { Users } from 'lucide-react';

interface CheckoutActiveVisitorsProps {
  count: number;
}

export const CheckoutActiveVisitors: React.FC<CheckoutActiveVisitorsProps> = ({ count }) => {
  if (count <= 1) return null; // Don't show if only current user

  return (
    <div className="flex items-center justify-center bg-amber-50 text-amber-700 p-2 text-xs rounded-md animate-pulse">
      <Users className="h-3.5 w-3.5 mr-1.5" />
      <span>{count} pessoas visualizando agora</span>
    </div>
  );
};
