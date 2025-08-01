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
import { TherapistProvider } from '@/contexts/TherapistContext';

// Main App Router
import { CleanLanguageAwareRouter } from '@/components/seo/CleanLanguageAwareRouter';

// Language Banner
import LanguageBanner from '@/components/ui/LanguageBanner';
import { useLanguageBanner } from '@/hooks/useLanguageBanner';

// Use the bulletproof theme that doesn't use React hooks
import { ThemeProvider } from '@/utils/BulletproofTheme';

import './App.css';
import { mobileOptimizer } from '@/utils/mobileOptimizations';

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
  const { showBanner, suggestedLanguage, dismissBanner, switchLanguage } = useLanguageBanner();

  // Initialize mobile optimizations
  React.useEffect(() => {
    mobileOptimizer.initialize();
  }, []);

  return (
    <ReactSafeWrapper>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <AppErrorBoundary>
            <BulletproofAuthProvider>
              <TherapistProvider>
                <div className="min-h-screen bg-background text-foreground">
                  {/* LanguageBanner temporarily disabled to fix duplicate header issue */}
                  {/* <LanguageBanner
                    isVisible={showBanner}
                    onDismiss={dismissBanner}
                    onSwitch={switchLanguage}
                    suggestedLanguage={suggestedLanguage}
                  /> */}
                  <SafeRouter>
                    <CleanLanguageAwareRouter />
                    <Toaster />
                    <Sonner />
                  </SafeRouter>
                </div>
              </TherapistProvider>
            </BulletproofAuthProvider>
          </AppErrorBoundary>
        </QueryClientProvider>
      </ThemeProvider>
    </ReactSafeWrapper>
  );
};

export default MainApp;
