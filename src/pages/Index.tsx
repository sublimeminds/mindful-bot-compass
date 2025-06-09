
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";
import UserDashboard from "@/components/UserDashboard";
import NotificationDebugPanel from "@/components/NotificationDebugPanel";
import NotificationToastHandler from "@/components/NotificationToastHandler";
import IntelligentNotificationProvider from "@/components/IntelligentNotificationProvider";

const Index = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Header />
      
      <main className="pt-12"> {/* Add padding-top to account for progress bar */}
        {isAuthenticated && user ? (
          <IntelligentNotificationProvider>
            <NotificationToastHandler />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Debug Panel - Only show in development or for testing */}
              {process.env.NODE_ENV === 'development' && (
                <NotificationDebugPanel />
              )}
              
              <UserDashboard />
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
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
