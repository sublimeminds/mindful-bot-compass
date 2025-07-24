import React from 'react';
import { Zap, Brain, Target } from 'lucide-react';

const AdaptiveAI = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-flow-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-flow-500 to-flow-600 rounded-xl p-4">
              <Zap className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Adaptive Systems
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Advanced AI that learns and adapts to your therapeutic needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <Brain className="h-8 w-8 text-flow-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Machine Learning</h3>
            <p className="text-gray-600">AI continuously learns from your interactions and preferences</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <Target className="h-8 w-8 text-flow-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Personalized Adaptation</h3>
            <p className="text-gray-600">Treatment approaches adapt based on your progress and feedback</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <Zap className="h-8 w-8 text-flow-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Real-time Optimization</h3>
            <p className="text-gray-600">System optimizes interventions in real-time for better outcomes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdaptiveAI;