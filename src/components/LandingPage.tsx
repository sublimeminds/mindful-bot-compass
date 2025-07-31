import React from 'react';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';
import ParallaxContainer from '@/components/parallax/ParallaxContainer';
import ParallaxSection from '@/components/parallax/ParallaxSection';
import AppleHeroSection from '@/components/sections/AppleHeroSection';
import SecurityShowcase from '@/components/sections/SecurityShowcase';
import AIHubSection from '@/components/ai/AIHubSection';
import CulturalAISection from '@/components/cultural/CulturalAISection';
import FeaturesSection from '@/components/FeaturesSection';
import TherapyApproachesSection from '@/components/landing/TherapyApproachesSection';
import AIWorkflowSection from '@/components/landing/AIWorkflowSection';
import SuccessStoriesSection from '@/components/landing/SuccessStoriesSection';
import GlobalReachSection from '@/components/landing/GlobalReachSection';
import CommunitySection from '@/components/landing/CommunitySection';
import AITechnologyShowcase from '@/components/sections/AITechnologyShowcase';
import AITherapistTeam from '@/pages/AITherapistTeam';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/Footer';
import PricingSection from '@/components/PricingSection';
import AppleProgressBar from '@/components/parallax/AppleProgressBar';
import MissionSection from '@/components/sections/MissionSection';
import TechnologySection from '@/components/sections/TechnologySection';
import {
  HeroBackground,
  AITechnologyBackground,
  AIHubBackground,
  CulturalAIBackground,
  MissionBackground,
  TherapistsBackground,
  TechnologyBackground,
  FeaturesBackground,
  ApproachesBackground,
  WorkflowBackground,
  SuccessStoriesBackground,
  SecurityBackground,
  GlobalReachBackground,
  CommunityBackground,
  PricingBackground,
  CTABackground
} from '@/components/backgrounds/SectionBackgrounds';

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
          background={<HeroBackground />}
        >
          <AppleHeroSection />
        </ParallaxSection>

        {/* AI Technology Section */}
        <ParallaxSection 
          id="ai-technology"
          backgroundSpeed={0.3}
          contentSpeed={0.6}
          background={<AITechnologyBackground />}
        >
          <AITechnologyShowcase />
        </ParallaxSection>

        {/* AI Hub Section */}
        <ParallaxSection 
          id="ai-hub"
          backgroundSpeed={0.4}
          contentSpeed={0.7}
          background={<AIHubBackground />}
        >
          <AIHubSection />
        </ParallaxSection>

        {/* Cultural AI Section */}
        <ParallaxSection 
          id="cultural-ai"
          backgroundSpeed={0.2}
          contentSpeed={0.5}
          background={<CulturalAIBackground />}
        >
          <CulturalAISection />
        </ParallaxSection>

        {/* Our Mission Section */}
        <ParallaxSection 
          id="mission"
          backgroundSpeed={0.3}
          contentSpeed={0.6}
          background={<MissionBackground />}
        >
          <MissionSection />
        </ParallaxSection>

        {/* Therapists Section */}
        <ParallaxSection 
          id="therapists"
          backgroundSpeed={0.3}
          contentSpeed={0.6}
          background={<TherapistsBackground />}
        >
          <AITherapistTeam />
        </ParallaxSection>

        {/* Technology Deep Dive Section */}
        <ParallaxSection 
          id="technology"
          backgroundSpeed={0.4}
          contentSpeed={0.7}
          background={<TechnologyBackground />}
        >
          <TechnologySection />
        </ParallaxSection>

        {/* Features Section */}
        <ParallaxSection 
          id="features"
          backgroundSpeed={0.4}
          contentSpeed={0.7}
          background={<FeaturesBackground />}
        >
          <FeaturesSection />
        </ParallaxSection>

        {/* Approaches Section */}
        <ParallaxSection 
          id="approaches"
          backgroundSpeed={0.2}
          contentSpeed={0.5}
          background={<ApproachesBackground />}
        >
          <TherapyApproachesSection />
        </ParallaxSection>

        {/* How It Works Section */}
        <ParallaxSection 
          id="how-it-works"
          backgroundSpeed={0.3}
          contentSpeed={0.6}
          background={<WorkflowBackground />}
        >
          <AIWorkflowSection />
        </ParallaxSection>


        {/* Success Stories Section */}
        <ParallaxSection 
          id="success-stories"
          backgroundSpeed={0.3}
          contentSpeed={0.6}
          background={<SuccessStoriesBackground />}
        >
          <SuccessStoriesSection />
        </ParallaxSection>

        {/* Security & Privacy Section */}
        <ParallaxSection 
          id="security"
          backgroundSpeed={0.4}
          contentSpeed={0.7}
          background={<SecurityBackground />}
        >
          <SecurityShowcase />
        </ParallaxSection>

        {/* Global Reach Section */}
        <ParallaxSection 
          id="global-reach"
          backgroundSpeed={0.2}
          contentSpeed={0.5}
          background={<GlobalReachBackground />}
        >
          <GlobalReachSection />
        </ParallaxSection>

        {/* Community Section */}
        <ParallaxSection 
          id="community"
          backgroundSpeed={0.3}
          contentSpeed={0.6}
          background={<CommunityBackground />}
        >
          <CommunitySection />
        </ParallaxSection>

        {/* Pricing Section */}
        <ParallaxSection 
          id="pricing"
          backgroundSpeed={0.4}
          contentSpeed={0.7}
          background={<PricingBackground />}
        >
          <PricingSection />
        </ParallaxSection>

        {/* CTA Section */}
        <ParallaxSection 
          id="cta"
          backgroundSpeed={0.3}
          contentSpeed={0.6}
          background={<CTABackground />}
        >
          <CTASection />
        </ParallaxSection>
      </ParallaxContainer>
      
      {/* Footer outside parallax container for better performance */}
      <Footer />
    </SafeComponentWrapper>
  );
};

export default LandingPage;