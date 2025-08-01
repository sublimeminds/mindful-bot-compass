import React from 'react';

// APPLE-STYLE SECTION BACKGROUNDS
// Sophisticated Apple-inspired design with brand gradients

// Hero Section - Clean Apple-style background
export const HeroBackground = () => (
  <div className="absolute inset-0 z-0">
    <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50/90 to-white"></div>
  </div>
);

// AI Technology - Enhanced storytelling background with GPU optimization
export const AITechnologyBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div 
      className="absolute inset-0 bg-gradient-to-br from-white via-therapy-50/30 to-harmony-50/40"
      style={{ willChange: 'transform' }}
    ></div>
    {/* GPU-accelerated floating elements */}
    <div 
      className="absolute top-20 left-10 w-32 h-32 bg-therapy-200/20 rounded-full blur-xl animate-pulse"
      style={{ 
        transform: 'translate3d(0, 0, 0)',
        willChange: 'transform, opacity'
      }}
    ></div>
    <div 
      className="absolute bottom-20 right-10 w-24 h-24 bg-calm-200/20 rounded-full blur-xl animate-pulse"
      style={{ 
        transform: 'translate3d(0, 0, 0)',
        willChange: 'transform, opacity',
        animationDelay: '1s'
      }}
    ></div>
  </div>
);

// AI Hub - Sophisticated calm gradient (Blue trust)
export const AIHubBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-br from-calm-500 via-calm-600 to-therapy-500"></div>
  </div>
);

// Cultural AI - Elegant harmony gradient (Pink connection)
export const CulturalAIBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-br from-harmony-500 via-harmony-600 to-balance-500"></div>
  </div>
);

// Mission - Rich balance gradient (Yellow clarity)
export const MissionBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-br from-balance-500 via-balance-600 to-therapy-500"></div>
  </div>
);

// Therapists - Clean white with flow accents (Professional)
export const TherapistsBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-white"></div>
  </div>
);

// Technology - Deep therapy-calm blend (Technical sophistication)
export const TechnologyBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-br from-therapy-600 via-calm-700 to-balance-700"></div>
  </div>
);

// Features - Light harmony-therapy gradient (Feature highlights)
export const FeaturesBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-br from-harmony-400 via-therapy-500 to-calm-500"></div>
  </div>
);

// Therapy Approaches - Warm balance-therapy gradient
export const ApproachesBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-br from-balance-500 via-therapy-500 to-harmony-500"></div>
  </div>
);

// AI Workflow - Dynamic flow-therapy blend
export const WorkflowBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-br from-flow-500 via-therapy-500 to-calm-600"></div>
  </div>
);

// Success Stories - Dark flow-therapy gradient (Impact stories)
export const SuccessStoriesBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-br from-flow-600 via-therapy-700 to-harmony-700"></div>
  </div>
);

// Global Reach - Vibrant harmony-flow gradient (Global connection)
export const GlobalReachBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-br from-harmony-500 via-flow-600 to-therapy-600"></div>
  </div>
);

// Community - Rich balance-harmony gradient
export const CommunityBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-br from-balance-600 via-harmony-700 to-flow-700"></div>
  </div>
);

// Trust/Security - Clean white with subtle security gradients
export const SecurityBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-gray-50 to-white"></div>
  </div>
);

// Pricing - Clean white with subtle accents
export const PricingBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-white"></div>
  </div>
);

// CTA - Bold therapy-calm gradient (Call to action)
export const CTABackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-br from-therapy-600 via-calm-700 to-harmony-700"></div>
  </div>
);

// Legacy aliases for backward compatibility
export const TrustIndicatorsBackground = SecurityBackground;
export const TrustSectionBackground = SecurityBackground;
export const HowItWorksBackground = SecurityBackground;
export const BenefitsBackground = SuccessStoriesBackground;