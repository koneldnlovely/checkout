
import React from 'react';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'CONFIRMED':
        return { color: 'bg-green-100 text-green-800', label: 'Confirmado' };
      case 'PENDING':
        return { color: 'bg-yellow-100 text-yellow-800', label: 'Pendente' };
      case 'RECEIVED':
        return { color: 'bg-blue-100 text-blue-800', label: 'Recebido' };
      case 'CANCELLED':
        return { color: 'bg-red-100 text-red-800', label: 'Cancelado' };
      case 'FAILED':
        return { color: 'bg-red-100 text-red-800', label: 'Falhou' };
      case 'DECLINED':
        return { color: 'bg-red-100 text-red-800', label: 'Recusado' };
      default:
        return { color: 'bg-gray-100 text-gray-800', label: status };
    }
  };

  const { color, label } = getStatusConfig();

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
