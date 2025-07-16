import React from 'react';
import { BookOpen, Brain, Target, CheckCircle, TrendingUp, Lightbulb } from 'lucide-react';

const CBTTherapy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <BookOpen className="h-16 w-16 text-therapy-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Cognitive Behavioral Therapy (CBT)
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Evidence-based approach focusing on thought patterns and behavioral changes
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Brain className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Thought Pattern Analysis</h3>
            <p className="text-gray-600">
              Identify and challenge negative thought patterns that impact your well-being
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Target className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Behavioral Interventions</h3>
            <p className="text-gray-600">
              Develop healthier behaviors and coping strategies for daily challenges
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <CheckCircle className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Goal-Oriented Treatment</h3>
            <p className="text-gray-600">
              Structured approach with clear objectives and measurable outcomes
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <TrendingUp className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Progress Tracking</h3>
            <p className="text-gray-600">
              Monitor improvements in mood, behavior, and thought patterns over time
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Lightbulb className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Cognitive Restructuring</h3>
            <p className="text-gray-600">
              Learn to reframe negative thoughts into more balanced, realistic perspectives
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <BookOpen className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Evidence-Based</h3>
            <p className="text-gray-600">
              Proven therapeutic approach with extensive research supporting its effectiveness
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-therapy-600 text-white rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-4">Start Your CBT Journey</h2>
          <p className="text-xl mb-6">
            Transform your thoughts and behaviors with evidence-based CBT techniques
          </p>
          <button className="bg-white text-therapy-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Begin CBT Therapy
          </button>
        </div>
      </div>
    </div>
  );
};

export default CBTTherapy;