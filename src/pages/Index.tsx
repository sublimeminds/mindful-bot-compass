
import React from 'react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import LandingPage from '@/components/LandingPage';
import DashboardPage from '@/pages/DashboardPage';

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

  // If user is authenticated, show dashboard
  if (user) {
    return <DashboardPage />;
  }

  // Show landing page for non-authenticated users
  return <LandingPage />;
};

export default Index;
