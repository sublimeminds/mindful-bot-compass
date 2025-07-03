import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from './utils';
import userEvent from '@testing-library/user-event';
import App from '@/App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Mock Supabase with realistic delays
const mockSupabase = {
  auth: {
    getSession: vi.fn().mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({ data: { session: null }, error: null }), 100)
      )
    ),
    onAuthStateChange: vi.fn().mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } }
    }),
    signUp: vi.fn().mockResolvedValue({ error: null }),
    signInWithPassword: vi.fn().mockResolvedValue({ error: null }),
    signOut: vi.fn().mockResolvedValue({}),
  },
  from: vi.fn().mockReturnValue({
    select: vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
    }),
  }),
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase,
}));

// Mock service health manager
vi.mock('@/utils/serviceHealthManager', () => ({
  serviceHealthManager: {
    startHealthChecks: vi.fn(),
    cleanup: vi.fn(),
    getHealthSummary: vi.fn().mockReturnValue({ healthy: true }),
  },
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('App Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should render the app without crashing', async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Should show loading initially
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should load the main page after auth initialization', async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Wait for auth to complete and main content to load
    await waitFor(
      () => {
        expect(screen.getByText(/TherapySync/i) || screen.getByText(/AI-Powered Mental Health/i)).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });

  it('should handle auth loading state properly', async () => {
    // Mock slower auth response
    mockSupabase.auth.getSession.mockImplementationOnce(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({ data: { session: null }, error: null }), 2000)
      )
    );

    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Should show loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for content to appear
    await waitFor(
      () => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it('should handle auth errors gracefully', async () => {
    // Mock auth error
    mockSupabase.auth.getSession.mockResolvedValueOnce({
      data: { session: null },
      error: new Error('Auth service unavailable')
    });

    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Should still render content despite auth error
    await waitFor(
      () => {
        expect(screen.getByText(/TherapySync/i) || screen.getByText(/AI-Powered Mental Health/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it('should handle navigation between routes', async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText(/TherapySync/i) || screen.getByText(/AI-Powered Mental Health/i)).toBeInTheDocument();
    });

    // Find and click auth link if available
    const authLink = screen.queryByText(/sign in/i) || screen.queryByText(/login/i);
    if (authLink) {
      await userEvent.click(authLink);
      // Should navigate without crashing
      await waitFor(() => {
        expect(window.location.pathname).toBe('/auth');
      });
    }
  });

  it('should handle service health monitoring', async () => {
    const { serviceHealthManager } = await import('@/utils/serviceHealthManager');
    
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Service health monitoring should start
    expect(serviceHealthManager.startHealthChecks).toHaveBeenCalled();
  });

  it('should recover from provider errors', async () => {
    // Mock a provider error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Force an error in auth provider
    mockSupabase.auth.onAuthStateChange.mockImplementationOnce(() => {
      throw new Error('Provider initialization failed');
    });

    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Should still render some content or error boundary
    await waitFor(() => {
      expect(
        screen.getByText(/TherapySync/i) ||
        screen.getByText(/error/i) ||
        screen.getByText(/loading/i)
      ).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it('should handle timeout scenarios', async () => {
    // Mock very slow auth response
    mockSupabase.auth.getSession.mockImplementationOnce(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({ data: { session: null }, error: null }), 10000)
      )
    );

    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Should timeout and show content anyway
    await waitFor(
      () => {
        expect(
          screen.getByText(/TherapySync/i) ||
          screen.getByText(/timeout/i) ||
          screen.getByText(/offline/i)
        ).toBeInTheDocument();
      },
      { timeout: 8000 }
    );
  });
});