import React from 'react';

// Hero Section Background - Sophisticated gradient mesh
export const HeroBackground = () => (
  <div className="absolute inset-0 z-0">
    <div className="absolute inset-0 bg-gradient-to-br from-therapy-100/60 via-therapy-50/70 to-calm-50/65"></div>
    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-therapy-200/45 to-calm-200/55"></div>
    <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-therapy-300/55 to-calm-300/55 rounded-full blur-3xl"></div>
    <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-calm-300/50 to-therapy-300/50 rounded-full blur-3xl"></div>
  </div>
);

// AI Technology Background - Neural network pattern
export const AITechnologyBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-r from-therapy-100/50 to-calm-100/50"></div>
    <div className="absolute inset-0 opacity-60" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.08'%3E%3Ccircle cx='7' cy='7' r='2'/%3E%3Ccircle cx='27' cy='7' r='1'/%3E%3Ccircle cx='47' cy='7' r='2'/%3E%3Ccircle cx='7' cy='27' r='1'/%3E%3Ccircle cx='27' cy='27' r='2'/%3E%3Ccircle cx='47' cy='27' r='1'/%3E%3Ccircle cx='7' cy='47' r='2'/%3E%3Ccircle cx='27' cy='47' r='1'/%3E%3Ccircle cx='47' cy='47' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
    }}></div>
    <div className="absolute top-10 left-10 w-32 h-32 border border-therapy-400/40 rounded-lg rotate-12 animate-float"></div>
    <div className="absolute bottom-10 right-10 w-24 h-24 border border-calm-400/40 rounded-full animate-float animation-delay-200"></div>
  </div>
);

// AI Hub Background - Tech elements
export const AIHubBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-bl from-therapy-100/35 via-therapy-50/45 to-calm-100/35"></div>
    <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-r from-therapy-400/30 to-calm-400/30 rounded-full blur-2xl"></div>
    <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-calm-400/25 to-harmony-400/25 rounded-full blur-3xl"></div>
    <div className="absolute top-1/3 left-10 w-20 h-20 border border-therapy-400/50 rounded-lg rotate-45 animate-float animation-delay-400"></div>
  </div>
);

// Cultural AI Background - Cultural elements
export const CulturalAIBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-r from-harmony-100/50 to-balance-100/50"></div>
    <div className="absolute inset-0 opacity-40" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.06'%3E%3Cpath d='M50 50m-25 0a25 25 0 1 1 50 0a25 25 0 1 1 -50 0M50 10m-5 0a5 5 0 1 1 10 0a5 5 0 1 1 -10 0M50 90m-5 0a5 5 0 1 1 10 0a5 5 0 1 1 -10 0M10 50m-5 0a5 5 0 1 1 10 0a5 5 0 1 1 -10 0M90 50m-5 0a5 5 0 1 1 10 0a5 5 0 1 1 -10 0'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
    }}></div>
    <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-harmony-400/35 to-balance-400/35 rounded-full blur-2xl"></div>
    <div className="absolute bottom-20 right-20 w-72 h-72 bg-gradient-to-r from-balance-400/25 to-flow-400/25 rounded-full blur-3xl"></div>
  </div>
);

// Therapists Background - Professional elements
export const TherapistsBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-tr from-flow-100/35 to-calm-100/45"></div>
    <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-r from-therapy-300/35 to-flow-300/35 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-r from-calm-300/30 to-harmony-300/30 rounded-full blur-3xl animate-pulse animation-delay-400"></div>
  </div>
);

// Features Background - Feature highlights
export const FeaturesBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-br from-balance-100/50 to-therapy-100/40"></div>
    <div className="absolute inset-0 opacity-50" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.06'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40zm0-40h2l-2 2V0zm0 4l4-4h2l-6 6V4zm0 4l8-8h2L40 10V8zm0 4L52 0h2L40 14v-2zm0 4L56 0h2L40 18v-2zm0 4L60 0h2L40 22v-2zm0 4L64 0h2L40 26v-2zm0 4L68 0h2L40 30v-2zm0 4L72 0h2L40 34v-2zm0 4L76 0h2L40 38v-2zm0 4L80 0v2L42 40h-2zm4 0L80 4v2L46 40h-2zm4 0L80 8v2L50 40h-2zm4 0l28-28v2L54 40h-2zm4 0l24-24v2L58 40h-2zm4 0l20-20v2L62 40h-2zm4 0l16-16v2L66 40h-2zm4 0l12-12v2L70 40h-2zm4 0l8-8v2l-6 6h-2zm4 0l4-4v2L78 40h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
    }}></div>
    <div className="absolute top-1/4 right-1/4 w-40 h-40 border border-therapy-400/40 rounded-full animate-float"></div>
    <div className="absolute bottom-1/4 left-1/4 w-32 h-32 border border-balance-400/40 rounded-lg rotate-12 animate-float animation-delay-300"></div>
  </div>
);

// Approaches Background - Therapy methods
export const ApproachesBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-tl from-harmony-100/50 to-flow-100/40"></div>
    <div className="absolute top-20 left-1/3 w-64 h-64 bg-gradient-to-r from-harmony-400/35 to-flow-400/35 rounded-full blur-2xl"></div>
    <div className="absolute bottom-20 right-1/3 w-80 h-80 bg-gradient-to-r from-therapy-400/25 to-calm-400/25 rounded-full blur-3xl"></div>
    <div className="absolute top-10 right-10 w-16 h-16 border border-harmony-400/50 rounded-full animate-float animation-delay-200"></div>
    <div className="absolute bottom-10 left-10 w-20 h-20 border border-flow-400/50 rounded-lg rotate-45 animate-float animation-delay-500"></div>
  </div>
);

// How It Works Background - Process flow
export const HowItWorksBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-r from-flow-100/35 to-balance-100/45"></div>
    <div className="absolute inset-0 opacity-40" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.04'%3E%3Cpath d='M60 60L0 0v60h60zM60 60l60-60v60H60z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
    }}></div>
    <div className="absolute top-1/4 left-10 w-24 h-24 border-2 border-flow-400/50 rounded-full animate-float"></div>
    <div className="absolute bottom-1/4 right-10 w-28 h-28 border-2 border-balance-400/50 rounded-lg rotate-12 animate-float animation-delay-300"></div>
  </div>
);

// Workflow Background - AI workflow
export const WorkflowBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-bl from-calm-100/45 to-therapy-100/40"></div>
    <div className="absolute top-10 right-1/4 w-72 h-72 bg-gradient-to-r from-calm-400/35 to-therapy-400/35 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute bottom-10 left-1/4 w-64 h-64 bg-gradient-to-r from-therapy-400/30 to-harmony-400/30 rounded-full blur-2xl animate-pulse animation-delay-600"></div>
    <div className="absolute top-1/3 left-10 w-18 h-18 border border-calm-400/50 rounded-full animate-float animation-delay-100"></div>
    <div className="absolute bottom-1/3 right-10 w-22 h-22 border border-therapy-400/50 rounded-lg rotate-45 animate-float animation-delay-400"></div>
  </div>
);

// Benefits Background - Success indicators
export const BenefitsBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-tr from-harmony-100/50 to-balance-100/40"></div>
    <div className="absolute top-20 right-20 w-80 h-80 bg-gradient-to-r from-harmony-400/35 to-balance-400/35 rounded-full blur-3xl"></div>
    <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-r from-balance-400/30 to-flow-400/30 rounded-full blur-3xl"></div>
    <div className="absolute top-1/4 left-1/4 w-16 h-16 border border-harmony-400/50 rounded-full animate-float animation-delay-200"></div>
    <div className="absolute bottom-1/4 right-1/4 w-20 h-20 border border-balance-400/50 rounded-lg rotate-12 animate-float animation-delay-500"></div>
  </div>
);

// Success Stories Background - Achievement elements
export const SuccessStoriesBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-br from-flow-100/45 to-harmony-100/45"></div>
    <div className="absolute inset-0 opacity-50" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.04'%3E%3Cpolygon points='50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
    }}></div>
    <div className="absolute top-16 left-16 w-32 h-32 bg-gradient-to-r from-flow-500/35 to-harmony-500/35 rounded-full blur-xl"></div>
    <div className="absolute top-32 right-24 w-24 h-24 bg-gradient-to-r from-harmony-500/40 to-balance-500/40 rounded-lg rotate-12 blur-lg"></div>
    <div className="absolute bottom-24 left-32 w-28 h-28 bg-gradient-to-r from-balance-500/38 to-flow-500/38 rounded-full blur-xl"></div>
    <div className="absolute bottom-16 right-16 w-36 h-36 bg-gradient-to-r from-therapy-500/32 to-calm-500/32 rounded-lg rotate-45 blur-2xl"></div>
  </div>
);

// Security Background - Security elements
export const SecurityBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-tl from-calm-100/40 to-therapy-100/50"></div>
    <div className="absolute inset-0 opacity-40" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.06'%3E%3Cpath d='M20 20h20v20H20V20zM0 0h20v20H0V0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
    }}></div>
    <div className="absolute top-20 right-1/3 w-60 h-60 bg-gradient-to-r from-calm-400/35 to-therapy-400/35 rounded-full blur-2xl"></div>
    <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-r from-therapy-400/25 to-calm-400/25 rounded-full blur-3xl"></div>
    <div className="absolute top-1/4 left-10 w-24 h-24 border-2 border-calm-400/50 rounded-lg rotate-12 animate-float"></div>
    <div className="absolute bottom-1/4 right-10 w-20 h-20 border-2 border-therapy-400/50 rounded-full animate-float animation-delay-300"></div>
  </div>
);

// Global Reach Background - World map elements
export const GlobalReachBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-r from-balance-100/45 to-harmony-100/45"></div>
    <div className="absolute top-10 left-1/4 w-80 h-80 bg-gradient-to-r from-balance-400/30 to-harmony-400/30 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute bottom-10 right-1/4 w-64 h-64 bg-gradient-to-r from-harmony-400/35 to-flow-400/35 rounded-full blur-2xl animate-pulse animation-delay-400"></div>
    <div className="absolute top-20 left-20 w-32 h-32 border border-balance-400/40 rounded-full animate-float"></div>
    <div className="absolute top-32 right-32 w-28 h-28 border border-harmony-400/45 rounded-lg rotate-12 animate-float animation-delay-200"></div>
    <div className="absolute bottom-32 left-40 w-24 h-24 border border-flow-400/40 rounded-full animate-float animation-delay-400"></div>
    <div className="absolute bottom-20 right-20 w-20 h-20 border border-balance-400/50 rounded-lg rotate-45 animate-float animation-delay-100"></div>
  </div>
);

// Community Background - Community elements
export const CommunityBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-bl from-harmony-100/50 to-flow-100/40"></div>
    <div className="absolute inset-0 opacity-50" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.04'%3E%3Ccircle cx='30' cy='30' r='15'/%3E%3Ccircle cx='15' cy='15' r='5'/%3E%3Ccircle cx='45' cy='15' r='5'/%3E%3Ccircle cx='15' cy='45' r='5'/%3E%3Ccircle cx='45' cy='45' r='5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
    }}></div>
    <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-r from-harmony-400/35 to-flow-400/35 rounded-full blur-3xl"></div>
    <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-flow-400/30 to-balance-400/30 rounded-full blur-3xl"></div>
    <div className="absolute top-16 left-16 w-16 h-16 border border-harmony-400/50 rounded-full animate-float"></div>
    <div className="absolute top-32 right-24 w-12 h-12 border border-flow-400/45 rounded-lg rotate-12 animate-float animation-delay-200"></div>
    <div className="absolute bottom-24 left-32 w-20 h-20 border border-balance-400/40 rounded-full animate-float animation-delay-400"></div>
    <div className="absolute bottom-16 right-16 w-14 h-14 border border-harmony-400/55 rounded-lg rotate-45 animate-float animation-delay-100"></div>
  </div>
);

// Pricing Background - Value elements
export const PricingBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-tr from-therapy-100/40 to-balance-100/50"></div>
    <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-therapy-400/35 to-balance-400/35 rounded-full blur-2xl"></div>
    <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-balance-400/25 to-harmony-400/25 rounded-full blur-3xl"></div>
    <div className="absolute top-10 left-10 w-24 h-24 border border-therapy-400/40 rounded-full animate-float"></div>
    <div className="absolute bottom-10 right-10 w-20 h-20 border border-balance-400/40 rounded-lg rotate-12 animate-float animation-delay-300"></div>
  </div>
);

// CTA Background - Action elements
export const CTABackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-br from-flow-100/50 to-calm-100/40"></div>
    <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-flow-400/35 to-calm-400/35 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute bottom-20 right-20 w-72 h-72 bg-gradient-to-r from-calm-400/32 to-therapy-400/32 rounded-full blur-2xl animate-pulse animation-delay-300"></div>
    <div className="absolute top-1/3 right-10 w-28 h-28 border-2 border-flow-400/50 rounded-full animate-float animation-delay-100"></div>
    <div className="absolute bottom-1/3 left-10 w-24 h-24 border-2 border-calm-400/50 rounded-lg rotate-45 animate-float animation-delay-400"></div>
    <div className="absolute top-16 left-1/3 w-32 h-32 bg-gradient-to-r from-flow-500/40 to-calm-500/40 rounded-full blur-xl"></div>
    <div className="absolute bottom-16 right-1/3 w-36 h-36 bg-gradient-to-r from-calm-500/35 to-therapy-500/35 rounded-lg rotate-12 blur-2xl"></div>
  </div>
);