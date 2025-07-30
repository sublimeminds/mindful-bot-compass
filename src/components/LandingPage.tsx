import React from 'react';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';
import ParallaxContainer from '@/components/parallax/ParallaxContainer';
import ParallaxSection from '@/components/parallax/ParallaxSection';
import HeroSection from '@/components/HeroSection';
import AIHubSection from '@/components/ai/AIHubSection';
import CulturalAISection from '@/components/cultural/CulturalAISection';
import FeaturesSection from '@/components/FeaturesSection';
import TherapyApproachesSection from '@/components/landing/TherapyApproachesSection';
import AIWorkflowSection from '@/components/landing/AIWorkflowSection';
import SuccessStoriesSection from '@/components/landing/SuccessStoriesSection';
import GlobalReachSection from '@/components/landing/GlobalReachSection';
import CommunitySection from '@/components/landing/CommunitySection';
import TrustIndicators from '@/components/landing/TrustIndicators';
import StatsCounter from '@/components/landing/StatsCounter';
import TrustSection from '@/components/landing/TrustSection';
import CTASection from '@/components/landing/CTASection';
import PricingSection from '@/components/PricingSection';
import AppleProgressBar from '@/components/parallax/AppleProgressBar';

const LandingPage = () => {
  console.log('🔍 LandingPage: Component rendering');
  
  return (
    <SafeComponentWrapper name="LandingPage">
      <AppleProgressBar />
      <ParallaxContainer>
        {/* Hero Section */}
        <ParallaxSection 
          id="hero"
          backgroundSpeed={0.5}
          contentSpeed={0.8}
          fullHeight
        >
          <HeroSection />
        </ParallaxSection>

        {/* AI Technology Section */}
        <ParallaxSection 
          id="ai-technology"
          backgroundSpeed={0.3}
          contentSpeed={0.6}
        >
          <TrustIndicators />
        </ParallaxSection>

        {/* AI Hub Section */}
        <ParallaxSection 
          id="ai-hub"
          backgroundSpeed={0.4}
          contentSpeed={0.7}
        >
          <AIHubSection />
        </ParallaxSection>

        {/* Cultural AI Section */}
        <ParallaxSection 
          id="cultural-ai"
          backgroundSpeed={0.2}
          contentSpeed={0.5}
        >
          <CulturalAISection />
        </ParallaxSection>

        {/* Therapists Section */}
        <ParallaxSection 
          id="therapists"
          backgroundSpeed={0.3}
          contentSpeed={0.6}
        >
          <StatsCounter />
        </ParallaxSection>

        {/* Features Section */}
        <ParallaxSection 
          id="features"
          backgroundSpeed={0.4}
          contentSpeed={0.7}
        >
          <FeaturesSection />
        </ParallaxSection>

        {/* Approaches Section */}
        <ParallaxSection 
          id="approaches"
          backgroundSpeed={0.2}
          contentSpeed={0.5}
        >
          <TherapyApproachesSection />
        </ParallaxSection>

        {/* How It Works Section */}
        <ParallaxSection 
          id="how-it-works"
          backgroundSpeed={0.3}
          contentSpeed={0.6}
        >
          <TrustSection />
        </ParallaxSection>

        {/* Workflow Section */}
        <ParallaxSection 
          id="workflow"
          backgroundSpeed={0.4}
          contentSpeed={0.7}
        >
          <AIWorkflowSection />
        </ParallaxSection>

        {/* Benefits Section */}
        <ParallaxSection 
          id="benefits"
          backgroundSpeed={0.2}
          contentSpeed={0.5}
        >
          <TrustIndicators />
        </ParallaxSection>

        {/* Success Stories Section */}
        <ParallaxSection 
          id="success-stories"
          backgroundSpeed={0.3}
          contentSpeed={0.6}
        >
          <SuccessStoriesSection />
        </ParallaxSection>

        {/* Security Section */}
        <ParallaxSection 
          id="security"
          backgroundSpeed={0.4}
          contentSpeed={0.7}
        >
          <TrustSection />
        </ParallaxSection>

        {/* Global Reach Section */}
        <ParallaxSection 
          id="global-reach"
          backgroundSpeed={0.2}
          contentSpeed={0.5}
        >
          <GlobalReachSection />
        </ParallaxSection>

        {/* Community Section */}
        <ParallaxSection 
          id="community"
          backgroundSpeed={0.3}
          contentSpeed={0.6}
        >
          <CommunitySection />
        </ParallaxSection>

        {/* Pricing Section */}
        <ParallaxSection 
          id="pricing"
          backgroundSpeed={0.4}
          contentSpeed={0.7}
        >
          <PricingSection />
        </ParallaxSection>

        {/* CTA Section */}
        <ParallaxSection 
          id="cta"
          backgroundSpeed={0.3}
          contentSpeed={0.6}
        >
          <CTASection />
        </ParallaxSection>
      </ParallaxContainer>
    </SafeComponentWrapper>
  );
};

export default LandingPage;