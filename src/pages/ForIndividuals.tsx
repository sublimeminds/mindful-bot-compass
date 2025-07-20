
import React from 'react';
import { Target, Brain, Heart, Calendar, Shield, Activity } from 'lucide-react';
import FluidSpacing from '@/components/ui/FluidSpacing';

const ForIndividuals = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <FluidSpacing variant="hero">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <Target className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 text-therapy-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              For Individuals
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Personal therapy journey with AI-powered insights and personalized treatment plans
            </p>
          </div>
        </FluidSpacing>

        {/* Features Grid */}
        <FluidSpacing variant="section">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100">
              <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-therapy-600 mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">AI-Powered Therapy</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Personalized therapy sessions with advanced AI that adapts to your needs
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100">
              <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-therapy-600 mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Mood Tracking</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Track your emotional well-being with comprehensive mood analytics
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100 sm:col-span-2 lg:col-span-1">
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-therapy-600 mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Flexible Scheduling</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Schedule therapy sessions at your convenience with 24/7 availability
              </p>
            </div>
          </div>
        </FluidSpacing>

        {/* CTA Section */}
        <FluidSpacing variant="section">
          <div className="text-center bg-therapy-600 text-white rounded-xl p-6 sm:p-8 mx-4 sm:mx-6 lg:mx-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Start Your Journey</h2>
            <p className="text-lg sm:text-xl mb-4 sm:mb-6">
              Begin your personalized therapy journey today with our AI-powered platform
            </p>
            <button className="bg-white text-therapy-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base">
              Get Started
            </button>
          </div>
        </FluidSpacing>
      </div>
    </div>
  );
};

export default ForIndividuals;
