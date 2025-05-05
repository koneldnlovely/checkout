import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { formatExpiryDate } from '@/utils/cardValidationUtils';
import { CardBrandDisplay, requiresFourDigitCvv } from './CardBrandDetector';
import { cardSchema } from './cardValidation';
import { handleCardNumberChange, handleExpiryDateChange } from './formatters/cardInputFormatters';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency } from '@/utils/formatters';
import { useIsMobile } from '@/hooks/use-mobile';

interface CardFormFieldsProps {
  form: UseFormReturn<z.infer<typeof cardSchema>>;
  productPrice?: number;
}

export const CardFormFields: React.FC<CardFormFieldsProps> = ({ form, productPrice = 0 }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-4">
      <CardHolderField form={form} />
      <CardNumberField form={form} />
      
      <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-3 gap-4'}`}>
        <ExpiryDateField form={form} />
        <CvvField form={form} />
        <InstallmentsField form={form} productPrice={productPrice} className={isMobile ? 'col-span-2' : ''} />
      </div>
    </div>
  );
};

// Individual form field components
const CardHolderField: React.FC<CardFormFieldsProps> = ({ form }) => (
  <FormField
    control={form.control}
    name="holderName"
    render={({ field }) => (
      <FormItem>
        <FormLabel className="text-gray-700 font-medium">Nome do titular</FormLabel>
        <FormControl>
          <Input 
            placeholder="Digite o nome do titular" 
            {...field} 
            autoComplete="cc-name"
            className="border border-gray-300 rounded py-3 px-4 w-full text-gray-700"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

const CardNumberField: React.FC<CardFormFieldsProps> = ({ form }) => (
  <FormField
    control={form.control}
    name="number"
    render={({ field: { onChange, value, ...rest } }) => (
      <FormItem>
        <FormLabel className="text-gray-700 font-medium">Número do cartão</FormLabel>
        <div className="relative">
          <FormControl>
            <Input 
              placeholder="Digite o número do seu cartão" 
              value={value} 
              {...rest}
              onChange={(e) => handleCardNumberChange(e, onChange)}
              autoComplete="cc-number"
              maxLength={19}  // 16 digits + 3 spaces
              className="border border-gray-300 rounded py-3 px-4 w-full text-gray-700 pr-12"
            />
          </FormControl>
          <CardBrandDisplay cardNumber={value || ''} />
        </div>
        <FormMessage />
      </FormItem>
    )}
  />
);

const ExpiryDateField: React.FC<CardFormFieldsProps> = ({ form }) => (
  <FormField
    control={form.control}
    name="expiryDate"
    render={({ field: { onChange, ...rest } }) => (
      <FormItem>
        <FormLabel className="text-gray-700 font-medium">Vencimento</FormLabel>
        <FormControl>
          <Input 
            placeholder="MM/AA" 
            {...rest}
            onChange={(e) => handleExpiryDateChange(e, onChange, formatExpiryDate)}
            autoComplete="cc-exp"
            maxLength={5}
            className="border border-gray-300 rounded py-3 px-4 w-full text-gray-700 text-center"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

const InstallmentsField: React.FC<{ 
  form: UseFormReturn<z.infer<typeof cardSchema>>; 
  productPrice: number; 
  className?: string;
}> = ({ form, productPrice, className = '' }) => {
  // Calculate installment values based on product price
  const calculateInstallmentValue = (installments: number): string => {
    if (!productPrice || installments <= 0) return "à vista";
    
    // For 1x, show "à vista" (in full)
    if (installments === 1) {
      return `1x de ${formatCurrency(productPrice)}`;
    }
    
    // For 2x and above, show installment amount with "sem juros"
    const installmentValue = productPrice / installments;
    return `${installments}x de ${formatCurrency(installmentValue)}`;
  };
  
  return (
    <FormField
      control={form.control}
      name="installments"
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className="text-gray-700 font-medium">Parcelamento</FormLabel>
          <Select 
            onValueChange={(value) => field.onChange(parseInt(value))} 
            defaultValue={field.value?.toString() || "1"}
          >
            <FormControl>
              <SelectTrigger className="border border-gray-300 rounded py-3 px-4 w-full text-gray-700">
                <SelectValue placeholder={calculateInstallmentValue(1)} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="1">{calculateInstallmentValue(1)}</SelectItem>
              <SelectItem value="2">{calculateInstallmentValue(2)}</SelectItem>
              <SelectItem value="3">{calculateInstallmentValue(3)}</SelectItem>
              <SelectItem value="4">{calculateInstallmentValue(4)}</SelectItem>
              <SelectItem value="5">{calculateInstallmentValue(5)}</SelectItem>
              <SelectItem value="6">{calculateInstallmentValue(6)}</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const CvvField: React.FC<CardFormFieldsProps> = ({ form }) => {
  const cardNumber = form.watch('number') || '';
  const isFourDigitCvv = requiresFourDigitCvv(cardNumber);
  
  return (
    <FormField
      control={form.control}
      name="cvv"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-medium">CVV</FormLabel>
          <FormControl>
            <Input 
              placeholder={isFourDigitCvv ? "0000" : "000"} 
              {...field}
              autoComplete="cc-csc"
              maxLength={isFourDigitCvv ? 4 : 3}
              type="text"
              className="border border-gray-300 rounded py-3 px-4 w-full text-gray-700 text-center"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CardFormFields;
