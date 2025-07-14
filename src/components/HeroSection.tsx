
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Users, Shield } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import GradientButton from '@/components/ui/GradientButton';
import heroImage from '@/assets/hero-therapy-sync.jpg';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-20 px-4 bg-gradient-to-br from-harmony-50 via-therapy-50 to-flow-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-therapy-200/30 to-harmony-200/30 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-flow-200/30 to-calm-200/30 blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16">
          {/* Trust badge */}
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-therapy-200">
            <Shield className="h-4 w-4 text-therapy-600" />
            <span className="text-sm font-medium text-therapy-700">HIPAA Compliant & Secure</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="block">Your AI-Powered</span>
            <span className="block therapy-text-gradient">Mental Wellness</span>
            <span className="block">Companion</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Experience personalized therapy sessions, mood tracking, and emotional support available 24/7. 
            Start your mental wellness journey with compassionate AI guidance.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center items-center gap-8 mb-12 text-slate-600">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-therapy-500" />
              <span className="font-medium">50,000+ Users</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-therapy-500" />
              <span className="font-medium">Available 24/7</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-therapy-500" />
              <span className="font-medium">Privacy Protected</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <GradientButton 
              size="lg" 
              onClick={() => navigate('/get-started')}
              className="px-8 py-4 text-lg font-semibold"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </GradientButton>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/auth')}
              className="px-8 py-4 text-lg font-semibold border-2 border-therapy-200 hover:bg-therapy-50"
            >
              Sign In
            </Button>
          </div>

          <p className="text-sm text-slate-500 mt-6">
            No commitment required • Cancel anytime • Start free
          </p>
        </div>

        {/* Hero visual showcase */}
        <div className="relative max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-therapy-200/50">
            <img 
              src={heroImage} 
              alt="TherapySync AI - Professional mental health support with cutting-edge AI technology" 
              className="w-full h-[400px] md:h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            
            {/* Overlay content */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="max-w-3xl">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl">
                    <Heart className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold">Transform Your Mental Wellness Journey</h3>
                </div>
                <p className="text-lg mb-6 text-white/90">
                  Experience the future of therapy with our AI-powered platform that adapts to your unique needs, 
                  providing personalized support, crisis intervention, and continuous growth tracking.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2 text-white/90">
                    <div className="w-2 h-2 bg-therapy-400 rounded-full"></div>
                    <span>AI-Powered Personalization</span>
                  </div>
                  <div className="flex items-center space-x-2 text-white/90">
                    <div className="w-2 h-2 bg-harmony-400 rounded-full"></div>
                    <span>24/7 Crisis Support</span>
                  </div>
                  <div className="flex items-center space-x-2 text-white/90">
                    <div className="w-2 h-2 bg-flow-400 rounded-full"></div>
                    <span>Progress Analytics</span>
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
