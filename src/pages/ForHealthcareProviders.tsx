import React from 'react';
import { Shield, FileText, Users, BarChart3, Calendar, Settings } from 'lucide-react';

const ForHealthcareProviders = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-16 w-16 text-therapy-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            For Healthcare Providers
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional tools for therapists, clinicians, and healthcare organizations
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <FileText className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Clinical Documentation</h3>
            <p className="text-gray-600">
              Comprehensive clinical notes and progress documentation tools
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Users className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Patient Management</h3>
            <p className="text-gray-600">
              Manage patient caseloads with integrated scheduling and tracking
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <BarChart3 className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics & Insights</h3>
            <p className="text-gray-600">
              Advanced analytics to track treatment outcomes and effectiveness
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-therapy-600 text-white rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-4">Enhance Your Practice</h2>
          <p className="text-xl mb-6">
            Empower your clinical practice with AI-assisted therapy tools and insights
          </p>
          <button className="bg-white text-therapy-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Start Provider Trial
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForHealthcareProviders;