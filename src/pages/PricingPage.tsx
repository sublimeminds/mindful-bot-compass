
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PricingSection from '@/components/PricingSection';
import { useSEO } from '@/hooks/useSEO';

const PricingPage = () => {
  useSEO({
    title: 'Pricing - TherapySync',
    description: 'Choose the perfect plan for your mental wellness journey with TherapySync\'s AI-powered therapy platform.',
    keywords: 'therapy pricing, mental health plans, AI therapy cost'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50/30 to-calm-50/30">
      <Header />
      <main className="pt-20">
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;
