
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { BulletproofAuthProvider } from '@/components/bulletproof/BulletproofAuthProvider';
import { SecurityProvider } from '@/components/security/SecurityProvider';
import { ThemeProvider } from '@/utils/BulletproofTheme';
import ReactErrorBoundary from '@/components/error/ReactErrorBoundary';
import Header from '@/components/Header';
import DatabaseFooter from '@/components/DatabaseFooter';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import SearchResults from '@/pages/SearchResults';
import TherapyTypesOverview from '@/pages/TherapyTypesOverview';
import TestDashboardPage from '@/pages/TestDashboardPage';
import PrivateRoute from '@/components/PrivateRoute';
import { useLocation } from 'react-router-dom';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  const AppContent = () => {
    const location = useLocation();
    
    return (
      <div className="min-h-screen bg-background">
        {/* Temporarily completely disable header on landing page */}
        {location.pathname !== '/' && location.pathname !== '' && <Header />}
        <main>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/therapy-types-overview" element={<TherapyTypesOverview />} />
            <Route path="/test-dashboard" element={<TestDashboardPage />} />
          </Routes>
        </main>
        <DatabaseFooter />
        <Toaster />
        <Sonner />
      </div>
    );
  };

  return (
    <ReactErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="therapysync-theme">
          <SecurityProvider>
            <BulletproofAuthProvider>
              <Router>
                <AppContent />
              </Router>
            </BulletproofAuthProvider>
          </SecurityProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ReactErrorBoundary>
  );
}

export default App;
