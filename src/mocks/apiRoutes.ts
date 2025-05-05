
import { IncomingMessage, ServerResponse } from 'http';
import { handler as webhookSimulatorHandler } from '../pages/api/webhook-simulator';
import { handler as mockAsaasPaymentHandler } from '../pages/api/mock-asaas-payment';
import { handler as checkPaymentStatusHandler } from '../pages/api/check-payment-status';

// This is a mapping of API routes to their handlers
export const apiRoutes: Record<string, (req: Request) => Promise<Response>> = {
  '/api/webhook-simulator': webhookSimulatorHandler,
  '/api/mock-asaas-payment': mockAsaasPaymentHandler,
  '/api/check-payment-status': checkPaymentStatusHandler
};

// Custom type for middleware
type NextFunction = () => void;

// Middleware for Vite server to handle API routes
export const apiRoutesMiddleware = async (
  req: IncomingMessage, 
  res: ServerResponse, 
  next: NextFunction
) => {
  const path = req.url || '';
  
  // Check if we have a handler for this route - exact match first
  if (path in apiRoutes) {
    console.log(`Handling API route (exact match): ${path}`);
    await handleApiRoute(path, req, res, next);
    return;
  }
  
  // Check for path match with query params
  for (const route in apiRoutes) {
    if (path.startsWith(route + '?')) {
      console.log(`Handling API route (with query params): ${path}`);
      await handleApiRoute(route, req, res, next);
      return;
    }
  }
  
  // Not an API route we handle, continue with normal request processing
  next();
};

// Helper function to handle API routes
async function handleApiRoute(
  route: string,
  req: IncomingMessage, 
  res: ServerResponse, 
  next: NextFunction
) {
  try {
    // Get the original full URL
    const originalUrl = req.url || '';
    
    // Parse body if it wasn't already parsed
    let body = undefined;
    
    // If req has already parsed body (added by our mockPlugin middleware)
    if ('body' in req && typeof (req as any).body !== 'undefined') {
      body = JSON.stringify((req as any).body);
    }
    
    // Build the request URL (preserve the full path with query params)
    const url = new URL(originalUrl, 'http://localhost');
    
    // Convert node http request to a fetch API Request
    const request = new Request(url.toString(), {
      method: req.method || 'GET',
      headers: req.headers as any,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? body : undefined,
    });
    
    // Call the handler with our Request object
    const response = await apiRoutes[route](request);
    
    // Send the response status
    res.statusCode = response.status;
    
    // Set the response headers
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    
    // Send the response body
    const responseBody = await response.text();
    res.end(responseBody);
  } catch (error) {
    console.error(`Error handling API route ${route}:`, error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
}
