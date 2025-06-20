
import React from 'react';
import { useAuth } from '@/components/SimpleAuthProvider';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import StatsCounter from '@/components/landing/StatsCounter';
import CTASection from '@/components/landing/CTASection';
import ComprehensivePricingSection from '@/components/landing/ComprehensivePricingSection';
import ComplianceSection from '@/components/landing/ComplianceSection';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to dashboard
  React.useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
          <p className="text-therapy-600 font-medium">Loading TherapySync...</p>
        </div>
      </div>
    );
  }

  // Show comprehensive landing page for unauthenticated users
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <StatsCounter />
      <div id="how-it-works">
        <HowItWorksSection />
      </div>
      <div id="features">
        <FeaturesSection />
      </div>
      <div id="pricing">
        <ComprehensivePricingSection />
      </div>
      <ComplianceSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
