import React from 'react';
import { MessageSquare, Heart, Users, Shield, Clock, Star } from 'lucide-react';

const AITherapyChat = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <MessageSquare className="h-16 w-16 text-therapy-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            AI Therapy Chat
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Personalized therapy conversations with evidence-based treatment approaches
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Heart className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Empathetic Conversations</h3>
            <p className="text-gray-600">
              Experience compassionate, understanding dialogue that feels natural and supportive
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Shield className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Evidence-Based</h3>
            <p className="text-gray-600">
              Built on proven therapeutic frameworks including CBT, DBT, and mindfulness approaches
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Clock className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Availability</h3>
            <p className="text-gray-600">
              Access therapeutic support whenever you need it, day or night
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Users className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Personalized Approach</h3>
            <p className="text-gray-600">
              Tailored conversations that adapt to your unique needs and therapeutic goals
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Star className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Progress Tracking</h3>
            <p className="text-gray-600">
              Monitor your therapeutic journey with insights and progress indicators
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <MessageSquare className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Natural Language</h3>
            <p className="text-gray-600">
              Communicate naturally without structured forms or rigid question formats
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-therapy-600 text-white rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-4">Start Your AI Therapy Chat Journey</h2>
          <p className="text-xl mb-6">
            Begin meaningful conversations that support your mental health and well-being
          </p>
          <button className="bg-white text-therapy-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Start Chatting Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default AITherapyChat;