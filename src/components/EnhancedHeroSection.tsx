import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const EnhancedHeroSection = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      {/* Clean, minimal background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-therapy-50/10"></div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10 pt-32 pb-20">
        
        {/* Professional Hero Content */}
        <div className="text-center max-w-6xl mx-auto space-y-16">
          
          {/* Clean Headline */}
          <div className={cn(
            "space-y-8 transition-all duration-1000",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <h1 className="text-5xl lg:text-7xl xl:text-8xl font-light leading-tight tracking-tight text-foreground">
              Professional AI therapy,
              <br />
              <span className="font-medium bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">
                available instantly
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-light">
              Experience evidence-based mental health support with advanced AI that adapts to your unique needs.
              Private, secure, and accessible 24/7.
            </p>
          </div>

          {/* Elegant Product Preview */}
          <div className={cn(
            "transition-all duration-1000 delay-300",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-xl border border-therapy-100/50">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-therapy-500 rounded-full"></div>
                    <span className="text-sm font-medium text-therapy-700">AI Therapy Session</span>
                  </div>
                  <div className="text-xs text-muted-foreground">End-to-end encrypted</div>
                </div>
                
                <div className="space-y-6 text-left">
                  <div className="flex justify-start">
                    <div className="bg-therapy-50 rounded-2xl px-6 py-4 max-w-md">
                      <p className="text-therapy-700">I've been feeling really anxious about work lately. It's affecting my sleep and relationships.</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <div className="bg-gradient-to-r from-therapy-500 to-calm-500 rounded-2xl px-6 py-4 max-w-md">
                      <p className="text-white">I understand that work anxiety can be overwhelming. Let's explore some strategies to help you manage these feelings. What specific situations at work trigger your anxiety most?</p>
                    </div>
                  </div>
                </div>
                
                {/* Subtle CTA to explore demo */}
                <div className="mt-8 pt-6 border-t border-therapy-100/50">
                  <button className="group flex items-center space-x-2 text-therapy-600 hover:text-therapy-700 transition-colors text-sm font-medium">
                    <Play className="w-4 h-4" />
                    <span>Experience the full interactive demo below</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Professional CTAs */}
          <div className={cn(
            "flex flex-col sm:flex-row justify-center gap-6 transition-all duration-1000 delay-600",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <Button
              size="lg"
              onClick={() => navigate('/get-started')}
              className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 text-white font-medium px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start therapy session
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <Button
              variant="outline"
              size="lg" 
              className="border-therapy-200 text-therapy-700 hover:bg-therapy-50 font-medium px-8 py-6 text-lg rounded-xl transition-all duration-300"
            >
              Learn more
            </Button>
          </div>

          {/* Trust indicators */}
          <div className={cn(
            "grid grid-cols-3 gap-8 pt-16 transition-all duration-1000 delay-900",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <div className="text-center">
              <div className="text-sm font-medium text-therapy-600 mb-1">HIPAA Compliant</div>
              <div className="text-xs text-muted-foreground">Enterprise-grade security</div>
            </div>
            
            <div className="text-center">
              <div className="text-sm font-medium text-therapy-600 mb-1">24/7 Available</div>
              <div className="text-xs text-muted-foreground">No appointments needed</div>
            </div>
            
            <div className="text-center">
              <div className="text-sm font-medium text-therapy-600 mb-1">Evidence-based</div>
              <div className="text-xs text-muted-foreground">Clinical-grade AI</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedHeroSection;