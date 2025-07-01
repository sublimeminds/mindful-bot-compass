
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FeaturesSection from '@/components/FeaturesSection';

const FeaturesOverviewPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50/30 to-calm-50/30">
      <Header />
      <main className="pt-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 therapy-text-gradient">
            All Features
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the comprehensive suite of AI-powered mental health tools designed to support your wellness journey.
          </p>
        </div>
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
};

export default FeaturesOverviewPage;
