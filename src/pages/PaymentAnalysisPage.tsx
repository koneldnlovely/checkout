
import React from 'react';
import { useLocation } from 'react-router-dom';
import { usePaymentAnalysis } from '@/hooks/usePaymentAnalysis';
import { LoadingState } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';
import { PaymentAnalysisLayout } from '@/components/shared/PaymentAnalysisLayout';

const PaymentAnalysisPage: React.FC = () => {
  const location = useLocation();
  const { order, loading } = usePaymentAnalysis({
    initialOrder: location.state?.order,
    hasWhatsappSupport: location.state?.product?.has_whatsapp_support,
    whatsappNumber: location.state?.product?.whatsapp_number,
    product: location.state?.product
  });

  const renderContent = () => {
    if (loading) {
      return (
        <div className="py-12 px-4">
          <LoadingState message="Estamos processando seu pagamento, por favor aguarde..." />
        </div>
      );
    }

    if (!order) {
      return (
        <div className="py-12 px-4">
          <ErrorState 
            title="Pedido não encontrado" 
            message="Não foi possível encontrar os dados do seu pedido." 
            actionLink="/" 
            actionLabel="Voltar para a página inicial" 
          />
        </div>
      );
    }

    return (
      <div className="py-8 px-4 animate-fade-in">
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold text-center mb-4">
            Processando seu pagamento
          </h2>
          
          <div className="flex items-center justify-center my-6">
            <div className="h-16 w-16 relative">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
              <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center text-primary">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4V2M12 20V22M6.31 6.31L4.89 4.89M17.69 17.69L19.11 19.11M4 12H2M20 12H22M6.31 17.69L4.89 19.11M17.69 6.31L19.11 4.89" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
          
          <p className="text-center text-gray-600 mb-6">
            Estamos verificando o status do seu pagamento. Por favor, aguarde alguns instantes...
          </p>
          
          <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Pedido:</span> {order.id.substring(0, 8)}...
            </p>
            <p className="text-sm text-blue-800">
              <span className="font-medium">Produto:</span> {order.productName}
            </p>
            <p className="text-sm text-blue-800">
              <span className="font-medium">Valor:</span> {new Intl.NumberFormat('pt-BR', {
                style: 'currency', 
                currency: 'BRL'
              }).format(order.productPrice)}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <PaymentAnalysisLayout>
      {renderContent()}
    </PaymentAnalysisLayout>
  );
};

export default PaymentAnalysisPage;
