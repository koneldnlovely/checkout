
import React from 'react';

interface PaymentAnalysisLayoutProps {
  children: React.ReactNode;
}

export const PaymentAnalysisLayout: React.FC<PaymentAnalysisLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 flex flex-col">
      <header className="py-4 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <h1 className="text-xl font-semibold text-gray-800">Processamento de Pagamento</h1>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        {children}
      </main>
      
      <footer className="py-4 bg-white border-t text-center text-sm text-gray-500">
        <div className="container mx-auto px-4">
          © {new Date().getFullYear()} Todos os direitos reservados
        </div>
      </footer>
    </div>
  );
};
