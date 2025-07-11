
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import EnhancedPricingSection from '@/components/pricing/EnhancedPricingSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import CTASection from '@/components/landing/CTASection';
import InteractiveDemo from '@/components/landing/InteractiveDemo';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';
import AlexCompanion from '@/components/ai/AlexCompanion';

const LandingPage = () => {
  console.log('LandingPage rendering');
  const [isAlexMinimized, setIsAlexMinimized] = React.useState(true);
  
  return (
    <SafeComponentWrapper name="LandingPage">
      <div className="min-h-screen">
        <SafeComponentWrapper name="Header" fallback={<div className="h-16 bg-white border-b"></div>}>
          <Header />
        </SafeComponentWrapper>
        
        <SafeComponentWrapper name="HeroSection" fallback={<div className="h-96 bg-gradient-to-br from-therapy-50 to-calm-50"></div>}>
          <HeroSection />
        </SafeComponentWrapper>
        
        <SafeComponentWrapper name="InteractiveDemo" fallback={<div className="py-20"></div>}>
          <InteractiveDemo />
        </SafeComponentWrapper>
        
        <SafeComponentWrapper name="HowItWorksSection" fallback={<div className="py-20"></div>}>
          <div id="how-it-works">
            <HowItWorksSection />
          </div>
        </SafeComponentWrapper>
        
        <SafeComponentWrapper name="FeaturesSection" fallback={<div className="py-20"></div>}>
          <div id="features">
            <FeaturesSection />
          </div>
        </SafeComponentWrapper>
        
        <SafeComponentWrapper name="PricingSection" fallback={<div className="py-20"></div>}>
          <div id="pricing">
            <EnhancedPricingSection />
          </div>
        </SafeComponentWrapper>
        
        <SafeComponentWrapper name="CTASection" fallback={<div className="py-20"></div>}>
          <CTASection />
        </SafeComponentWrapper>
        
        <SafeComponentWrapper name="Footer" fallback={<div className="h-32 bg-slate-50"></div>}>
          <Footer />
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
