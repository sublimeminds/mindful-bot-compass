
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TherapistProvider } from '@/contexts/TherapistContext';
import { TutorialProvider } from '@/components/tutorial/TutorialProvider';
import MobileNavigationTabs from '@/components/mobile/MobileNavigationTabs';
import OfflineIndicator from '@/components/OfflineIndicator';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Goals from '@/pages/Goals';
import MoodTracker from '@/pages/MoodTracker';
import CommunityHub from '@/pages/CommunityHub';
import Profile from '@/pages/Profile';
import TherapyChat from '@/pages/TherapyChat';
import SessionPage from '@/pages/SessionPage';
import Help from '@/pages/Help';
import Admin from '@/pages/Admin';
import Integrations from '@/pages/Integrations';
import Settings from '@/pages/Settings';
import Analytics from '@/pages/Analytics';
import EnhancedIntegrations from '@/pages/EnhancedIntegrations';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <TherapistProvider>
          <TutorialProvider>
            <div className="min-h-screen bg-background">
              <OfflineIndicator />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/mood" element={<MoodTracker />} />
                <Route path="/community" element={<CommunityHub />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/chat" element={<TherapyChat />} />
                <Route path="/session" element={<SessionPage />} />
                <Route path="/help" element={<Help />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/integrations" element={<Integrations />} />
                <Route path="/enhanced-integrations" element={<EnhancedIntegrations />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/analytics" element={<Analytics />} />
              </Routes>
              <MobileNavigationTabs />
              <Toaster />
            </div>
          </TutorialProvider>
        </TherapistProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
