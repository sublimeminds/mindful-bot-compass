
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { EnhancedAuthProvider } from '@/components/EnhancedAuthProvider';
import { SimpleAppProvider } from '@/hooks/useSimpleApp';
import NotificationToastHandler from '@/components/NotificationToastHandler';
import AppRouter from '@/components/AppRouter';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <EnhancedAuthProvider>
          <SimpleAppProvider>
            <Router>
              <div className="min-h-screen bg-background">
                <AppRouter />
                <NotificationToastHandler />
                <Toaster />
                <Sonner />
              </div>
            </Router>
          </SimpleAppProvider>
        </EnhancedAuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
