
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

const App = () => {
  // Early validation - check React availability before using any components
  if (typeof React === 'undefined' || React === null) {
    console.error('App: React is not available');
    return React.createElement('div', {
      style: {
        padding: '20px',
        textAlign: 'center',
        color: '#dc2626',
        backgroundColor: '#fee2e2',
        border: '1px solid #fecaca',
        borderRadius: '6px',
        margin: '20px',
        fontSize: '18px',
        fontFamily: 'system-ui, sans-serif'
      }
    }, 'React framework is not loaded. Please refresh the page.');
  }

  if (!React.useState || !React.useEffect || !React.useContext || !React.createElement) {
    console.error('App: React hooks or core methods are not available');
    return React.createElement('div', {
      style: {
        padding: '20px',
        textAlign: 'center',
        color: '#dc2626',
        backgroundColor: '#fee2e2',
        border: '1px solid #fecaca',
        borderRadius: '6px',
        margin: '20px',
        fontSize: '18px',
        fontFamily: 'system-ui, sans-serif'
      }
    }, 'React is not properly initialized. Please refresh the page.');
  }

  // Now it's safe to render the full app
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

export default App;
