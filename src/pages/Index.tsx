
import React from 'react';
import { useAuth } from '@/components/SimpleAuthProvider';
import LandingPage from '@/components/LandingPage';
import DashboardPage from '@/pages/DashboardPage';

const Index = () => {
  const { user, loading } = useAuth();

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

  if (user) {
    return <DashboardPage />;
  }

  return <LandingPage />;
};

export default Index;
