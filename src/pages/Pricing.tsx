
import React from 'react';
import { useSafeSEO } from '@/hooks/useSafeSEO';
import PageLayout from '@/components/layout/PageLayout';
import EnhancedPricingPage from '@/components/pricing/EnhancedPricingPage';

const Pricing = () => {
  useSafeSEO({
    title: 'Pricing Plans - TherapySync AI Platform',
    description: 'Choose from Free, Premium, or Professional plans. Affordable AI therapy with voice technology, crisis support, and personalized care. Save up to 35% with yearly billing.',
    keywords: 'AI therapy pricing, mental health plans, therapy subscription, crisis support, free therapy, yearly discount'
  });

  return (
    <PageLayout>
      <EnhancedPricingPage />
    </PageLayout>
  );
};

export default Pricing;
