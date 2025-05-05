
import React from 'react';
import { PixStatusCheck } from './PixStatusCheck';
import { PaymentStatus } from '@/types/checkout';

interface PixStatusCheckerProps {
  status: PaymentStatus;
  isCheckingStatus: boolean;
  onCheckStatus: () => void;
}

export const PixStatusChecker: React.FC<PixStatusCheckerProps> = ({ 
  status, 
  isCheckingStatus, 
  onCheckStatus 
}) => {
  // Sempre ocultar o botão de verificação de status
  const hidden = true;
  
  return (
    <div className="flex flex-col">
      <PixStatusCheck 
        checking={isCheckingStatus} 
        onCheck={onCheckStatus}
        hidden={hidden}
      />
    </div>
  );
};
