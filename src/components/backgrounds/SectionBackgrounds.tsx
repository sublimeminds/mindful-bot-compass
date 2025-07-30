import React from 'react';

// Hero Section Background - Sophisticated gradient mesh
export const HeroBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-br from-background via-therapy-50/20 to-calm-50/30"></div>
    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-therapy-100/10 to-calm-100/20"></div>
    <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-therapy-200/20 to-calm-200/20 rounded-full blur-3xl"></div>
    <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-calm-200/15 to-therapy-200/15 rounded-full blur-3xl"></div>
  </div>
);

// AI Technology Background - Neural network pattern
export const AITechnologyBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-r from-therapy-50/20 to-calm-50/20"></div>
    <div className="absolute inset-0 opacity-30" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.04'%3E%3Ccircle cx='7' cy='7' r='2'/%3E%3Ccircle cx='27' cy='7' r='1'/%3E%3Ccircle cx='47' cy='7' r='2'/%3E%3Ccircle cx='7' cy='27' r='1'/%3E%3Ccircle cx='27' cy='27' r='2'/%3E%3Ccircle cx='47' cy='27' r='1'/%3E%3Ccircle cx='7' cy='47' r='2'/%3E%3Ccircle cx='27' cy='47' r='1'/%3E%3Ccircle cx='47' cy='47' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
    }}></div>
    <div className="absolute top-10 left-10 w-32 h-32 border border-therapy-200/20 rounded-lg rotate-12 animate-float"></div>
    <div className="absolute bottom-10 right-10 w-24 h-24 border border-calm-200/20 rounded-full animate-float animation-delay-200"></div>
  </div>
);

// AI Hub Background - Tech elements
export const AIHubBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-bl from-therapy-50/15 via-transparent to-calm-50/15"></div>
    <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-r from-therapy-300/10 to-calm-300/10 rounded-full blur-2xl"></div>
    <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-calm-300/8 to-harmony-300/8 rounded-full blur-3xl"></div>
    <div className="absolute top-1/3 left-10 w-20 h-20 border border-therapy-200/30 rounded-lg rotate-45 animate-float animation-delay-400"></div>
  </div>
);

// Cultural AI Background - Cultural elements
export const CulturalAIBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-r from-harmony-50/20 to-balance-50/20"></div>
    <div className="absolute inset-0 opacity-20" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.03'%3E%3Cpath d='M50 50m-25 0a25 25 0 1 1 50 0a25 25 0 1 1 -50 0M50 10m-5 0a5 5 0 1 1 10 0a5 5 0 1 1 -10 0M50 90m-5 0a5 5 0 1 1 10 0a5 5 0 1 1 -10 0M10 50m-5 0a5 5 0 1 1 10 0a5 5 0 1 1 -10 0M90 50m-5 0a5 5 0 1 1 10 0a5 5 0 1 1 -10 0'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
    }}></div>
    <div className="absolute top-20 left-10 text-6xl opacity-10 animate-pulse">🏮</div>
    <div className="absolute top-32 right-20 text-5xl opacity-10 animate-bounce">🕌</div>
    <div className="absolute bottom-40 left-20 text-5xl opacity-10 animate-pulse">⛩️</div>
    <div className="absolute bottom-20 right-32 text-4xl opacity-10 animate-pulse">🏛️</div>
  </div>
);

// Therapists Background - Professional elements
export const TherapistsBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-tr from-flow-50/15 to-calm-50/15"></div>
    <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-r from-therapy-200/15 to-flow-200/15 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-r from-calm-200/10 to-harmony-200/10 rounded-full blur-3xl animate-pulse animation-delay-400"></div>
  </div>
);

// Features Background - Feature highlights
export const FeaturesBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-br from-balance-50/20 to-therapy-50/20"></div>
    <div className="absolute inset-0 opacity-25" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.03'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40zm0-40h2l-2 2V0zm0 4l4-4h2l-6 6V4zm0 4l8-8h2L40 10V8zm0 4L52 0h2L40 14v-2zm0 4L56 0h2L40 18v-2zm0 4L60 0h2L40 22v-2zm0 4L64 0h2L40 26v-2zm0 4L68 0h2L40 30v-2zm0 4L72 0h2L40 34v-2zm0 4L76 0h2L40 38v-2zm0 4L80 0v2L42 40h-2zm4 0L80 4v2L46 40h-2zm4 0L80 8v2L50 40h-2zm4 0l28-28v2L54 40h-2zm4 0l24-24v2L58 40h-2zm4 0l20-20v2L62 40h-2zm4 0l16-16v2L66 40h-2zm4 0l12-12v2L70 40h-2zm4 0l8-8v2l-6 6h-2zm4 0l4-4v2L78 40h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
    }}></div>
    <div className="absolute top-1/4 right-1/4 w-40 h-40 border border-therapy-200/20 rounded-full animate-float"></div>
    <div className="absolute bottom-1/4 left-1/4 w-32 h-32 border border-balance-200/20 rounded-lg rotate-12 animate-float animation-delay-300"></div>
  </div>
);

// Approaches Background - Therapy methods
export const ApproachesBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-tl from-harmony-50/20 to-flow-50/20"></div>
    <div className="absolute top-20 left-1/3 w-64 h-64 bg-gradient-to-r from-harmony-300/12 to-flow-300/12 rounded-full blur-2xl"></div>
    <div className="absolute bottom-20 right-1/3 w-80 h-80 bg-gradient-to-r from-therapy-300/8 to-calm-300/8 rounded-full blur-3xl"></div>
    <div className="absolute top-10 right-10 w-16 h-16 border border-harmony-200/30 rounded-full animate-float animation-delay-200"></div>
    <div className="absolute bottom-10 left-10 w-20 h-20 border border-flow-200/30 rounded-lg rotate-45 animate-float animation-delay-500"></div>
  </div>
);

// How It Works Background - Process flow
export const HowItWorksBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-r from-flow-50/15 to-balance-50/15"></div>
    <div className="absolute inset-0 opacity-20" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.02'%3E%3Cpath d='M60 60L0 0v60h60zM60 60l60-60v60H60z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
    }}></div>
    <div className="absolute top-1/4 left-10 w-24 h-24 border-2 border-flow-200/25 rounded-full animate-float"></div>
    <div className="absolute bottom-1/4 right-10 w-28 h-28 border-2 border-balance-200/25 rounded-lg rotate-12 animate-float animation-delay-300"></div>
  </div>
);

// Workflow Background - AI workflow
export const WorkflowBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-bl from-calm-50/18 to-therapy-50/18"></div>
    <div className="absolute top-10 right-1/4 w-72 h-72 bg-gradient-to-r from-calm-300/12 to-therapy-300/12 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute bottom-10 left-1/4 w-64 h-64 bg-gradient-to-r from-therapy-300/10 to-harmony-300/10 rounded-full blur-2xl animate-pulse animation-delay-600"></div>
    <div className="absolute top-1/3 left-10 w-18 h-18 border border-calm-200/30 rounded-full animate-float animation-delay-100"></div>
    <div className="absolute bottom-1/3 right-10 w-22 h-22 border border-therapy-200/30 rounded-lg rotate-45 animate-float animation-delay-400"></div>
  </div>
);

// Benefits Background - Success indicators
export const BenefitsBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-tr from-harmony-50/20 to-balance-50/20"></div>
    <div className="absolute top-20 right-20 w-80 h-80 bg-gradient-to-r from-harmony-300/15 to-balance-300/15 rounded-full blur-3xl"></div>
    <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-r from-balance-300/10 to-flow-300/10 rounded-full blur-3xl"></div>
    <div className="absolute top-1/4 left-1/4 w-16 h-16 border border-harmony-200/25 rounded-full animate-float animation-delay-200"></div>
    <div className="absolute bottom-1/4 right-1/4 w-20 h-20 border border-balance-200/25 rounded-lg rotate-12 animate-float animation-delay-500"></div>
  </div>
);

// Success Stories Background - Achievement elements
export const SuccessStoriesBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-br from-flow-50/18 to-harmony-50/18"></div>
    <div className="absolute inset-0 opacity-25" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.02'%3E%3Cpolygon points='50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
    }}></div>
    <div className="absolute top-16 left-16 text-4xl opacity-15 animate-pulse">⭐</div>
    <div className="absolute top-32 right-24 text-3xl opacity-15 animate-bounce">🏆</div>
    <div className="absolute bottom-24 left-32 text-3xl opacity-15 animate-pulse">💫</div>
    <div className="absolute bottom-16 right-16 text-4xl opacity-15 animate-pulse">🎯</div>
  </div>
);

// Security Background - Security elements
export const SecurityBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-tl from-calm-50/16 to-therapy-50/16"></div>
    <div className="absolute inset-0 opacity-20" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.03'%3E%3Cpath d='M20 20h20v20H20V20zM0 0h20v20H0V0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
    }}></div>
    <div className="absolute top-20 right-1/3 w-60 h-60 bg-gradient-to-r from-calm-300/12 to-therapy-300/12 rounded-full blur-2xl"></div>
    <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-r from-therapy-300/8 to-calm-300/8 rounded-full blur-3xl"></div>
    <div className="absolute top-1/4 left-10 text-3xl opacity-12 animate-pulse">🔐</div>
    <div className="absolute bottom-1/4 right-10 text-3xl opacity-12 animate-pulse">🛡️</div>
  </div>
);

// Global Reach Background - World map elements
export const GlobalReachBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-r from-balance-50/18 to-harmony-50/18"></div>
    <div className="absolute top-10 left-1/4 w-80 h-80 bg-gradient-to-r from-balance-300/10 to-harmony-300/10 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute bottom-10 right-1/4 w-64 h-64 bg-gradient-to-r from-harmony-300/12 to-flow-300/12 rounded-full blur-2xl animate-pulse animation-delay-400"></div>
    <div className="absolute top-20 left-20 text-4xl opacity-15 animate-pulse">🌍</div>
    <div className="absolute top-32 right-32 text-3xl opacity-15 animate-bounce">🌎</div>
    <div className="absolute bottom-32 left-40 text-3xl opacity-15 animate-pulse">🌏</div>
    <div className="absolute bottom-20 right-20 text-2xl opacity-15 animate-pulse">🗺️</div>
  </div>
);

// Community Background - Community elements
export const CommunityBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-bl from-harmony-50/20 to-flow-50/20"></div>
    <div className="absolute inset-0 opacity-25" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='15'/%3E%3Ccircle cx='15' cy='15' r='5'/%3E%3Ccircle cx='45' cy='15' r='5'/%3E%3Ccircle cx='15' cy='45' r='5'/%3E%3Ccircle cx='45' cy='45' r='5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
    }}></div>
    <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-r from-harmony-300/12 to-flow-300/12 rounded-full blur-3xl"></div>
    <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-flow-300/10 to-balance-300/10 rounded-full blur-3xl"></div>
    <div className="absolute top-16 left-16 text-3xl opacity-12 animate-pulse">👥</div>
    <div className="absolute top-32 right-24 text-2xl opacity-12 animate-bounce">🤝</div>
    <div className="absolute bottom-24 left-32 text-3xl opacity-12 animate-pulse">💬</div>
    <div className="absolute bottom-16 right-16 text-2xl opacity-12 animate-pulse">🌟</div>
  </div>
);

// Pricing Background - Value elements
export const PricingBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-tr from-therapy-50/16 to-balance-50/16"></div>
    <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-therapy-300/12 to-balance-300/12 rounded-full blur-2xl"></div>
    <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-balance-300/8 to-harmony-300/8 rounded-full blur-3xl"></div>
    <div className="absolute top-10 left-10 w-24 h-24 border border-therapy-200/20 rounded-full animate-float"></div>
    <div className="absolute bottom-10 right-10 w-20 h-20 border border-balance-200/20 rounded-lg rotate-12 animate-float animation-delay-300"></div>
  </div>
);

// CTA Background - Action elements
export const CTABackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-br from-flow-50/20 to-calm-50/20"></div>
    <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-flow-300/15 to-calm-300/15 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute bottom-20 right-20 w-72 h-72 bg-gradient-to-r from-calm-300/12 to-therapy-300/12 rounded-full blur-2xl animate-pulse animation-delay-300"></div>
    <div className="absolute top-1/3 right-10 w-28 h-28 border-2 border-flow-200/25 rounded-full animate-float animation-delay-100"></div>
    <div className="absolute bottom-1/3 left-10 w-24 h-24 border-2 border-calm-200/25 rounded-lg rotate-45 animate-float animation-delay-400"></div>
    <div className="absolute top-16 left-1/3 text-3xl opacity-15 animate-pulse">🚀</div>
    <div className="absolute bottom-16 right-1/3 text-3xl opacity-15 animate-bounce">✨</div>
  </div>
);