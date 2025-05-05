
import { Order, PaymentStatus } from '@/types/checkout';
import { vi } from 'vitest';

/**
 * Creates a mock order with default values
 */
export const createMockOrder = (overrides?: Partial<Order>): Order => ({
  id: 'order-123',
  customerId: 'customer-123',
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  customerCpfCnpj: '123.456.789-00',
  customerPhone: '(11) 98765-4321',
  productId: 'product-123',
  productName: 'Test Product',
  productPrice: 99.9,
  status: 'PENDING' as PaymentStatus,
  paymentMethod: 'creditCard',
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
  ...overrides
});

/**
 * Creates a mock function that simulates fetchOrderById with different statuses
 */
export const createMockFetchOrderById = (status: PaymentStatus = 'PENDING') => {
  return vi.fn().mockImplementation((orderId: string) => {
    if (!orderId) return null;
    
    return Promise.resolve({
      ...createMockOrder(),
      id: orderId,
      status
    });
  });
};
