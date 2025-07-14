
import React from 'react';
import { useSafeSEO } from '@/hooks/useSafeSEO';
import PageLayout from '@/components/layout/PageLayout';
import EnhancedPricingSection from '@/components/pricing/EnhancedPricingSection';

const Pricing = () => {
  useSafeSEO({
    title: 'Pricing Plans - TherapySync AI Platform',
    description: 'Choose from Free, Premium, or Professional plans. Affordable AI therapy with voice technology, crisis support, and personalized care. Save up to 35% with yearly billing.',
    keywords: 'AI therapy pricing, mental health plans, therapy subscription, crisis support, free therapy, yearly discount'
  });

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-white to-calm-50">
        <EnhancedPricingSection />
      </div>
    </PageLayout>
  );
};

export default Pricing;
