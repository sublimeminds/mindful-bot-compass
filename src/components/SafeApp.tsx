
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

// Main SafeApp component with emergency timeout
class SafeApp extends Component {
  state = { servicesReady: false, emergencyTimeout: false };
  private emergencyTimer: NodeJS.Timeout | null = null;

  async componentDidMount() {
    // Emergency timeout - if services take too long, continue anyway
    this.emergencyTimer = setTimeout(() => {
      console.warn('Emergency timeout triggered - continuing with minimal services');
      this.setState({ servicesReady: true, emergencyTimeout: true });
    }, 3000); // 3 second emergency timeout

    try {
      // Initialize services before rendering main app
      await serviceManager.initialize();
      if (this.emergencyTimer) clearTimeout(this.emergencyTimer);
      this.setState({ servicesReady: true });
    } catch (error) {
      console.warn('Service initialization failed, continuing with defaults:', error);
      if (this.emergencyTimer) clearTimeout(this.emergencyTimer);
      this.setState({ servicesReady: true });
    }
  }

  componentWillUnmount() {
    if (this.emergencyTimer) {
      clearTimeout(this.emergencyTimer);
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
