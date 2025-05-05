
import React from 'react';
import { Loader2 } from 'lucide-react';

const ProductLoadingState: React.FC = () => {
  return (
    <div className="container mx-auto py-6 flex justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
};

export default ProductLoadingState;
