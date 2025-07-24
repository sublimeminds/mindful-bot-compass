import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Users, Shield } from 'lucide-react';

const AIChat = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-therapy-500 to-therapy-600 rounded-xl p-4">
              <MessageSquare className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Therapy Chat
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Engage in personalized therapy conversations with advanced AI therapists
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <MessageSquare className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">24/7 Availability</h3>
            <p className="text-gray-600">Access therapy support whenever you need it, day or night</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <Users className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Multiple Approaches</h3>
            <p className="text-gray-600">Choose from various therapeutic approaches and personality types</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <Shield className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Privacy First</h3>
            <p className="text-gray-600">Your conversations are secure and completely confidential</p>
          </div>
        </div>

        <div className="text-center">
          <Button size="lg" className="bg-therapy-600 hover:bg-therapy-700">
            Start Chatting
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;