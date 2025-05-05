
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export const CheckoutNav: React.FC = () => {
  return (
    <nav className="bg-white shadow-sm py-3">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-semibold text-gray-800">
            Checkout
          </Link>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <ShieldCheck className="w-4 h-4 mr-1" />
          <span>Pagamento Seguro</span>
        </div>
      </div>
    </nav>
  );
};
