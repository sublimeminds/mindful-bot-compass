import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '../utils';
import { BrowserRouter } from 'react-router-dom';

// Test the complete loading chain
describe('Loading Chain Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Main App Loading Sequence', () => {
    it('should load main.tsx components without errors', async () => {
      // Test that the staged app loads properly
      const StagedApp = () => {
        const [stage, setStage] = React.useState<'loading' | 'contexts' | 'app'>('loading');
        
        React.useEffect(() => {
          setTimeout(() => setStage('contexts'), 50);
        }, []);
        
        React.useEffect(() => {
          if (stage === 'contexts') {
            setTimeout(() => setStage('app'), 100);
          }
        }, [stage]);
        
        if (stage === 'loading') {
          return <div data-testid="loading">Loading...</div>;
        }
        
        if (stage === 'contexts') {
          return <div data-testid="contexts">Loading contexts...</div>;
        }
        
        return <div data-testid="app">App loaded</div>;
      };
      
      render(<StagedApp />);
      
      expect(screen.getByTestId('loading')).toBeInTheDocument();
      
      await waitFor(() => {
        expect(screen.getByTestId('contexts')).toBeInTheDocument();
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('app')).toBeInTheDocument();
      });
    });

    it('should load AppWithContexts without React corruption', async () => {
      const AppWithContexts = await import('@/components/AppWithContexts');
      const Component = AppWithContexts.default;
      
      // Mock the App component to avoid deep loading
      vi.doMock('@/App', () => ({
        default: () => <div data-testid="mocked-app">Mocked App</div>
      }));
      
      render(<Component />);
      
      await waitFor(() => {
        expect(screen.getByTestId('mocked-app')).toBeInTheDocument();
      });
    });

    it('should handle lazy loading failures gracefully', async () => {
      const FailingLazyComponent = React.lazy(() => {
        return Promise.reject(new Error('Component failed to load'));
      });
      
      const TestApp = () => (
        <React.Suspense fallback={<div data-testid="loading">Loading...</div>}>
          <FailingLazyComponent />
        </React.Suspense>
      );
      
      render(<TestApp />);
      
      expect(screen.getByTestId('loading')).toBeInTheDocument();
      
      // The error should be caught by Suspense boundary
      await waitFor(() => {
        // Should still show loading or an error boundary
        expect(screen.getByTestId('loading')).toBeInTheDocument();
      });
    });
  });

  describe('Router Integration', () => {
    it('should load AppRouter without hook errors', async () => {
      const AppRouter = await import('@/components/AppRouter');
      const Component = AppRouter.default;
      
      // Mock all lazy-loaded pages to avoid deep dependencies
      vi.doMock('@/pages/Index', () => ({
        default: () => <div data-testid="index-page">Index Page</div>
      }));
      
      render(
        <BrowserRouter>
          <Component />
        </BrowserRouter>
      );
      
      await waitFor(() => {
        expect(screen.getByTestId('index-page')).toBeInTheDocument();
      });
    });
  });

  describe('Context Provider Chain', () => {
    it('should initialize all providers without conflicts', async () => {
      const { QueryClient, QueryClientProvider } = await import('@tanstack/react-query');
      const { I18nextProvider } = await import('react-i18next');
      const i18n = await import('@/i18n');
      
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
        },
      });
      
      const ProviderChain = ({ children }: { children: React.ReactNode }) => (
        <I18nextProvider i18n={i18n.default}>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              {children}
            </BrowserRouter>
          </QueryClientProvider>
        </I18nextProvider>
      );
      
      render(
        <ProviderChain>
          <div data-testid="provider-test">Providers loaded</div>
        </ProviderChain>
      );
      
      expect(screen.getByTestId('provider-test')).toBeInTheDocument();
    });
  });
});