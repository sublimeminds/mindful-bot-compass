
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
import QuickSignupWithPlan from "@/components/subscription/QuickSignupWithPlan";
import { Button } from "@/components/ui/button";

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
            {/* Quick Signup CTA */}
            <div className="bg-gradient-to-r from-therapy-500 to-calm-500 py-16">
              <div className="max-w-4xl mx-auto text-center px-4">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Ready to Start Your Mental Health Journey?
                </h2>
                <p className="text-therapy-100 mb-8 text-lg">
                  Choose your plan and get personalized AI therapy support in minutes
                </p>
                <QuickSignupWithPlan>
                  <Button size="lg" className="bg-white text-therapy-600 hover:bg-gray-100 px-8 py-3 text-lg">
                    Get Started Now - Choose Your Plan
                  </Button>
                </QuickSignupWithPlan>
              </div>
            </div>
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
