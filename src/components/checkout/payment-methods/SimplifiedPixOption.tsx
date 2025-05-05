
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SimplifiedPixOptionProps {
  onSubmit: () => void;
  isLoading: boolean;
  buttonColor: string;
  buttonText: string;
  showQrCode?: boolean;
  hasValidCustomerData?: boolean;
}

export const SimplifiedPixOption: React.FC<SimplifiedPixOptionProps> = ({ 
  onSubmit,
  isLoading,
  buttonColor,
  buttonText,
  showQrCode = false,
  hasValidCustomerData = true
}) => {
  const { toast } = useToast();
  
  const handleSubmit = () => {
    if (!hasValidCustomerData) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha seus dados pessoais antes de continuar.",
        variant: "destructive",
      });
      
      // Scroll to personal info section
      const personalInfoSection = document.getElementById('personal-info-section');
      if (personalInfoSection) {
        personalInfoSection.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    
    onSubmit();
  };
  
  return (
    <div className="flex flex-col items-center">
      {!showQrCode ? (
        <>
          <p className="text-sm text-center mb-6">
            Finalize o pagamento para gerar o QR Code do PIX.
          </p>
          
          {!hasValidCustomerData && (
            <div className="w-full p-3 mb-4 bg-orange-50 border border-orange-200 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-orange-700">
                Preencha seus dados pessoais na seção de identificação antes de prosseguir.
              </p>
            </div>
          )}
          
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full"
            style={{ backgroundColor: buttonColor }}
          >
            {isLoading ? 'Processando...' : (
              <span className="flex items-center justify-center">
                {buttonText} <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            )}
          </Button>
        </>
      ) : (
        <div className="border border-gray-200 rounded-lg p-6 w-full max-w-sm mx-auto text-center">
          <div className="w-48 h-48 mx-auto mb-4 animate-pulse bg-gray-200 rounded-md flex items-center justify-center">
            <p className="text-sm text-gray-500">Carregando QR Code...</p>
          </div>
          <p className="font-medium">Gerando o QR Code PIX</p>
          <p className="text-sm text-gray-500 mt-2">
            O pagamento será confirmado automaticamente
          </p>
        </div>
      )}
    </div>
  );
};
