
import React from 'react';
import { useApp } from '@/components/MinimalAppProvider';
import LandingPage from '@/components/LandingPage';
import DashboardPage from '@/pages/DashboardPage';

const Index = () => {
  const { user, loading } = useApp();

  console.log('Index page - user:', user, 'loading:', loading);

  // Show loading while checking authentication
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

  // If user is authenticated, show dashboard
  if (user) {
    console.log('Rendering DashboardPage for authenticated user');
    return <DashboardPage />;
  }

  // Show landing page for non-authenticated users
  console.log('Rendering LandingPage for non-authenticated user');
  return <LandingPage />;
};

export default Index;
