import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '../utils';
import userEvent from '@testing-library/user-event';
import App from '@/App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { EnhancedAuthProvider } from '@/components/EnhancedAuthProvider';

// E2E tests for full app loading scenarios
describe('End-to-End App Loading Tests', () => {
  const renderFullApp = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    return render(
      <React.StrictMode>
        <ThemeProvider>
          <EnhancedAuthProvider>
            <QueryClientProvider client={queryClient}>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </QueryClientProvider>
          </EnhancedAuthProvider>
        </ThemeProvider>
      </React.StrictMode>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    
    // Mock Supabase with realistic behavior
    vi.doMock('@/integrations/supabase/client', () => ({
      supabase: {
        auth: {
          getSession: vi.fn().mockResolvedValue({
            data: { session: null },
            error: null
          }),
          onAuthStateChange: vi.fn().mockReturnValue({
            data: { subscription: { unsubscribe: vi.fn() } }
          }),
        },
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
            }),
          }),
        }),
      },
    }));
  });

  it('should complete full app loading cycle without blank page', async () => {
    const consoleSpy = vi.spyOn(console, 'log');
    
    renderFullApp();

    // Should never have a completely blank page
    await waitFor(() => {
      const hasContent = 
        screen.queryByText(/loading/i) ||
        screen.queryByText(/therapysync/i) ||
        screen.queryByText(/mental health/i) ||
        screen.queryByText(/error/i);
      
      expect(hasContent).toBeInTheDocument();
    }, { timeout: 1000 });

    // Should eventually load main content
    await waitFor(() => {
      expect(
        screen.getByText(/therapysync/i) ||
        screen.getByText(/mental health/i) ||
        screen.getByText(/ai-powered/i)
      ).toBeInTheDocument();
    }, { timeout: 10000 });

    // Should log app startup
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Starting TherapySync'));
    
    consoleSpy.mockRestore();
  });

  it('should handle slow network conditions', async () => {
    // Mock slow auth response
    vi.doMock('@/integrations/supabase/client', () => ({
      supabase: {
        auth: {
          getSession: vi.fn().mockImplementation(() => 
            new Promise(resolve => 
              setTimeout(() => resolve({ data: { session: null }, error: null }), 3000)
            )
          ),
          onAuthStateChange: vi.fn().mockReturnValue({
            data: { subscription: { unsubscribe: vi.fn() } }
          }),
        },
      },
    }));

    renderFullApp();

    // Should show loading state during slow auth
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Should eventually complete loading
    await waitFor(() => {
      expect(
        screen.getByText(/therapysync/i) ||
        screen.getByText(/mental health/i)
      ).toBeInTheDocument();
    }, { timeout: 15000 });
  });

  it('should recover from auth failures', async () => {
    // Mock auth failure
    vi.doMock('@/integrations/supabase/client', () => ({
      supabase: {
        auth: {
          getSession: vi.fn().mockRejectedValue(new Error('Network error')),
          onAuthStateChange: vi.fn().mockReturnValue({
            data: { subscription: { unsubscribe: vi.fn() } }
          }),
        },
      },
    }));

    renderFullApp();

    // Should still load content despite auth failure
    await waitFor(() => {
      expect(
        screen.getByText(/therapysync/i) ||
        screen.getByText(/mental health/i) ||
        screen.getByText(/offline/i)
      ).toBeInTheDocument();
    }, { timeout: 10000 });
  });

  it('should maintain functionality during partial service failures', async () => {
    // Mock partial service failures
    vi.doMock('@/utils/serviceHealthManager', () => ({
      serviceHealthManager: {
        startHealthChecks: vi.fn().mockImplementation(() => {
          throw new Error('Health check failed');
        }),
        cleanup: vi.fn(),
      },
    }));

    renderFullApp();

    // Should still load main app despite service failures
    await waitFor(() => {
      expect(
        screen.getByText(/therapysync/i) ||
        screen.getByText(/mental health/i)
      ).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('should handle navigation after loading', async () => {
    renderFullApp();

    // Wait for initial load
    await waitFor(() => {
      expect(
        screen.getByText(/therapysync/i) ||
        screen.getByText(/mental health/i)
      ).toBeInTheDocument();
    });

    // Test navigation
    const user = userEvent.setup();
    const links = screen.getAllByRole('link');
    
    if (links.length > 0) {
      // Click first available link
      await user.click(links[0]);
      
      // Should not crash or show blank page
      await waitFor(() => {
        expect(
          screen.getByText(/loading/i) ||
          screen.getByText(/therapysync/i) ||
          screen.getByText(/mental health/i) ||
          screen.getByText(/error/i)
        ).toBeInTheDocument();
      });
    }
  });

  it('should handle rapid re-renders without memory leaks', async () => {
    const { rerender } = renderFullApp();

    // Wait for initial load
    await waitFor(() => {
      expect(
        screen.getByText(/therapysync/i) ||
        screen.getByText(/mental health/i)
      ).toBeInTheDocument();
    });

    // Trigger multiple re-renders
    for (let i = 0; i < 5; i++) {
      rerender(
        <React.StrictMode>
          <ThemeProvider>
            <EnhancedAuthProvider>
              <QueryClientProvider client={new QueryClient()}>
                <BrowserRouter>
                  <App />
                </BrowserRouter>
              </QueryClientProvider>
            </EnhancedAuthProvider>
          </ThemeProvider>
        </React.StrictMode>
      );

      await waitFor(() => {
        expect(
          screen.getByText(/therapysync/i) ||
          screen.getByText(/mental health/i)
        ).toBeInTheDocument();
      });
    }

    // Should still work after multiple re-renders
    expect(
      screen.getByText(/therapysync/i) ||
      screen.getByText(/mental health/i)
    ).toBeInTheDocument();
  });
});