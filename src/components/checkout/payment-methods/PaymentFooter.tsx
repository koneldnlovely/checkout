
import React from 'react';
import { Star, Heart, ShieldCheck, CreditCard, Lock } from 'lucide-react';

export const PaymentFooter: React.FC = () => {
  return (
    <div className="mt-16 max-w-3xl mx-auto px-4">
      {/* Trust badges */}
      <div className="flex flex-wrap justify-center gap-8 mb-8">
        <div className="flex flex-col items-center">
          <div className="bg-green-50 p-2 rounded-full mb-2">
            <ShieldCheck className="h-6 w-6 text-green-600" />
          </div>
          <span className="text-xs text-gray-600">Compra Segura</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="bg-purple-50 p-2 rounded-full mb-2">
            <CreditCard className="h-6 w-6 text-purple-600" />
          </div>
          <span className="text-xs text-gray-600">Pagamento Protegido</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="bg-blue-50 p-2 rounded-full mb-2">
            <Lock className="h-6 w-6 text-blue-600" />
          </div>
          <span className="text-xs text-gray-600">Dados Criptografados</span>
        </div>
      </div>

      {/* Testimonial */}
      <div className="text-center mb-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
        <div className="inline-flex items-center justify-center mb-3 text-yellow-400">
          <Star className="h-4 w-4" fill="currentColor" />
          <Star className="h-4 w-4" fill="currentColor" />
          <Star className="h-4 w-4" fill="currentColor" />
          <Star className="h-4 w-4" fill="currentColor" />
          <Star className="h-4 w-4" fill="currentColor" />
        </div>
        <p className="text-gray-700 font-medium mb-2">
          "Compra super fácil e rápida! Recomendo!"
        </p>
        <p className="text-sm text-gray-500">— Maria S.</p>
      </div>
      
      {/* Support and copyright */}
      <div className="text-center text-xs text-gray-500 flex flex-col items-center mb-8">
        <div className="flex items-center justify-center mb-2">
          <Heart className="h-3 w-3 text-red-400 mr-1" />
          <p>Feito com amor para nossos clientes</p>
        </div>
        <p className="mb-2">Se precisar de ajuda, entre em contato com nosso suporte</p>
        <p>© {new Date().getFullYear()} Asaas Payments</p>
      </div>
    </div>
  );
};
