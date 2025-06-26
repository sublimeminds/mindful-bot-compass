
import { Suspense, lazy } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import ElectronErrorBoundary from '@/components/electron/ElectronErrorBoundary';
import ElectronAppWrapper from '@/components/electron/ElectronAppWrapper';
import { SafeAccessibilityProvider } from '@/contexts/SafeAccessibilityContext';
import './App.css';

// Lazy load the main router to prevent blocking
const AppRouter = lazy(() => import('@/components/AppRouter'));

// Create a stable query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry in Electron offline mode
        if (window.location.protocol === 'file:' && failureCount >= 1) {
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false, // Disable in Electron
    },
  },
});

// Simple loading fallback for Electron
const ElectronLoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
      <p className="text-therapy-600 font-medium">Loading TherapySync...</p>
    </div>
  </div>
);

function App() {
  console.log('App component rendering');
  
  return (
    <ElectronErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <SafeAccessibilityProvider>
            <ElectronAppWrapper>
              <Suspense fallback={<ElectronLoadingFallback />}>
                <AppRouter />
              </Suspense>
              <Toaster />
            </ElectronAppWrapper>
          </SafeAccessibilityProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ElectronErrorBoundary>
  );
}

export default App;
