import React from 'react';
import { Users, Brain, Heart, Shield, Star, Zap } from 'lucide-react';

const AITherapistTeam = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Users className="h-16 w-16 text-therapy-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            AI Therapist Team
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet our 9 specialized AI therapists with unique approaches and 3D avatars
          </p>
        </div>

        {/* AI Therapists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="w-16 h-16 bg-therapy-100 rounded-full flex items-center justify-center mb-4">
              <Brain className="h-8 w-8 text-therapy-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Dr. Sarah Chen</h3>
            <p className="text-therapy-600 text-sm mb-2">Cognitive Behavioral Therapy</p>
            <p className="text-gray-600">
              Specializes in anxiety, depression, and thought pattern restructuring
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="w-16 h-16 bg-therapy-100 rounded-full flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-therapy-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Dr. Marcus Johnson</h3>
            <p className="text-therapy-600 text-sm mb-2">Dialectical Behavior Therapy</p>
            <p className="text-gray-600">
              Expert in emotional regulation and interpersonal effectiveness
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="w-16 h-16 bg-therapy-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-therapy-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Dr. Elena Rodriguez</h3>
            <p className="text-therapy-600 text-sm mb-2">Trauma-Focused Therapy</p>
            <p className="text-gray-600">
              Specialized in PTSD, trauma recovery, and resilience building
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="w-16 h-16 bg-therapy-100 rounded-full flex items-center justify-center mb-4">
              <Star className="h-8 w-8 text-therapy-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Dr. Alex Kim</h3>
            <p className="text-therapy-600 text-sm mb-2">Mindfulness-Based Therapy</p>
            <p className="text-gray-600">
              Focuses on present-moment awareness and acceptance practices
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="w-16 h-16 bg-therapy-100 rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-therapy-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Dr. Priya Patel</h3>
            <p className="text-therapy-600 text-sm mb-2">Family Systems Therapy</p>
            <p className="text-gray-600">
              Specializes in relationship dynamics and family counseling
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="w-16 h-16 bg-therapy-100 rounded-full flex items-center justify-center mb-4">
              <Zap className="h-8 w-8 text-therapy-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Dr. James Wright</h3>
            <p className="text-therapy-600 text-sm mb-2">Solution-Focused Therapy</p>
            <p className="text-gray-600">
              Expert in goal-setting and rapid therapeutic interventions
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-therapy-600 text-white rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-4">Meet Your AI Therapist Team</h2>
          <p className="text-xl mb-6">
            Connect with specialized AI therapists tailored to your specific needs
          </p>
          <button className="bg-white text-therapy-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Choose Your Therapist
          </button>
        </div>
      </div>
    </div>
  );
};

export default AITherapistTeam;