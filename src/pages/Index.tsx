
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
import GradientLoadingSpinner from "@/components/ui/GradientLoadingSpinner";
import GradientLogo from "@/components/ui/GradientLogo";
import UserAvatar from "@/components/ui/UserAvatar";
import { Heart, Sparkles } from "lucide-react";

const Index = () => {
  const { isAuthenticated, user, loading } = useAuth();

  console.log('Index page - Auth state:', { isAuthenticated, user: user?.email, loading });

  // Show loading with new branding while checking auth
  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-harmony-50 via-balance-50 to-flow-100">
          <div className="text-center space-y-8">
            <div className="flex items-center justify-center w-40 h-40 bg-white/90 backdrop-blur-sm rounded-full shadow-xl p-6">
              <GradientLogo 
                size="xxl"
                className="drop-shadow-lg"
              />
            </div>
            <GradientLoadingSpinner 
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
              {/* Welcome section with user avatar for authenticated users */}
              <div className="mb-8 text-center">
                <div className="flex items-center justify-center mb-6">
                  <div className="relative">
                    <UserAvatar user={user} size="xl" />
                    <div className="absolute -top-2 -right-2 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <GradientLogo size="lg" />
                    </div>
                  </div>
                </div>
                <h1 className="text-3xl font-bold mb-3 flex items-center justify-center text-slate-800">
                  <GradientLogo size="lg" className="mr-4" />
                  <span className="bg-gradient-to-r from-harmony-600 via-balance-600 to-flow-600 bg-clip-text text-transparent">
                    Welcome back to your wellness journey
                  </span>
                  <Sparkles className="h-7 w-7 ml-3 text-harmony-500" />
                </h1>
                <p className="text-lg text-slate-600">
                  Continue flowing with TherapySync's personalized support
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
            <div id="how-it-works">
              <HowItWorksSection />
            </div>
            <div id="testimonials">
              <TestimonialsSection />
            </div>
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
