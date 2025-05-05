
import React from 'react';
import { PaymentStatus } from '@/types/checkout';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CardStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

const CardStatusBadge: React.FC<CardStatusBadgeProps> = ({ status, className }) => {
  // Define status configuration based on payment status
  const getStatusConfig = () => {
    switch (status) {
      case 'CONFIRMED':
      case 'RECEIVED':
        return {
          label: 'Aprovado',
          icon: CheckCircle,
          bgColor: 'bg-green-100 text-green-700 border-green-200'
        };
      case 'CANCELLED':
      case 'REFUNDED':
      case 'OVERDUE':
      case 'FAILED':
      case 'DECLINED':
        return {
          label: 'Recusado',
          icon: XCircle,
          bgColor: 'bg-red-100 text-red-700 border-red-200'
        };
      case 'PENDING':
        return {
          label: 'Em análise',
          icon: Clock,
          bgColor: 'bg-amber-100 text-amber-700 border-amber-200'
        };
      default:
        return {
          label: 'Processando',
          icon: AlertCircle,
          bgColor: 'bg-blue-100 text-blue-700 border-blue-200'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Badge 
      variant="outline" 
      className={cn('flex items-center gap-1 py-1 px-2 font-medium', config.bgColor, className)}
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{config.label}</span>
    </Badge>
  );
};

export default CardStatusBadge;
