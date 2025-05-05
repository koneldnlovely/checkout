
import React from 'react';
import { XCircle, CreditCard } from 'lucide-react';

const FailureReasons = () => {
  return (
    <>
      <p className="text-gray-700">Seu pagamento não foi autorizado pela operadora do cartão. Isso pode ocorrer por diversos motivos:</p>
      
      <div className="bg-red-50 rounded-lg border border-red-100 p-4 my-4">
        <div className="flex flex-col space-y-3 text-left">
          <div className="flex items-start">
            <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-red-700"><strong>Cartão com limite insuficiente</strong> - Verifique se há saldo disponível</p>
          </div>
          <div className="flex items-start">
            <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-red-700"><strong>Dados incorretos</strong> - Confira se todos os dados foram digitados corretamente</p>
          </div>
          <div className="flex items-start">
            <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-red-700"><strong>Cartão bloqueado</strong> - Entre em contato com seu banco</p>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 my-4 animate-pulse-slow">
        <div className="flex items-center">
          <CreditCard className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0" />
          <p className="text-amber-700 font-medium">Não tente novamente com o mesmo cartão! O problema persistirá.</p>
        </div>
      </div>
    </>
  );
};

export default FailureReasons;
