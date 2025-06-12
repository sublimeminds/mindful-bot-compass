
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bot, Heart } from "lucide-react";
import AuthModal from "./AuthModal";

const HeroSection = () => {
  console.log('HeroSection: Component rendering');
  
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleStartSession = () => {
    console.log('HeroSection: Starting session');
    setShowAuthModal(true);
  };

  return (
    <>
      <section className="relative py-20 overflow-hidden gradient-therapy">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="animate-fade-in">
              <div className="flex items-center justify-center mb-6">
                <div className="flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg animate-float">
                  <Bot className="h-10 w-10 text-therapy-500" />
                </div>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Your AI Therapy Companion
                <span className="block bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">
                  Always Here for You
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Get professional AI-powered therapy support for emotional healing, trauma recovery, 
                and mental wellness. Available 24/7, completely confidential, and designed to help you thrive.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 text-white border-0 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={handleStartSession}
                >
                  Start Free Session
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-therapy-200 text-therapy-600 hover:bg-therapy-50 px-8 py-3 text-lg font-semibold"
                >
                  Learn More
                </Button>
              </div>
              
              <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-calm-500 rounded-full"></div>
                  <span>100% Confidential</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-therapy-500 rounded-full"></div>
                  <span>24/7 Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span>Evidence-Based</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-therapy-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-calm-200 rounded-full opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-5 w-12 h-12 bg-therapy-300 rounded-full opacity-15 animate-float" style={{ animationDelay: '2s' }}></div>
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
