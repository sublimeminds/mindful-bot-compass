import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, Brain, Play, Sparkles } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import GradientLogo from '@/components/ui/GradientLogo';

const AppleHeroSection = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Apple-Style Clean Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50/90 to-white">
        {/* Subtle geometric elements for depth */}
        <div 
          className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-therapy-100/40 to-calm-100/40 blur-[120px] opacity-60"
          style={{
            transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
            top: '5%',
            left: '-10%'
          }}
        />
        <div 
          className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-harmony-100/30 to-therapy-100/30 blur-[100px] opacity-50"
          style={{
            transform: `translate(${-mousePosition.x * 15}px, ${-mousePosition.y * 15}px)`,
            bottom: '10%',
            right: '-5%'
          }}
        />
        
        {/* Minimal floating elements */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-therapy-300/20 rounded-full"
            style={{
              left: `${15 + (i * 12)}%`,
              top: `${25 + (i * 8)}%`,
              animation: `float ${4 + (i % 2)}s ease-in-out infinite`,
              animationDelay: `${i * 1}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10 text-center">
        
        {/* Logo and Brand */}
        <div className={cn(
          "flex items-center justify-center space-x-4 mb-8 transition-all duration-1000",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <div className="p-2 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg">
            <GradientLogo size="lg" />
          </div>
          <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            TherapySync
          </div>
        </div>
        
        {/* Main Headline */}
        <div className={cn(
          "space-y-6 mb-12 transition-all duration-1000 delay-200",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-light leading-tight tracking-tight">
            <span className="block text-slate-900">Mental health</span>
            <span className="block bg-gradient-to-r from-therapy-600 via-calm-600 to-harmony-600 bg-clip-text text-transparent font-medium">
              that understands you
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl lg:text-3xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
            AI therapy that speaks your language, understands your culture,
            <span className="block sm:inline"> and adapts to your unique needs.</span>
          </p>
        </div>

        {/* Value Props Cards */}
        <div className={cn(
          "grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto transition-all duration-1000 delay-400",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <div className="group p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 hover:bg-white/90 transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="w-12 h-12 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="font-semibold text-slate-900 mb-2">100% Private</div>
            <div className="text-sm text-slate-600">HIPAA-compliant security</div>
          </div>
          
          <div className="group p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 hover:bg-white/90 transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="w-12 h-12 bg-gradient-to-r from-calm-500 to-harmony-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="font-semibold text-slate-900 mb-2">Always Available</div>
            <div className="text-sm text-slate-600">24/7 instant access</div>
          </div>
          
          <div className="group p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 hover:bg-white/90 transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="w-12 h-12 bg-gradient-to-r from-harmony-500 to-therapy-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="font-semibold text-slate-900 mb-2">Evidence-Based</div>
            <div className="text-sm text-slate-600">Clinical-grade AI</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className={cn(
          "flex flex-col sm:flex-row justify-center gap-6 mb-16 transition-all duration-1000 delay-600",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <Button
            size="lg"
            onClick={() => navigate('/get-started')}
            className="group bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 text-white font-medium px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Start Your Journey
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button
            variant="outline"
            size="lg" 
            className="group border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-therapy-400 font-medium px-8 py-6 text-lg rounded-2xl transition-all duration-300 hover:scale-105"
          >
            <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
            Watch Demo
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className={cn(
          "flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground transition-all duration-1000 delay-800",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>10,000+ Sessions Completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-primary" />
            <span>HIPAA Compliant</span>
          </div>
          <div className="flex items-center space-x-2">
            <Brain className="w-4 h-4 text-primary" />
            <span>95% User Satisfaction</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppleHeroSection;