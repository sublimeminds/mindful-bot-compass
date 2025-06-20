
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import PricingSection from '@/components/PricingSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import CTASection from '@/components/landing/CTASection';

const LandingPage = () => {
  console.log('LandingPage rendering');
  
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <div id="how-it-works">
        <HowItWorksSection />
      </div>
      <div id="features">
        <FeaturesSection />
      </div>
      <div id="pricing">
        <PricingSection />
      </div>
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;
