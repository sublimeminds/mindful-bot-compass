import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles, Shield, Brain } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import GradientLogo from '@/components/ui/GradientLogo';
import { motion } from 'framer-motion';
import SafeHavenIcon from '@/components/icons/SafeHavenIcon';
import AlwaysHereIcon from '@/components/icons/AlwaysHereIcon';
import ScienceBackedIcon from '@/components/icons/ScienceBackedIcon';

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
          <div className="p-3 rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg border border-slate-200/50">
            <GradientLogo size="lg" />
          </div>
          <div className="text-3xl lg:text-4xl font-bold text-slate-900 drop-shadow-sm">
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

        {/* Enhanced Value Props Cards - Fixed Centering */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12 max-w-5xl mx-auto place-items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Safe Haven Card - Perfectly Centered */}
          <motion.div 
            className="group relative p-8 bg-white/90 backdrop-blur-md rounded-3xl border border-white/40 hover:bg-white/95 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl shadow-lg overflow-hidden w-full max-w-sm mx-auto flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ y: -8 }}
          >
            {/* Glass morphism overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-therapy-100/30 via-white/20 to-calm-100/30 rounded-3xl" />
            
            {/* Breathing icon container - Centered */}
            <motion.div 
              className="relative w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-xl mx-auto bg-gradient-to-br from-therapy-500 to-therapy-600"
              animate={{ 
                scale: [1, 1.05, 1],
                boxShadow: [
                  "0 10px 30px hsl(var(--therapy-500) / 0.3)",
                  "0 15px 40px hsl(var(--therapy-500) / 0.4)",
                  "0 10px 30px hsl(var(--therapy-500) / 0.3)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <SafeHavenIcon size={32} className="text-white drop-shadow-lg" />
            </motion.div>
            
            <div className="relative z-10">
              <div className="font-bold text-slate-900 text-xl mb-3">Safe Haven</div>
              <div className="text-slate-700 leading-relaxed">Your thoughts, protected always</div>
              <div className="text-xs text-slate-500 mt-2 font-medium tracking-wide">HIPAA-COMPLIANT SECURITY</div>
            </div>

            {/* Floating particles */}
            <div className="absolute top-4 right-4 w-2 h-2 bg-therapy-300/40 rounded-full animate-pulse" />
            <div className="absolute bottom-8 left-6 w-1 h-1 bg-calm-300/60 rounded-full animate-pulse delay-1000" />
          </motion.div>
          
          {/* Always Here Card - Perfectly Centered */}
          <motion.div 
            className="group relative p-7 bg-white/90 backdrop-blur-md rounded-3xl border border-white/40 hover:bg-white/95 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl shadow-lg overflow-hidden w-full max-w-sm mx-auto flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{ y: -8 }}
          >
            {/* Glass morphism overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-calm-100/30 via-white/20 to-harmony-100/30 rounded-3xl" />
            
            {/* Breathing icon container - Centered */}
            <motion.div 
              className="relative w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-xl mx-auto bg-gradient-to-br from-calm-500 to-calm-600"
              animate={{ 
                scale: [1, 1.05, 1],
                boxShadow: [
                  "0 10px 30px hsl(var(--calm-500) / 0.3)",
                  "0 15px 40px hsl(var(--calm-500) / 0.4)",
                  "0 10px 30px hsl(var(--calm-500) / 0.3)"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <AlwaysHereIcon size={32} className="text-white drop-shadow-lg" />
            </motion.div>
            
            <div className="relative z-10">
              <div className="font-bold text-slate-900 text-xl mb-3">Always Here</div>
              <div className="text-slate-700 leading-relaxed">Support when you need it most</div>
              <div className="text-xs text-slate-500 mt-2 font-medium tracking-wide">24/7 INSTANT ACCESS</div>
            </div>

            {/* Floating particles */}
            <div className="absolute top-6 right-6 w-1.5 h-1.5 bg-calm-300/50 rounded-full animate-pulse delay-500" />
            <div className="absolute bottom-6 left-8 w-1 h-1 bg-harmony-300/60 rounded-full animate-pulse delay-1500" />
          </motion.div>
          
          {/* Science-Backed Card - Perfectly Centered */}
          <motion.div 
            className="group relative p-6 bg-white/90 backdrop-blur-md rounded-3xl border border-white/40 hover:bg-white/95 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl shadow-lg overflow-hidden w-full max-w-sm mx-auto flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            whileHover={{ y: -8 }}
          >
            {/* Glass morphism overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-harmony-100/30 via-white/20 to-therapy-100/30 rounded-3xl" />
            
            {/* Breathing icon container - Centered */}
            <motion.div 
              className="relative w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-xl mx-auto bg-gradient-to-br from-harmony-500 to-harmony-600"
              animate={{ 
                scale: [1, 1.05, 1],
                boxShadow: [
                  "0 10px 30px hsl(var(--harmony-500) / 0.3)",
                  "0 15px 40px hsl(var(--harmony-500) / 0.4)",
                  "0 10px 30px hsl(var(--harmony-500) / 0.3)"
                ]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            >
              <ScienceBackedIcon size={32} className="text-white drop-shadow-lg" />
            </motion.div>
            
            <div className="relative z-10">
              <div className="font-bold text-slate-900 text-xl mb-3">Science-Backed</div>
              <div className="text-slate-700 leading-relaxed">Proven therapeutic methods</div>
              <div className="text-xs text-slate-500 mt-2 font-medium tracking-wide">CLINICAL-GRADE AI</div>
            </div>

            {/* Floating particles */}
            <div className="absolute top-5 right-5 w-2 h-2 bg-harmony-300/40 rounded-full animate-pulse delay-700" />
            <div className="absolute bottom-10 left-5 w-1 h-1 bg-therapy-300/60 rounded-full animate-pulse delay-2000" />
          </motion.div>
        </motion.div>

        {/* Enhanced CTA Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row justify-center gap-6 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Button
              size="lg"
              onClick={() => navigate('/get-started')}
              className="group bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 text-white font-medium px-10 py-7 text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              size="lg" 
              className="group border-2 border-slate-300 bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white hover:border-therapy-400 font-medium px-10 py-7 text-lg rounded-2xl transition-all duration-500 shadow-lg hover:shadow-xl"
            >
              <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              Watch Demo
            </Button>
          </motion.div>
        </motion.div>

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