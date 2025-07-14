
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
import LiveChatAgent from '@/components/LiveChatAgent';
import { AvatarManagerProvider } from '@/components/avatar/OptimizedAvatarManager';
import { TherapistProvider } from '@/contexts/TherapistContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useAffiliateTracking } from '@/hooks/useAffiliateTracking';

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

// Enhanced context readiness component with simplified React initialization
function ContextReadyWrapper({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    // Simple readiness check
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 50); // Short delay to ensure React is fully initialized

    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Initializing application...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Bulletproof App with enhanced authentication
function App() {
  // Initialize affiliate tracking globally
  useAffiliateTracking();
  
  return (
    <ReactSafeWrapper>
      <QueryClientProvider client={queryClient}>
        <AppErrorBoundary>
          <BulletproofAuthProvider>
            <SimpleAppProvider>
              <ThemeProvider>
                <TherapistProvider>
                  <AvatarManagerProvider maxActiveAvatars={3}>
                    <ContextReadyWrapper>
                      <SafeRouter>
                      <div className="min-h-screen bg-background">
                        <AppRouter />
                        <LiveChatAgent />
                        <Toaster />
                        <Sonner />
                      </div>
                      </SafeRouter>
                    </ContextReadyWrapper>
                  </AvatarManagerProvider>
                </TherapistProvider>
              </ThemeProvider>
            </SimpleAppProvider>
          </BulletproofAuthProvider>
        </AppErrorBoundary>
      </QueryClientProvider>
    </ReactSafeWrapper>
  );
}

export default App;
