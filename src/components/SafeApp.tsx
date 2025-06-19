
import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SimpleErrorBoundary from '@/components/SimpleErrorBoundary';

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

// Lazy load the main app content to ensure React is ready
const MainAppContent = React.lazy(() => import('@/components/MainAppContent'));

// Simple loading component
const LoadingFallback = () => React.createElement('div', {
  className: 'min-h-screen bg-background flex items-center justify-center'
}, React.createElement('div', {
  className: 'animate-spin rounded-full h-8 w-8 border-b-2 border-primary'
}));

// Main SafeApp component with minimal complexity
class SafeApp extends Component {
  render() {
    return React.createElement(SimpleErrorBoundary, { children: 
      React.createElement(QueryClientProvider, { 
        client: queryClient,
        children: React.createElement(Router, { children:
          React.createElement(React.Suspense, {
            fallback: React.createElement(LoadingFallback),
            children: React.createElement(MainAppContent)
          })
        })
      })
    });
  }
}

export default SafeApp;
