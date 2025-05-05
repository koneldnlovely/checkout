
import React from 'react';
import { CreditCardData } from '@/types/checkout';
import { getCardBrandIcon } from '@/utils/cardUtils';

interface CardHolderInfoProps {
  holderName?: string;
  brand?: string;
  maskedNumber?: string;
}

const CardHolderInfo: React.FC<CardHolderInfoProps> = ({ 
  holderName, 
  brand, 
  maskedNumber 
}) => {
  // Format holder name to show properly (capitalize first letter of each word)
  const formatHolderName = (name?: string) => {
    if (!name) return '-';
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="flex flex-col">
      <span className="text-sm font-medium">{formatHolderName(holderName)}</span>
      <div className="flex items-center text-xs text-muted-foreground">
        <span className="mr-1">{getCardBrandIcon(brand)}</span>
        <span>{maskedNumber || '•••• ••••'}</span>
      </div>
    </div>
  );
};

export default CardHolderInfo;
