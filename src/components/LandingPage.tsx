
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
import SuccessStoriesSection from '@/components/landing/SuccessStoriesSection';
import SecurityPrivacySection from '@/components/landing/SecurityPrivacySection';
import GlobalReachSection from '@/components/landing/GlobalReachSection';
import CommunitySection from '@/components/landing/CommunitySection';
import AIHubSection from '@/components/ai/AIHubSection';
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
      <ParallaxContainer className="min-h-screen relative scroll-smooth">
        {/* Apple-Style Progress Bar */}
        <AppleProgressBar />
        
        {/* Hero Section */}
        <ParallaxSection 
          id="hero"
          background={
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-therapy-600/90 via-harmony-500/80 to-calm-600/90" />
              <div className="absolute inset-0 bg-gradient-radial from-white/10 via-transparent to-transparent" />
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-healing-400/20 to-transparent rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-tl from-therapy-400/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
            </div>
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
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-50 via-blue-50/80 to-indigo-50" />
              <div className="absolute inset-0 opacity-40">
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(90deg,transparent_49%,rgba(99,102,241,0.1)_50%,transparent_51%)] bg-[length:80px_80px]" />
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(0deg,transparent_49%,rgba(99,102,241,0.1)_50%,transparent_51%)] bg-[length:80px_80px]" />
              </div>
              <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-gradient-to-tl from-indigo-300/20 to-transparent rounded-full blur-3xl animate-pulse delay-500" />
            </div>
          }
          backgroundSpeed={-0.15}
        >
          <div className="text-center">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">Advanced AI Technology</h2>
              <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
                Powered by cutting-edge artificial intelligence that truly understands your unique needs and adapts to your therapeutic journey
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/40 hover:shadow-2xl transition-all duration-300 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mx-auto mb-6 flex items-center justify-center text-white text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300">🧠</div>
                  <h3 className="font-bold text-xl mb-3 text-gray-900">Neural Processing</h3>
                  <p className="text-gray-600 leading-relaxed">Advanced transformer models trained specifically on therapeutic conversations and evidence-based practices</p>
                </div>
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/40 hover:shadow-2xl transition-all duration-300 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mx-auto mb-6 flex items-center justify-center text-white text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300">🎯</div>
                  <h3 className="font-bold text-xl mb-3 text-gray-900">Smart Matching</h3>
                  <p className="text-gray-600 leading-relaxed">AI-driven analysis to match you with the perfect therapist and therapeutic approach for optimal results</p>
                </div>
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/40 hover:shadow-2xl transition-all duration-300 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl mx-auto mb-6 flex items-center justify-center text-white text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300">🔒</div>
                  <h3 className="font-bold text-xl mb-3 text-gray-900">Privacy First</h3>
                  <p className="text-gray-600 leading-relaxed">Military-grade encryption with HIPAA compliance ensuring your conversations remain completely confidential</p>
                </div>
              </div>
            </div>
          </div>
        </ParallaxSection>
        
        {/* AI Hub Section */}
        <ParallaxSection 
          id="ai-hub"
          background={
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-blue-900/90 to-indigo-900/95" />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-transparent to-purple-600/20" />
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-transparent rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-tl from-purple-400/25 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
              <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-br from-cyan-400/20 to-transparent rounded-full blur-3xl animate-pulse delay-500" />
              {/* Animated grid overlay */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(90deg,transparent_98%,rgba(255,255,255,0.5)_100%)] bg-[length:100px_100px]" />
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(0deg,transparent_98%,rgba(255,255,255,0.5)_100%)] bg-[length:100px_100px]" />
              </div>
            </div>
          }
          backgroundSpeed={-0.1}
        >
          <SafeComponentWrapper name="AIHubSection" fallback={<div className="py-20"></div>}>
            <AIHubSection />
          </SafeComponentWrapper>
        </ParallaxSection>
        
        {/* Real Therapist Team */}
        <ParallaxSection 
          id="therapists"
          background={
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-700/85 via-teal-600/80 to-cyan-700/85" />
              <div className="absolute inset-0 bg-gradient-to-tr from-white/15 via-transparent to-emerald-300/10" />
              <div className="absolute top-1/4 right-1/5 w-88 h-88 bg-gradient-to-br from-emerald-300/25 to-transparent rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-gradient-to-tl from-teal-300/20 to-transparent rounded-full blur-3xl animate-pulse delay-700" />
              <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-gradient-to-br from-cyan-300/15 to-transparent rounded-full blur-3xl animate-pulse delay-300" />
            </div>
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
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-bl from-gray-50 via-slate-50 to-gray-100" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.1)_0%,transparent_70%)]" />
              <div className="absolute top-1/4 left-1/2 w-96 h-96 bg-gradient-to-br from-indigo-200/30 to-transparent rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-gradient-to-tl from-purple-200/20 to-transparent rounded-full blur-3xl animate-pulse delay-500" />
            </div>
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
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-r from-white via-blue-50/50 to-indigo-50/30" />
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_25%,rgba(99,102,241,0.3)_0%,transparent_50%)]" />
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_75%_25%,rgba(147,51,234,0.3)_0%,transparent_50%)]" />
                <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_75%,rgba(59,130,246,0.3)_0%,transparent_50%)]" />
              </div>
            </div>
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
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-700/85 via-purple-600/80 to-indigo-700/85" />
              <div className="absolute inset-0 bg-gradient-to-tl from-fuchsia-400/20 via-transparent to-blue-400/20" />
              <div className="absolute top-1/5 left-1/4 w-80 h-80 bg-gradient-to-br from-violet-300/30 to-transparent rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/4 right-1/5 w-72 h-72 bg-gradient-to-tl from-purple-300/25 to-transparent rounded-full blur-3xl animate-pulse delay-600" />
            </div>
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
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-bl from-teal-700/85 via-emerald-600/80 to-green-700/85" />
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 via-transparent to-lime-400/20" />
              <div className="absolute top-1/3 right-1/4 w-88 h-88 bg-gradient-to-br from-teal-300/30 to-transparent rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/5 left-1/3 w-76 h-76 bg-gradient-to-tl from-emerald-300/25 to-transparent rounded-full blur-3xl animate-pulse delay-900" />
            </div>
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
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-slate-100 to-zinc-50" />
              <div className="absolute inset-0 opacity-40">
                <div className="absolute top-0 left-0 w-full h-full bg-[conic-gradient(from_0deg_at_50%_50%,rgba(99,102,241,0.1)_0deg,transparent_60deg,rgba(147,51,234,0.1)_120deg,transparent_180deg,rgba(59,130,246,0.1)_240deg,transparent_300deg)]" />
              </div>
              <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-gradient-to-br from-indigo-300/25 to-transparent rounded-full blur-3xl animate-pulse" />
            </div>
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
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-tr from-rose-700/85 via-pink-600/80 to-red-700/85" />
              <div className="absolute inset-0 bg-gradient-to-bl from-yellow-400/20 via-transparent to-orange-400/20" />
              <div className="absolute top-1/5 right-1/5 w-84 h-84 bg-gradient-to-br from-rose-300/30 to-transparent rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/3 left-1/4 w-68 h-68 bg-gradient-to-tl from-pink-300/25 to-transparent rounded-full blur-3xl animate-pulse delay-400" />
            </div>
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
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800/90 via-slate-700/85 to-zinc-800/90" />
              <div className="absolute inset-0 bg-gradient-to-tl from-blue-400/15 via-transparent to-purple-400/15" />
              <div className="absolute top-1/3 left-1/5 w-76 h-76 bg-gradient-to-br from-blue-300/20 to-transparent rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-tl from-purple-300/20 to-transparent rounded-full blur-3xl animate-pulse delay-1100" />
            </div>
          }
          backgroundSpeed={-0.1}
        >
          <SafeComponentWrapper name="PricingSection" fallback={<div className="py-20"></div>}>
            <EnhancedPricingSection />
          </SafeComponentWrapper>
        </ParallaxSection>
        
        {/* Success Stories */}
        <ParallaxSection 
          id="success-stories"
          background={
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600/80 via-orange-600/70 to-red-600/80" />
              <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400/20 via-transparent to-pink-400/20" />
              <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-yellow-300/30 to-transparent rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-gradient-to-tl from-orange-300/30 to-transparent rounded-full blur-3xl animate-pulse delay-700" />
            </div>
          }
          backgroundSpeed={-0.3}
        >
          <SafeComponentWrapper name="SuccessStoriesSection" fallback={<div className="py-20"></div>}>
            <SuccessStoriesSection />
          </SafeComponentWrapper>
        </ParallaxSection>

        {/* Security & Privacy */}
        <ParallaxSection 
          id="security"
          background={
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-tr from-green-700/85 via-emerald-600/75 to-teal-700/85" />
              <div className="absolute inset-0 bg-gradient-to-bl from-cyan-400/15 via-transparent to-green-400/15" />
              <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-gradient-to-br from-emerald-300/25 to-transparent rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-gradient-to-tl from-teal-300/20 to-transparent rounded-full blur-3xl animate-pulse delay-1500" />
            </div>
          }
          backgroundSpeed={-0.2}
        >
          <SafeComponentWrapper name="SecurityPrivacySection" fallback={<div className="py-20"></div>}>
            <SecurityPrivacySection />
          </SafeComponentWrapper>
        </ParallaxSection>

        {/* Global Reach */}
        <ParallaxSection 
          id="global-reach"
          background={
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-bl from-blue-700/90 via-indigo-600/80 to-purple-700/90" />
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 via-transparent to-violet-400/20" />
              <div className="absolute top-1/5 right-1/5 w-96 h-96 bg-gradient-to-br from-blue-300/30 to-transparent rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/5 left-1/5 w-80 h-80 bg-gradient-to-tl from-indigo-300/25 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
            </div>
          }
          backgroundSpeed={-0.25}
        >
          <SafeComponentWrapper name="GlobalReachSection" fallback={<div className="py-20"></div>}>
            <GlobalReachSection />
          </SafeComponentWrapper>
        </ParallaxSection>

        {/* Community & Support */}
        <ParallaxSection 
          id="community"
          background={
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700/85 via-pink-600/80 to-rose-700/85" />
              <div className="absolute inset-0 bg-gradient-to-bl from-fuchsia-400/20 via-transparent to-pink-400/20" />
              <div className="absolute top-1/3 left-1/3 w-88 h-88 bg-gradient-to-br from-purple-300/30 to-transparent rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-tl from-pink-300/25 to-transparent rounded-full blur-3xl animate-pulse delay-800" />
            </div>
          }
          backgroundSpeed={-0.15}
        >
          <SafeComponentWrapper name="CommunitySection" fallback={<div className="py-20"></div>}>
            <CommunitySection />
          </SafeComponentWrapper>
        </ParallaxSection>

        {/* CTA */}
        <ParallaxSection 
          id="cta"
          background={
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-t from-therapy-700/90 via-harmony-600/85 to-calm-700/90" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-therapy-900/20" />
              <div className="absolute top-1/4 left-1/2 w-96 h-96 bg-gradient-to-br from-healing-300/30 to-transparent rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-gradient-to-tl from-therapy-300/25 to-transparent rounded-full blur-3xl animate-pulse delay-1200" />
            </div>
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
