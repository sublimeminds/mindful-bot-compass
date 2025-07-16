
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
import ReactSafeWrapper from '@/components/ReactSafeWrapper';

// App Router
import { LanguageAwareRouter } from '@/components/seo/LanguageAwareRouter';
import { ThemeProvider } from '@/contexts/ThemeContext';

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

// Simplified ready wrapper without hooks to prevent React crashes
function ContextReadyWrapper({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// Core app component with minimal tracking
function AppCore() {
  return (
    <ReactSafeWrapper>
      <QueryClientProvider client={queryClient}>
        <AppErrorBoundary>
          <BulletproofAuthProvider>
            <ThemeProvider>
              <SafeRouter>
                <div className="min-h-screen bg-background">
                  <LanguageAwareRouter />
                  <Toaster />
                  <Sonner />
                </div>
              </SafeRouter>
            </ThemeProvider>
          </BulletproofAuthProvider>
        </AppErrorBoundary>
      </QueryClientProvider>
    </ReactSafeWrapper>
  );
}

// App wrapper with additional providers that use hooks
function App() {
  return (
    <ContextReadyWrapper>
      <AppWithTracking />
    </ContextReadyWrapper>
  );
}

// Simplified app with minimal tracking
function AppWithTracking() {
  // Remove complex affiliate tracking initialization that was causing crashes
  return <AppCore />;
}

export default App;
