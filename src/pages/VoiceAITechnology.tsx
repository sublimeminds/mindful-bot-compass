import React from 'react';
import { Mic, Headphones, Globe, Heart, Shield, Zap } from 'lucide-react';

const VoiceAITechnology = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Mic className="h-16 w-16 text-therapy-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Voice AI Technology
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Natural voice conversations in 29 languages with emotion detection and analysis
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Globe className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">29 Languages</h3>
            <p className="text-gray-600">
              Communicate in your native language with natural voice recognition and response
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Heart className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Emotion Detection</h3>
            <p className="text-gray-600">
              Advanced AI analyzes vocal patterns to understand emotional states and responses
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Headphones className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Natural Conversations</h3>
            <p className="text-gray-600">
              Engage in fluid, natural-sounding conversations that feel authentic and supportive
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Shield className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Privacy First</h3>
            <p className="text-gray-600">
              Your voice data is encrypted and processed with the highest security standards
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Zap className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-Time Processing</h3>
            <p className="text-gray-600">
              Instant voice processing and response for seamless therapeutic interactions
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Mic className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Voice Biometrics</h3>
            <p className="text-gray-600">
              Analyze vocal patterns to gain insights into stress levels and emotional well-being
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-therapy-600 text-white rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-4">Experience Voice AI Technology</h2>
          <p className="text-xl mb-6">
            Connect with our advanced voice AI in your preferred language
          </p>
          <button className="bg-white text-therapy-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Try Voice AI Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceAITechnology;