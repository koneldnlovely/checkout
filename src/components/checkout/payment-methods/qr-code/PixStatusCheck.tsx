
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Loader2 } from 'lucide-react';

interface PixStatusCheckProps {
  checking: boolean;
  onCheck: () => void;
  hidden?: boolean;  // New prop to control visibility
}

export const PixStatusCheck: React.FC<PixStatusCheckProps> = ({ 
  checking, 
  onCheck, 
  hidden = false  // Default to false to maintain existing behavior
}) => {
  return (
    <div className={`pt-2 ${hidden ? 'hidden' : ''}`}>
      <Button 
        onClick={onCheck} 
        disabled={checking}
        variant="outline"
        className="w-full"
      >
        {checking ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <RefreshCw className="mr-2 h-4 w-4" />
        )}
        Verificar pagamento
      </Button>
    </div>
  );
};
