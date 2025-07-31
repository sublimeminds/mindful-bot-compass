import React from 'react';

// APPLE-STYLE CLEAN BACKGROUNDS - NO TRANSPARENCY
// Clean, vibrant single-layer backgrounds with perfect contrast

// Hero Section Background - Clean white with subtle brand accent
export const HeroBackground = () => (
  <div className="absolute inset-0 z-0">
    <div className="absolute inset-0 bg-gradient-to-br from-background to-therapy-50"></div>
  </div>
);

// Trust Indicators Background - Clean white
export const TrustIndicatorsBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-background"></div>
  </div>
);

// AI Hub Background - Clean therapy gradient
export const AIHubBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-br from-therapy-50 to-calm-100"></div>
  </div>
);

// Cultural AI Background - Clean harmony gradient
export const CulturalAIBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-br from-harmony-100 to-therapy-100"></div>
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

// Therapy Approaches Background - Clean light theme
export const ApproachesBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-br from-therapy-50 to-balance-100"></div>
  </div>
);

// Trust Section Background - Clean white
export const TrustSectionBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-background"></div>
  </div>
);

// AI Workflow Background - Light therapy theme
export const WorkflowBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-br from-flow-50 to-therapy-100"></div>
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

// Global Reach Background - Light harmony theme
export const GlobalReachBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-br from-harmony-50 to-flow-100"></div>
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