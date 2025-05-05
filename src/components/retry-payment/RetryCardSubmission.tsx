
import React from 'react';
import { CreditCardData, Order } from '@/types/checkout';
import RetryPaymentForm from './RetryPaymentForm';
import { RetryLimitMessage } from './RetryLimitMessage';
import WhatsAppSupportLink from './WhatsAppSupportLink';

interface RetryCardSubmissionProps {
  order: Order | null;
  validationResult: {
    canProceed: boolean;
    message?: string;
    remainingAttempts?: number;
    waitTime?: number;
  } | null;
  onSubmit: (data: CreditCardData) => Promise<void>;
  isLoading: boolean;
  hasWhatsappSupport?: boolean;
  whatsappNumber?: string;
}

export const RetryCardSubmission: React.FC<RetryCardSubmissionProps> = ({
  order,
  validationResult,
  onSubmit,
  isLoading,
  hasWhatsappSupport,
  whatsappNumber,
}) => {
  // Se temos um número de WhatsApp, vamos logar para debug
  React.useEffect(() => {
    if (whatsappNumber) {
      console.log('[RetryCardSubmission] WhatsApp number disponível:', whatsappNumber);
    }
  }, [whatsappNumber]);

  // If we're not allowed to proceed, show the retry limit message
  if (validationResult && !validationResult.canProceed) {
    return (
      <>
        <RetryLimitMessage message={validationResult.message} />
        {whatsappNumber && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <WhatsAppSupportLink whatsappNumber={whatsappNumber} />
          </div>
        )}
      </>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {order && (
          <div className="text-gray-700">
            <p className="font-medium mb-1">Detalhes do pedido:</p>
            <p className="text-sm">Produto: {order.productName}</p>
            <p className="text-sm">Valor: R$ {order.productPrice.toFixed(2)}</p>
          </div>
        )}
        
        <RetryPaymentForm
          order={order}
          validationResult={validationResult}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </div>
      
      {/* Simplificamos a lógica para mostrar o suporte de WhatsApp sempre que o número estiver disponível */}
      {whatsappNumber && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <WhatsAppSupportLink whatsappNumber={whatsappNumber} />
        </div>
      )}
    </div>
  );
};

export default RetryCardSubmission;
