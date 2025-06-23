
import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { SimpleAuthProvider } from "@/components/SimpleAuthProvider";
import AppRouter from "@/components/AppRouter";
import SimpleErrorBoundary from "@/components/SimpleErrorBoundary";
import { initI18nSafely } from "@/i18n/safeInit";
import "./App.css";

// Initialize i18n safely before React renders
initI18nSafely();

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

// Fallback App component (only used when loaded via FullApp)
const App = () => {
  console.log('App: Starting React application...');

  return (
    <SimpleErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SimpleAuthProvider>
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </SimpleAuthProvider>
      </QueryClientProvider>
    </SimpleErrorBoundary>
  );
};

export default App;
