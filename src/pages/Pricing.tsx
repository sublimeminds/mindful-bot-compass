
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ComprehensivePricingSection from '@/components/landing/ComprehensivePricingSection';
import { useSimpleSEO } from '@/hooks/useSimpleSEO';

const Pricing = () => {
  useSimpleSEO({
    title: 'Pricing Plans - TherapySync AI Platform',
    description: 'Choose from Free, Premium, or Professional plans. Affordable AI therapy with voice technology, crisis support, and personalized care.',
    keywords: 'AI therapy pricing, mental health plans, therapy subscription, crisis support, free therapy'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-white to-calm-50">
      <Header />
      <ComprehensivePricingSection />
      <Footer />
    </div>
  );
};

export default Pricing;
