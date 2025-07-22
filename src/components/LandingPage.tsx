
import React from 'react';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import EnhancedPricingSection from '@/components/pricing/EnhancedPricingSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import CTASection from '@/components/landing/CTASection';
import InteractiveDemo from '@/components/landing/InteractiveDemo';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';
import AlexCompanion from '@/components/ai/AlexCompanion';

const LandingPage = () => {
  console.log('🔍 LandingPage: Component rendering');
  const [isAlexMinimized, setIsAlexMinimized] = React.useState(true);
  
  return (
    <SafeComponentWrapper name="LandingPage">
      <div className="min-h-screen">
        {/* Hero Section */}
        <SafeComponentWrapper name="HeroSection" fallback={<div className="h-96 bg-gradient-to-br from-therapy-50 to-calm-50"></div>}>
          <HeroSection />
        </SafeComponentWrapper>
        
        {/* Interactive Demo */}
        <SafeComponentWrapper name="InteractiveDemo" fallback={<div className="py-20"></div>}>
          <InteractiveDemo />
        </SafeComponentWrapper>
        
        {/* How It Works */}
        <SafeComponentWrapper name="HowItWorksSection" fallback={<div className="py-20"></div>}>
          <div id="how-it-works">
            <HowItWorksSection />
          </div>
        </SafeComponentWrapper>
        
        {/* Features */}
        <SafeComponentWrapper name="FeaturesSection" fallback={<div className="py-20"></div>}>
          <div id="features">
            <FeaturesSection />
          </div>
        </SafeComponentWrapper>
        
        {/* Pricing */}
        <SafeComponentWrapper name="PricingSection" fallback={<div className="py-20"></div>}>
          <div id="pricing">
            <EnhancedPricingSection />
          </div>
        </SafeComponentWrapper>
        
        {/* CTA */}
        <SafeComponentWrapper name="CTASection" fallback={<div className="py-20"></div>}>
          <CTASection />
        </SafeComponentWrapper>
        
        {/* Alex AI Companion */}
        <AlexCompanion 
          isMinimized={isAlexMinimized}
          onToggleMinimize={() => setIsAlexMinimized(!isAlexMinimized)}
        />
      </div>
    </SafeComponentWrapper>
  );
};

export default LandingPage;
