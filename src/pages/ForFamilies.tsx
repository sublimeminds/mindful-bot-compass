import React from 'react';
import { Users, Heart, Shield, Settings, Calendar, Star } from 'lucide-react';

const ForFamilies = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Users className="h-16 w-16 text-therapy-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            For Families
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Family mental health support with shared accounts, parental controls, and family therapy
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Shield className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Parental Controls</h3>
            <p className="text-gray-600">
              Secure monitoring and management of family member therapy sessions
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Heart className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Family Therapy</h3>
            <p className="text-gray-600">
              Specialized family therapy sessions to strengthen relationships
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Settings className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Shared Dashboard</h3>
            <p className="text-gray-600">
              Family dashboard to track progress and coordinate care
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-therapy-600 text-white rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-4">Support Your Family</h2>
          <p className="text-xl mb-6">
            Create a supportive environment for your family's mental health journey
          </p>
          <button className="bg-white text-therapy-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Start Family Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForFamilies;