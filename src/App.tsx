
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import { MinimalAuthProvider } from '@/components/MinimalAuthProvider';
import ErrorBoundary from '@/components/ErrorBoundary';
import AppRouter from '@/components/AppRouter';
import './App.css';

const queryClient = new QueryClient();

function App() {
  console.log('App: Starting application...');
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <MinimalAuthProvider>
            <div className="min-h-screen bg-background">
              <AppRouter />
              <Toaster />
            </div>
          </MinimalAuthProvider>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
