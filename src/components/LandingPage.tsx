
import React from 'react';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import EnhancedPricingSection from '@/components/pricing/EnhancedPricingSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import CTASection from '@/components/landing/CTASection';
import AdvancedDemoSection from '@/components/landing/AdvancedDemoSection';
import RealTherapistTeam from '@/components/therapist/RealTherapistTeam';
import ComprehensiveTherapyApproaches from '@/components/landing/ComprehensiveTherapyApproaches';
import AdvancedTherapyBenefits from '@/components/landing/AdvancedTherapyBenefits';
import AIWorkflowSection from '@/components/landing/AIWorkflowSection';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';
import AlexCompanion from '@/components/ai/AlexCompanion';
import ParallaxContainer from '@/components/parallax/ParallaxContainer';
import ParallaxSection from '@/components/parallax/ParallaxSection';
import AppleProgressBar from '@/components/parallax/AppleProgressBar';

const LandingPage = () => {
  console.log('🔍 LandingPage: Component rendering');
  const [isAlexMinimized, setIsAlexMinimized] = React.useState(true);
  
  return (
    <SafeComponentWrapper name="LandingPage">
      <ParallaxContainer className="min-h-screen relative">
        {/* Apple-Style Progress Bar */}
        <AppleProgressBar />
        
        {/* Hero Section */}
        <ParallaxSection 
          id="hero"
          fullHeight
          background={
            <div className="absolute inset-0 bg-gradient-to-br from-therapy-50/60 via-healing-50/40 to-harmony-50/60" />
          }
          backgroundSpeed={-0.2}
        >
          <SafeComponentWrapper name="HeroSection" fallback={<div className="h-96 bg-gradient-to-br from-therapy-50 to-calm-50"></div>}>
            <HeroSection />
          </SafeComponentWrapper>
        </ParallaxSection>

        {/* AI Technology Section */}
        <ParallaxSection 
          id="ai-technology"
          background={
            <div className="absolute inset-0 bg-gradient-to-tr from-mindful-50/30 via-flow-50/20 to-therapy-50/30" />
          }
          backgroundSpeed={-0.15}
        >
          <div className="py-20 px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Advanced AI Technology</h2>
              <p className="text-xl text-gray-600 mb-8">Powered by cutting-edge artificial intelligence that understands you</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <div className="w-12 h-12 bg-gradient-to-br from-therapy-500 to-healing-500 rounded-xl mx-auto mb-4 flex items-center justify-center text-white text-2xl">🧠</div>
                  <h3 className="font-semibold text-lg mb-2">Neural Processing</h3>
                  <p className="text-gray-600">Advanced language models trained on therapeutic data</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <div className="w-12 h-12 bg-gradient-to-br from-therapy-500 to-healing-500 rounded-xl mx-auto mb-4 flex items-center justify-center text-white text-2xl">🎯</div>
                  <h3 className="font-semibold text-lg mb-2">Personalized Matching</h3>
                  <p className="text-gray-600">AI-driven therapist and approach recommendations</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <div className="w-12 h-12 bg-gradient-to-br from-therapy-500 to-healing-500 rounded-xl mx-auto mb-4 flex items-center justify-center text-white text-2xl">🔒</div>
                  <h3 className="font-semibold text-lg mb-2">Privacy First</h3>
                  <p className="text-gray-600">HIPAA-compliant with end-to-end encryption</p>
                </div>
              </div>
            </div>
          </div>
        </ParallaxSection>
        
        {/* Real Therapist Team */}
        <ParallaxSection 
          id="therapists"
          background={
            <div className="absolute inset-0 bg-gradient-to-r from-therapy-50/10 via-transparent to-calm-50/10" />
          }
          backgroundSpeed={-0.1}
        >
          <SafeComponentWrapper name="RealTherapistTeam" fallback={<div className="py-20"></div>}>
            <RealTherapistTeam />
          </SafeComponentWrapper>
        </ParallaxSection>
        
        {/* Advanced Demo */}
        <ParallaxSection 
          id="demo"
          background={
            <div className="absolute inset-0 bg-gradient-to-bl from-mindful-50/15 via-transparent to-flow-50/15" />
          }
          backgroundSpeed={-0.15}
        >
          <SafeComponentWrapper name="AdvancedDemoSection" fallback={<div className="py-20"></div>}>
            <AdvancedDemoSection />
          </SafeComponentWrapper>
        </ParallaxSection>
        
        {/* Features */}
        <ParallaxSection 
          id="features"
          background={
            <div className="absolute inset-0 bg-gradient-to-r from-flow-50/20 via-white to-mindful-50/20" />
          }
          backgroundSpeed={-0.2}
        >
          <SafeComponentWrapper name="FeaturesSection" fallback={<div className="py-20"></div>}>
            <FeaturesSection />
          </SafeComponentWrapper>
        </ParallaxSection>
        
        {/* Comprehensive Therapy Approaches */}
        <ParallaxSection 
          id="approaches"
          background={
            <div className="absolute inset-0 bg-gradient-to-br from-therapy-50/30 via-healing-50/20 to-harmony-50/30" />
          }
          backgroundSpeed={-0.1}
        >
          <SafeComponentWrapper name="ComprehensiveTherapyApproaches" fallback={<div className="py-20"></div>}>
            <ComprehensiveTherapyApproaches />
          </SafeComponentWrapper>
        </ParallaxSection>
        
        {/* How It Works */}
        <ParallaxSection 
          id="how-it-works"
          background={
            <div className="absolute inset-0 bg-gradient-to-bl from-therapy-50/30 via-harmony-50/20 to-calm-50/30" />
          }
          backgroundSpeed={-0.25}
        >
          <SafeComponentWrapper name="HowItWorksSection" fallback={<div className="py-20"></div>}>
            <HowItWorksSection />
          </SafeComponentWrapper>
        </ParallaxSection>
        
        {/* AI Workflow - Step by Step */}
        <ParallaxSection 
          id="workflow"
          background={
            <div className="absolute inset-0 bg-gradient-to-r from-mindful-50/20 via-white to-flow-50/20" />
          }
          backgroundSpeed={-0.15}
        >
          <SafeComponentWrapper name="AIWorkflowSection" fallback={<div className="py-20"></div>}>
            <AIWorkflowSection />
          </SafeComponentWrapper>
        </ParallaxSection>
        
        {/* Advanced Therapy Benefits */}
        <ParallaxSection 
          id="benefits"
          background={
            <div className="absolute inset-0 bg-gradient-to-tr from-healing-50/30 via-balance-50/20 to-therapy-50/30" />
          }
          backgroundSpeed={-0.2}
        >
          <SafeComponentWrapper name="AdvancedTherapyBenefits" fallback={<div className="py-20"></div>}>
            <AdvancedTherapyBenefits />
          </SafeComponentWrapper>
        </ParallaxSection>
        
        {/* Pricing */}
        <ParallaxSection 
          id="pricing"
          background={
            <div className="absolute inset-0 bg-gradient-to-br from-calm-50/20 via-harmony-50/30 to-therapy-50/20" />
          }
          backgroundSpeed={-0.1}
        >
          <SafeComponentWrapper name="PricingSection" fallback={<div className="py-20"></div>}>
            <EnhancedPricingSection />
          </SafeComponentWrapper>
        </ParallaxSection>
        
        {/* CTA */}
        <ParallaxSection 
          id="cta"
          background={
            <div className="absolute inset-0 bg-gradient-to-t from-therapy-50/30 via-harmony-50/20 to-calm-50/30" />
          }
          backgroundSpeed={-0.25}
        >
          <SafeComponentWrapper name="CTASection" fallback={<div className="py-20"></div>}>
            <CTASection />
          </SafeComponentWrapper>
        </ParallaxSection>
        
        {/* Alex AI Companion */}
        <AlexCompanion 
          isMinimized={isAlexMinimized}
          onToggleMinimize={() => setIsAlexMinimized(!isAlexMinimized)}
        />
      </ParallaxContainer>
    </SafeComponentWrapper>
  );
};

export default LandingPage;
