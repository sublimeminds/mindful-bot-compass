
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HowItWorksSection from '@/components/landing/HowItWorksSection';

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50/30 to-calm-50/30">
      <Header />
      <main className="pt-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 therapy-text-gradient">
            How It Works
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn how TherapySync's AI-powered platform provides personalized mental health support in just three simple steps.
          </p>
        </div>
        <HowItWorksSection />
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
