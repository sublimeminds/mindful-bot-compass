
import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { SimpleAuthProvider } from "@/components/SimpleAuthProvider";
import { SimpleAdminProvider } from "@/components/SimpleAdminProvider";
import AppRouter from "@/components/AppRouter";
import EnhancedErrorBoundary from "@/components/enhanced/EnhancedErrorBoundary";
import "./App.css";
import './i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retryOnMount: false,
      refetchOnReconnect: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <EnhancedErrorBoundary level="critical">
      <QueryClientProvider client={queryClient}>
        <SimpleAuthProvider>
          <SimpleAdminProvider>
            <BrowserRouter>
              <EnhancedErrorBoundary level="page">
                <AppRouter />
              </EnhancedErrorBoundary>
            </BrowserRouter>
          </SimpleAdminProvider>
        </SimpleAuthProvider>
      </QueryClientProvider>
    </EnhancedErrorBoundary>
  );
};

export default App;
