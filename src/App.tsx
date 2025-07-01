
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { EnhancedAuthProvider } from '@/components/EnhancedAuthProvider';
import LandingPage from '@/components/LandingPage';
import EnhancedOnboardingPage from '@/pages/EnhancedOnboardingPage';
import OnboardingPage from '@/pages/OnboardingPage';
import Dashboard from '@/pages/Dashboard';
import FamilyFeaturesPage from '@/pages/FamilyFeaturesPage';
import ProfilePage from '@/pages/ProfilePage';
import DashboardPage from '@/pages/DashboardPage';
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
                <Route path="/onboarding" element={<EnhancedOnboardingPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/family-features" element={<FamilyFeaturesPage />} />
                <Route path="/analytics" element={<DashboardPage />} />
                <Route path="/sessions" element={<DashboardPage />} />
                <Route path="/goals" element={<DashboardPage />} />
                <Route path="/settings" element={<ProfilePage />} />
                <Route path="/billing" element={<ProfilePage />} />
                <Route path="/help" element={<DashboardPage />} />
                <Route path="/support" element={<DashboardPage />} />
              </Routes>
              <Toaster />
              <Sonner />
            </div>
          </Router>
        </EnhancedAuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
