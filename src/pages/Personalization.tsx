import React from 'react';
import { User, Settings, Palette } from 'lucide-react';

const Personalization = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-harmony-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-harmony-500 to-harmony-600 rounded-xl p-4">
              <User className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Personalization
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Customize your AI therapist personality and communication style
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <Settings className="h-8 w-8 text-harmony-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Custom Settings</h3>
            <p className="text-gray-600">Adjust AI behavior and response style to match your preferences</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <Palette className="h-8 w-8 text-harmony-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Personality Themes</h3>
            <p className="text-gray-600">Choose from various therapist personalities and communication styles</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <User className="h-8 w-8 text-harmony-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Personal Matching</h3>
            <p className="text-gray-600">AI learns your preferences and adapts over time</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Personalization;