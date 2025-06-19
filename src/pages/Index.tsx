
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import PricingSection from '@/components/PricingSection';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const Index = () => {
  // Try to access auth context safely
  let user = null;
  try {
    const { useAuth } = require('@/contexts/AuthContext');
    const auth = useAuth();
    user = auth.user;
  } catch (error) {
    // Context not available, continue without user
    console.warn('AuthContext not available in Index');
  }

  return (
    <>
      <Header />
      <div className="min-h-screen">
        {user ? (
          <DashboardLayout />
        ) : (
          <>
            <HeroSection />
            <FeaturesSection />
            <PricingSection />
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Index;
