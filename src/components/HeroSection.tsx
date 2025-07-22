
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Users, Shield } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import GradientButton from '@/components/ui/GradientButton';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 px-4 bg-gradient-to-br from-harmony-50 via-therapy-50 to-flow-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-40 sm:w-80 h-40 sm:h-80 rounded-full bg-gradient-to-br from-therapy-200/30 to-harmony-200/30 blur-3xl"></div>
        <div className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-40 sm:w-80 h-40 sm:h-80 rounded-full bg-gradient-to-tr from-flow-200/30 to-calm-200/30 blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          {/* Trust badge */}
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6 lg:mb-8 border border-therapy-200">
            <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-therapy-600" />
            <span className="text-xs sm:text-sm font-medium text-therapy-700">HIPAA Compliant & Secure</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            <span className="block">Your AI-Powered</span>
            <span className="block therapy-text-gradient">Mental Wellness</span>
            <span className="block">Companion</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-600 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
            Experience personalized therapy sessions, mood tracking, and emotional support available 24/7. 
            Start your mental wellness journey with compassionate AI guidance.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10 lg:mb-12 text-slate-600 px-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-therapy-500" />
              <span className="text-sm sm:text-base font-medium">50,000+ Users</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-therapy-500" />
              <span className="text-sm sm:text-base font-medium">Available 24/7</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-therapy-500" />
              <span className="text-sm sm:text-base font-medium">Privacy Protected</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            <GradientButton 
              size="lg" 
              onClick={() => navigate('/get-started')}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </GradientButton>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/auth')}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold border-2 border-therapy-200 hover:bg-therapy-50"
            >
              Sign In
            </Button>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 mt-4 sm:mt-6 px-4">
            No commitment required • Cancel anytime • Start free
          </p>
        </div>

        {/* Optimized Hero Display */}
        <div className="relative max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-therapy-200/50 min-h-[280px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[450px]">
            {/* Dynamic Gradient Background */}
            <div className="absolute inset-0 hero-gradient-bg"></div>
            
            {/* Simplified animations for better performance */}
            <div className="neural-orb therapy w-8 sm:w-12 lg:w-16 h-8 sm:h-12 lg:h-16 top-6 sm:top-12 left-1/5" style={{ animationDelay: '0s' }}></div>
            <div className="neural-orb calm w-6 sm:w-10 lg:w-12 h-6 sm:h-10 lg:h-12 top-1/3 right-1/4" style={{ animationDelay: '1.5s' }}></div>
            <div className="neural-orb harmony w-8 sm:w-12 lg:w-14 h-8 sm:h-12 lg:h-14 bottom-1/4 left-1/3" style={{ animationDelay: '3s' }}></div>
            
            {/* Overlay content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8 text-white">
              <div className="max-w-3xl relative z-10">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                  <div className="inline-flex items-center justify-center w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl">
                    <Heart className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold">Transform Your Mental Wellness Journey</h3>
                </div>
                <p className="text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 text-white/90">
                  Experience the future of therapy with our AI-powered platform that adapts to your unique needs, 
                  providing personalized support, crisis intervention, and continuous growth tracking.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                  <div className="flex items-center space-x-2 text-white/90">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-therapy-400 rounded-full animate-pulse"></div>
                    <span className="text-xs sm:text-sm">AI-Powered Personalization</span>
                  </div>
                  <div className="flex items-center space-x-2 text-white/90">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-harmony-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    <span className="text-xs sm:text-sm">24/7 Crisis Support</span>
                  </div>
                  <div className="flex items-center space-x-2 text-white/90">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-flow-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <span className="text-xs sm:text-sm">Progress Analytics</span>
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
