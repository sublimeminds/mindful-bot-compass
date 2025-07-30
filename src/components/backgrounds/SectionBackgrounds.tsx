import React from 'react';

// APPLE-INFLUENCED SECTION BACKGROUNDS
// Strong, vibrant gradients with proper contrast and no blur effects

// Hero Section Background - Premium Apple-style clean white with accent highlights
export const HeroBackground = () => (
  <div className="absolute inset-0 z-0">
    <div className="absolute inset-0 bg-gradient-to-br from-white via-therapy-25/60 to-calm-50/50"></div>
    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-therapy-100/20"></div>
  </div>
);

// Trust Indicators Background - Apple's confident blue-white gradient
export const TrustIndicatorsBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-r from-calm-50/70 via-white to-therapy-50/60"></div>
    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-calm-25/40"></div>
  </div>
);

// AI Hub Background - Bold tech-forward gradient (Apple Silicon style)
export const AIHubBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-br from-flow-100/60 via-therapy-50/50 to-calm-100/70"></div>
    <div className="absolute inset-0 bg-gradient-to-tr from-flow-200/30 to-transparent"></div>
  </div>
);

// Cultural AI Background - Rich Apple-inspired dark background
export const CulturalAIBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-r from-harmony-600/70 via-harmony-700/60 to-therapy-600/65"></div>
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-harmony-800/20 to-harmony-900/30"></div>
  </div>
);

// Stats Counter Background - Vibrant Apple keynote-style gradient
export const StatsCounterBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-tr from-balance-100/65 via-therapy-100/50 to-flow-100/60"></div>
    <div className="absolute inset-0 bg-gradient-to-bl from-balance-200/40 to-transparent"></div>
  </div>
);

// Features Background - Bold Apple product showcase style
export const FeaturesBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-br from-therapy-600/65 via-calm-600/55 to-harmony-600/70"></div>
    <div className="absolute inset-0 bg-gradient-to-t from-therapy-800/25 to-transparent"></div>
  </div>
);

// Therapy Approaches Background - Healing Apple health-app style
export const ApproachesBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-tl from-flow-100/65 via-calm-100/55 to-therapy-100/60"></div>
    <div className="absolute inset-0 bg-gradient-to-br from-flow-200/35 to-transparent"></div>
  </div>
);

// Trust Section Background - Apple's security/privacy section style
export const TrustSectionBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-r from-calm-50/70 via-white to-slate-50/60"></div>
    <div className="absolute inset-0 bg-gradient-to-b from-calm-100/30 to-transparent"></div>
  </div>
);

// AI Workflow Background - Apple's innovation showcase gradient
export const WorkflowBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-bl from-flow-100/60 via-calm-100/50 to-therapy-100/65"></div>
    <div className="absolute inset-0 bg-gradient-to-tr from-flow-300/25 to-transparent"></div>
  </div>
);

// Success Stories Background - Apple celebration/achievement style
export const SuccessStoriesBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-br from-therapy-600/70 via-balance-600/60 to-harmony-600/65"></div>
    <div className="absolute inset-0 bg-gradient-to-t from-therapy-900/20 to-transparent"></div>
  </div>
);

// Security Background - Apple privacy protection theme
export const SecurityBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-tl from-calm-50/65 via-slate-50/70 to-white"></div>
    <div className="absolute inset-0 bg-gradient-to-br from-calm-100/35 to-transparent"></div>
  </div>
);

// Global Reach Background - Apple's worldwide presence style
export const GlobalReachBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-r from-harmony-100/60 via-flow-100/50 to-calm-100/65"></div>
    <div className="absolute inset-0 bg-gradient-to-b from-harmony-200/30 to-transparent"></div>
  </div>
);

// Community Background - Warm Apple social/community gradient
export const CommunityBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-bl from-harmony-600/65 via-therapy-600/60 to-balance-600/70"></div>
    <div className="absolute inset-0 bg-gradient-to-tr from-harmony-800/20 to-transparent"></div>
  </div>
);

// Pricing Background - Clean Apple store/commerce style
export const PricingBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-tr from-therapy-50/60 via-white to-calm-50/65"></div>
    <div className="absolute inset-0 bg-gradient-to-bl from-therapy-100/30 to-transparent"></div>
  </div>
);

// CTA Background - Bold Apple call-to-action style
export const CTABackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-br from-therapy-600/70 via-harmony-600/65 to-calm-600/60"></div>
    <div className="absolute inset-0 bg-gradient-to-t from-therapy-900/25 to-transparent"></div>
  </div>
);

// Legacy aliases for backward compatibility
export const AITechnologyBackground = TrustIndicatorsBackground;
export const TherapistsBackground = ApproachesBackground;
export const HowItWorksBackground = TrustSectionBackground;
export const BenefitsBackground = SuccessStoriesBackground;