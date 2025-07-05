
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Users, Shield } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import GradientButton from '@/components/ui/GradientButton';

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

        {/* Hero visual/demo could go here */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-therapy-200/50 p-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-therapy-500 to-harmony-500 rounded-2xl mb-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Ready to start healing?</h3>
              <p className="text-slate-600 mb-4">Join thousands who have transformed their mental wellness with TherapySync</p>
              <div className="flex justify-center space-x-4 text-sm text-slate-500">
                <span>✓ Personalized therapy</span>
                <span>✓ Mood tracking</span>
                <span>✓ Crisis support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
