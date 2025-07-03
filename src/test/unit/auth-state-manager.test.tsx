import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { waitFor } from '../utils';
import { useAuthState } from '@/components/auth/AuthStateManager';

// Mock Supabase
const mockSupabase = {
  auth: {
    getSession: vi.fn(),
    onAuthStateChange: vi.fn(),
  },
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase,
}));

describe('useAuthState Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock implementations
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null
    });
    
    mockSupabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } }
    });
  });

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useAuthState());
    
    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBe(null);
  });

  it('should handle successful session retrieval', async () => {
    const mockUser = { id: 'test-user', email: 'test@example.com' };
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: { user: mockUser } },
      error: null
    });

    const { result } = renderHook(() => useAuthState());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
  });

  it('should handle session errors gracefully', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: new Error('Session error')
    });

    const { result } = renderHook(() => useAuthState());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBe(null);
  });

  it('should handle network timeouts', async () => {
    // Mock a slow response
    mockSupabase.auth.getSession.mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({ data: { session: null }, error: null }), 15000)
      )
    );

    const { result } = renderHook(() => useAuthState());

    // Should timeout and set loading to false
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 12000 });

    expect(result.current.user).toBe(null);
  });

  it('should handle auth state changes', async () => {
    let authCallback: Function;
    
    mockSupabase.auth.onAuthStateChange.mockImplementation((callback) => {
      authCallback = callback;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });

    const { result } = renderHook(() => useAuthState());

    // Simulate auth state change
    const mockUser = { id: 'new-user', email: 'new@example.com' };
    authCallback!('SIGNED_IN', { user: mockUser });

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
    });
  });

  it('should handle Electron environment', async () => {
    // Mock Electron environment
    Object.defineProperty(window.navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) MyApp/1.0.0 Chrome/91.0.4472.124 Electron/13.1.7 Safari/537.36',
      configurable: true
    });

    mockSupabase.auth.getSession.mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({ data: { session: null }, error: null }), 8000)
      )
    );

    const { result } = renderHook(() => useAuthState());

    // Should timeout faster in Electron (5 seconds)
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 7000 });
  });

  it('should cleanup subscriptions on unmount', () => {
    const unsubscribeMock = vi.fn();
    mockSupabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: unsubscribeMock } }
    });

    const { unmount } = renderHook(() => useAuthState());
    
    unmount();
    
    expect(unsubscribeMock).toHaveBeenCalled();
  });
});