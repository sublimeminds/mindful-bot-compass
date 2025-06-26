
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import ReactSafeWrapper from "./components/ReactSafeWrapper";
import { AccessibilityProvider } from "./contexts/AccessibilityContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import Chat from "./pages/Chat";
import MoodTracker from "./pages/MoodTracker";
import Goals from "./pages/Goals";
import SessionHistory from "./pages/SessionHistory";
import Settings from "./pages/Settings";
import VoiceAI from "./pages/VoiceAI";
import TherapyChat from "./pages/TherapyChat";
import Techniques from "./pages/Techniques";
import TechniqueSession from "./pages/TechniqueSession";
import Analytics from "./pages/Analytics";
import Integrations from "./pages/Integrations";
import OnboardingPage from "./pages/OnboardingPage";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminSystem from "./pages/AdminSystem";
import AdminContent from "./pages/AdminContent";
import AdminIntegrations from "./pages/AdminIntegrations";
import CrisisManagement from "./pages/CrisisManagement";
import EnhancedIntegrations from "./pages/EnhancedIntegrations";
import ContentLibrary from "./pages/ContentLibrary";
import LiveCollaboration from "./pages/LiveCollaboration";
import AIPersonalization from "./pages/AIPersonalization";
import AdvancedAnalytics from "./pages/AdvancedAnalytics";
import { EnhancedAuthProvider } from "./components/EnhancedAuthProvider";
import AuthErrorBoundary from "./components/auth/AuthErrorBoundary";

const queryClient = new QueryClient();

const App = () => {
  return (
    <ReactSafeWrapper>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <TooltipProvider>
            <AccessibilityProvider>
              <AuthErrorBoundary>
                <EnhancedAuthProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/onboarding" element={<OnboardingPage />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/chat" element={<Chat />} />
                      <Route path="/mood-tracker" element={<MoodTracker />} />
                      <Route path="/goals" element={<Goals />} />
                      <Route path="/session-history" element={<SessionHistory />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/voice-ai" element={<VoiceAI />} />
                      <Route path="/therapy-chat" element={<TherapyChat />} />
                      <Route path="/techniques" element={<Techniques />} />
                      <Route path="/techniques/:id" element={<TechniqueSession />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/advanced-analytics" element={<AdvancedAnalytics />} />
                      <Route path="/integrations" element={<Integrations />} />
                      <Route path="/enhanced-integrations" element={<EnhancedIntegrations />} />
                      <Route path="/content-library" element={<ContentLibrary />} />
                      <Route path="/live-collaboration" element={<LiveCollaboration />} />
                      <Route path="/ai-personalization" element={<AIPersonalization />} />
                      <Route path="/crisis-management" element={<CrisisManagement />} />
                      <Route path="/admin" element={<Admin />} />
                      <Route path="/admin/dashboard" element={<AdminDashboard />} />
                      <Route path="/admin/users" element={<AdminUsers />} />
                      <Route path="/admin/analytics" element={<AdminAnalytics />} />
                      <Route path="/admin/system" element={<AdminSystem />} />
                      <Route path="/admin/content" element={<AdminContent />} />
                      <Route path="/admin/integrations" element={<AdminIntegrations />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </BrowserRouter>
                </EnhancedAuthProvider>
              </AuthErrorBoundary>
            </AccessibilityProvider>
          </TooltipProvider>
        </HelmetProvider>
      </QueryClientProvider>
    </ReactSafeWrapper>
  );
};

export default App;
