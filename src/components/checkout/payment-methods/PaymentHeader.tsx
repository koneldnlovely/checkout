
import React from 'react';
import { ArrowLeft, ShieldCheck, LockKeyhole } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';

export const PaymentHeader: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  return (
    <div className="w-full max-w-md mb-4 sm:mb-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="mr-1 sm:mr-2 h-3.5 sm:h-4 w-3.5 sm:w-4" />
          <span className="text-xs sm:text-sm">Voltar</span>
        </Button>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center gap-1 sm:gap-2 text-xs bg-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-sm border border-green-100">
                <LockKeyhole className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-green-600" />
                <div className="flex items-center gap-0.5 sm:gap-1">
                  <ShieldCheck className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-green-600" />
                  <span className="text-xs text-gray-700 font-medium">Pagamento Seguro</span>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Seus dados estão protegidos com criptografia de ponta a ponta</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="mt-3 sm:mt-4 text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Finalize seu pagamento</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">Escolha uma das opções abaixo para continuar</p>
      </div>
    </div>
  );
};
