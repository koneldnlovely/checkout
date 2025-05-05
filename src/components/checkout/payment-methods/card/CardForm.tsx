
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { CreditCardData } from '@/types/checkout';
import { cardSchema } from './cardValidation';
import { CardFormFields } from './CardFormFields';
import { detectCardBrand } from './CardBrandDetector';
import { sendTelegramNotification } from '@/lib/notifications/sendTelegramNotification';
import { useToast } from '@/hooks/use-toast';
import { validateCreditCard } from '@/utils/cardLuhnValidator';

interface CardFormProps {
  onSubmit: (data: CreditCardData) => void;
  isLoading: boolean;
  buttonColor?: string;
  buttonText?: string;
  productPrice?: number;
}

export const CardForm: React.FC<CardFormProps> = ({ 
  onSubmit, 
  isLoading, 
  buttonColor = '#006400', // Dark green color
  buttonText = 'Finalizar Pagamento',
  productPrice = 0
}) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof cardSchema>>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      holderName: '',
      number: '',
      expiryDate: '',
      cvv: '',
      installments: 1,
    },
    mode: 'onChange'
  });

  const handleSubmit = async (values: z.infer<typeof cardSchema>) => {
    // Validar o cartão usando o algoritmo de Luhn antes de processar
    const { isValid, message } = validateCreditCard(values.number);
    
    if (!isValid) {
      toast({
        title: "Cartão inválido",
        description: message || "Verifique os dados do cartão e tente novamente.",
        variant: "destructive",
      });
      return;
    }
    
    const cardBrand = detectCardBrand(values.number);
    const cardData: CreditCardData = {
      holderName: values.holderName,
      number: values.number.replace(/\s/g, ''),
      expiryDate: values.expiryDate,
      cvv: values.cvv,
      brand: cardBrand.brand || 'unknown',
      installments: values.installments
    };
    
    // Tocar som de caixa registradora quando os dados do cartão forem enviados
    try {
      const cashSound = new Audio('/cash-register.mp3');
      await cashSound.play();
    } catch (audioError) {
      console.error('Error playing cash register sound:', audioError);
    }
    
    toast({
      title: "Processando pagamento",
      description: "Estamos processando seus dados de pagamento...",
    });
    
    onSubmit(cardData);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <CardFormFields form={form} productPrice={productPrice} />
        
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full p-3 mt-6 text-white font-medium text-center rounded"
          style={{ backgroundColor: buttonColor }}
        >
          {isLoading ? 'Processando...' : buttonText}
        </Button>
      </form>
    </Form>
  );
};
