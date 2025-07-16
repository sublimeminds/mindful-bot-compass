import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';

// Super Admin specific imports
import { SuperAdminProvider } from '@/contexts/SuperAdminContext';
import SuperAdminRouter from '@/components/SuperAdminRouter';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Add React safety wrapper for admin
import ReactSafeWrapper from '@/components/ReactSafeWrapper';

// Configure React Query for admin
const adminQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
    mutations: {
      retry: 1,
    },
  },
});

const SuperAdminApp: React.FC = () => {
  console.log('SuperAdminApp: Initializing admin panel');
  
  return (
    <ReactSafeWrapper>
      <QueryClientProvider client={adminQueryClient}>
        <ThemeProvider>
          <SuperAdminProvider>
            <BrowserRouter>
              <div className="min-h-screen bg-background">
                <SuperAdminRouter />
                <Toaster />
                <Sonner />
              </div>
            </BrowserRouter>
          </SuperAdminProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ReactSafeWrapper>
  );
};

export default SuperAdminApp;