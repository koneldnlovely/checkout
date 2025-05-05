
import React from 'react';
import { Check } from 'lucide-react';

export const PixConfirmation: React.FC = () => {
  return (
    <div className="text-center p-8 bg-green-50 rounded-lg border border-green-200">
      <Check className="w-16 h-16 mx-auto text-green-500 mb-2" />
      <h3 className="text-xl font-semibold text-green-700">Pagamento Confirmado!</h3>
      <p className="text-green-600">Seu pagamento foi processado com sucesso.</p>
    </div>
  );
};
