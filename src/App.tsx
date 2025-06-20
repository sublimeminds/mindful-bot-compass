
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import AppRouter from '@/components/AppRouter';
import SafeComponent from '@/components/SafeComponent';
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
  console.log('App component rendering');
  
  return (
    <SafeComponent 
      componentName="App"
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
            <p className="text-therapy-600 font-medium">Loading TherapySync...</p>
          </div>
        </div>
      }
    >
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen">
            <AppRouter />
            <Toaster />
          </div>
        </Router>
      </QueryClientProvider>
    </SafeComponent>
  );
}

export default App;
