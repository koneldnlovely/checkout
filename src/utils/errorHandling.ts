
/**
 * Handles API errors in a standardized way
 */
interface ErrorHandlerOptions {
  toast?: any;
  defaultMessage?: string;
  onError?: (error: any) => void;
  logError?: boolean;
}

/**
 * Handles API errors in a standardized way
 */
export const handleApiError = (error: any, options: ErrorHandlerOptions = {}) => {
  const {
    toast,
    defaultMessage = "Ocorreu um erro inesperado. Tente novamente.",
    onError,
    logError = true
  } = options;

  // Always log the error to console in development
  if (logError) {
    console.error("API Error:", error);
  }

  // Extract error message based on error type
  let errorMessage = defaultMessage;

  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else if (error && typeof error === 'object') {
    // Handle Supabase error
    if ('code' in error && 'message' in error) {
      errorMessage = `Erro ${error.code}: ${error.message}`;
    }
    // Handle Fetch API error
    else if ('status' in error && 'statusText' in error) {
      errorMessage = `${error.status}: ${error.statusText}`;
    }
    // Handle error response from API
    else if ('data' in error && error.data && typeof error.data === 'object') {
      errorMessage = error.data.message || error.data.error || defaultMessage;
    }
  }

  // Display toast if provided
  if (toast) {
    toast({
      title: "Erro",
      description: errorMessage,
      variant: "destructive",
    });
  }

  // Call custom error handler if provided
  if (onError) {
    onError(error);
  }

  return errorMessage;
};

/**
 * Formats a payment status error message
 */
export const getPaymentStatusErrorMessage = (status: string): string => {
  const statusMessages: Record<string, string> = {
    'CANCELLED': 'O pagamento foi cancelado',
    'REFUNDED': 'O pagamento foi estornado',
    'OVERDUE': 'O prazo de pagamento expirou',
    'ERROR': 'Ocorreu um erro no processamento do pagamento',
    'DECLINED': 'O pagamento foi recusado pela operadora'
  };

  return statusMessages[status] || `Status de pagamento: ${status}`;
};
