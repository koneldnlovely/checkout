
import { useState, useEffect, useRef, useCallback } from 'react';
import { PaymentStatus } from '@/types/checkout';
import { checkPaymentStatus } from '@/services/asaasService';

interface UsePaymentPollingResult {
  status: PaymentStatus;
  isCheckingStatus: boolean;
  error: string | null;
  forceCheck: () => void;
}

export const usePaymentPolling = (
  paymentId: string, 
  initialStatus: PaymentStatus = 'PENDING'
): UsePaymentPollingResult => {
  const [status, setStatus] = useState<PaymentStatus>(initialStatus);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollingIntervalRef = useRef<number | null>(null);
  const lastCheckRef = useRef<number>(0);
  
  // Function to check payment status
  const checkStatus = useCallback(async () => {
    if (!paymentId) {
      console.log('No payment ID provided for status check');
      return;
    }
    
    // Enforce minimum 2 seconds between checks
    const now = Date.now();
    if (now - lastCheckRef.current < 2000) {
      console.log('Rate limiting status check, too frequent');
      return;
    }
    lastCheckRef.current = now;
    
    console.log(`Checking payment status for ID: ${paymentId}`);
    setIsCheckingStatus(true);
    setError(null);
    
    try {
      const response = await checkPaymentStatus(paymentId);
      console.log(`Received payment status:`, response);
      
      // Extract status based on response type
      let normalizedStatus: PaymentStatus;
      
      if (typeof response === 'object' && response !== null && 'status' in response) {
        // Handle case when response is an object with status property
        normalizedStatus = response.status as PaymentStatus;
        
        // If there's an error, set it
        if ('error' in response && response.error) {
          setError(response.error);
        }
      } else {
        // Handle case when response is directly the status string
        normalizedStatus = response as PaymentStatus;
      }
      
      // Only update if status changed
      if (normalizedStatus !== status) {
        console.log(`Payment status changed from ${status} to ${normalizedStatus}`);
        setStatus(normalizedStatus);
        
        // If payment is completed (confirmed/cancelled/refunded), stop polling
        if (['CONFIRMED', 'CANCELLED', 'REFUNDED', 'OVERDUE'].includes(normalizedStatus)) {
          console.log('Payment completed, stopping polling');
          stopPolling();
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao verificar status';
      console.error('Error checking payment status:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsCheckingStatus(false);
    }
  }, [paymentId, status]);
  
  // Start polling
  const startPolling = useCallback(() => {
    console.log('Starting payment status polling');
    stopPolling(); // Clear any existing interval
    
    // Force an immediate check
    checkStatus();
    
    // Set up interval for recurring checks
    pollingIntervalRef.current = window.setInterval(checkStatus, 6000);
  }, [checkStatus]);
  
  // Stop polling
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      console.log('Stopping payment status polling');
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);
  
  // Force check on demand (manual refresh)
  const forceCheck = useCallback(() => {
    console.log('Manually triggering payment status check');
    checkStatus();
  }, [checkStatus]);
  
  // Initialize polling when component mounts
  useEffect(() => {
    if (paymentId && status === 'PENDING') {
      console.log('Initializing payment polling for pending payment');
      startPolling();
    }
    
    // Clean up on unmount
    return () => {
      stopPolling();
    };
  }, [paymentId, status, startPolling, stopPolling]);
  
  return {
    status,
    isCheckingStatus,
    error,
    forceCheck
  };
};
