
import React from 'react';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import EnhancedPricingSection from '@/components/pricing/EnhancedPricingSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import CTASection from '@/components/landing/CTASection';
import AdvancedDemoSection from '@/components/landing/AdvancedDemoSection';
import RealTherapistTeam from '@/components/therapist/RealTherapistTeam';
import TherapyApproachesSection from '@/components/landing/TherapyApproachesSection';
import AdvancedTherapyBenefits from '@/components/landing/AdvancedTherapyBenefits';
import AIWorkflowSection from '@/components/landing/AIWorkflowSection';
import ProgressTracker from '@/components/landing/ProgressTracker';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';
import AlexCompanion from '@/components/ai/AlexCompanion';

const LandingPage = () => {
  console.log('🔍 LandingPage: Component rendering');
  const [isAlexMinimized, setIsAlexMinimized] = React.useState(true);
  
  return (
    <SafeComponentWrapper name="LandingPage">
      <div className="min-h-screen relative">
        {/* Progress Tracker */}
        <ProgressTracker />
        
        {/* Hero Section */}
        <SafeComponentWrapper name="HeroSection" fallback={<div className="h-96 bg-gradient-to-br from-therapy-50 to-calm-50"></div>}>
          <div id="hero">
            <HeroSection />
          </div>
        </SafeComponentWrapper>
        
        {/* Real Therapist Team */}
        <SafeComponentWrapper name="RealTherapistTeam" fallback={<div className="py-20"></div>}>
          <div id="therapists">
            <RealTherapistTeam />
          </div>
        </SafeComponentWrapper>
        
        {/* Advanced Demo */}
        <SafeComponentWrapper name="AdvancedDemoSection" fallback={<div className="py-20"></div>}>
          <div id="demo">
            <AdvancedDemoSection />
          </div>
        </SafeComponentWrapper>
        
        {/* Features */}
        <SafeComponentWrapper name="FeaturesSection" fallback={<div className="py-20"></div>}>
          <div id="features" className="bg-gradient-to-r from-flow-50/20 via-white to-mindful-50/20">
            <FeaturesSection />
          </div>
        </SafeComponentWrapper>
        
        {/* Therapy Approaches */}
        <SafeComponentWrapper name="TherapyApproachesSection" fallback={<div className="py-20"></div>}>
          <TherapyApproachesSection />
        </SafeComponentWrapper>
        
        {/* How It Works */}
        <SafeComponentWrapper name="HowItWorksSection" fallback={<div className="py-20"></div>}>
          <div id="how-it-works" className="bg-gradient-to-bl from-therapy-50/30 via-harmony-50/20 to-calm-50/30">
            <HowItWorksSection />
          </div>
        </SafeComponentWrapper>
        
        {/* AI Workflow - Step by Step */}
        <SafeComponentWrapper name="AIWorkflowSection" fallback={<div className="py-20"></div>}>
          <div className="bg-gradient-to-r from-mindful-50/20 via-white to-flow-50/20">
            <AIWorkflowSection />
          </div>
        </SafeComponentWrapper>
        
        {/* Advanced Therapy Benefits */}
        <SafeComponentWrapper name="AdvancedTherapyBenefits" fallback={<div className="py-20"></div>}>
          <div id="benefits" className="bg-gradient-to-tr from-healing-50/30 via-balance-50/20 to-therapy-50/30">
            <AdvancedTherapyBenefits />
          </div>
        </SafeComponentWrapper>
        
        {/* Pricing */}
        <SafeComponentWrapper name="PricingSection" fallback={<div className="py-20"></div>}>
          <div id="pricing" className="bg-gradient-to-br from-calm-50/20 via-harmony-50/30 to-therapy-50/20">
            <EnhancedPricingSection />
          </div>
        </SafeComponentWrapper>
        
        {/* CTA */}
        <SafeComponentWrapper name="CTASection" fallback={<div className="py-20"></div>}>
          <div id="cta" className="bg-gradient-to-t from-therapy-50/30 via-harmony-50/20 to-calm-50/30">
            <CTASection />
          </div>
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
