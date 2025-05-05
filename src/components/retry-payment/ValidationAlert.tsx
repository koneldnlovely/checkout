
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { XCircle, AlertTriangle, Clock } from 'lucide-react';

interface ValidationAlertProps {
  validationResult: {
    canProceed: boolean;
    message?: string;
    remainingAttempts?: number;
    waitTime?: number;
  } | null;
}

export const ValidationAlert: React.FC<ValidationAlertProps> = ({ validationResult }) => {
  if (!validationResult) return null;

  return (
    <>
      {validationResult.canProceed ? (
        <Alert className="mb-4" variant="default">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Informação</AlertTitle>
          <AlertDescription>
            {validationResult.message}
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="mb-4" variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Limite atingido</AlertTitle>
          <AlertDescription>
            {validationResult.message}
            {validationResult.waitTime && (
              <div className="mt-2 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>
                  Aguarde {validationResult.waitTime} {validationResult.waitTime === 1 ? 'minuto' : 'minutos'} 
                  antes de tentar novamente
                </span>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};
