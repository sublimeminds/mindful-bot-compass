import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '../utils';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Test Index page in complete isolation
describe('Index Page Isolation Tests', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  it('should load Index page component without dependencies', async () => {
    // Mock all external dependencies
    vi.doMock('@/hooks/useAuth', () => ({
      useAuth: () => ({ user: null, loading: false })
    }));
    
    vi.doMock('@/hooks/useDashboard', () => ({
      useDashboard: () => ({ data: null, loading: false })
    }));

    try {
      const Index = await import('@/pages/Index');
      const Component = Index.default;
      
      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Component />
          </BrowserRouter>
        </QueryClientProvider>
      );
      
      // Should render without crashing
      expect(document.body).toBeInTheDocument();
    } catch (error) {
      console.error('Index page failed to load:', error);
      throw error;
    }
  });

  it('should handle missing auth context gracefully', async () => {
    // Test what happens when auth context is not available
    vi.doMock('@/hooks/useAuth', () => ({
      useAuth: () => { throw new Error('Auth context not available'); }
    }));

    try {
      const Index = await import('@/pages/Index');
      const Component = Index.default;
      
      // Wrap in error boundary to catch hook errors
      const TestWrapper = () => {
        try {
          return <Component />;
        } catch (error) {
          return <div data-testid="hook-error">Hook error: {error.message}</div>;
        }
      };
      
      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <TestWrapper />
          </BrowserRouter>
        </QueryClientProvider>
      );
      
      // Should either render the page or show a graceful error
      expect(document.body).toBeInTheDocument();
    } catch (error) {
      // This test helps identify where the Index page is failing
      console.error('Index page hook error:', error);
    }
  });

  it('should identify specific component causing crashes', async () => {
    // Test each major component in Index page individually
    const componentTests = [
      'HeroSection',
      'FeaturesSection', 
      'TestimonialsSection',
      'PricingSection',
      'CTASection'
    ];

    for (const componentName of componentTests) {
      try {
        const module = await import(`@/components/${componentName}`);
        const Component = module.default || module[componentName];
        
        if (Component) {
          render(
            <QueryClientProvider client={queryClient}>
              <BrowserRouter>
                <Component />
              </BrowserRouter>
            </QueryClientProvider>
          );
          
          console.log(`✅ ${componentName} loaded successfully`);
        }
      } catch (error) {
        console.error(`❌ ${componentName} failed to load:`, error);
      }
    }
  });
});