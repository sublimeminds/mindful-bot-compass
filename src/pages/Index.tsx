
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";
import UserDashboard from "@/components/UserDashboard";
import NotificationDebugPanel from "@/components/NotificationDebugPanel";

const Index = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Header />
      
      <main>
        {isAuthenticated && user ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Debug Panel - Only show in development or for testing */}
            {process.env.NODE_ENV === 'development' && (
              <NotificationDebugPanel />
            )}
            
            <UserDashboard />
          </div>
        ) : (
          <>
            <HeroSection />
            <FeaturesSection />
            <PricingSection />
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
