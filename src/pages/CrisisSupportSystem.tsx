import React from 'react';
import { Shield, Phone, MessageCircle, Clock, Heart, Users } from 'lucide-react';

const CrisisSupportSystem = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-16 w-16 text-red-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Crisis Support System
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            24/7 crisis intervention with automated detection and emergency resources
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Phone className="h-8 w-8 text-red-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Emergency Line</h3>
            <p className="text-gray-600">
              Direct access to crisis counselors and emergency services
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <MessageCircle className="h-8 w-8 text-red-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Detection</h3>
            <p className="text-gray-600">
              Automated crisis detection in conversations with immediate alerts
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Clock className="h-8 w-8 text-red-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Immediate Response</h3>
            <p className="text-gray-600">
              Instant connection to appropriate crisis intervention resources
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-red-600 text-white rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-4">Need Help Now?</h2>
          <p className="text-xl mb-6">
            Our crisis support system is available 24/7 to help you through difficult times
          </p>
          <button className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Get Crisis Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrisisSupportSystem;