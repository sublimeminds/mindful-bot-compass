
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import AppRouter from '@/components/AppRouter';
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
  console.log('App component rendering');
  
  // Double-check React is available before rendering
  if (!React || !React.useState || !React.useRef) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center', 
        backgroundColor: '#fee2e2',
        color: '#991b1b' 
      }}>
        React is not properly initialized. Please refresh the page.
      </div>
    );
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen">
          <AppRouter />
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
