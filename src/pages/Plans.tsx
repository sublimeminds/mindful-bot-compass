
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PricingSection from '@/components/PricingSection';

const Plans = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-therapy-900 mb-4">Choose Your Plan</h1>
          <p className="text-xl text-therapy-600 max-w-2xl mx-auto">
            Select the perfect plan for your mental wellness journey. Upgrade or downgrade at any time.
          </p>
        </div>
        <PricingSection />
      </div>
      <Footer />
    </div>
  );
};

export default Plans;
