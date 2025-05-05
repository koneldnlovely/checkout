
import React from 'react';

interface CheckoutBannerProps {
  productName: string;
  headingColor?: string;
}

export const CheckoutBanner: React.FC<CheckoutBannerProps> = ({ 
  productName, 
  headingColor = '#ffffff'
}) => {
  return (
    <div className="container mx-auto text-center py-6">
      <h1 
        className="text-2xl md:text-3xl font-bold"
        style={{ color: headingColor }}
      >
        {productName}
      </h1>
    </div>
  );
};
