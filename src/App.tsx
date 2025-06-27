
import { Suspense, lazy } from 'react';
import { HashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import ElectronErrorBoundary from '@/components/electron/ElectronErrorBoundary';
import ElectronAppWrapper from '@/components/electron/ElectronAppWrapper';
import { SafeAccessibilityProvider } from '@/contexts/SafeAccessibilityContext';
import { EnhancedAuthProvider } from '@/components/EnhancedAuthProvider';
import './App.css';

// Lazy load the main router to prevent blocking
const AppRouter = lazy(() => import('@/components/AppRouter'));

// Create a stable query client instance with Electron-friendly settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry in Electron offline mode or file protocol
        const isElectron = window.location.protocol === 'file:' || 
                          window.navigator.userAgent.toLowerCase().includes('electron');
        
        if (isElectron && failureCount >= 1) {
          console.log('QueryClient: Skipping retry in Electron mode');
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false, // Disable in Electron
      refetchOnReconnect: false, // Disable auto-refetch in Electron
    },
  },
});

// Enhanced loading fallback for Electron with timeout
const ElectronLoadingFallback = () => {
  console.log('App: Showing loading fallback');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
        <p className="text-therapy-600 font-medium">Loading TherapySync...</p>
        <p className="text-sm text-therapy-500 mt-2">Initializing your mental health companion</p>
      </div>
    </div>
  );
};

function App() {
  console.log('App: Component rendering');
  
  return (
    <ElectronErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <SafeAccessibilityProvider>
            <EnhancedAuthProvider>
              <ElectronAppWrapper>
                <HashRouter>
                  <Suspense fallback={<ElectronLoadingFallback />}>
                    <AppRouter />
                  </Suspense>
                </HashRouter>
                <Toaster />
              </ElectronAppWrapper>
            </EnhancedAuthProvider>
          </SafeAccessibilityProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ElectronErrorBoundary>
  );
}

export default App;
