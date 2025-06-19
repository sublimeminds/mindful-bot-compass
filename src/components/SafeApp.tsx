
import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SimpleErrorBoundary from '@/components/SimpleErrorBoundary';
import SimpleSafeReactProvider from '@/components/SimpleSafeReactProvider';
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

// Lazy load the main app content
const MainAppContent = React.lazy(() => import('@/components/MainAppContent'));

// Simplified ValidatedApp component
class ValidatedApp extends Component {
  render() {
    return React.createElement('div', { className: 'min-h-screen bg-background' }, [
      // Basic offline indicator
      React.createElement(SimpleOfflineIndicator, { key: 'offline-indicator' }),
      
      // Main app content with Suspense
      React.createElement(React.Suspense, {
        key: 'main-content',
        fallback: React.createElement('div', {
          className: 'min-h-screen bg-background flex items-center justify-center'
        }, React.createElement('div', { className: 'text-center space-y-4' }, [
          React.createElement('div', {
            key: 'spinner',
            className: 'animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto'
          }),
          React.createElement('p', { 
            key: 'text',
            className: 'text-muted-foreground'
          }, 'Loading application...')
        ]))
      }, React.createElement(MainAppContent))
    ]);
  }
}

// Main SafeApp component - simplified architecture
class SafeApp extends Component {
  render() {
    return React.createElement(SimpleErrorBoundary, { children: 
      React.createElement(SimpleSafeReactProvider, { children:
        React.createElement(QueryClientProvider, { 
          client: queryClient,
          children: React.createElement(Router, { children:
            React.createElement(ValidatedApp)
          })
        })
      })
    });
  }
}

export default SafeApp;
