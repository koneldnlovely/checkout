
import { mockAsaasPaymentHandler, mockCheckPaymentStatusHandler } from './handlers';

// Define FetchEvent interface since it's not available in standard TypeScript types
interface ExtendedFetchEvent extends Event {
  request: Request;
  respondWith(response: Response | Promise<Response>): void;
}

// Setup mock API routes for Vite development server
export function setupMocks() {
  // Register the handler for all /api/* routes
  self.addEventListener('fetch', (event) => {
    // Cast event to our extended type
    const fetchEvent = event as unknown as ExtendedFetchEvent;
    const url = new URL(fetchEvent.request.url);
    
    // Handle mock payment API
    if (url.pathname === '/api/mock-asaas-payment') {
      console.log('Intercepting request to /api/mock-asaas-payment');
      fetchEvent.respondWith(mockAsaasPaymentHandler(fetchEvent.request));
      return;
    }
    
    // Handle mock payment status check (for local testing)
    if (url.pathname === '/api/check-payment-status') {
      console.log('Intercepting request to /api/check-payment-status');
      fetchEvent.respondWith(mockCheckPaymentStatusHandler(fetchEvent.request));
      return;
    }
    
    // For all other routes, let the browser handle the request normally
  });
}
