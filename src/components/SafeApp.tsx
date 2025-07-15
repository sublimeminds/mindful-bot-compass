
import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SimpleErrorBoundary from '@/components/SimpleErrorBoundary';
import { SimpleAuthProvider } from '@/components/SimpleAuthProvider';
import SimpleLanguageRouter from '@/components/seo/SimpleLanguageRouter';
import { serviceManager } from '@/services/serviceManager';

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
  state = { servicesReady: false };

  async componentDidMount() {
    try {
      // Initialize services before rendering main app
      await serviceManager.initialize();
      this.setState({ servicesReady: true });
    } catch (error) {
      console.warn('Service initialization failed, continuing with defaults:', error);
      this.setState({ servicesReady: true });
    }
  }

  render() {
    if (!this.state.servicesReady) {
      return <LoadingFallback />;
    }

    return (
      <SimpleErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <Router>
            <SimpleAuthProvider>
              <React.Suspense fallback={<LoadingFallback />}>
                <SimpleLanguageRouter />
              </React.Suspense>
            </SimpleAuthProvider>
          </Router>
        </QueryClientProvider>
      </SimpleErrorBoundary>
    );
  }
}

export default SafeApp;
