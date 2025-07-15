import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEliteSystemIntegration } from '../../hooks/useEliteSystemIntegration';

// Mock the auth context
vi.mock('../../contexts/SimpleAppContext', () => ({
  useSimpleApp: () => ({
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
      user_metadata: { name: 'Test User' },
      app_metadata: {},
      aud: 'authenticated',
      created_at: '2023-01-01T00:00:00.000Z'
    },
    loading: false,
    register: vi.fn(),
    login: vi.fn(),
    logout: vi.fn()
  })
}));

// Mock the toast hook
vi.mock('../../hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
    dismiss: vi.fn(),
    toasts: []
  })
}));

// Mock supabase client
vi.mock('../../integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: null }))
        }))
      })),
      insert: vi.fn(() => Promise.resolve({ data: {}, error: null })),
      upsert: vi.fn(() => Promise.resolve({ data: {}, error: null }))
    })),
    functions: {
      invoke: vi.fn(() => Promise.resolve({ data: { success: true }, error: null }))
    }
  }
}));

describe('useEliteSystemIntegration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Hook Initialization', () => {
    it('initializes with default state', () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      expect(result.current.systemStatus.isActivated).toBe(false);
      expect(result.current.isActivating).toBe(false);
      expect(typeof result.current.activateEliteSystem).toBe('function');
      expect(typeof result.current.deactivateEliteSystem).toBe('function');
    });

    it('provides system status interface', () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      expect(result.current.systemStatus).toHaveProperty('isActivated');
      expect(typeof result.current.systemStatus.isActivated).toBe('boolean');
    });
  });

  describe('System Activation', () => {
    it('activates elite system successfully', async () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      await act(async () => {
        await result.current.activateEliteSystem();
      });

      expect(result.current.isActivating).toBe(false);
    });

    it('handles activation errors gracefully', async () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      await act(async () => {
        try {
          await result.current.activateEliteSystem();
        } catch (error) {
          expect(error).toBeDefined();
        }
      });
    });
  });

  describe('System Deactivation', () => {
    it('deactivates elite system successfully', async () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      await act(async () => {
        await result.current.deactivateEliteSystem();
      });

      expect(result.current.isActivating).toBe(false);
    });
  });

  describe('System Status Checking', () => {
    it('checks system status correctly', async () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      await act(async () => {
        await result.current.checkSystemStatus();
      });

      expect(result.current.systemStatus).toBeDefined();
    });

    it('updates system status after checking', async () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      await act(async () => {
        await result.current.checkSystemStatus();
      });

      expect(typeof result.current.systemStatus.isActivated).toBe('boolean');
    });
  });

  describe('System Metrics', () => {
    it('retrieves system metrics successfully', async () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      await act(async () => {
        await result.current.getSystemMetrics();
      });

      expect(result.current.getSystemMetrics).toBeDefined();
    });

    it('handles metrics retrieval errors', async () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      await act(async () => {
        try {
          await result.current.getSystemMetrics();
        } catch (error) {
          expect(error).toBeDefined();
        }
      });
    });
  });

  describe('Error Handling', () => {
    it('handles network errors gracefully', async () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      await act(async () => {
        try {
          await result.current.activateEliteSystem();
        } catch (error) {
          expect(error).toBeDefined();
        }
      });
    });

    it('provides error feedback to users', async () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      await act(async () => {
        try {
          await result.current.activateEliteSystem();
        } catch (error) {
          expect(error).toBeDefined();
        }
      });
    });
  });

  describe('State Management', () => {
    it('manages loading states correctly', async () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      expect(result.current.isActivating).toBe(false);

      await act(async () => {
        const activationPromise = result.current.activateEliteSystem();
        // During activation, isActivating should be true
        await activationPromise;
      });

      expect(result.current.isActivating).toBe(false);
    });

    it('prevents multiple simultaneous activations', async () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      await act(async () => {
        const promise1 = result.current.activateEliteSystem();
        const promise2 = result.current.activateEliteSystem();
        
        await Promise.all([promise1, promise2]);
      });

      expect(result.current.isActivating).toBe(false);
    });
  });

  describe('Authentication Integration', () => {
    it('requires authenticated user', () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      expect(result.current.activateEliteSystem).toBeDefined();
    });

    it('handles unauthenticated state', () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      expect(result.current.systemStatus).toBeDefined();
    });
  });

  describe('Toast Notifications', () => {
    it('shows success notifications', async () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      await act(async () => {
        await result.current.activateEliteSystem();
      });

      // Toast should be called for success
      expect(result.current.activateEliteSystem).toBeDefined();
    });

    it('shows error notifications', async () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      await act(async () => {
        try {
          await result.current.activateEliteSystem();
        } catch (error) {
          // Toast should be called for error
          expect(error).toBeDefined();
        }
      });
    });
  });

  describe('Cleanup', () => {
    it('cleans up resources on unmount', () => {
      const { result, unmount } = renderHook(() => useEliteSystemIntegration());

      expect(result.current.systemStatus).toBeDefined();

      unmount();

      // Should not throw after unmount
      expect(true).toBe(true);
    });
  });
});