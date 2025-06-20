
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SimpleAppProvider } from '@/components/SimpleAppProvider';
import { Toaster } from '@/components/ui/toaster';
import AppRouter from '@/components/AppRouter';
import SimpleErrorBoundary from '@/components/SimpleErrorBoundary';
import './App.css';

// Create QueryClient once
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <SimpleErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <SimpleAppProvider>
            <AppRouter />
            <Toaster />
          </SimpleAppProvider>
        </Router>
      </QueryClientProvider>
    </SimpleErrorBoundary>
  );
}

export default App;
