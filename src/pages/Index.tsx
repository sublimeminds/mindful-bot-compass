
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";
import UserDashboard from "@/components/UserDashboard";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { isAuthenticated, profile, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && profile && !profile.onboarding_complete) {
      navigate('/onboarding');
    }
  }, [isAuthenticated, profile, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated && profile?.onboarding_complete) {
    return <UserDashboard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
