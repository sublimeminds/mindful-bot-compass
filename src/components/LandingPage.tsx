import React from 'react';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';
import ParallaxContainer from '@/components/parallax/ParallaxContainer';
import ParallaxSection from '@/components/parallax/ParallaxSection';
import HeroSection from '@/components/HeroSection';
import TrustIndicators from '@/components/landing/TrustIndicators';
import StatsCounter from '@/components/landing/StatsCounter';
import TrustSection from '@/components/landing/TrustSection';
import CTASection from '@/components/landing/CTASection';

const LandingPage = () => {
  console.log('🔍 LandingPage: Component rendering');
  
  return (
    <SafeComponentWrapper name="LandingPage">
      <ParallaxContainer>
        <ParallaxSection 
          id="hero"
          backgroundSpeed={0.5}
          contentSpeed={0.8}
          fullHeight
        >
          <HeroSection />
        </ParallaxSection>

        <ParallaxSection 
          id="trust"
          backgroundSpeed={0.3}
          contentSpeed={0.6}
        >
          <TrustIndicators />
        </ParallaxSection>

        <ParallaxSection 
          id="stats"
          backgroundSpeed={0.4}
          contentSpeed={0.7}
        >
          <StatsCounter />
        </ParallaxSection>

        <ParallaxSection 
          id="security"
          backgroundSpeed={0.2}
          contentSpeed={0.5}
        >
          <TrustSection />
        </ParallaxSection>

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