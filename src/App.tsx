
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

// Simple loading component that doesn't use hooks
const LoadingScreen = () => {
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
      textAlign: 'center'
    }
  }, 'Loading...'));
};

// Error screen that doesn't use hooks
const ErrorScreen = ({ message }: { message: string }) => {
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
      padding: '20px',
      textAlign: 'center',
      color: '#dc2626',
      backgroundColor: '#fee2e2',
      border: '1px solid #fecaca',
      borderRadius: '6px',
      maxWidth: '400px'
    }
  }, message));
};

// Main app component that uses hooks
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

const App = () => {
  // Check if React is available at all
  if (typeof React === 'undefined' || React === null) {
    console.error('App: React is not available');
    return ErrorScreen({ message: 'React framework is not loaded. Please refresh the page.' });
  }

  // Check if React core methods are available
  if (!React.createElement) {
    console.error('App: React.createElement is not available');
    return ErrorScreen({ message: 'React is not properly initialized. Please refresh the page.' });
  }

  // Check if React hooks are available
  if (!React.useState || !React.useEffect || !React.useContext) {
    console.error('App: React hooks are not available');
    return ErrorScreen({ message: 'React hooks are not available. Please refresh the page.' });
  }

  // Use a state to track if we're ready to render the full app
  const [isReady, setIsReady] = React.useState(false);

  // Use effect to delay rendering until React is fully stable
  React.useEffect(() => {
    // Double-check that all React features are available
    const timer = setTimeout(() => {
      if (React.useState && React.useEffect && React.useContext && React.createElement) {
        console.log('App: React is fully ready, rendering app');
        setIsReady(true);
      } else {
        console.error('App: React hooks still not available after delay');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return LoadingScreen();
  }

  return <AppContent />;
};

export default App;
