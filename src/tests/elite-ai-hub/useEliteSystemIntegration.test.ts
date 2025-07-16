import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useEliteSystemIntegration } from '../../hooks/useEliteSystemIntegration';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/use-toast';
import { supabase } from '../../integrations/supabase/client';

// Mock dependencies
vi.mock('../../hooks/useAuth');
vi.mock('../../hooks/use-toast');
vi.mock('../../integrations/supabase/client');

const mockUseAuth = vi.mocked(useAuth);
const mockUseToast = vi.mocked(useToast);
const mockSupabase = vi.mocked(supabase);

describe('useEliteSystemIntegration', () => {
  const mockToast = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    mockUseAuth.mockReturnValue({
      user: { id: 'test-user-id' },
      isLoading: false,
    } as any);
    
    mockUseToast.mockReturnValue({
      toast: mockToast,
    } as any);
    
    // Mock Supabase client methods
    mockSupabase.from = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: null
          })
        })
      }),
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { id: 'test-id' },
            error: null
          })
        })
      })
    }) as any;
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Hook Initialization', () => {
    it('initializes with default state', () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      expect(result.current.systemStatus.isActivated).toBe(false);
      expect(typeof result.current.activateEliteSystem).toBe('function');
      expect(typeof result.current.sendMessage).toBe('function');
      expect(typeof result.current.playMessage).toBe('function');
      expect(typeof result.current.stopPlayback).toBe('function');
      expect(typeof result.current.loadPreferences).toBe('function');
      expect(typeof result.current.analyzeSession).toBe('function');
      expect(typeof result.current.initiateEliteSession).toBe('function');
      expect(typeof result.current.processMessage).toBe('function');
      expect(typeof result.current.getEliteSystemStatus).toBe('function');
    });

    it('provides system status interface', () => {
      const { result } = renderHook(() => useEliteSystemIntegration());
      
      expect(result.current.systemStatus).toHaveProperty('isActivated');
      expect(result.current.systemStatus.isActivated).toBe(false);
    });
  });

  describe('System Activation', () => {
    it('activates elite system successfully', async () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      await act(async () => {
        const success = await result.current.activateEliteSystem();
        expect(success).toBe(true);
      });

      expect(result.current.systemStatus.isActivated).toBe(true);
    });

    it('handles activation errors gracefully', async () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      // Mock error response
      mockSupabase.from = vi.fn().mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Database error' }
            })
          })
        })
      }) as any;

      await act(async () => {
        const success = await result.current.activateEliteSystem();
        expect(success).toBe(false);
      });

      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Elite System Error',
        description: 'Failed to activate Elite System'
      });
    });
  });

  describe('Message Processing', () => {
    it('sends messages successfully', async () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      await act(async () => {
        const success = await result.current.sendMessage('Test message');
        expect(success).toBe(true);
      });

      expect(result.current.messages).toHaveLength(2); // User message + AI response
    });

    it('handles empty messages', async () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      await act(async () => {
        const success = await result.current.sendMessage('');
        expect(success).toBe(false);
      });

      expect(result.current.messages).toHaveLength(0);
    });
  });

  describe('System Status', () => {
    it('retrieves system status', async () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      await act(async () => {
        const status = await result.current.getEliteSystemStatus();
        expect(status).toHaveProperty('isActive');
        expect(status).toHaveProperty('lastRouting');
        expect(status).toHaveProperty('adaptiveLearningActive');
        expect(status).toHaveProperty('systemHealth');
      });
    });
  });

  describe('Session Management', () => {
    it('initiates elite session', async () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      await act(async () => {
        const sessionId = await result.current.initiateEliteSession();
        expect(typeof sessionId).toBe('string');
        expect(sessionId.length).toBeGreaterThan(0);
      });
    });

    it('analyzes sessions', async () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      await act(async () => {
        const analysis = await result.current.analyzeSession();
        expect(analysis).toHaveProperty('summary');
        expect(analysis).toHaveProperty('insights');
        expect(analysis).toHaveProperty('recommendations');
      });
    });
  });

  describe('Media Playback', () => {
    it('plays messages', async () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      await act(async () => {
        await result.current.playMessage('Test message');
      });

      expect(result.current.isPlaying).toBe(false); // Should complete quickly in test
    });

    it('stops playback', () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      act(() => {
        result.current.stopPlayback();
      });

      expect(result.current.isPlaying).toBe(false);
    });
  });

  describe('User Preferences', () => {
    it('loads user preferences', async () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      await act(async () => {
        await result.current.loadPreferences();
      });

      expect(result.current.userPreferences).toBeDefined();
    });
  });

  describe('Authentication Integration', () => {
    it('requires authenticated user', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isLoading: false,
      } as any);

      const { result } = renderHook(() => useEliteSystemIntegration());
      
      expect(result.current.systemStatus.isActivated).toBe(false);
    });

    it('handles loading state', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isLoading: true,
      } as any);

      const { result } = renderHook(() => useEliteSystemIntegration());
      
      expect(result.current.isLoading).toBe(false); // Hook should handle this gracefully
    });
  });

  describe('Toast Notifications', () => {
    it('shows success notifications', async () => {
      const { result } = renderHook(() => useEliteSystemIntegration());

      await act(async () => {
        await result.current.activateEliteSystem();
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Elite System Activated',
        description: 'Advanced AI therapy system is now active'
      });
    });

    it('shows error notifications', async () => {
      mockSupabase.from = vi.fn().mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Error' }
            })
          })
        })
      }) as any;

      const { result } = renderHook(() => useEliteSystemIntegration());

      await act(async () => {
        await result.current.activateEliteSystem();
      });

      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Elite System Error',
        description: 'Failed to activate Elite System'
      });
    });
  });

  describe('Cleanup', () => {
    it('cleans up resources on unmount', () => {
      const { unmount } = renderHook(() => useEliteSystemIntegration());
      
      expect(() => unmount()).not.toThrow();
    });
  });
});