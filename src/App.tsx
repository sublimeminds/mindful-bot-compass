
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { EnhancedAuthProvider } from '@/components/EnhancedAuthProvider';
import { SimpleAppProvider } from '@/hooks/useSimpleApp';
import LandingPage from '@/components/LandingPage';
import EnhancedOnboardingPage from '@/pages/EnhancedOnboardingPage';
import OnboardingPage from '@/pages/OnboardingPage';
import Dashboard from '@/pages/Dashboard';
import FamilyFeaturesPage from '@/pages/FamilyFeaturesPage';
import ProfilePage from '@/pages/ProfilePage';
import DashboardPage from '@/pages/DashboardPage';
import TherapyChatPage from '@/pages/TherapyChatPage';
import SessionsPage from '@/pages/SessionsPage';
import AIAvatarPage from '@/pages/AIAvatarPage';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <EnhancedAuthProvider>
          <SimpleAppProvider>
            <Router>
              <div className="min-h-screen bg-background">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/onboarding" element={<EnhancedOnboardingPage />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/family-features" element={<FamilyFeaturesPage />} />
                  <Route path="/analytics" element={<DashboardPage />} />
                  <Route path="/sessions" element={<SessionsPage />} />
                  <Route path="/goals" element={<GoalsPage />} />
                  <Route path="/settings" element={<ProfilePage />} />
                  <Route path="/billing" element={<ProfilePage />} />
                  <Route path="/help" element={<DashboardPage />} />
                  <Route path="/support" element={<DashboardPage />} />
                  <Route path="/therapy-chat" element={<TherapyChatPage />} />
                  <Route path="/chat" element={<TherapyChatPage />} />
                  <Route path="/mood" element={<DashboardPage />} />
                  <Route path="/mood-tracker" element={<DashboardPage />} />
                  <Route path="/ai-avatar" element={<AIAvatarPage />} />
                </Routes>
                <Toaster />
                <Sonner />
              </div>
            </Router>
          </SimpleAppProvider>
        </EnhancedAuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
