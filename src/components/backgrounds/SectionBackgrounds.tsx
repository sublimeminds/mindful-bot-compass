import React from 'react';

// APPLE-STYLE CLEAN BACKGROUNDS - NO TRANSPARENCY
// Clean, vibrant single-layer backgrounds with perfect contrast

// Hero Section Background - Vibrant therapy gradient
export const HeroBackground = () => (
  <div className="absolute inset-0 z-0">
    <div className="absolute inset-0 bg-gradient-to-br from-therapy-500 to-therapy-600"></div>
  </div>
);

// Trust Indicators Background - Clean white
export const TrustIndicatorsBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-background"></div>
  </div>
);

// AI Hub Background - Vibrant therapy gradient
export const AIHubBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-br from-therapy-500 to-calm-500"></div>
  </div>
);

// Cultural AI Background - Vibrant harmony gradient
export const CulturalAIBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-br from-harmony-500 to-therapy-500"></div>
  </div>
);

// Stats Counter Background - Clean white
export const StatsCounterBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-background"></div>
  </div>
);

// Features Background - Dark theme with light text
export const FeaturesBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-br from-therapy-600 to-calm-700"></div>
  </div>
);

// Therapy Approaches Background - Vibrant therapy theme
export const ApproachesBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-br from-therapy-500 to-balance-500"></div>
  </div>
);

// Trust Section Background - Clean white
export const TrustSectionBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-background"></div>
  </div>
);

// AI Workflow Background - Vibrant flow theme
export const WorkflowBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-br from-flow-500 to-therapy-500"></div>
  </div>
);

// Success Stories Background - Dark theme with light text
export const SuccessStoriesBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-br from-harmony-600 to-therapy-700"></div>
  </div>
);

// Security Background - Clean white
export const SecurityBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-background"></div>
  </div>
);

// Global Reach Background - Vibrant harmony theme
export const GlobalReachBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-br from-harmony-500 to-flow-500"></div>
  </div>
);

// Community Background - Dark theme with light text
export const CommunityBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-br from-balance-600 to-harmony-700"></div>
  </div>
);

// Pricing Background - Clean white
export const PricingBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-background"></div>
  </div>
);

// CTA Background - Dark theme with light text
export const CTABackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-br from-therapy-600 to-calm-700"></div>
  </div>
);

// Legacy aliases for backward compatibility
export const AITechnologyBackground = TrustIndicatorsBackground;
export const TherapistsBackground = ApproachesBackground;
export const HowItWorksBackground = TrustSectionBackground;
export const BenefitsBackground = SuccessStoriesBackground;