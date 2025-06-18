
import { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { AccessibilityProvider } from '@/contexts/AccessibilityContext';
import { SessionProvider } from '@/contexts/SessionContext';
import { TherapistProvider } from '@/contexts/TherapistContext';
import { Toaster } from '@/components/ui/toaster';
import AccessibleErrorBoundary from '@/components/enhanced/AccessibleErrorBoundary';
import AccessibilityPanel from '@/components/accessibility/AccessibilityPanel';
import PerformanceDashboard from '@/components/performance/PerformanceDashboard';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import OnboardingPage from '@/pages/OnboardingPage';
import SessionPage from '@/pages/SessionPage';
import SettingsPage from '@/pages/SettingsPage';
import SubscriptionPage from '@/pages/SubscriptionPage';
import VoiceSettingsPage from '@/pages/VoiceSettingsPage';
import NotFound from '@/pages/NotFound';
import { useAuth } from '@/contexts/AuthContext';

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

function AppContent() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { isAuthenticated } = useAuth();

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
    <div className="min-h-screen bg-background">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      }>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
          <Route path="/onboarding" element={isAuthenticated ? <OnboardingPage /> : <Navigate to="/login" />} />
          <Route path="/session" element={isAuthenticated ? <SessionPage /> : <Navigate to="/login" />} />
          <Route path="/settings" element={isAuthenticated ? <SettingsPage /> : <Navigate to="/login" />} />
          <Route path="/subscription" element={isAuthenticated ? <SubscriptionPage /> : <Navigate to="/login" />} />
          <Route path="/voice-settings" element={isAuthenticated ? <VoiceSettingsPage /> : <Navigate to="/login" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      
      {/* Accessibility and Performance Tools */}
      <AccessibilityPanel />
      <PerformanceDashboard />
      
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <AccessibleErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AccessibilityProvider>
          <AuthProvider>
            <SessionProvider>
              <TherapistProvider>
                <Router>
                  <AppContent />
                </Router>
              </TherapistProvider>
            </SessionProvider>
          </AuthProvider>
        </AccessibilityProvider>
      </QueryClientProvider>
    </AccessibleErrorBoundary>
  );
}

export default App;
