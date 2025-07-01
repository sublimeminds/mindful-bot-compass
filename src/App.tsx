import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import EnhancedAuthProvider from '@/components/EnhancedAuthProvider';
import LandingPage from '@/components/LandingPage';
import EnhancedOnboardingPage from '@/pages/EnhancedOnboardingPage';
import OnboardingPage from '@/pages/OnboardingPage';
import Dashboard from '@/pages/Dashboard';
import AuthPage from '@/pages/AuthPage';
import FamilyFeaturesPage from '@/pages/FamilyFeaturesPage';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <EnhancedAuthProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/onboarding" element={<EnhancedOnboardingPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/family-features" element={<FamilyFeaturesPage />} />
              </Routes>
              <Toaster />
              <Sonner />
            </div>
          </Router>
        </EnhancedAuthProvider>
      </TooltipProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
