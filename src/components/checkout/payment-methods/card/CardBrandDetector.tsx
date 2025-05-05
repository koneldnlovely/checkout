import React from 'react';
import { CreditCard } from 'lucide-react';

export const detectCardBrand = (cardNumber: string): { brand: string; icon: React.ReactNode } => {
  const cleanNumber = cardNumber.replace(/\D/g, '');
  
  if (/^4/.test(cleanNumber)) {
    return { 
      brand: 'visa', 
      icon: (
        <div className="bg-blue-600 rounded-md h-6 w-10 flex items-center justify-center text-white">
          <span className="font-bold text-xs">VISA</span>
        </div>
      )
    };
  }
  
  if (/^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[0-1]|2720)/.test(cleanNumber)) {
    return { 
      brand: 'mastercard', 
      icon: (
        <div className="bg-gradient-to-r from-red-600 to-yellow-500 rounded-md h-6 w-10 flex items-center justify-center text-white">
          <span className="font-bold text-[10px] tracking-tighter">MC</span>
        </div>
      )
    };
  }
  
  if (/^3[47]/.test(cleanNumber)) {
    return { 
      brand: 'amex', 
      icon: (
        <div className="bg-blue-400 rounded-md h-6 w-10 flex items-center justify-center text-white">
          <span className="font-bold text-[10px]">AMEX</span>
        </div>
      )
    };
  }
  
  if (/^(6011|64[4-9]|65)/.test(cleanNumber)) {
    return { 
      brand: 'discover', 
      icon: (
        <div className="bg-orange-500 rounded-md h-6 w-10 flex items-center justify-center text-white">
          <span className="font-bold text-[10px]">DISC</span>
        </div>
      )
    };
  }
  
  if (/^(30[0-5]|36|38|39)/.test(cleanNumber)) {
    return { 
      brand: 'diners', 
      icon: (
        <div className="bg-blue-700 rounded-md h-6 w-10 flex items-center justify-center text-white">
          <span className="font-bold text-[10px]">DINRS</span>
        </div>
      )
    };
  }
  
  if (/^(636368|438935|504175|451416|5090(4[0-9]|5[0-9]|6[0-9]|7[0-4]))/.test(cleanNumber)) {
    return { 
      brand: 'elo', 
      icon: (
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-md h-6 w-10 flex items-center justify-center text-white">
          <span className="font-bold text-[10px]">ELO</span>
        </div>
      )
    };
  }
  
  if (/^(606282)/.test(cleanNumber)) {
    return { 
      brand: 'hipercard', 
      icon: (
        <div className="bg-red-600 rounded-md h-6 w-10 flex items-center justify-center text-white">
          <span className="font-bold text-[10px]">HIPER</span>
        </div>
      )
    };
  }
  
  return { 
    brand: 'unknown', 
    icon: <CreditCard className="h-5 w-5 text-gray-400" /> 
  };
};

export const requiresFourDigitCvv = (cardNumber: string): boolean => {
  const { brand } = detectCardBrand(cardNumber);
  return brand === 'amex';
};

interface CardBrandDisplayProps {
  cardNumber: string;
}

export const CardBrandDisplay: React.FC<CardBrandDisplayProps> = ({ cardNumber }) => {
  const { icon } = detectCardBrand(cardNumber);
  
  return (
    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
      {icon}
    </div>
  );
};

export default { detectCardBrand, CardBrandDisplay, requiresFourDigitCvv };
