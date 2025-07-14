import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayoutWithSidebar from '@/components/dashboard/DashboardLayoutWithSidebar';
import EliteSystemDashboard from '@/components/elite/EliteSystemDashboard';
import AuthRequiredPage from '@/components/auth/AuthRequiredPage';

const EliteSystemPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
          <p className="text-therapy-600 font-medium">Loading Elite System...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthRequiredPage 
      title="Access Elite AI System" 
      description="Sign in to access the Elite AI therapy system with advanced cultural adaptation, intelligent routing, and adaptive learning capabilities."
      redirectTo="/elite-system"
    />;
  }

  return (
    <DashboardLayoutWithSidebar>
      <EliteSystemDashboard />
    </DashboardLayoutWithSidebar>
  );
};

export default EliteSystemPage;