
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import AdvancedFeaturesSection from '@/components/landing/AdvancedFeaturesSection';
import StatsCounter from '@/components/landing/StatsCounter';
import InteractiveDemo from '@/components/landing/InteractiveDemo';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import TrustSection from '@/components/landing/TrustSection';
import VideoEnhancedDemo from '@/components/landing/VideoEnhancedDemo';
import CTASection from '@/components/landing/CTASection';
import PricingSection from '@/components/PricingSection';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user, loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is authenticated, show dashboard
  if (user) {
    return (
      <>
        <Header />
        <DashboardLayout />
        <Footer />
      </>
    );
  }

  // Show complete landing page for non-authenticated users
  return (
    <>
      <Header />
      <div className="min-h-screen">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <AdvancedFeaturesSection />
        <StatsCounter />
        <InteractiveDemo />
        <TestimonialsSection />
        <TrustSection />
        <VideoEnhancedDemo />
        <CTASection />
        <PricingSection />
      </div>
      <Footer />
    </>
  );
};

export default Index;
