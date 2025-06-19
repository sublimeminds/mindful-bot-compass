
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import PricingSection from '@/components/PricingSection';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const Index = () => {
  // Safe auth context access
  let user = null;
  let authContextAvailable = false;
  
  try {
    const { useAuth } = require('@/contexts/AuthContext');
    const auth = useAuth();
    user = auth.user;
    authContextAvailable = true;
  } catch (error) {
    // Context not available, continue without user
    console.debug('AuthContext not available in Index, showing public view');
  }

  return (
    <>
      <Header />
      <div className="min-h-screen">
        {authContextAvailable && user ? (
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
