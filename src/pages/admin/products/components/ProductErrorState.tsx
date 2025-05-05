
import React from 'react';

interface ProductErrorStateProps {
  error: Error;
}

const ProductErrorState: React.FC<ProductErrorStateProps> = ({ error }) => {
  return (
    <div className="container mx-auto py-6">
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <h2 className="text-red-600 font-medium">Erro ao carregar produto</h2>
        <p className="text-red-500">{error.message}</p>
      </div>
    </div>
  );
};

export default ProductErrorState;
