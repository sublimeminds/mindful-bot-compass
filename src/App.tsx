
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

// Safe wrapper component for TooltipProvider
const SafeTooltipWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check if React and hooks are available
  if (!React || typeof React.useState !== 'function') {
    console.warn('React hooks not available, rendering without tooltips');
    return <>{children}</>;
  }

  try {
    return (
      <TooltipProvider>
        {children}
      </TooltipProvider>
    );
  } catch (error) {
    console.warn('TooltipProvider failed to render, rendering without tooltips:', error);
    return <>{children}</>;
  }
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SimpleAuthProvider>
        <AdminProvider>
          <TherapistProvider>
            <SafeTooltipWrapper>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppRouter />
              </BrowserRouter>
            </SafeTooltipWrapper>
          </TherapistProvider>
        </AdminProvider>
      </SimpleAuthProvider>
    </QueryClientProvider>
  );
};

export default App;
