
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { SimpleAuthProvider } from "@/components/SimpleAuthProvider";
import { AdminProvider } from "@/contexts/AdminContext";
import { TherapistProvider } from "@/contexts/TherapistContext";
import AppRouter from "@/components/AppRouter";
import SimpleErrorBoundary from "@/components/SimpleErrorBoundary";
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
  return (
    <SimpleErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SimpleAuthProvider>
          <AdminProvider>
            <TherapistProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppRouter />
              </BrowserRouter>
            </TherapistProvider>
          </AdminProvider>
        </SimpleAuthProvider>
      </QueryClientProvider>
    </SimpleErrorBoundary>
  );
};

export default App;
