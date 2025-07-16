import React from 'react';
import { Heart, Flower, Clock, Shield, Star, Lightbulb } from 'lucide-react';

const MindfulnessTherapy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Heart className="h-16 w-16 text-therapy-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Mindfulness-Based Therapy
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Present-moment awareness and acceptance-based therapeutic interventions
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Clock className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Present-Moment Awareness</h3>
            <p className="text-gray-600">
              Develop the ability to stay grounded in the present moment
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Shield className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Acceptance Practice</h3>
            <p className="text-gray-600">
              Learn to accept difficult emotions and thoughts without judgment
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Flower className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Meditation Techniques</h3>
            <p className="text-gray-600">
              Guided meditation practices tailored to your therapeutic needs
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Star className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Stress Reduction</h3>
            <p className="text-gray-600">
              Proven techniques for reducing stress and anxiety through mindfulness
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Lightbulb className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Cognitive Flexibility</h3>
            <p className="text-gray-600">
              Develop a more flexible relationship with your thoughts and emotions
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Heart className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Self-Compassion</h3>
            <p className="text-gray-600">
              Cultivate kindness and understanding toward yourself and others
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-therapy-600 text-white rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-4">Begin Your Mindfulness Journey</h2>
          <p className="text-xl mb-6">
            Discover peace and clarity through mindfulness-based therapeutic practices
          </p>
          <button className="bg-white text-therapy-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Start Mindfulness Practice
          </button>
        </div>
      </div>
    </div>
  );
};

export default MindfulnessTherapy;