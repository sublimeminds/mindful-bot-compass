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
      {/* Interactive Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Animated geometric shapes */}
        <div 
          className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * 50}px, ${mousePosition.y * 50}px)`,
            top: '10%',
            left: '10%'
          }}
        />
        <div 
          className="absolute w-80 h-80 rounded-full bg-gradient-to-r from-accent/15 to-primary/15 blur-2xl animate-pulse"
          style={{
            transform: `translate(${-mousePosition.x * 30}px, ${-mousePosition.y * 30}px)`,
            bottom: '20%',
            right: '15%',
            animationDelay: '1s'
          }}
        />
        
        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full animate-float"
            style={{
              left: `${10 + (i * 8)}%`,
              top: `${20 + (i * 5)}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + (i % 3)}s`
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
            <span className="block text-foreground">Mental health</span>
            <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-medium">
              that understands you
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl lg:text-3xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-light">
            AI therapy that speaks your language, understands your culture,
            <span className="block sm:inline"> and adapts to your unique needs.</span>
          </p>
        </div>

        {/* Value Props Cards */}
        <div className={cn(
          "grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto transition-all duration-1000 delay-400",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <div className="group p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-border/50 hover:bg-white/80 transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="font-semibold text-foreground mb-2">100% Private</div>
            <div className="text-sm text-muted-foreground">HIPAA-compliant security</div>
          </div>
          
          <div className="group p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-border/50 hover:bg-white/80 transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-r from-secondary to-accent rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="font-semibold text-foreground mb-2">Always Available</div>
            <div className="text-sm text-muted-foreground">24/7 instant access</div>
          </div>
          
          <div className="group p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-border/50 hover:bg-white/80 transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-r from-accent to-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="font-semibold text-foreground mb-2">Evidence-Based</div>
            <div className="text-sm text-muted-foreground">Clinical-grade AI</div>
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
            className="group bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-medium px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Start Your Journey
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button
            variant="outline"
            size="lg" 
            className="group border-2 border-border/50 text-foreground hover:bg-accent/10 font-medium px-8 py-6 text-lg rounded-2xl transition-all duration-300 hover:scale-105 hover:border-primary/50"
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