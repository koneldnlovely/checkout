
import { Plugin } from 'vite';
import { IncomingMessage, ServerResponse } from 'http';
import { apiRoutesMiddleware } from './apiRoutes';

// Extend IncomingMessage type to allow for body property
interface ExtendedIncomingMessage extends IncomingMessage {
  body?: any;
}

export const mockApiPlugin = (): Plugin => {
  return {
    name: 'mock-api-plugin',
    configureServer(server) {
      // Add debug logging
      console.log('Configuring mock API plugin...');
      
      // Middleware to parse request body
      server.middlewares.use(async (req: ExtendedIncomingMessage, res: ServerResponse, next) => {
        console.log(`Request received for: ${req.url}`);
        
        // Parse request body for API routes
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
          try {
            const chunks: Buffer[] = [];
            for await (const chunk of req) {
              chunks.push(Buffer.from(chunk));
            }
            const body = Buffer.concat(chunks).toString('utf8');
            req.body = body ? JSON.parse(body) : {};
          } catch (error) {
            console.error('Error parsing request body:', error);
          }
        }
        
        next();
      });

      // Add our API routes middleware
      server.middlewares.use(apiRoutesMiddleware);
    },
  };
};
