import React from 'react';
import { Button } from '@/components/ui/button';
import { Brain, MessageSquare, Zap } from 'lucide-react';

const TherapyAI = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-therapy-600 to-therapy-700 rounded-xl p-4">
              <Brain className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            TherapySync AI
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Advanced AI therapy platform with personalized treatment plans and real-time adaptation
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <MessageSquare className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI Conversations</h3>
            <p className="text-gray-600">Engage with advanced AI therapists trained in multiple therapeutic approaches</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <Zap className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Real-time Adaptation</h3>
            <p className="text-gray-600">AI learns and adapts to your unique needs and therapeutic progress</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <Brain className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Personalized Plans</h3>
            <p className="text-gray-600">Custom treatment plans tailored to your specific mental health goals</p>
          </div>
        </div>

        <div className="text-center">
          <Button size="lg" className="bg-therapy-600 hover:bg-therapy-700">
            Start Your AI Therapy Journey
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TherapyAI;