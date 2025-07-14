
import React from 'react';
import { useSafeSEO } from '@/hooks/useSafeSEO';
import EnhancedPricingPage from '@/components/pricing/EnhancedPricingPage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Pricing = () => {
  useSafeSEO({
    title: 'Pricing Plans - TherapySync AI Platform',
    description: 'Choose from Free, Premium, or Professional plans. Affordable AI therapy with voice technology, crisis support, and personalized care. Save up to 35% with yearly billing.',
    keywords: 'AI therapy pricing, mental health plans, therapy subscription, crisis support, free therapy, yearly discount'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-white to-calm-50">
      <Header />
      <EnhancedPricingPage />
      <Footer />
    </div>
  );
};

export default Pricing;
