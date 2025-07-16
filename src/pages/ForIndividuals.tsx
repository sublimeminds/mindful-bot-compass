import React from 'react';
import { Target, Brain, Heart, Calendar, Shield, Activity } from 'lucide-react';

const ForIndividuals = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Target className="h-16 w-16 text-therapy-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            For Individuals
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Personal therapy journey with AI-powered insights and personalized treatment plans
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Brain className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Therapy</h3>
            <p className="text-gray-600">
              Personalized therapy sessions with advanced AI that adapts to your needs
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Heart className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Mood Tracking</h3>
            <p className="text-gray-600">
              Track your emotional well-being with comprehensive mood analytics
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Calendar className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Flexible Scheduling</h3>
            <p className="text-gray-600">
              Schedule therapy sessions at your convenience with 24/7 availability
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-therapy-600 text-white rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-4">Start Your Journey</h2>
          <p className="text-xl mb-6">
            Begin your personalized therapy journey today with our AI-powered platform
          </p>
          <button className="bg-white text-therapy-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForIndividuals;