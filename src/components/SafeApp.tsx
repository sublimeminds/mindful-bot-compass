
import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SimpleErrorBoundary from '@/components/SimpleErrorBoundary';
import { SimpleAuthProvider } from '@/components/SimpleAuthProvider';
import OptimizedLanguageRouter from '@/components/seo/OptimizedLanguageRouter';
import LoadingBoundary from '@/components/LoadingBoundary';

// Create a simple, reliable QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Simple loading component
const LoadingFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

// Main SafeApp component with minimal complexity
class SafeApp extends Component {
  render() {
    return (
      <SimpleErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <Router>
            <SimpleAuthProvider>
              <LoadingBoundary timeout={8000}>
                <React.Suspense fallback={<LoadingFallback />}>
                  <OptimizedLanguageRouter />
                </React.Suspense>
              </LoadingBoundary>
            </SimpleAuthProvider>
          </Router>
        </QueryClientProvider>
      </SimpleErrorBoundary>
    );
  }
}

export default SafeApp;
