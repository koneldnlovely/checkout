
import { useState, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CustomerData, PaymentMethod, Product, CreditCardData, AddressData } from '@/types/checkout';
import { useRedirectConfig } from './checkout/useRedirectConfig';
import { usePaymentNavigation } from './checkout/usePaymentNavigation';
import { useOrderHandler } from './checkout/useOrderHandler';

export const useCheckoutState = (product: Product | undefined) => {
  const { toast } = useToast();
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('creditCard');
  const lastSubmitTimeRef = useRef<number>(0);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { redirectPage } = useRedirectConfig();
  const { navigateToPayment, navigateToFailure } = usePaymentNavigation();
  const { handleOrderCreation, isSubmitting, setIsSubmitting } = useOrderHandler();
  
  // Debounced customer data submission to prevent excessive logging
  const handleCustomerSubmit = useCallback((data: CustomerData) => {
    // Clear any existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // Use debouncing to prevent too many calls
    debounceTimeoutRef.current = setTimeout(() => {
      const now = Date.now();
      // Only process if it's been at least 1 second since the last submission
      if (now - lastSubmitTimeRef.current > 1000) {
        // Log only once when debugging
        console.log('Customer data received');
        
        // Validate customer data
        if (!data.name || !data.email || !data.cpfCnpj || !data.phone) {
          console.error('Missing required customer data fields');
          return;
        }
        
        // Store customer data in state for later use
        setCustomerData(data);
        lastSubmitTimeRef.current = now;
      }
    }, 500);
  }, []);
  
  const handleAddressSubmit = useCallback((data: AddressData) => {
    console.log('Address data received:', data);
    setAddressData(data);
  }, []);
  
  const handlePaymentSubmit = async (paymentData?: CreditCardData, existingOrderId?: string) => {
    if (!product) {
      console.error('Missing product data');
      toast({
        title: "Erro",
        description: "Produto não encontrado",
        variant: "destructive",
      });
      return;
    }
    
    // Check if we have customer data in state before proceeding
    if (!customerData || !customerData.name || !customerData.email || !customerData.cpfCnpj || !customerData.phone) {
      console.error('Missing customer data');
      toast({
        title: "Erro",
        description: "Por favor, preencha seus dados pessoais",
        variant: "destructive",
      });
      return;
    }
    
    // Check if address is required (physical product) and validate it
    if (product.type === 'physical' && !addressData) {
      console.error('Missing address data for physical product');
      toast({
        title: "Erro",
        description: "Por favor, preencha o endereço de entrega",
        variant: "destructive",
      });
      return;
    }
    
    console.log("Processing payment with customer data", { name: customerData.name, email: customerData.email });
    setIsSubmitting(true);
    
    // Define order variable outside the try block so it's accessible in catch
    let currentOrder: any = null;
    let billingData: any = null;
    
    try {
      const result = await handleOrderCreation(
        customerData, 
        product, 
        paymentMethod, 
        paymentData, 
        existingOrderId,
        addressData
      );
      
      currentOrder = result.currentOrder;
      billingData = result.billingData;
      
      navigateToPayment(
        paymentMethod, 
        currentOrder, 
        billingData, 
        redirectPage, 
        customerData, 
        product
      );
    } catch (error) {
      navigateToFailure(error, customerData, currentOrder);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    customerData,
    addressData,
    paymentMethod,
    isSubmitting,
    handleCustomerSubmit,
    handleAddressSubmit,
    setPaymentMethod,
    handlePaymentSubmit
  };
};
