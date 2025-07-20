
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Users, Shield } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import GradientButton from '@/components/ui/GradientButton';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-6 sm:py-8 md:py-12 lg:py-16 px-4 bg-gradient-to-br from-harmony-50 via-therapy-50 to-flow-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 sm:-top-20 -right-10 sm:-right-20 w-20 sm:w-40 lg:w-60 h-20 sm:h-40 lg:h-60 rounded-full bg-gradient-to-br from-therapy-200/30 to-harmony-200/30 blur-2xl animate-pulse"></div>
        <div className="absolute -bottom-10 sm:-bottom-20 -left-10 sm:-left-20 w-20 sm:w-40 lg:w-60 h-20 sm:h-40 lg:h-60 rounded-full bg-gradient-to-tr from-flow-200/30 to-calm-200/30 blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          {/* Trust badge */}
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-3 sm:mb-4 lg:mb-6 border border-therapy-200">
            <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-therapy-600" />
            <span className="text-xs sm:text-sm font-medium text-therapy-700">HIPAA Compliant & Secure</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 lg:mb-6 leading-tight">
            <span className="block">Your AI-Powered</span>
            <span className="block therapy-text-gradient">Mental Wellness</span>
            <span className="block">Companion</span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 mb-4 sm:mb-6 lg:mb-8 max-w-3xl mx-auto leading-relaxed px-2">
            Experience personalized therapy sessions, mood tracking, and emotional support available 24/7. 
            Start your mental wellness journey with compassionate AI guidance.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 lg:mb-10 text-slate-600 px-2">
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-therapy-500" />
              <span className="text-xs sm:text-sm lg:text-base font-medium">50,000+ Users</span>
            </div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-therapy-500" />
              <span className="text-xs sm:text-sm lg:text-base font-medium">Available 24/7</span>
            </div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-therapy-500" />
              <span className="text-xs sm:text-sm lg:text-base font-medium">Privacy Protected</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 lg:gap-4 justify-center items-center px-2">
            <GradientButton 
              size="lg" 
              onClick={() => navigate('/get-started')}
              className="w-full sm:w-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 text-sm sm:text-base lg:text-lg font-semibold"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </GradientButton>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/auth')}
              className="w-full sm:w-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 text-sm sm:text-base lg:text-lg font-semibold border-2 border-therapy-200 hover:bg-therapy-50"
            >
              Sign In
            </Button>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 mt-3 sm:mt-4 lg:mt-6 px-2">
            No commitment required • Cancel anytime • Start free
          </p>
        </div>

        {/* Optimized Hero Display */}
        <div className="relative max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg sm:shadow-xl border border-therapy-200/50 min-h-[200px] sm:min-h-[250px] md:min-h-[300px] lg:min-h-[350px]">
            {/* Dynamic Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-therapy-500/90 via-harmony-500/80 to-flow-500/90"></div>
            
            {/* Simplified animations */}
            <div className="absolute top-4 sm:top-8 left-1/5 w-6 sm:w-8 lg:w-12 h-6 sm:h-8 lg:h-12 rounded-full bg-white/20 backdrop-blur-sm animate-pulse"></div>
            <div className="absolute top-1/3 right-1/4 w-4 sm:w-6 lg:w-10 h-4 sm:h-6 lg:h-10 rounded-full bg-white/15 backdrop-blur-sm animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute bottom-1/4 left-1/3 w-5 sm:w-8 lg:w-10 h-5 sm:h-8 lg:h-10 rounded-full bg-white/25 backdrop-blur-sm animate-pulse" style={{ animationDelay: '3s' }}></div>
            
            {/* Overlay content */}
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 lg:p-6 text-white">
              <div className="max-w-3xl relative z-10">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                  <div className="inline-flex items-center justify-center w-6 sm:w-8 lg:w-10 h-6 sm:h-8 lg:h-10 bg-white/20 backdrop-blur-sm rounded-lg">
                    <Heart className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                  </div>
                  <h3 className="text-sm sm:text-lg lg:text-xl font-bold">Transform Your Mental Wellness Journey</h3>
                </div>
                <p className="text-xs sm:text-sm lg:text-base mb-3 sm:mb-4 text-white/90">
                  Experience the future of therapy with our AI-powered platform that adapts to your unique needs.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-2 lg:gap-3">
                  <div className="flex items-center space-x-1.5 text-white/90">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-therapy-400 rounded-full animate-pulse"></div>
                    <span className="text-xs">AI-Powered</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-white/90">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-harmony-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    <span className="text-xs">24/7 Support</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-white/90">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-flow-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <span className="text-xs">Progress Analytics</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
