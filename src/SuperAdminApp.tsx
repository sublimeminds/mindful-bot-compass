import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';

// Super Admin specific imports
import { SuperAdminProvider } from '@/contexts/SuperAdminContext';
import SuperAdminRouter from '@/components/SuperAdminRouter';
// Removed theme context import - using direct styling

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
        <SuperAdminProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-slate-900 text-white">
              <SuperAdminRouter />
              <Toaster />
              <Sonner />
            </div>
          </BrowserRouter>
        </SuperAdminProvider>
      </QueryClientProvider>
    </ReactSafeWrapper>
  );
};

export default SuperAdminApp;