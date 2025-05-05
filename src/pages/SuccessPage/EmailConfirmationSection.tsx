
import React from 'react';
import { Mail } from 'lucide-react';

export const EmailConfirmationSection: React.FC = () => (
  <div className="p-5 bg-blue-50 rounded-lg border border-blue-100 my-4 flex items-start">
    <div className="bg-blue-100 p-3 rounded-full mr-4 mt-1">
      <Mail className="h-5 w-5 text-blue-600" />
    </div>
    <div className="text-left">
      <p className="text-gray-800 font-medium text-lg">Um e-mail com os detalhes da compra foi enviado para você.</p>
      <p className="text-gray-600 mt-1">Verifique sua caixa de entrada e a pasta de spam.</p>
    </div>
  </div>
);
