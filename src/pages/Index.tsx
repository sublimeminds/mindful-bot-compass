
import { useAuth } from "@/contexts/AuthContext";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import PricingSection from "@/components/PricingSection";
import UserDashboard from "@/components/UserDashboard";
import NotificationDebugPanel from "@/components/NotificationDebugPanel";
import NotificationToastHandler from "@/components/NotificationToastHandler";
import IntelligentNotificationProvider from "@/components/IntelligentNotificationProvider";
import IntelligentAssistant from "@/components/ai/IntelligentAssistant";
import SmartOnboardingGuide from "@/components/ai/SmartOnboardingGuide";

const Index = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {isAuthenticated && user ? (
        <IntelligentNotificationProvider>
          <NotificationToastHandler />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Debug Panel - Only show in development or for testing */}
            {process.env.NODE_ENV === 'development' && (
              <NotificationDebugPanel />
            )}
            
            <SmartOnboardingGuide />
            <UserDashboard />
            <IntelligentAssistant />
          </div>
        </IntelligentNotificationProvider>
      ) : (
        <>
          <HeroSection />
          <div id="features">
            <FeaturesSection />
          </div>
          <div id="pricing">
            <PricingSection />
          </div>
        </>
      )}
    </div>
  );
};

export default Index;
