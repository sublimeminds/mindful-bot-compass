
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { SimpleAuthProvider } from '@/components/SimpleAuthProvider';
import AppRouter from '@/components/AppRouter';
import './App.css';

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
    <QueryClientProvider client={queryClient}>
      <Router>
        <SimpleAuthProvider>
          <div className="min-h-screen bg-background text-foreground">
            <AppRouter />
            <Toaster position="top-right" />
          </div>
        </SimpleAuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
