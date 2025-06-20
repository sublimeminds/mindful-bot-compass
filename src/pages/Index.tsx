
import React from 'react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import SimpleLandingPage from '@/components/SimpleLandingPage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import PricingSection from '@/components/PricingSection';

const Index = () => {
  const { user, loading } = useSimpleApp();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is authenticated, show a simple dashboard message for now
  if (user) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto py-10">
          <h1 className="text-3xl font-bold mb-4">Welcome to your Dashboard</h1>
          <p>You are logged in as: {user.email}</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Show landing page for non-authenticated users
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <Footer />
    </div>
  );
};

export default Index;
