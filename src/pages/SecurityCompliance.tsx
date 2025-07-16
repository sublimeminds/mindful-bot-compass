import React from 'react';
import { Shield, Lock, FileText, CheckCircle, Globe, Server } from 'lucide-react';

const SecurityCompliance = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-16 w-16 text-therapy-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Security & Compliance
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your privacy and security are our top priorities. Learn about our comprehensive security measures
          </p>
        </div>

        {/* Security Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Lock className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">End-to-End Encryption</h3>
            <p className="text-gray-600">
              All conversations and data are encrypted using industry-standard protocols
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <FileText className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">HIPAA Compliant</h3>
            <p className="text-gray-600">
              Fully compliant with HIPAA regulations for healthcare data protection
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Server className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Infrastructure</h3>
            <p className="text-gray-600">
              Enterprise-grade security with regular audits and monitoring
            </p>
          </div>
        </div>

        {/* Compliance Certifications */}
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Compliance Certifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900">HIPAA</h4>
              <p className="text-sm text-gray-600">Health Insurance Portability and Accountability Act</p>
            </div>
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900">SOC 2</h4>
              <p className="text-sm text-gray-600">Service Organization Control 2</p>
            </div>
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900">GDPR</h4>
              <p className="text-sm text-gray-600">General Data Protection Regulation</p>
            </div>
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900">ISO 27001</h4>
              <p className="text-sm text-gray-600">Information Security Management</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-therapy-600 text-white rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-4">Your Data is Safe</h2>
          <p className="text-xl mb-6">
            Trust in our commitment to protecting your privacy and securing your therapeutic journey
          </p>
          <button className="bg-white text-therapy-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecurityCompliance;