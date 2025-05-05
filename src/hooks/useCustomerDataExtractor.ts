
import { useState, useRef, useEffect, RefObject } from 'react';
import { CustomerData } from '@/types/checkout';

export const useCustomerDataExtractor = (
  customerFormRef: RefObject<HTMLFormElement>, 
  onCustomerDataSubmit: (data: CustomerData) => void
) => {
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [hasValidCustomerData, setHasValidCustomerData] = useState(false);
  const lastExtractTimeRef = useRef<number>(0);
  const extractTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const extractCustomerData = (): { data: CustomerData | null, isValid: boolean } => {
    if (!customerFormRef.current) return { data: null, isValid: false };
    
    const formData = new FormData(customerFormRef.current);
    const data: CustomerData = {
      name: formData.get('name') as string || '',
      email: formData.get('email') as string || '',
      cpfCnpj: formData.get('cpfCnpj') as string || '',
      phone: formData.get('phone') as string || '',
    };
    
    const isValid = !!(
      data.name && data.name.trim().length > 2 && 
      data.email && data.email.includes('@') && 
      data.cpfCnpj && data.cpfCnpj.replace(/\D/g, '').length >= 11 && 
      data.phone && data.phone.replace(/\D/g, '').length >= 10
    );
    
    return { data, isValid };
  };

  useEffect(() => {
    if (!customerFormRef.current) return;
    
    const handleFormChange = () => {
      if (extractTimeoutRef.current) {
        clearTimeout(extractTimeoutRef.current);
      }
      
      extractTimeoutRef.current = setTimeout(() => {
        const now = Date.now();
        if (now - lastExtractTimeRef.current > 1000) {
          const { data, isValid } = extractCustomerData();
          
          setHasValidCustomerData(isValid);
          
          if (data) {
            setCustomerData(data);
            onCustomerDataSubmit(data);
            lastExtractTimeRef.current = now;
          }
        }
      }, 500);
    };
    
    const form = customerFormRef.current;
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('blur', handleFormChange);
      input.addEventListener('input', handleFormChange);
    });
    
    handleFormChange();
    
    return () => {
      inputs.forEach(input => {
        input.removeEventListener('blur', handleFormChange);
        input.removeEventListener('input', handleFormChange);
      });
      
      if (extractTimeoutRef.current) {
        clearTimeout(extractTimeoutRef.current);
      }
    };
  }, [customerFormRef, onCustomerDataSubmit]);

  return { customerData, hasValidCustomerData };
};
