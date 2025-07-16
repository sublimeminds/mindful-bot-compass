import React from 'react';
import { Globe, Heart, Users, Star, Shield, Lightbulb } from 'lucide-react';

const CulturalAI = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Globe className="h-16 w-16 text-therapy-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Cultural AI
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Culturally sensitive AI trained to understand diverse backgrounds and contexts
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Users className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Cultural Sensitivity</h3>
            <p className="text-gray-600">
              AI trained on diverse cultural perspectives and therapeutic approaches
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Heart className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Inclusive Care</h3>
            <p className="text-gray-600">
              Therapeutic support that respects and incorporates your cultural background
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Lightbulb className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Contextual Understanding</h3>
            <p className="text-gray-600">
              Deep understanding of how cultural context impacts mental health and healing
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Star className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Personalized Approach</h3>
            <p className="text-gray-600">
              Tailored therapeutic strategies that align with your cultural values and beliefs
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Shield className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Safe Space</h3>
            <p className="text-gray-600">
              Create a comfortable environment where cultural identity is celebrated and respected
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Globe className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Global Perspectives</h3>
            <p className="text-gray-600">
              Incorporating healing traditions and wisdom from cultures around the world
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-therapy-600 text-white rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-4">Experience Culturally Sensitive AI</h2>
          <p className="text-xl mb-6">
            Connect with AI that understands and respects your cultural background
          </p>
          <button className="bg-white text-therapy-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Start Your Journey
          </button>
        </div>
      </div>
    </div>
  );
};

export default CulturalAI;