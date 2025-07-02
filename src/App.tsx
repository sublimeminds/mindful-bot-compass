
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SimpleAppProvider } from '@/hooks/useSimpleApp';
import ErrorBoundary from '@/components/ErrorBoundary';
import AppRouter from '@/components/AppRouter';
import './App.css';

const queryClient = new QueryClient();

function App() {
  console.log('App: Starting application...');
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <SimpleAppProvider>
            <Router>
              <div className="min-h-screen bg-background">
                <AppRouter />
                <Toaster />
                <Sonner />
              </div>
            </Router>
          </SimpleAppProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
