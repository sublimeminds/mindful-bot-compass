
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

// Bulletproof App with enhanced authentication
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppErrorBoundary>
        <BulletproofAuthProvider>
          <SimpleAppProvider>
            <SafeRouter>
              <div className="min-h-screen bg-background">
                <AppRouter />
                <Toaster />
                <Sonner />
              </div>
            </SafeRouter>
          </SimpleAppProvider>
        </BulletproofAuthProvider>
      </AppErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
