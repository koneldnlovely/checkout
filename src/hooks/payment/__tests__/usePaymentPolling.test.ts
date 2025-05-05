
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePaymentPolling } from '../usePaymentPolling';
import { Order } from '@/types/checkout';

// Mock the hooks used by usePaymentPolling
vi.mock('../usePaymentStatusChecker', () => ({
  usePaymentStatusChecker: () => ({
    checkOrderStatusInDatabase: vi.fn(),
    checkPaymentStatusInAsaas: vi.fn()
  })
}));

vi.mock('../usePaymentNavigation', () => ({
  usePaymentNavigation: () => ({
    navigateToSuccess: vi.fn(),
    navigateToRetryPayment: vi.fn()
  })
}));

describe('usePaymentPolling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should handle temporary payment IDs with delayed success', () => {
    const navigateToSuccessMock = vi.fn();
    
    // Override the mock implementation for this specific test
    vi.mock('../usePaymentNavigation', () => ({
      usePaymentNavigation: () => ({
        navigateToSuccess: navigateToSuccessMock,
        navigateToRetryPayment: vi.fn()
      })
    }));
    
    const mockFetchOrderById = vi.fn();
    
    const { result } = renderHook(() => usePaymentPolling({
      fetchOrderById: mockFetchOrderById
    }));
    
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
      status: 'PENDING',
      paymentMethod: 'creditCard',
      asaasPaymentId: 'temp_123456',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    };
    
    const timeoutId = result.current.handleTemporaryPaymentId(mockOrder);
    
    expect(timeoutId).not.toBeNull();
    expect(navigateToSuccessMock).not.toHaveBeenCalled();
    
    // Advance timers to trigger the timeout
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    
    expect(navigateToSuccessMock).toHaveBeenCalledWith(mockOrder);
  });

  it('should handle temporary retry payment IDs with delayed success', () => {
    const navigateToSuccessMock = vi.fn();
    
    // Override the mock implementation for this specific test
    vi.mock('../usePaymentNavigation', () => ({
      usePaymentNavigation: () => ({
        navigateToSuccess: navigateToSuccessMock,
        navigateToRetryPayment: vi.fn()
      })
    }));
    
    const mockFetchOrderById = vi.fn();
    
    const { result } = renderHook(() => usePaymentPolling({
      fetchOrderById: mockFetchOrderById
    }));
    
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
      status: 'PENDING',
      paymentMethod: 'creditCard',
      asaasPaymentId: 'temp_retry_123456',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    };
    
    const timeoutId = result.current.handleTemporaryPaymentId(mockOrder);
    
    expect(timeoutId).not.toBeNull();
    expect(navigateToSuccessMock).not.toHaveBeenCalled();
    
    // Advance timers to trigger the timeout
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    
    expect(navigateToSuccessMock).toHaveBeenCalledWith(mockOrder);
  });

  it('should return null for regular payment IDs', () => {
    const mockFetchOrderById = vi.fn();
    
    const { result } = renderHook(() => usePaymentPolling({
      fetchOrderById: mockFetchOrderById
    }));
    
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
      status: 'PENDING',
      paymentMethod: 'creditCard',
      asaasPaymentId: 'pay_123456789',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    };
    
    const timeoutId = result.current.handleTemporaryPaymentId(mockOrder);
    
    expect(timeoutId).toBeNull();
  });

  it('should create polling interval for regular payment IDs', () => {
    const mockCheckOrderStatusInDatabase = vi.fn().mockResolvedValue({ statusChanged: false });
    const mockCheckPaymentStatusInAsaas = vi.fn().mockResolvedValue({ statusChanged: false });
    
    // Override the mock implementation for this specific test
    vi.mock('../usePaymentStatusChecker', () => ({
      usePaymentStatusChecker: () => ({
        checkOrderStatusInDatabase: mockCheckOrderStatusInDatabase,
        checkPaymentStatusInAsaas: mockCheckPaymentStatusInAsaas
      })
    }));
    
    const mockFetchOrderById = vi.fn();
    
    const { result } = renderHook(() => usePaymentPolling({
      fetchOrderById: mockFetchOrderById,
      pollingInterval: 1000 // Use a shorter interval for testing
    }));
    
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
      status: 'PENDING',
      paymentMethod: 'creditCard',
      asaasPaymentId: 'pay_123456789',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    };
    
    const intervalId = result.current.createPollingInterval(mockOrder);
    
    expect(intervalId).not.toBeNull();
    
    // Advance timers to trigger the interval once
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    expect(mockCheckOrderStatusInDatabase).toHaveBeenCalledWith(mockOrder, mockFetchOrderById);
    expect(mockCheckPaymentStatusInAsaas).toHaveBeenCalledWith(mockOrder, 1);
    
    // Clean up the interval
    if (intervalId) {
      clearInterval(intervalId);
    }
  });
});
