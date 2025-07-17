import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';

// Add i18n initialization
import './i18n';

// Core Components
import { BulletproofAuthProvider } from '@/components/bulletproof/BulletproofAuthProvider';
import { SafeRouter } from '@/components/bulletproof/SafeRouter';
import AppErrorBoundary from '@/components/core/AppErrorBoundary';
import ReactSafeWrapper from '@/components/ReactSafeWrapper';

// Main App Router
import { CleanLanguageAwareRouter } from '@/components/seo/CleanLanguageAwareRouter';

// Use the bulletproof theme that doesn't use React hooks
import { ThemeProvider } from '@/utils/BulletproofTheme';

import './App.css';

// Configure React Query with bulletproof settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error && 'status' in error && typeof error.status === 'number') {
          return error.status >= 500 && failureCount < 3;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
    mutations: {
      retry: 1,
    },
  },
});

const MainApp: React.FC = () => {
  return (
    <ReactSafeWrapper>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <AppErrorBoundary>
            <BulletproofAuthProvider>
              <div className="min-h-screen bg-background text-foreground">
                <SafeRouter>
                  <CleanLanguageAwareRouter />
                  <Toaster />
                  <Sonner />
                </SafeRouter>
              </div>
            </BulletproofAuthProvider>
          </AppErrorBoundary>
        </QueryClientProvider>
      </ThemeProvider>
    </ReactSafeWrapper>
  );
};

export default MainApp;