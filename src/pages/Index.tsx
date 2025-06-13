
import React from 'react';
import { useAuth } from "@/contexts/AuthContext";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import PricingSection from "@/components/PricingSection";
import UserDashboard from "@/components/UserDashboard";
import NotificationToastHandler from "@/components/NotificationToastHandler";
import IntelligentNotificationProvider from "@/components/IntelligentNotificationProvider";
import OfflineIndicator from "@/components/OfflineIndicator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StatsCounter from "@/components/landing/StatsCounter";
import VideoEnhancedDemo from "@/components/landing/VideoEnhancedDemo";
import AdvancedFeaturesSection from "@/components/landing/AdvancedFeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import TrustSection from "@/components/landing/TrustSection";
import CTASection from "@/components/landing/CTASection";
import TreeLoadingSpinner from "@/components/ui/TreeLoadingSpinner";
import TreeLogo from "@/components/ui/TreeLogo";

const Index = () => {
  const { isAuthenticated, user, loading } = useAuth();

  console.log('Index page - Auth state:', { isAuthenticated, user: user?.email, loading });

  // Show loading while checking auth
  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
          <div className="text-center space-y-6">
            <TreeLogo 
              size="xl"
              animated={true}
              variant="growing"
              loading={true}
              className="mx-auto"
            />
            <TreeLoadingSpinner 
              size="lg" 
              message="Syncing your mental wellness journey..."
            />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <OfflineIndicator />
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        {isAuthenticated && user ? (
          <IntelligentNotificationProvider>
            <NotificationToastHandler />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Welcome section with logo for authenticated users */}
              <div className="mb-8 text-center">
                <div className="flex items-center justify-center mb-4">
                  <TreeLogo 
                    size="lg"
                    animated={true}
                    variant="celebration"
                    className="drop-shadow-sm"
                  />
                </div>
                <h1 className="text-2xl font-bold text-therapy-700 mb-2">
                  Welcome back to your wellness journey
                </h1>
                <p className="text-muted-foreground">
                  Continue growing with TherapySync's personalized support
                </p>
              </div>
              <UserDashboard />
            </div>
          </IntelligentNotificationProvider>
        ) : (
          <>
            <HeroSection />
            <StatsCounter />
            <VideoEnhancedDemo />
            <AdvancedFeaturesSection />
            <HowItWorksSection />
            <TestimonialsSection />
            <TrustSection />
            <div id="features">
              <FeaturesSection />
            </div>
            <div id="pricing">
              <PricingSection />
            </div>
            <CTASection />
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Index;
