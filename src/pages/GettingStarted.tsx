import React from 'react';
import { BookOpen, Play, CheckCircle, ArrowRight, Users, Heart } from 'lucide-react';

const GettingStarted = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <BookOpen className="h-16 w-16 text-therapy-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Getting Started
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your step-by-step guide to beginning your therapy journey with TherapySync
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-therapy-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Your Account</h3>
                <p className="text-gray-600">
                  Sign up for TherapySync and complete your profile to get personalized recommendations
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-therapy-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Complete Assessment</h3>
                <p className="text-gray-600">
                  Take our comprehensive assessment to help our AI understand your needs and preferences
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-therapy-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Your First Session</h3>
                <p className="text-gray-600">
                  Begin your therapy journey with a personalized session tailored to your goals
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Start Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
            <Play className="h-8 w-8 text-therapy-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Quick Start Tutorial</h3>
            <p className="text-gray-600 mb-4">
              Watch our 5-minute tutorial to learn the basics
            </p>
            <button className="bg-therapy-600 text-white px-4 py-2 rounded-lg hover:bg-therapy-700 transition-colors">
              Watch Now
            </button>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
            <CheckCircle className="h-8 w-8 text-therapy-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Setup Checklist</h3>
            <p className="text-gray-600 mb-4">
              Follow our checklist to get fully set up
            </p>
            <button className="bg-therapy-600 text-white px-4 py-2 rounded-lg hover:bg-therapy-700 transition-colors">
              View Checklist
            </button>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
            <Users className="h-8 w-8 text-therapy-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Support</h3>
            <p className="text-gray-600 mb-4">
              Join our community for tips and support
            </p>
            <button className="bg-therapy-600 text-white px-4 py-2 rounded-lg hover:bg-therapy-700 transition-colors">
              Join Community
            </button>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-therapy-600 text-white rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Begin?</h2>
          <p className="text-xl mb-6">
            Take the first step towards better mental health with TherapySync
          </p>
          <button className="bg-white text-therapy-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Start Your Journey
          </button>
        </div>
      </div>
    </div>
  );
};

export default GettingStarted;