
import React from 'react';
import { Lock, CreditCard, ShieldCheck, Package } from 'lucide-react';

export const CheckoutFooter: React.FC = () => {
  return (
    <footer className="bg-white py-6 mt-8 border-t border-gray-200">
      <div className="container mx-auto px-4 text-center">
        <div className="flex flex-wrap justify-center items-center gap-6 mb-4">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="text-[#28A745] h-5 w-5" />
            <span className="text-sm text-gray-600">Pagamento 100% seguro</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Lock className="text-[#28A745] h-5 w-5" />
            <span className="text-sm text-gray-600">Dados protegidos</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <CreditCard className="text-[#28A745] h-5 w-5" />
            <span className="text-sm text-gray-600">Pagamento processado pela Stripe</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Package className="text-[#28A745] h-5 w-5" />
            <span className="text-sm text-gray-600">Todos pedidos possuem código de rastreio</span>
          </div>
        </div>
        
        <div className="text-xs text-gray-500">
          © {new Date().getFullYear()} CineflickCard. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};
