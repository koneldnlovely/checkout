
import { useRef, useEffect } from 'react';
import { UseFormReturn, FieldValues } from 'react-hook-form';
import { CustomerData } from '@/types/checkout';

export function useCustomerFormValidation<
  TFieldValues extends FieldValues = CustomerData
>(
  form: UseFormReturn<TFieldValues>,
  onSubmit: (data: CustomerData) => void
) {
  const lastSubmittedRef = useRef<CustomerData | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);
  const lastSubmissionTime = useRef<number>(0);

  const isDataDifferent = (data: TFieldValues): boolean => {
    if (!lastSubmittedRef.current) return true;
    
    const last = lastSubmittedRef.current;
    const current = data as unknown as CustomerData;
    
    return (
      last.name !== current.name ||
      last.email !== current.email ||
      last.cpfCnpj !== current.cpfCnpj ||
      last.phone !== current.phone
    );
  };

  const canSubmit = (): boolean => {
    const now = Date.now();
    const timeSinceLastSubmission = now - lastSubmissionTime.current;
    return timeSinceLastSubmission > 3000;
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const subscription = form.watch((value, { name, type }) => {
      if (type === 'change' && form.formState.isValid) {
        const data = form.getValues();
        
        if (isDataDifferent(data) && canSubmit()) {
          if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
          }
          
          debounceTimerRef.current = setTimeout(() => {
            lastSubmissionTime.current = Date.now();
            lastSubmittedRef.current = { ...(data as unknown as CustomerData) };
            onSubmit(data as unknown as CustomerData);
            debounceTimerRef.current = null;
          }, 1000);
        }
      }
    });
    
    return () => {
      subscription.unsubscribe();
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [form, onSubmit]);

  return {
    isValid: form.formState.isValid
  };
}
