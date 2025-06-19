
import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SimpleErrorBoundary from '@/components/SimpleErrorBoundary';
import SimpleSafeReactProvider from '@/components/SimpleSafeReactProvider';
import StageLoadingProvider from '@/components/StageLoadingProvider';
import SimpleOfflineIndicator from '@/components/fallback/SimpleOfflineIndicator';
import { automatedHealthService } from '@/services/automatedHealthService';

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

// Lazy load the main app content - this will only load AFTER React is validated
const MainAppContent = React.lazy(() => import('@/components/MainAppContent'));

interface ValidatedAppState {
  isContextsReady: boolean;
  healthMonitoringStarted: boolean;
}

// This class component handles post-validation loading - only renders after React is safe
class ValidatedApp extends Component<{}, ValidatedAppState> {
  private contextTimer?: NodeJS.Timeout;

  constructor(props: {}) {
    super(props);
    this.state = {
      isContextsReady: false,
      healthMonitoringStarted: false
    };
  }

  componentDidMount() {
    console.log('ValidatedApp: React hooks are now safe to use');
    
    // Start automated health monitoring now that React is validated
    this.startHealthMonitoring();
    
    // Initialize contexts with a small delay to ensure everything is ready
    this.contextTimer = setTimeout(() => {
      this.setState({ isContextsReady: true });
    }, 150);
  }

  componentWillUnmount() {
    if (this.contextTimer) {
      clearTimeout(this.contextTimer);
    }
    
    // Stop health monitoring
    if (this.state.healthMonitoringStarted) {
      automatedHealthService.stopMonitoring();
    }
  }

  private startHealthMonitoring = async () => {
    try {
      console.log('ValidatedApp: Starting automated health monitoring...');
      await automatedHealthService.startMonitoring();
      this.setState({ healthMonitoringStarted: true });
      console.log('ValidatedApp: Health monitoring started successfully');
    } catch (error) {
      console.error('ValidatedApp: Failed to start health monitoring', error);
    }
  };

  render() {
    const { isContextsReady } = this.state;

    return React.createElement('div', { className: 'min-h-screen bg-background' }, [
      // Basic offline indicator that doesn't use hooks
      React.createElement(SimpleOfflineIndicator, { key: 'offline-indicator' }),
      
      // Show loading until contexts are ready
      !isContextsReady ? 
        React.createElement('div', {
          key: 'loading',
          className: 'min-h-screen bg-background flex items-center justify-center'
        }, React.createElement('div', { className: 'text-center' }, [
          React.createElement('div', {
            key: 'spinner',
            className: 'animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4'
          }),
          React.createElement('p', { key: 'text' }, 'Loading application contexts...')
        ])) :
        
        // Render main app content with Suspense
        React.createElement(React.Suspense, {
          key: 'main-content',
          fallback: React.createElement('div', {
            className: 'min-h-screen bg-background flex items-center justify-center'
          }, React.createElement('div', { className: 'text-center' }, [
            React.createElement('div', {
              key: 'spinner',
              className: 'animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4'
            }),
            React.createElement('p', { key: 'text' }, 'Loading...')
          ]))
        }, React.createElement(MainAppContent))
    ]);
  }
}

// Main SafeApp component - completely hook-free until validation passes
class SafeApp extends Component {
  render() {
    return React.createElement(SimpleErrorBoundary, { children: 
      React.createElement(SimpleSafeReactProvider, { children:
        React.createElement(StageLoadingProvider, { 
          stage: 'validation',
          onStageComplete: () => console.log('Validation stage complete'),
          children: React.createElement(QueryClientProvider, { 
            client: queryClient,
            children: React.createElement(StageLoadingProvider, { 
              stage: 'contexts',
              onStageComplete: () => console.log('Contexts stage complete'),
              children: React.createElement(Router, { children:
                React.createElement(StageLoadingProvider, { 
                  stage: 'application',
                  onStageComplete: () => console.log('Application stage complete'),
                  children: React.createElement(ValidatedApp)
                })
              })
            })
          })
        })
      })
    });
  }
}

export default SafeApp;
