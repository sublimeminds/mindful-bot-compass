
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FeaturesShowcase from '@/components/features/FeaturesShowcase';

const FeaturesOverview = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <FeaturesShowcase />
      <Footer />
    </div>
  );
};

export default FeaturesOverview;
