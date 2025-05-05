
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PaymentStatus } from '@/types/checkout';
import { checkPaymentStatus } from '@/services/asaasService';

interface UsePixPaymentStatusProps {
  paymentId: string;
  orderId: string;
  expirationDate: string;
  productType?: 'digital' | 'physical';
}

interface PaymentStatusResponse {
  status: PaymentStatus;
  error?: string;
}

export const usePixPaymentStatus = ({
  paymentId,
  orderId,
  expirationDate,
  productType = 'physical'
}: UsePixPaymentStatusProps) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<PaymentStatus>("PENDING");
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  // Função para verificar o status do pagamento
  const checkStatus = async () => {
    if (!paymentId || !orderId) {
      console.error("Não é possível verificar o status sem paymentId ou orderId");
      return;
    }

    setIsCheckingStatus(true);
    
    try {
      console.log(`Checking payment status for paymentId: ${paymentId}, orderId: ${orderId}`);
      const response = await checkPaymentStatus(paymentId);
      
      // Handle response based on whether it's the raw status string or a response object
      if (typeof response === 'object' && response !== null) {
        if (response.error) {
          console.error("Erro ao verificar status:", response.error);
          return;
        }
        
        // Normalize status - treat "RECEIVED" as "CONFIRMED"
        const normalizedStatus = 
          response.status === "RECEIVED" ? "CONFIRMED" : response.status;
        
        console.log(`Received payment status: ${response.status}, normalized to: ${normalizedStatus}`);
        setStatus(normalizedStatus as PaymentStatus);
        
        // Redirect if payment is confirmed
        if (normalizedStatus === "CONFIRMED") {
          console.log("Payment confirmed, redirecting to success page...");
          navigate('/success', { 
            state: { 
              order: { id: orderId },
              productType: productType
            } 
          });
        }
      } else {
        // Handle when response is just the status string directly
        const normalizedStatus = 
          response === "RECEIVED" ? "CONFIRMED" : response;
        
        console.log(`Received payment status: ${response}, normalized to: ${normalizedStatus}`);
        setStatus(normalizedStatus as PaymentStatus);
        
        // Redirect if payment is confirmed
        if (normalizedStatus === "CONFIRMED") {
          console.log("Payment confirmed, redirecting to success page...");
          navigate('/success', { 
            state: { 
              order: { id: orderId },
              productType: productType
            } 
          });
        }
      }
    } catch (error) {
      console.error("Erro ao verificar status do pagamento:", error);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  // Verificação inicial do status
  useEffect(() => {
    checkStatus();
    
    // Polling a cada 5 segundos
    const interval = setInterval(() => {
      if (status !== "CONFIRMED") {
        checkStatus();
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [paymentId, orderId]);

  // Cálculo do tempo restante
  useEffect(() => {
    if (!expirationDate) return;
    
    const expiry = new Date(expirationDate).getTime();
    const now = new Date().getTime();
    const initialTimeLeft = Math.max(0, Math.floor((expiry - now) / 1000));
    
    setTimeLeft(initialTimeLeft);
    
    if (initialTimeLeft <= 0) {
      setIsExpired(true);
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setIsExpired(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [expirationDate]);
  
  return {
    status,
    timeLeft,
    isCheckingStatus,
    isExpired,
    forceCheckStatus: checkStatus
  };
};
