
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';

// Add i18n initialization
import './i18n';

// Bulletproof Framework Components
import { BulletproofAuthProvider } from '@/components/bulletproof/BulletproofAuthProvider';
import { AppErrorBoundary } from '@/components/bulletproof/MultiLevelErrorBoundary';
import { SafeRouter } from '@/components/bulletproof/SafeRouter';

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

// Route configuration
const routes = [
  {
    path: '/',
    component: LandingPage,
    name: 'Landing'
  },
  {
    path: '/auth',
    component: AuthPage,
    name: 'Auth'
  },
  {
    path: '/dashboard',
    component: DashboardPage,
    name: 'Dashboard',
    requiresAuth: true
  }
];

// Bulletproof App with progressive enhancement
function App() {
  return (
    <AppErrorBoundary 
      name="Application"
      showErrorDetails={process.env.NODE_ENV === 'development'}
    >
      <QueryClientProvider client={queryClient}>
        <BulletproofAuthProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <SafeRouter 
                routes={routes}
                defaultRoute="/"
                authCheck={() => {
                  // Check if user is authenticated using bulletproof auth
                  try {
                    const { user } = require('@/components/bulletproof/BulletproofAuthProvider').useBulletproofAuth();
                    return !!user;
                  } catch {
                    return false;
                  }
                }}
              />
              <Toaster />
              <Sonner />
            </div>
          </Router>
        </BulletproofAuthProvider>
      </QueryClientProvider>
    </AppErrorBoundary>
  );
}

export default App;
