import React from 'react';
import { Settings, Heart, Shield, Users, Target, Star } from 'lucide-react';

const DBTTherapy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Settings className="h-16 w-16 text-therapy-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Dialectical Behavior Therapy (DBT)
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Skills-based therapy for emotional regulation and interpersonal effectiveness
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Heart className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Emotion Regulation</h3>
            <p className="text-gray-600">
              Learn to understand, accept, and manage intense emotions effectively
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Users className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Interpersonal Skills</h3>
            <p className="text-gray-600">
              Develop healthy relationship skills and effective communication strategies
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Shield className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Distress Tolerance</h3>
            <p className="text-gray-600">
              Build resilience and cope with crisis situations without making them worse
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Target className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Mindfulness Skills</h3>
            <p className="text-gray-600">
              Cultivate present-moment awareness and non-judgmental acceptance
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Star className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Skills Training</h3>
            <p className="text-gray-600">
              Practical skills you can use in daily life to improve emotional well-being
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Settings className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Behavioral Changes</h3>
            <p className="text-gray-600">
              Develop healthier patterns of behavior and response to challenging situations
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-therapy-600 text-white rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-4">Master DBT Skills</h2>
          <p className="text-xl mb-6">
            Develop emotional regulation and interpersonal effectiveness through DBT
          </p>
          <button className="bg-white text-therapy-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Start DBT Training
          </button>
        </div>
      </div>
    </div>
  );
};

export default DBTTherapy;