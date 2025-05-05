
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePaymentNavigation } from '../usePaymentNavigation';
import { Order } from '@/types/checkout';

// Mock react-router-dom's useNavigate
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}));

const mockNavigate = vi.fn();

describe('usePaymentNavigation', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('should navigate to success page with order data', () => {
    const { result } = renderHook(() => usePaymentNavigation());
    
    const mockOrder: Order = {
      id: 'order-123',
      customerId: 'customer-123',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerCpfCnpj: '123.456.789-00',
      customerPhone: '(11) 98765-4321',
      productId: 'product-123',
      productName: 'Test Product',
      productPrice: 99.9,
      status: 'CONFIRMED',
      paymentMethod: 'pix',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    };

    result.current.navigateToSuccess(mockOrder);

    expect(mockNavigate).toHaveBeenCalledWith('/success', {
      state: {
        order: mockOrder,
        has_whatsapp_support: false,
        whatsapp_number: ''
      }
    });
  });

  it('should navigate to success page with whatsapp support data', () => {
    const { result } = renderHook(() => usePaymentNavigation());
    
    const mockOrder: Order = {
      id: 'order-123',
      customerId: 'customer-123',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerCpfCnpj: '123.456.789-00',
      customerPhone: '(11) 98765-4321',
      productId: 'product-123',
      productName: 'Test Product',
      productPrice: 99.9,
      status: 'CONFIRMED',
      paymentMethod: 'pix',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    };

    result.current.navigateToSuccess(mockOrder, true, '5511987654321');

    expect(mockNavigate).toHaveBeenCalledWith('/success', {
      state: {
        order: mockOrder,
        has_whatsapp_support: true,
        whatsapp_number: '5511987654321'
      }
    });
  });

  it('should navigate to retry payment page with order data', () => {
    const { result } = renderHook(() => usePaymentNavigation());
    
    const mockOrder: Order = {
      id: 'order-123',
      customerId: 'customer-123',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerCpfCnpj: '123.456.789-00',
      customerPhone: '(11) 98765-4321',
      productId: 'product-123',
      productName: 'Test Product',
      productPrice: 99.9,
      status: 'FAILED',
      paymentMethod: 'creditCard',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    };

    result.current.navigateToRetryPayment(mockOrder);

    expect(mockNavigate).toHaveBeenCalledWith('/retry-payment', {
      state: {
        order: mockOrder,
        autoRetry: true
      }
    });
  });

  it('should navigate to home page with error message after timeout', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => usePaymentNavigation());
    
    result.current.navigateToHomeWithError('Test error message');
    
    expect(mockNavigate).not.toHaveBeenCalled();
    
    vi.advanceTimersByTime(2000);
    
    expect(mockNavigate).toHaveBeenCalledWith('/', {
      state: {
        errorMessage: 'Test error message'
      }
    });
    
    vi.useRealTimers();
  });
});
