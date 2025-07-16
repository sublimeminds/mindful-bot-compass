import React from 'react';
import { Brain, Zap, Shield, Target, Users, BarChart3 } from 'lucide-react';

const TherapyAICore = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Brain className="h-16 w-16 text-therapy-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            TherapySync AI Core
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Advanced multi-model AI system powered by OpenAI and Anthropic with real-time insights
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Zap className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Multi-Model AI</h3>
            <p className="text-gray-600">
              Combines the best of OpenAI and Anthropic models for optimal therapeutic conversations
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Shield className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-Time Insights</h3>
            <p className="text-gray-600">
              Get immediate feedback and insights during your therapy sessions
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Target className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Adaptive Learning</h3>
            <p className="text-gray-600">
              AI that learns and adapts to your unique therapeutic needs over time
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Users className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Collaborative Care</h3>
            <p className="text-gray-600">
              Seamlessly integrates with human therapists for enhanced treatment outcomes
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <BarChart3 className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Evidence-Based</h3>
            <p className="text-gray-600">
              Built on proven therapeutic frameworks and clinical best practices
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Brain className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Continuous Evolution</h3>
            <p className="text-gray-600">
              Regular updates and improvements based on latest research and user feedback
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-therapy-600 text-white rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience TherapySync AI Core?</h2>
          <p className="text-xl mb-6">
            Join thousands of users who are already benefiting from our advanced AI therapy system
          </p>
          <button className="bg-white text-therapy-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Get Started Today
          </button>
        </div>
      </div>
    </div>
  );
};

export default TherapyAICore;