
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HashRouter } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import ElectronErrorBoundary from '@/components/electron/ElectronErrorBoundary';
import ElectronAppWrapper from '@/components/electron/ElectronAppWrapper';
import { SafeAccessibilityProvider } from '@/contexts/SafeAccessibilityContext';
import { EnhancedAuthProvider } from '@/components/EnhancedAuthProvider';
import { SimpleTherapistProvider } from '@/components/SimpleTherapistProvider';
import AppRouter from '@/components/AppRouter';
import './App.css';

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

function App() {
  console.log('App: Component rendering');
  
  return (
    <ElectronErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <SafeAccessibilityProvider>
            <EnhancedAuthProvider>
              <SimpleTherapistProvider>
                <ElectronAppWrapper>
                  <HashRouter>
                    <AppRouter />
                  </HashRouter>
                  <Toaster />
                </ElectronAppWrapper>
              </SimpleTherapistProvider>
            </EnhancedAuthProvider>
          </SafeAccessibilityProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ElectronErrorBoundary>
  );
}

export default App;
