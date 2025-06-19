
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SimpleErrorBoundary from '@/components/SimpleErrorBoundary';
import SimpleSafeReactProvider from '@/components/SimpleSafeReactProvider';
import SafeHookWrapper from '@/components/SafeHookWrapper';
import SimpleOfflineIndicator from '@/components/fallback/SimpleOfflineIndicator';
import AppRouter from '@/components/AppRouter';

import './App.css';

// Enhanced Query Client with better defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error?.message?.includes('unauthorized') || error?.message?.includes('forbidden')) {
          return false;
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: (failureCount, error) => {
        if (error?.message?.includes('unauthorized') || error?.message?.includes('forbidden')) {
          return false;
        }
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(2000 * 2 ** attemptIndex, 10000),
    },
  },
});

// Hook-dependent components that will be loaded after React validation
const HookDependentComponents = React.lazy(() => import('@/components/HookDependentComponents'));

function App() {
  return (
    <SimpleErrorBoundary>
      <SimpleSafeReactProvider>
        <QueryClientProvider client={queryClient}>
          <Router>
            <SafeHookWrapper 
              componentName="Main Application"
              fallback={
                <div className="min-h-screen bg-background flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Loading application...</p>
                  </div>
                </div>
              }
            >
              <div className="min-h-screen bg-background">
                {/* Basic offline indicator that doesn't use hooks */}
                <SimpleOfflineIndicator />
                
                {/* Main application content */}
                <AppRouter />
                
                {/* Load hook-dependent components after React is validated */}
                <React.Suspense fallback={null}>
                  <HookDependentComponents />
                </React.Suspense>
              </div>
            </SafeHookWrapper>
          </Router>
        </QueryClientProvider>
      </SimpleSafeReactProvider>
    </SimpleErrorBoundary>
  );
}

export default App;
