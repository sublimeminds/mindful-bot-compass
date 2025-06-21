
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { SimpleAuthProvider } from "@/components/SimpleAuthProvider";
import { AdminProvider } from "@/contexts/AdminContext";
import { TherapistProvider } from "@/contexts/TherapistContext";
import AppRouter from "@/components/AppRouter";
import "./App.css";
import './i18n';

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
const AppLoading = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8fafc',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{
        padding: '20px',
        textAlign: 'center',
        color: '#6b7280'
      }}>
        Loading TherapySync...
      </div>
    </div>
  );
};

// Error component
const AppError = ({ error }: { error: string }) => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fee2e2',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{
        padding: '30px',
        textAlign: 'center',
        color: '#dc2626',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px'
      }}>
        <h2 style={{ marginBottom: '16px' }}>Application Error</h2>
        <p style={{ marginBottom: '20px' }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Reload Page
        </button>
      </div>
    </div>
  );
};

// Main app content with hooks
const AppContent = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SimpleAuthProvider>
        <AdminProvider>
          <TherapistProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppRouter />
              </BrowserRouter>
            </TooltipProvider>
          </TherapistProvider>
        </AdminProvider>
      </SimpleAuthProvider>
    </QueryClientProvider>
  );
};

// Simplified React checker class component
class SafeReactChecker extends React.Component<
  { children: React.ReactNode }, 
  { isReactReady: boolean; error?: string }
> {
  private mounted = true;

  state = {
    isReactReady: false,
    error: undefined as string | undefined
  };

  componentDidMount() {
    this.validateReact();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  private validateReact = () => {
    try {
      // Simple React validation
      if (typeof React === 'undefined' || React === null) {
        throw new Error('React is not available');
      }

      if (!React.useState || !React.useEffect || !React.useContext || !React.createElement) {
        throw new Error('React hooks are not available');
      }

      console.log('SafeReactChecker: React validation successful');
      
      if (this.mounted) {
        this.setState({ isReactReady: true });
      }
      
    } catch (error) {
      console.error('SafeReactChecker: React validation failed', error);
      if (this.mounted) {
        this.setState({ 
          isReactReady: false, 
          error: (error as Error).message 
        });
      }
    }
  };

  render() {
    const { children } = this.props;
    const { isReactReady, error } = this.state;

    if (error) {
      return <AppError error={error} />;
    }

    if (!isReactReady) {
      return <AppLoading />;
    }

    return children;
  }
}

const App = () => {
  // Basic React availability check
  if (typeof React === 'undefined' || React === null) {
    console.error('App: React is not available');
    return <AppError error="React framework is not loaded. Please refresh the page." />;
  }

  return (
    <SafeReactChecker>
      <AppContent />
    </SafeReactChecker>
  );
};

export default App;
