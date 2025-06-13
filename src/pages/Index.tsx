
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

const Index = () => {
  const { isAuthenticated, user, loading } = useAuth();

  console.log('Index page - Auth state:', { isAuthenticated, user: user?.email, loading });

  // Show loading while checking auth
  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
          <TreeLoadingSpinner 
            size="lg" 
            message="Syncing your mental wellness journey..."
          />
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
