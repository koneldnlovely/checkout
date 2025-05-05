
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { usePaymentAnalysis } from '../usePaymentAnalysis';
import { Order } from '@/types/checkout';

// Mock the hooks used by usePaymentAnalysis
vi.mock('@/hooks/useOrderData', () => ({
  useOrderData: () => ({
    fetchOrderById: vi.fn().mockResolvedValue({
      id: 'order-123',
      customerId: 'customer-123',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerCpfCnpj: '123.456.789-00',
      customerPhone: '(11) 98765-4321',
      productId: 'product-123',
      productName: 'Test Product',
      productPrice: 99.9,
      status: 'PENDING',
      paymentMethod: 'creditCard',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    }),
    getOrderIdFromUrl: vi.fn().mockReturnValue('order-123')
  })
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

vi.mock('@/hooks/payment/usePaymentStatusChecker', () => ({
  usePaymentStatusChecker: () => ({
    hasTerminalStatus: vi.fn().mockReturnValue({ hasTerminalStatus: false, isSuccess: false }),
    checkOrderStatusInDatabase: vi.fn(),
    checkPaymentStatusInAsaas: vi.fn()
  })
}));

vi.mock('@/hooks/payment/usePaymentNavigation', () => ({
  usePaymentNavigation: () => ({
    navigateToSuccess: vi.fn(),
    navigateToRetryPayment: vi.fn(),
    navigateToHomeWithError: vi.fn()
  })
}));

vi.mock('@/hooks/payment/usePaymentPolling', () => ({
  usePaymentPolling: () => ({
    createPollingInterval: vi.fn().mockReturnValue(123), // Mock interval ID
    checkCount: 0,
    setCheckCount: vi.fn()
  })
}));

vi.mock('@/utils/paymentErrorHandler', () => ({
  logPaymentError: vi.fn()
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
);

describe('usePaymentAnalysis', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with a loading state', () => {
    const { result } = renderHook(() => usePaymentAnalysis(), { wrapper });
    
    expect(result.current.loading).toBe(true);
  });

  it('should load order from initialOrder prop if provided', async () => {
    const mockOrder: Order = {
      id: 'order-456',
      customerId: 'customer-456',
      customerName: 'Jane Doe',
      customerEmail: 'jane@example.com',
      customerCpfCnpj: '987.654.321-00',
      customerPhone: '(11) 98765-4321',
      productId: 'product-456',
      productName: 'Another Product',
      productPrice: 149.9,
      status: 'PENDING',
      paymentMethod: 'pix',
      createdAt: '2023-01-02T00:00:00Z',
      updatedAt: '2023-01-02T00:00:00Z',
    };
    
    const { result, rerender } = renderHook(
      () => usePaymentAnalysis({ initialOrder: mockOrder }),
      { wrapper }
    );
    
    // Wait for useEffect to run
    await vi.runAllTimersAsync();
    rerender();
    
    expect(result.current.order).toEqual(mockOrder);
    expect(result.current.loading).toBe(false);
  });

  it('should handle errors during order loading', async () => {
    // Mock useOrderData to throw an error
    vi.mock('@/hooks/useOrderData', () => ({
      useOrderData: () => ({
        fetchOrderById: vi.fn().mockRejectedValue(new Error('Failed to load order')),
        getOrderIdFromUrl: vi.fn().mockReturnValue('order-123')
      })
    }));
    
    const navigateToHomeWithErrorMock = vi.fn();
    
    vi.mock('@/hooks/payment/usePaymentNavigation', () => ({
      usePaymentNavigation: () => ({
        navigateToSuccess: vi.fn(),
        navigateToRetryPayment: vi.fn(),
        navigateToHomeWithError: navigateToHomeWithErrorMock
      })
    }));
    
    const { result, rerender } = renderHook(() => usePaymentAnalysis(), { wrapper });
    
    // Wait for useEffect to run
    await vi.runAllTimersAsync();
    rerender();
    
    expect(result.current.loading).toBe(false);
    expect(navigateToHomeWithErrorMock).toHaveBeenCalledWith(
      "Falha ao processar pagamento. Tente novamente."
    );
  });
});
