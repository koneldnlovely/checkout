
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for validating retry attempts
 * Extracted from useRetryValidation.ts to separate concerns
 */
export const useRetryValidator = () => {
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  /**
   * Verifica se o pedido atingiu o limite máximo de tentativas
   */
  const checkRetryLimit = async (
    orderId: string, 
    maxAttempts = 3
  ): Promise<{ valid: boolean; message?: string; currentAttempts: number }> => {
    setIsValidating(true);
    
    try {
      const { count, error } = await supabase
        .from('card_data')
        .select('*', { count: 'exact' })
        .eq('order_id', orderId);
      
      if (error) throw new Error(error.message);
      
      const currentAttempts = count || 0;
      const remainingAttempts = Math.max(0, maxAttempts - currentAttempts);
      
      if (currentAttempts >= maxAttempts) {
        return {
          valid: false,
          message: `Limite máximo de ${maxAttempts} tentativas atingido para este pedido.`,
          currentAttempts
        };
      }
      
      return {
        valid: true,
        message: remainingAttempts === 1 
          ? "Esta é sua última tentativa disponível" 
          : `Você tem ${remainingAttempts} tentativas restantes`,
        currentAttempts
      };
    } catch (error) {
      console.error('Erro ao verificar limite de tentativas:', error);
      return {
        valid: true, // Em caso de erro, permitimos a tentativa para não bloquear o usuário
        message: "Não foi possível verificar o limite de tentativas",
        currentAttempts: 0
      };
    } finally {
      setIsValidating(false);
    }
  };

  /**
   * Verifica se já passou tempo suficiente desde a última tentativa
   */
  const canAttemptNow = async (
    orderId: string,
    minMinutes = 5
  ): Promise<{ allowed: boolean; waitTime?: number; message?: string }> => {
    setIsValidating(true);
    
    try {
      const { data, error } = await supabase
        .from('card_data')
        .select('created_at')
        .eq('order_id', orderId)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) throw new Error(error.message);
      
      // Se não houver tentativas anteriores, pode tentar agora
      if (!data || data.length === 0) {
        return { allowed: true };
      }
      
      const lastAttemptTime = new Date(data[0].created_at);
      const now = new Date();
      const diffMinutes = (now.getTime() - lastAttemptTime.getTime()) / 60000;
      
      if (diffMinutes < minMinutes) {
        const waitTimeMinutes = Math.ceil(minMinutes - diffMinutes);
        return {
          allowed: false,
          waitTime: waitTimeMinutes,
          message: `Por favor, aguarde ${waitTimeMinutes} ${waitTimeMinutes === 1 ? 'minuto' : 'minutos'} antes de tentar novamente.`
        };
      }
      
      return { allowed: true };
    } catch (error) {
      console.error('Erro ao verificar tempo entre tentativas:', error);
      return {
        allowed: true, // Em caso de erro, permitimos a tentativa para não bloquear o usuário
        message: "Não foi possível verificar o intervalo entre tentativas"
      };
    } finally {
      setIsValidating(false);
    }
  };

  return {
    isValidating,
    checkRetryLimit,
    canAttemptNow
  };
};
