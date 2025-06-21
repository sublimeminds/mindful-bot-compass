
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
import ReactReadyWrapper from "@/components/ReactReadyWrapper";
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
  // Basic React availability check before using any hooks
  if (typeof React === 'undefined' || React === null) {
    console.error('App: React is not available');
    return ErrorScreen({ message: 'React framework is not loaded. Please refresh the page.' });
  }

  if (!React.createElement) {
    console.error('App: React.createElement is not available');
    return ErrorScreen({ message: 'React is not properly initialized. Please refresh the page.' });
  }

  console.log('App: Rendering with ReactReadyWrapper');

  return (
    <ReactReadyWrapper>
      <AppContent />
    </ReactReadyWrapper>
  );
};

export default App;
