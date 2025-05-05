
import { useState } from 'react';
import { useRetryValidator } from '@/hooks/useRetryValidator';

/**
 * Configuration options for validating retry attempts
 */
interface RetryValidationOptions {
  /** Maximum number of attempts allowed (default: 3) */
  maxAttempts: number;
  /** Minimum minutes to wait between attempts (default: 5) */
  minMinutes: number;
  /** Whether to enforce a delay between attempts (default: false) */
  enforceDelay: boolean;
}

/**
 * Result of a validation check for retry attempts
 */
interface RetryValidationResult {
  /** Whether the user can proceed with the retry attempt */
  canProceed: boolean;
  /** User-friendly message about the validation result */
  message?: string;
  /** Number of attempts remaining for the order */
  remainingAttempts?: number;
  /** Wait time in minutes before next attempt is allowed (if applicable) */
  waitTime?: number;
}

/**
 * Custom hook that provides validation logic for payment retry attempts.
 * 
 * This hook combines the functionality from useRetryValidator to check both
 * attempt limits and time-based restrictions for payment retries.
 * 
 * @returns An object containing:
 *   - isValidating: Boolean indicating if validation is in progress
 *   - validateRetryAttempt: Function to validate if a retry attempt can be made
 */
export const useRetryValidation = () => {
  const [isValidating, setIsValidating] = useState(false);
  const { checkRetryLimit, canAttemptNow, isValidating: validatorIsValidating } = useRetryValidator();

  /**
   * Validates whether a retry attempt can be made for a specific order.
   * 
   * This function performs two types of validation:
   * 1. Checks if the maximum number of retry attempts has been reached
   * 2. If enforceDelay is true, verifies that enough time has passed since the last attempt
   * 
   * @param orderId - The ID of the order to validate retry attempt for
   * @param options - Configuration options for validation
   * @param options.maxAttempts - Maximum number of attempts allowed (default: 3)
   * @param options.minMinutes - Minimum minutes to wait between attempts (default: 5)
   * @param options.enforceDelay - Whether to enforce time delay between attempts (default: false)
   * 
   * @returns A promise resolving to a validation result object containing:
   *   - canProceed: Whether the retry attempt is allowed
   *   - message: User-friendly message explaining the result
   *   - remainingAttempts: Number of attempts remaining (if applicable)
   *   - waitTime: Minutes to wait before next attempt (if applicable)
   */
  const validateRetryAttempt = async (
    orderId: string,
    options = { maxAttempts: 3, minMinutes: 5, enforceDelay: false }
  ): Promise<RetryValidationResult> => {
    setIsValidating(true);
    
    try {
      // Verifica o limite de tentativas
      const limitCheck = await checkRetryLimit(orderId, options.maxAttempts);
      
      if (!limitCheck.valid) {
        return {
          canProceed: false,
          message: limitCheck.message,
          remainingAttempts: 0
        };
      }
      
      // Verifica o intervalo entre tentativas (se enforceDelay for true)
      if (options.enforceDelay) {
        const delayCheck = await canAttemptNow(orderId, options.minMinutes);
        
        if (!delayCheck.allowed) {
          return {
            canProceed: false,
            message: delayCheck.message,
            remainingAttempts: options.maxAttempts - limitCheck.currentAttempts,
            waitTime: delayCheck.waitTime
          };
        }
      }
      
      // Tudo ok, pode prosseguir
      return {
        canProceed: true,
        message: limitCheck.message,
        remainingAttempts: options.maxAttempts - limitCheck.currentAttempts
      };
    } finally {
      setIsValidating(false);
    }
  };

  return {
    /**
     * Indicates if a validation process is currently in progress,
     * either in this hook or in the underlying validator hook.
     */
    isValidating: isValidating || validatorIsValidating,
    
    /**
     * Function to validate if a retry attempt can be made for a specific order.
     * See function documentation for details.
     */
    validateRetryAttempt
  };
};
