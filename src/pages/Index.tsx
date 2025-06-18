
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import PricingSection from '@/components/PricingSection';
import UserDashboard from '@/components/UserDashboard';

const Index = () => {
  const { user } = useAuth();

  return (
    <>
      <Header />
      <div className="min-h-screen">
        {user ? (
          <UserDashboard />
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
