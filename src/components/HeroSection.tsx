
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Shield, Brain, Heart } from "lucide-react";
import AuthModal from "./AuthModal";
import QuickSignupWithPlan from "./subscription/QuickSignupWithPlan";
import GradientLogo from "@/components/ui/GradientLogo";

const HeroSection = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleStartSession = () => {
    setShowAuthModal(true);
  };

  const scrollToDemo = () => {
    const demoElement = document.querySelector('#video-demo');
    if (demoElement) {
      demoElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <section className="relative py-24 lg:py-40 overflow-hidden bg-gradient-to-br from-harmony-50 via-balance-50 to-flow-100 animate-gradient-flow bg-[length:400%_400%] min-h-screen flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-6xl mx-auto">
            <div className="animate-fade-in">
              {/* Enhanced hero badge */}
              <div className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 mb-8 shadow-lg">
                <Sparkles className="h-5 w-5 text-harmony-600" />
                <span className="text-harmony-800 text-base font-medium">Complete AI Mental Health Platform</span>
                <div className="flex items-center space-x-1">
                  <Brain className="h-4 w-4 text-balance-600" />
                  <Heart className="h-4 w-4 text-flow-600" />
                  <Shield className="h-4 w-4 text-harmony-600" />
                </div>
              </div>
              
              <div className="flex items-center justify-center mb-12">
                <div className="flex items-center justify-center w-80 h-80 bg-white/95 backdrop-blur-sm rounded-full shadow-2xl animate-swirl-breathe p-8">
                  <GradientLogo 
                    size="hero"
                    className="drop-shadow-xl"
                  />
                </div>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-slate-800 mb-10 leading-tight">
                Your Complete
                <span className="block bg-gradient-to-r from-harmony-600 via-balance-600 to-flow-600 bg-clip-text text-transparent">
                  Mental Health
                </span>
                <span className="block text-4xl sm:text-5xl lg:text-6xl mt-4 text-slate-600">
                  AI Companion
                </span>
              </h1>
              
              <p className="text-2xl sm:text-3xl text-slate-700 mb-16 max-w-5xl mx-auto leading-relaxed">
                Advanced AI therapy with crisis detection, cultural awareness, predictive analytics, 
                and community support—all in one comprehensive platform.
                <span className="block mt-3 font-semibold text-harmony-700">
                  Available 24/7 with enterprise-grade security and personalized care.
                </span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-20">
                <QuickSignupWithPlan>
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-harmony-500 via-balance-500 to-flow-600 hover:from-harmony-600 hover:via-balance-600 hover:to-flow-700 text-white border-0 px-12 py-6 text-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:animate-swirl-grow"
                  >
                    Start Free Trial
                    <ArrowRight className="h-6 w-6 ml-3" />
                  </Button>
                </QuickSignupWithPlan>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-harmony-300 text-harmony-700 hover:bg-white/80 px-12 py-6 text-2xl font-semibold backdrop-blur-sm group shadow-lg bg-white/60"
                  onClick={scrollToDemo}
                >
                  <GradientLogo 
                    size="md"
                    className="mr-3 group-hover:animate-swirl-grow"
                  />
                  Explore Platform
                </Button>
              </div>
              
              {/* Enhanced trust indicators */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-base text-slate-600">
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-harmony-600" />
                    <span className="font-medium">HIPAA Compliant</span>
                  </div>
                  <span className="text-sm text-slate-500">Enterprise Security</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-balance-600" />
                    <span className="font-medium">AI-Powered</span>
                  </div>
                  <span className="text-sm text-slate-500">Crisis Detection</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-flow-600" />
                    <span className="font-medium">Evidence-Based</span>
                  </div>
                  <span className="text-sm text-slate-500">Therapeutic Approaches</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-harmony-600" />
                    <span className="font-medium">25K+ Users</span>
                  </div>
                  <span className="text-sm text-slate-500">Helped Worldwide</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced decorative elements */}
        <div className="absolute top-32 left-16 w-40 h-40 bg-harmony-200/30 rounded-full opacity-40 animate-swirl-breathe"></div>
        <div className="absolute bottom-32 right-16 w-32 h-32 bg-flow-200/30 rounded-full opacity-40 animate-swirl-breathe" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-8 w-24 h-24 bg-balance-300/20 rounded-full opacity-30 animate-swirl-breathe" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-48 right-1/4 w-28 h-28 bg-harmony-300/20 rounded-full opacity-25 animate-swirl-breathe" style={{ animationDelay: '3s' }}></div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/10 pointer-events-none"></div>
      </section>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        defaultMode="signup"
      />
    </>
  );
};

export default HeroSection;
