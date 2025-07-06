
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';

// Add i18n initialization
import './i18n';

// Bulletproof Components
import { BulletproofAuthProvider } from '@/components/bulletproof/BulletproofAuthProvider';
import { SafeRouter } from '@/components/bulletproof/SafeRouter';
import { AppErrorBoundary } from '@/components/bulletproof/MultiLevelErrorBoundary';
import { SimpleAppProvider } from '@/hooks/useSimpleApp';
import ReactSafeWrapper from '@/components/ReactSafeWrapper';

// App Router
import AppRouter from '@/components/AppRouter';

import './App.css';

// Configure React Query with bulletproof settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors, but retry on 5xx and network errors
        if (error && 'status' in error && typeof error.status === 'number') {
          return error.status >= 500 && failureCount < 3;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    },
    mutations: {
      retry: 1,
    },
  },
});

// Enhanced context readiness component with robust React initialization
function ContextReadyWrapper({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = React.useState(false);
  const [retryCount, setRetryCount] = React.useState(0);
  const maxRetries = 10;

  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const checkReactReadiness = () => {
      try {
        // Check if React and all essential hooks are available
        const reactReady = typeof React !== 'undefined' && 
                          React !== null &&
                          typeof React.useState === 'function' &&
                          typeof React.useEffect === 'function' &&
                          typeof React.useContext === 'function' &&
                          typeof React.createElement === 'function';

        if (reactReady) {
          console.log('ContextReadyWrapper: React fully initialized');
          setIsReady(true);
        } else if (retryCount < maxRetries) {
          console.warn(`ContextReadyWrapper: React not ready, retry ${retryCount + 1}/${maxRetries}`);
          setRetryCount(prev => prev + 1);
          // Exponential backoff: 50ms, 100ms, 200ms, 400ms, etc.
          const delay = Math.min(50 * Math.pow(2, retryCount), 2000);
          timeoutId = setTimeout(checkReactReadiness, delay);
        } else {
          console.error('ContextReadyWrapper: Max retries reached, React may not be properly initialized');
          // Force ready to prevent infinite loading, but with warning
          setIsReady(true);
        }
      } catch (error) {
        console.error('ContextReadyWrapper: Error checking React readiness:', error);
        if (retryCount < maxRetries) {
          setRetryCount(prev => prev + 1);
          timeoutId = setTimeout(checkReactReadiness, 100);
        } else {
          setIsReady(true); // Force ready as fallback
        }
      }
    };

    checkReactReadiness();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [retryCount]);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            Initializing React context...
            {retryCount > 0 && ` (${retryCount}/${maxRetries})`}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Bulletproof App with enhanced authentication
function App() {
  return (
    <ReactSafeWrapper>
      <QueryClientProvider client={queryClient}>
        <AppErrorBoundary>
          <BulletproofAuthProvider>
            <SimpleAppProvider>
              <ContextReadyWrapper>
                <SafeRouter>
                  <div className="min-h-screen bg-background">
                    <AppRouter />
                    <Toaster />
                    <Sonner />
                  </div>
                </SafeRouter>
              </ContextReadyWrapper>
            </SimpleAppProvider>
          </BulletproofAuthProvider>
        </AppErrorBoundary>
      </QueryClientProvider>
    </ReactSafeWrapper>
  );
}

export default App;
