import React from 'react';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';

const LandingPage = () => {
  console.log('🔍 LandingPage: Component rendering');
  
  return (
    <SafeComponentWrapper name="LandingPage">
      <div className="min-h-screen bg-gradient-to-br from-therapy-600/90 via-harmony-500/80 to-calm-600/90">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-6">Welcome to TherapySync</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Connect with qualified therapists and mental health professionals 
              through our comprehensive platform designed for your well-being.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-therapy-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Get Started
              </button>
              <button className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </SafeComponentWrapper>
  );
};

export default LandingPage;