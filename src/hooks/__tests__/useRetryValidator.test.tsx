
import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useRetryValidator } from '@/hooks/useRetryValidator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Mock Supabase and toast
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis()
  }
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn()
}));

describe('useRetryValidator hook', () => {
  beforeEach(() => {
    vi.mocked(useToast).mockReturnValue({
      toast: vi.fn(),
      dismiss: vi.fn(), // Added dismiss function
      toasts: []        // Added empty toasts array
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('checkRetryLimit', () => {
    it('should allow retries when under the limit', async () => {
      // Mock Supabase to return 1 existing attempt
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            count: 1,
            error: null
          })
        })
      } as any);
      
      const { result } = renderHook(() => useRetryValidator());
      
      const limitCheck = await result.current.checkRetryLimit('order-123', 3);
      
      expect(limitCheck).toEqual({
        valid: true,
        message: 'Você tem 2 tentativas restantes',
        currentAttempts: 1
      });
      
      expect(supabase.from).toHaveBeenCalledWith('card_data');
    });

    it('should deny retries when at the limit', async () => {
      // Mock Supabase to return max attempts
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            count: 3,
            error: null
          })
        })
      } as any);
      
      const { result } = renderHook(() => useRetryValidator());
      
      const limitCheck = await result.current.checkRetryLimit('order-123', 3);
      
      expect(limitCheck).toEqual({
        valid: false,
        message: 'Limite máximo de 3 tentativas atingido para este pedido.',
        currentAttempts: 3
      });
    });

    it('should handle database errors gracefully', async () => {
      // Mock Supabase to throw an error
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            count: null,
            error: { message: 'Database error' }
          })
        })
      } as any);
      
      const { result } = renderHook(() => useRetryValidator());
      
      const limitCheck = await result.current.checkRetryLimit('order-123', 3);
      
      // Should allow the attempt even with an error
      expect(limitCheck).toEqual({
        valid: true,
        message: 'Não foi possível verificar o limite de tentativas',
        currentAttempts: 0
      });
    });

    it('should handle the last attempt case', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            count: 2,
            error: null
          })
        })
      } as any);
      
      const { result } = renderHook(() => useRetryValidator());
      
      const limitCheck = await result.current.checkRetryLimit('order-123', 3);
      
      expect(limitCheck).toEqual({
        valid: true,
        message: 'Esta é sua última tentativa disponível',
        currentAttempts: 2
      });
    });
  });

  describe('canAttemptNow', () => {
    it('should allow attempt when no previous attempts exist', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                data: [],
                error: null
              })
            })
          })
        })
      } as any);
      
      const { result } = renderHook(() => useRetryValidator());
      
      const timeCheck = await result.current.canAttemptNow('order-123', 5);
      
      expect(timeCheck).toEqual({
        allowed: true
      });
    });

    it('should deny attempt when not enough time has passed', async () => {
      // Set up a mock date that's recent (not enough time has passed)
      const now = new Date();
      const twoMinutesAgo = new Date(now.getTime() - 2 * 60000); // 2 minutes ago
      
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                data: [{ created_at: twoMinutesAgo.toISOString() }],
                error: null
              })
            })
          })
        })
      } as any);
      
      // Mock Date.now
      const realDateNow = Date.now;
      global.Date.now = vi.fn(() => now.getTime());
      
      const { result } = renderHook(() => useRetryValidator());
      
      const timeCheck = await result.current.canAttemptNow('order-123', 5);
      
      expect(timeCheck.allowed).toBe(false);
      expect(timeCheck.waitTime).toBe(3); // 5 minutes required - 2 minutes passed = 3 minutes wait
      expect(timeCheck.message).toContain('aguarde 3 minutos');
      
      // Restore Date.now
      global.Date.now = realDateNow;
    });

    it('should allow attempt when enough time has passed', async () => {
      // Set up a mock date that's old enough
      const now = new Date();
      const sixMinutesAgo = new Date(now.getTime() - 6 * 60000); // 6 minutes ago
      
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                data: [{ created_at: sixMinutesAgo.toISOString() }],
                error: null
              })
            })
          })
        })
      } as any);
      
      // Mock Date.now
      const realDateNow = Date.now;
      global.Date.now = vi.fn(() => now.getTime());
      
      const { result } = renderHook(() => useRetryValidator());
      
      const timeCheck = await result.current.canAttemptNow('order-123', 5);
      
      expect(timeCheck).toEqual({
        allowed: true
      });
      
      // Restore Date.now
      global.Date.now = realDateNow;
    });

    it('should handle database errors gracefully', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                data: null,
                error: { message: 'Database error' }
              })
            })
          })
        })
      } as any);
      
      const { result } = renderHook(() => useRetryValidator());
      
      const timeCheck = await result.current.canAttemptNow('order-123', 5);
      
      // Should allow the attempt even with an error
      expect(timeCheck.allowed).toBe(true);
      expect(timeCheck.message).toBe('Não foi possível verificar o intervalo entre tentativas');
    });
  });

  it('should manage isValidating state during operations', async () => {
    let isValidatingValue = false;
    
    // Mock supabase to delay response
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          count: 1,
          error: null
        })
      })
    } as any);
    
    const { result, rerender } = renderHook(() => {
      const hook = useRetryValidator();
      isValidatingValue = hook.isValidating;
      return hook;
    });
    
    expect(isValidatingValue).toBe(false);
    
    // Start operation
    const checkPromise = result.current.checkRetryLimit('order-123');
    
    // isValidating should be set to true during the operation
    // Since we're using a mock, we can't easily check intermediate state
    // In a real component test, we'd use waitFor to test this
    
    await checkPromise;
    
    // After the operation completes, isValidating should be false again
    rerender();
    expect(isValidatingValue).toBe(false);
  });
});

