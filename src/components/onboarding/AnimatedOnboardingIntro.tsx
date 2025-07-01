
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Brain, Heart, Users, Sparkles } from 'lucide-react';
import GradientLogo from '@/components/ui/GradientLogo';

interface AnimatedOnboardingIntroProps {
  onGetStarted: () => void;
}

const AnimatedOnboardingIntro = ({ onGetStarted }: AnimatedOnboardingIntroProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-white to-calm-50 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="animate-fade-in">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <GradientLogo size="xl" className="drop-shadow-sm" />
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl font-bold therapy-text-gradient mb-6 leading-tight">
            Welcome to Your
            <span className="block">Mental Wellness Journey</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Let's create a personalized therapy experience designed just for you. 
            This journey will help us understand your needs and preferences.
          </p>

          {/* Feature Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
            <div className="flex flex-col items-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">AI-Powered Therapy</h3>
              <p className="text-sm text-slate-600 text-center">Personalized conversations tailored to your unique needs</p>
            </div>

            <div className="flex flex-col items-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-harmony-500 to-balance-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Mood Tracking</h3>
              <p className="text-sm text-slate-600 text-center">Track your emotional journey with intelligent insights</p>
            </div>

            <div className="flex flex-col items-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-calm-500 to-flow-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Community Support</h3>
              <p className="text-sm text-slate-600 text-center">Connect with others on similar healing journeys</p>
            </div>
          </div>

          {/* CTA Button */}
          <Button 
            size="lg"
            onClick={onGetStarted}
            className="bg-gradient-to-r from-therapy-500 via-calm-500 to-therapy-600 hover:from-therapy-600 hover:via-calm-600 hover:to-therapy-700 text-white px-12 py-6 text-xl rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
          >
            <Sparkles className="h-6 w-6 mr-3 group-hover:animate-pulse" />
            Start Your Journey
            <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </Button>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-slate-500">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              HIPAA Compliant
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              End-to-End Encrypted
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              24/7 Available
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedOnboardingIntro;
