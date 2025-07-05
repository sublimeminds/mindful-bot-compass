
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';

// Add i18n initialization
import './i18n';

// Bulletproof Components
import { BulletproofAuthProvider } from '@/components/bulletproof/BulletproofAuthProvider';
import { SafeRouter } from '@/components/bulletproof/SafeRouter';
import { AppErrorBoundary } from '@/components/bulletproof/MultiLevelErrorBoundary';

// Pages
import LandingPage from '@/components/LandingPage';
import AuthPage from '@/pages/EnhancedAuth';
import DashboardPage from '@/pages/Dashboard';

import './App.css';

// Configure React Query with bulletproof settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors, but retry on 5xx and network errors
        if (error && 'status' in error && typeof error.status === 'number') {
          return error.status >= 500 && failureCount < 3;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    },
    mutations: {
      retry: 1,
    },
  },
});

// Bulletproof App with enhanced authentication
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppErrorBoundary>
        <BulletproofAuthProvider>
          <SafeRouter>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
              </Routes>
              <Toaster />
              <Sonner />
            </div>
          </SafeRouter>
        </BulletproofAuthProvider>
      </AppErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
