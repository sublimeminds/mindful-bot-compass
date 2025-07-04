import React from 'react';
import EnhancedHeader from '@/components/navigation/EnhancedHeader';
import Footer from '@/components/Footer';
import SafePricingSection from '@/components/landing/SafePricingSection';
import { useSimpleSEO } from '@/hooks/useSimpleSEO';

const Pricing = () => {
  useSimpleSEO({
    title: 'Pricing Plans - TherapySync AI Platform',
    description: 'Choose from Free, Premium, or Professional plans. Affordable AI therapy with voice technology, crisis support, and personalized care.',
    keywords: 'AI therapy pricing, mental health plans, therapy subscription, crisis support, free therapy'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-white to-calm-50">
      <EnhancedHeader />
      <SafePricingSection />
      <Footer />
    </div>
  );
};

export default Pricing;