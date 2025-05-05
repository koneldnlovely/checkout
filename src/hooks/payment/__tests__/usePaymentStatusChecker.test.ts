
import { usePaymentStatusChecker } from '../usePaymentStatusChecker';
import { renderHook } from '@testing-library/react';
import { Order, PaymentStatus } from '@/types/checkout';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the fetchOrderById function
const mockFetchOrderById = vi.fn();

// Mock the checkPaymentStatus function
const mockCheckPaymentStatus = vi.fn();

vi.mock('@/services/asaasService', () => ({
  checkPaymentStatus: (paymentId: string) => mockCheckPaymentStatus(paymentId),
}));

describe('usePaymentStatusChecker', () => {
  beforeEach(() => {
    mockFetchOrderById.mockReset();
    mockCheckPaymentStatus.mockReset();
  });

  describe('hasTerminalStatus', () => {
    it('should correctly identify failure terminal statuses', () => {
      // Update to include id property
      const failureOrder: Order = {
        id: 'test-id', // Add the missing id property
        customerId: 'customer123',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerCpfCnpj: '123.456.789-00',
        customerPhone: '(11) 98765-4321',
        productId: 'product123',
        productName: 'Test Product',
        productPrice: 100,
        status: 'PENDING',
        paymentMethod: 'creditCard',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      };

      const { result } = renderHook(() => usePaymentStatusChecker());
      const { hasTerminalStatus } = result.current;

      // Update the order status to a failure status
      failureOrder.status = 'FAILED';
      const failureResult = hasTerminalStatus(failureOrder);
      expect(failureResult.hasTerminalStatus).toBe(true);
      expect(failureResult.isSuccess).toBe(false);

      failureOrder.status = 'DECLINED';
      const declinedResult = hasTerminalStatus(failureOrder);
      expect(declinedResult.hasTerminalStatus).toBe(true);
      expect(declinedResult.isSuccess).toBe(false);

      failureOrder.status = 'CANCELLED';
      const cancelledResult = hasTerminalStatus(failureOrder);
      expect(cancelledResult.hasTerminalStatus).toBe(true);
      expect(cancelledResult.isSuccess).toBe(false);
    });

    it('should correctly identify success terminal statuses', () => {
      const successOrder: Order = {
        id: 'test-id', // Add the missing id property
        customerId: 'customer123',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerCpfCnpj: '123.456.789-00',
        customerPhone: '(11) 98765-4321',
        productId: 'product123',
        productName: 'Test Product',
        productPrice: 100,
        status: 'PENDING',
        paymentMethod: 'creditCard',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      };

      const { result } = renderHook(() => usePaymentStatusChecker());
      const { hasTerminalStatus } = result.current;

      // Update the order status to a success status
      successOrder.status = 'CONFIRMED';
      const successResult = hasTerminalStatus(successOrder);
      expect(successResult.hasTerminalStatus).toBe(true);
      expect(successResult.isSuccess).toBe(true);
    });

    it('should return false when the order does not have a terminal status', () => {
      const pendingOrder: Order = {
        id: 'test-id', // Add the missing id property
        customerId: 'customer123',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerCpfCnpj: '123.456.789-00',
        customerPhone: '(11) 98765-4321',
        productId: 'product123',
        productName: 'Test Product',
        productPrice: 100,
        status: 'PENDING',
        paymentMethod: 'creditCard',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      };

      const { result } = renderHook(() => usePaymentStatusChecker());
      const { hasTerminalStatus } = result.current;

      const pendingResult = hasTerminalStatus(pendingOrder);
      expect(pendingResult.hasTerminalStatus).toBe(false);
      expect(pendingResult.isSuccess).toBe(false);
    });
  });

  describe('checkOrderStatusInDatabase', () => {
    it('should return statusChanged true and isSuccess false when order status is updated to failed in database', async () => {
      const initialOrder: Order = {
        id: 'test-id', // Add the missing id property
        customerId: 'customer123',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerCpfCnpj: '123.456.789-00',
        customerPhone: '(11) 98765-4321',
        productId: 'product123',
        productName: 'Test Product',
        productPrice: 100,
        status: 'PENDING',
        paymentMethod: 'creditCard',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      };

      mockFetchOrderById.mockResolvedValue({ ...initialOrder, status: 'FAILED' });

      const { result } = renderHook(() => usePaymentStatusChecker());
      const { checkOrderStatusInDatabase } = result.current;

      const { statusChanged, updatedOrder, isSuccess } = await checkOrderStatusInDatabase(
        initialOrder,
        mockFetchOrderById
      );

      expect(statusChanged).toBe(true);
      expect(updatedOrder).toEqual({ ...initialOrder, status: 'FAILED' });
      expect(isSuccess).toBe(false);
      expect(mockFetchOrderById).toHaveBeenCalledWith(initialOrder.id);
    });

    it('should return statusChanged true and isSuccess true when order status is updated to confirmed in database', async () => {
      const initialOrder: Order = {
        id: 'test-id', // Add the missing id property
        customerId: 'customer123',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerCpfCnpj: '123.456.789-00',
        customerPhone: '(11) 98765-4321',
        productId: 'product123',
        productName: 'Test Product',
        productPrice: 100,
        status: 'PENDING',
        paymentMethod: 'creditCard',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      };

      mockFetchOrderById.mockResolvedValue({ ...initialOrder, status: 'CONFIRMED' });

      const { result } = renderHook(() => usePaymentStatusChecker());
      const { checkOrderStatusInDatabase } = result.current;

      const { statusChanged, updatedOrder, isSuccess } = await checkOrderStatusInDatabase(
        initialOrder,
        mockFetchOrderById
      );

      expect(statusChanged).toBe(true);
      expect(updatedOrder).toEqual({ ...initialOrder, status: 'CONFIRMED' });
      expect(isSuccess).toBe(true);
      expect(mockFetchOrderById).toHaveBeenCalledWith(initialOrder.id);
    });

    it('should return statusChanged false when order status is not updated in database', async () => {
      const initialOrder: Order = {
        id: 'test-id', // Add the missing id property
        customerId: 'customer123',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerCpfCnpj: '123.456.789-00',
        customerPhone: '(11) 98765-4321',
        productId: 'product123',
        productName: 'Test Product',
        productPrice: 100,
        status: 'PENDING',
        paymentMethod: 'creditCard',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      };

      mockFetchOrderById.mockResolvedValue(initialOrder);

      const { result } = renderHook(() => usePaymentStatusChecker());
      const { checkOrderStatusInDatabase } = result.current;

      const { statusChanged, updatedOrder, isSuccess } = await checkOrderStatusInDatabase(
        initialOrder,
        mockFetchOrderById
      );

      expect(statusChanged).toBe(false);
      expect(updatedOrder).toBeUndefined();
      expect(isSuccess).toBeUndefined();
      expect(mockFetchOrderById).toHaveBeenCalledWith(initialOrder.id);
    });

    it('should handle errors when checking order status in database', async () => {
      const initialOrder: Order = {
        id: 'test-id', // Add the missing id property
        customerId: 'customer123',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerCpfCnpj: '123.456.789-00',
        customerPhone: '(11) 98765-4321',
        productId: 'product123',
        productName: 'Test Product',
        productPrice: 100,
        status: 'PENDING',
        paymentMethod: 'creditCard',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      };

      mockFetchOrderById.mockRejectedValue(new Error('Failed to fetch order'));

      const { result } = renderHook(() => usePaymentStatusChecker());
      const { checkOrderStatusInDatabase } = result.current;

      const { statusChanged } = await checkOrderStatusInDatabase(
        initialOrder,
        mockFetchOrderById
      );

      expect(statusChanged).toBe(false);
      expect(mockFetchOrderById).toHaveBeenCalledWith(initialOrder.id);
    });
  });

  describe('checkPaymentStatusInAsaas', () => {
    it('should return statusChanged true and status CONFIRMED when payment status is confirmed in Asaas', async () => {
      const initialOrder: Order = {
        id: 'test-id', // Add the missing id property
        customerId: 'customer123',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerCpfCnpj: '123.456.789-00',
        customerPhone: '(11) 98765-4321',
        productId: 'product123',
        productName: 'Test Product',
        productPrice: 100,
        status: 'PENDING',
        paymentMethod: 'creditCard',
        asaasPaymentId: 'payment123',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      };

      mockCheckPaymentStatus.mockResolvedValue('CONFIRMED');

      const { result } = renderHook(() => usePaymentStatusChecker());
      const { checkPaymentStatusInAsaas } = result.current;

      const { statusChanged, status } = await checkPaymentStatusInAsaas(initialOrder, 1);

      expect(statusChanged).toBe(true);
      expect(status).toBe('CONFIRMED');
      expect(mockCheckPaymentStatus).toHaveBeenCalledWith(initialOrder.asaasPaymentId);
    });

    it('should return statusChanged true and status FAILED when payment status is failed in Asaas', async () => {
      const initialOrder: Order = {
        id: 'test-id', // Add the missing id property
        customerId: 'customer123',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerCpfCnpj: '123.456.789-00',
        customerPhone: '(11) 98765-4321',
        productId: 'product123',
        productName: 'Test Product',
        productPrice: 100,
        status: 'PENDING',
        paymentMethod: 'creditCard',
        asaasPaymentId: 'payment123',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      };

      mockCheckPaymentStatus.mockResolvedValue('FAILED');

      const { result } = renderHook(() => usePaymentStatusChecker());
      const { checkPaymentStatusInAsaas } = result.current;

      const { statusChanged, status } = await checkPaymentStatusInAsaas(initialOrder, 1);

      expect(statusChanged).toBe(true);
      expect(status).toBe('FAILED');
      expect(mockCheckPaymentStatus).toHaveBeenCalledWith(initialOrder.asaasPaymentId);
    });

    it('should return statusChanged false when payment status is not updated in Asaas', async () => {
      const initialOrder: Order = {
        id: 'test-id', // Add the missing id property
        customerId: 'customer123',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerCpfCnpj: '123.456.789-00',
        customerPhone: '(11) 98765-4321',
        productId: 'product123',
        productName: 'Test Product',
        productPrice: 100,
        status: 'PENDING',
        paymentMethod: 'creditCard',
        asaasPaymentId: 'payment123',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      };

      mockCheckPaymentStatus.mockResolvedValue('PENDING');

      const { result } = renderHook(() => usePaymentStatusChecker());
      const { checkPaymentStatusInAsaas } = result.current;

      const { statusChanged, status } = await checkPaymentStatusInAsaas(initialOrder, 1);

      expect(statusChanged).toBe(false);
      expect(status).toBeUndefined();
      expect(mockCheckPaymentStatus).toHaveBeenCalledWith(initialOrder.asaasPaymentId);
    });
  });
});
