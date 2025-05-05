
import React from 'react';

export const PaymentDecorativeElements: React.FC = () => {
  return (
    <>
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-asaas-primary/5 via-asaas-secondary/10 to-purple-100/5 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-r from-purple-100/5 via-asaas-secondary/10 to-asaas-primary/5 pointer-events-none"></div>
      
      <div className="absolute top-20 left-10 w-32 h-32 bg-asaas-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-asaas-secondary/5 rounded-full blur-3xl pointer-events-none"></div>
    </>
  );
};
