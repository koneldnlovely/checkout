
import React from 'react';
import { CreditCard } from 'lucide-react';

interface SectionTitleProps {
  number?: number;
  title: string;
  icon?: React.ReactNode;
  showNumberBadge?: boolean;
  headingColor?: string;
  numberBadgeColor?: string; // New prop for custom number badge color
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ 
  number, 
  title, 
  icon, 
  showNumberBadge = true,
  headingColor,
  numberBadgeColor = '#28A745' // Default green color, but can be overridden
}) => {
  return (
    <div className="flex items-center mb-4">
      {showNumberBadge && number ? (
        <div 
          className="flex items-center justify-center w-7 h-7 rounded-full text-white font-bold mr-2"
          style={{ backgroundColor: numberBadgeColor }}
        >
          {number}
        </div>
      ) : icon ? (
        <div className="mr-2">{icon}</div>
      ) : null}
      <h2 
        className="text-base font-semibold"
        style={{ color: headingColor || 'black' }}
      >
        {title}
      </h2>
    </div>
  );
};
