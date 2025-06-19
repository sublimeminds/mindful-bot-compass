
import { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { SessionProvider } from '@/contexts/SessionContext';
import { TherapistProvider } from '@/contexts/TherapistContext';
import { Toaster } from '@/components/ui/toaster';
import EnhancedErrorBoundary from '@/components/enhanced/EnhancedErrorBoundary';
import AutoRecoveryProvider from '@/components/enhanced/AutoRecoveryProvider';
import AccessibilityPanel from '@/components/accessibility/AccessibilityPanel';
import NetworkStatusIndicator from '@/components/performance/NetworkStatusIndicator';
import OfflineIndicator from '@/components/OfflineIndicator';
import AppRouter from '@/components/AppRouter';
import { initializePWA } from '@/utils/serviceWorker';
import { enhancedCacheService } from '@/services/enhancedCachingService';

import './App.css';
import SafeReactProvider from '@/components/SafeReactProvider';
import { SafeAccessibilityProvider } from '@/contexts/SafeAccessibilityContext';

// Enhanced Query Client with better defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on auth errors
        if (error?.message?.includes('unauthorized') || error?.message?.includes('forbidden')) {
          return false;
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false, // Disable aggressive refetching
      refetchOnReconnect: true, // Refetch when back online
    },
    mutations: {
      retry: (failureCount, error) => {
        // Be more conservative with mutation retries
        if (error?.message?.includes('unauthorized') || error?.message?.includes('forbidden')) {
          return false;
        }
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(2000 * 2 ** attemptIndex, 10000),
    },
  },
});

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initialize PWA and enhanced caching
    const initializeApp = async () => {
      try {
        // Initialize PWA features
        await initializePWA({
          onUpdate: () => {
            console.log('New app version available');
          },
          onSuccess: () => {
            console.log('App is ready for offline use');
          }
        });

        // Warm up critical caches
        await enhancedCacheService.warmCache([
          {
            key: 'user-profile',
            fetcher: async () => {
              // This would fetch user profile data
              return null;
            }
          }
        ]);

        // Set up periodic cache cleanup
        setInterval(() => {
          enhancedCacheService.cleanup();
        }, 10 * 60 * 1000); // Every 10 minutes

        // Start automated health monitoring
        const { automatedHealthService } = await import('@/services/automatedHealthService');
        await automatedHealthService.startMonitoring();
        console.log('Automated health monitoring started');

        setIsInitialized(true);
      } catch (error) {
        console.error('App initialization failed:', error);
        setIsInitialized(true); // Still allow app to load
      }
    };

    initializeApp();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      // Stop health monitoring on cleanup
      import('@/services/automatedHealthService').then(({ automatedHealthService }) => {
        automatedHealthService.stopMonitoring();
      });
    };
  }, []);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Initializing app...</p>
        </div>
      </div>
    );
  }

  return (
    <SafeReactProvider>
      <AutoRecoveryProvider 
        recoveryLevel="conservative"
        enableModuleReloading={true}
        enableContextRecovery={true}
      >
        <EnhancedErrorBoundary level="critical">
          <QueryClientProvider client={queryClient}>
            <SafeAccessibilityProvider>
              <AuthProvider>
                <SessionProvider>
                  <TherapistProvider>
                    <Router>
                      <div className="min-h-screen bg-background">
                        <EnhancedErrorBoundary level="page">
                          <AppRouter />
                        </EnhancedErrorBoundary>
                        
                        {/* Status Indicators */}
                        <NetworkStatusIndicator />
                        <OfflineIndicator />
                        
                        {/* Accessibility Tools - Available to all users */}
                        <EnhancedErrorBoundary level="component">
                          <AccessibilityPanel />
                        </EnhancedErrorBoundary>
                        
                        <Toaster />
                      </div>
                    </Router>
                  </TherapistProvider>
                </SessionProvider>
              </AuthProvider>
            </SafeAccessibilityProvider>
          </QueryClientProvider>
        </EnhancedErrorBoundary>
      </AutoRecoveryProvider>
    </SafeReactProvider>
  );
}

export default App;
