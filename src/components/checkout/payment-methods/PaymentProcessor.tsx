
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { PaymentMethod } from '@/types/checkout';

interface PaymentProcessorProps {
  paymentMethod: PaymentMethod;
  hasValidCustomerData: boolean;
  onSubmit: (data?: any) => void;
  children: (props: {
    handleSubmit: (data?: any) => Promise<void>;
    isProcessing: boolean;
    paymentSuccess: boolean;
    paymentError: boolean;
  }) => React.ReactNode;
}

export const PaymentProcessor: React.FC<PaymentProcessorProps> = ({
  paymentMethod,
  hasValidCustomerData,
  onSubmit,
  children
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data?: any) => {
    setIsProcessing(true);
    setPaymentError(false);
    setPaymentSuccess(false);
    
    try {
      if (!hasValidCustomerData) {
        throw new Error("Por favor, preencha seus dados pessoais corretamente");
      }
      
      // Add a 4-second delay for credit card payments
      if (paymentMethod === 'creditCard') {
        await new Promise(resolve => setTimeout(resolve, 4000));
      }
      
      await onSubmit(data);
      
      if (paymentMethod === 'pix') {
        setPaymentSuccess(true);
      }
    } catch (error) {
      console.error('Error submitting payment:', error);
      setPaymentError(true);
      const errorMessage = error instanceof Error ? error.message : "Erro ao processar pagamento";
      
      toast({
        title: "Erro de validação",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {children({
        handleSubmit,
        isProcessing,
        paymentSuccess,
        paymentError
      })}
    </>
  );
};

