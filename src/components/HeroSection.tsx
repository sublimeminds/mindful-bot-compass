
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import AuthModal from "./AuthModal";
import QuickSignupWithPlan from "./subscription/QuickSignupWithPlan";
import TreeLogo from "@/components/ui/TreeLogo";

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
      <section className="relative py-24 lg:py-40 overflow-hidden gradient-harmony animate-gradient-flow bg-[length:400%_400%] min-h-screen flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-6xl mx-auto">
            <div className="animate-fade-in">
              {/* Hero badge */}
              <div className="inline-flex items-center space-x-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
                <Sparkles className="h-5 w-5 text-harmony-600" />
                <span className="text-harmony-800 text-base font-medium">AI-Powered Mental Health Support</span>
                <div className="w-3 h-3 bg-harmony-500 rounded-full animate-pulse"></div>
              </div>
              
              <div className="flex items-center justify-center mb-12">
                <div className="flex items-center justify-center w-80 h-80 bg-white/95 backdrop-blur-sm rounded-full shadow-harmony animate-swirl-breathe p-8">
                  <TreeLogo 
                    size="hero"
                    className="drop-shadow-xl"
                  />
                </div>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-foreground mb-10 leading-tight">
                Sync Your Mind
                <span className="block bg-gradient-to-r from-harmony-600 via-balance-600 to-flow-600 bg-clip-text text-transparent">
                  With AI Therapy
                </span>
                <span className="block text-4xl sm:text-5xl lg:text-6xl mt-4 text-muted-foreground">
                  Available 24/7
                </span>
              </h1>
              
              <p className="text-2xl sm:text-3xl text-muted-foreground mb-16 max-w-4xl mx-auto leading-relaxed">
                Experience personalized mental health support powered by AI. 
                <span className="block mt-3 font-semibold text-harmony-700">
                  Find balance, grow stronger, and sync with your wellbeing journey.
                </span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-20">
                <QuickSignupWithPlan>
                  <Button 
                    size="lg" 
                    className="gradient-flow text-white border-0 px-12 py-6 text-2xl font-semibold shadow-harmony hover:shadow-3xl transition-all duration-300 hover:scale-105 hover:animate-swirl-grow"
                  >
                    Start Your Journey
                    <ArrowRight className="h-6 w-6 ml-3" />
                  </Button>
                </QuickSignupWithPlan>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-3 border-harmony-300 text-harmony-700 hover:bg-harmony-50 px-12 py-6 text-2xl font-semibold backdrop-blur-sm group"
                  onClick={scrollToDemo}
                >
                  <TreeLogo 
                    size="md"
                    className="mr-3 group-hover:animate-swirl-grow"
                  />
                  See How It Works
                </Button>
              </div>
              
              {/* Trust indicators */}
              <div className="flex flex-wrap items-center justify-center gap-12 text-base text-muted-foreground">
                <div className="flex items-center space-x-3">
                  <TreeLogo size="sm" className="opacity-60" />
                  <span className="font-medium">HIPAA Compliant</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-balance-500 rounded-full"></div>
                  <span className="font-medium">256-bit Encryption</span>
                </div>
                <div className="flex items-center space-x-3">
                  <TreeLogo size="sm" className="opacity-60" />
                  <span className="font-medium">Evidence-Based</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-flow-600 rounded-full"></div>
                  <span className="font-medium">25K+ Users Helped</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Gradient-inspired decorative elements */}
        <div className="absolute top-32 left-16 w-40 h-40 bg-harmony-200/30 rounded-full opacity-40 animate-swirl-breathe"></div>
        <div className="absolute bottom-32 right-16 w-32 h-32 bg-flow-200/30 rounded-full opacity-40 animate-swirl-breathe" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-8 w-24 h-24 bg-balance-300/20 rounded-full opacity-30 animate-swirl-breathe" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-48 right-1/4 w-28 h-28 bg-harmony-300/20 rounded-full opacity-25 animate-swirl-breathe" style={{ animationDelay: '3s' }}></div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/20 pointer-events-none"></div>
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
