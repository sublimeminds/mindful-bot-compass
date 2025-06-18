
import { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { AccessibilityProvider } from '@/contexts/AccessibilityContext';
import { SessionProvider } from '@/contexts/SessionContext';
import { TherapistProvider } from '@/contexts/TherapistContext';
import { Toaster } from '@/components/ui/toaster';
import ErrorBoundary from '@/components/ErrorBoundary';
import AccessibilityPanel from '@/components/accessibility/AccessibilityPanel';
import PerformanceDashboard from '@/components/performance/PerformanceDashboard';
import AppRouter from '@/components/AppRouter';

import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    },
  },
});

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AccessibilityProvider>
          <AuthProvider>
            <SessionProvider>
              <TherapistProvider>
                <Router>
                  <div className="min-h-screen bg-background">
                    <AppRouter />
                    
                    {/* Accessibility and Performance Tools */}
                    <ErrorBoundary>
                      <AccessibilityPanel />
                    </ErrorBoundary>
                    <ErrorBoundary>
                      <PerformanceDashboard />
                    </ErrorBoundary>
                    
                    <Toaster />
                  </div>
                </Router>
              </TherapistProvider>
            </SessionProvider>
          </AuthProvider>
        </AccessibilityProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
