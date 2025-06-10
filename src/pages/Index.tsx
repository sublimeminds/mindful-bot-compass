
import { useAuth } from "@/contexts/AuthContext";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import PricingSection from "@/components/PricingSection";
import UserDashboard from "@/components/UserDashboard";
import NotificationToastHandler from "@/components/NotificationToastHandler";
import IntelligentNotificationProvider from "@/components/IntelligentNotificationProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Index = () => {
  const { isAuthenticated, user, loading } = useAuth();

  console.log('Index page - Auth state:', { isAuthenticated, user: user?.email, loading });

  // Show loading while checking auth
  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-500"></div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        {isAuthenticated && user ? (
          <IntelligentNotificationProvider>
            <NotificationToastHandler />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      </div>
      <Footer />
    </>
  );
};

export default Index;
