
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SimpleErrorBoundary from '@/components/SimpleErrorBoundary';
import SimpleSafeReactProvider from '@/components/SimpleSafeReactProvider';
import SafeHookWrapper from '@/components/SafeHookWrapper';
import SimpleOfflineIndicator from '@/components/fallback/SimpleOfflineIndicator';

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

// Lazy load the main app content that requires contexts
const MainAppContent = React.lazy(() => import('@/components/MainAppContent'));

// This component now only renders AFTER React hooks are validated
const SafeAppWithHooks = () => {
  const [isContextsReady, setIsContextsReady] = React.useState(false);

  React.useEffect(() => {
    // Small delay to ensure all contexts are properly initialized
    const timer = setTimeout(() => {
      setIsContextsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Basic offline indicator that doesn't use hooks */}
      <SimpleOfflineIndicator />
      
      {/* Show loading until contexts are ready */}
      {!isContextsReady ? (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading application...</p>
          </div>
        </div>
      ) : (
        <SafeHookWrapper 
          componentName="Main Application Content"
          fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
              <div className="text-center">
                <p className="text-red-600 mb-4">Unable to load application</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Reload
                </button>
              </div>
            </div>
          }
        >
          <React.Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Loading...</p>
              </div>
            </div>
          }>
            <MainAppContent />
          </React.Suspense>
        </SafeHookWrapper>
      )}
    </div>
  );
};

// This is now completely hook-free and safe to render immediately
const SafeApp = () => {
  return (
    <SimpleErrorBoundary>
      <SimpleSafeReactProvider>
        <QueryClientProvider client={queryClient}>
          <Router>
            <SafeAppWithHooks />
          </Router>
        </QueryClientProvider>
      </SimpleSafeReactProvider>
    </SimpleErrorBoundary>
  );
};

export default SafeApp;
