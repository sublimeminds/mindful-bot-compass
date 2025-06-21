
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

// Simple loading component without hooks
const AppLoading = () => {
  return React.createElement('div', {
    style: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8fafc',
      fontFamily: 'system-ui, sans-serif'
    }
  }, React.createElement('div', {
    style: {
      padding: '20px',
      textAlign: 'center',
      color: '#6b7280'
    }
  }, 'Loading TherapySync...'));
};

// Error component without hooks
const AppError = ({ error }: { error: string }) => {
  return React.createElement('div', {
    style: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fee2e2',
      fontFamily: 'system-ui, sans-serif'
    }
  }, React.createElement('div', {
    style: {
      padding: '30px',
      textAlign: 'center',
      color: '#dc2626',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      maxWidth: '400px'
    }
  }, [
    React.createElement('h2', { key: 'title', style: { marginBottom: '16px' } }, 'Application Error'),
    React.createElement('p', { key: 'message', style: { marginBottom: '20px' } }, error),
    React.createElement('button', {
      key: 'reload',
      onClick: () => window.location.reload(),
      style: {
        backgroundColor: '#dc2626',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '6px',
        cursor: 'pointer'
      }
    }, 'Reload Page')
  ]));
};

// Main app content that uses hooks
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

// Safe React checker class component
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
      // Validate React is properly loaded
      if (typeof React === 'undefined' || React === null) {
        throw new Error('React is not available');
      }

      // Validate essential React methods
      if (!React.useState || !React.useEffect || !React.useContext || !React.createElement) {
        throw new Error('React hooks are not available');
      }

      // Test createElement
      const testElement = React.createElement('div', null, 'test');
      if (!testElement) {
        throw new Error('React.createElement is not working');
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
      return React.createElement(AppError, { error });
    }

    if (!isReactReady) {
      return React.createElement(AppLoading);
    }

    return children;
  }
}

const App = () => {
  // Basic React availability check before using class component
  if (typeof React === 'undefined' || React === null) {
    console.error('App: React is not available');
    return React.createElement(AppError, { 
      error: 'React framework is not loaded. Please refresh the page.' 
    });
  }

  return React.createElement(SafeReactChecker, {}, React.createElement(AppContent));
};

export default App;
