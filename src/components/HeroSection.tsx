
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import AuthModal from "./AuthModal";
import QuickSignupWithPlan from "./subscription/QuickSignupWithPlan";
import TreeLogo from "@/components/ui/TreeLogo";

const HeroSection = () => {
  console.log('HeroSection: Component rendering');
  
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleStartSession = () => {
    console.log('HeroSection: Starting session');
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
      <section className="relative py-20 lg:py-32 overflow-hidden gradient-therapy">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-5xl mx-auto">
            <div className="animate-fade-in">
              {/* Hero badge */}
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <Sparkles className="h-4 w-4 text-therapy-600" />
                <span className="text-therapy-800 text-sm font-medium">AI-Powered Mental Health Support</span>
                <div className="w-2 h-2 bg-therapy-500 rounded-full animate-pulse"></div>
              </div>
              
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center justify-center w-24 h-24 bg-white/90 backdrop-blur-sm rounded-full shadow-therapy animate-tree-breathe">
                  <TreeLogo 
                    size="lg"
                    className="drop-shadow-sm"
                  />
                </div>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground mb-8 leading-tight">
                Sync Your Mind
                <span className="block bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">
                  With AI Therapy
                </span>
                <span className="block text-3xl sm:text-4xl lg:text-5xl mt-2 text-muted-foreground">
                  Available 24/7
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
                Experience personalized mental health support powered by AI. 
                <span className="block mt-2 font-semibold text-therapy-700">
                  Find balance, grow stronger, and sync with your wellbeing journey.
                </span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                <QuickSignupWithPlan>
                  <Button 
                    size="lg" 
                    className="gradient-nature text-white border-0 px-10 py-4 text-xl font-semibold shadow-therapy hover:shadow-3xl transition-all duration-300 hover:scale-105 hover:animate-tree-grow"
                  >
                    Start Your Journey
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </QuickSignupWithPlan>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-therapy-300 text-therapy-700 hover:bg-therapy-50 px-10 py-4 text-xl font-semibold backdrop-blur-sm group"
                  onClick={scrollToDemo}
                >
                  <TreeLogo 
                    size="sm"
                    className="mr-2 group-hover:animate-tree-grow"
                  />
                  See How It Works
                </Button>
              </div>
              
              {/* Trust indicators */}
              <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-therapy-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">HIPAA Compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-calm-500 rounded-full"></div>
                  <span className="font-medium">256-bit Encryption</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TreeLogo size="sm" className="opacity-60" />
                  <span className="font-medium">Evidence-Based</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-therapy-600 rounded-full"></div>
                  <span className="font-medium">25K+ Users Helped</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Nature-inspired decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-therapy-200/30 rounded-full opacity-40 animate-leaf-float"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-calm-200/30 rounded-full opacity-40 animate-leaf-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-5 w-16 h-16 bg-therapy-300/20 rounded-full opacity-30 animate-leaf-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-32 right-1/4 w-20 h-20 bg-calm-300/20 rounded-full opacity-25 animate-leaf-float" style={{ animationDelay: '3s' }}></div>
        
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
