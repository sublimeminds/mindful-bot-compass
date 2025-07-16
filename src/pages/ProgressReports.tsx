import React from 'react';
import { FileText, TrendingUp, Calendar, Share2, Download, BarChart3 } from 'lucide-react';

const ProgressReports = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <FileText className="h-16 w-16 text-therapy-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Progress Reports
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Detailed progress reports and insights for you, families, and healthcare providers
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <TrendingUp className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Progress Tracking</h3>
            <p className="text-gray-600">
              Comprehensive tracking of therapy progress and outcomes
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Calendar className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Scheduled Reports</h3>
            <p className="text-gray-600">
              Automated weekly, monthly, and custom report generation
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Share2 className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Sharing</h3>
            <p className="text-gray-600">
              Share reports securely with healthcare providers and family members
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-therapy-600 text-white rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-4">Generate Your Report</h2>
          <p className="text-xl mb-6">
            Create detailed progress reports to track your therapy journey
          </p>
          <button className="bg-white text-therapy-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Create Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgressReports;