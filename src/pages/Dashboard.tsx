
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';
import { useSafeNavigation } from '@/components/bulletproof/SafeRouter';
import BulletproofDashboardLayout from '@/components/dashboard/BulletproofDashboardLayout';
import AuthRequiredPage from '@/components/auth/AuthRequiredPage';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const { navigate } = useSafeNavigation();

  if (loading) {
    return (
      <SafeComponentWrapper name="DashboardLoader">
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-foreground font-medium">Loading Dashboard...</p>
          </div>
        </div>
      </SafeComponentWrapper>
    );
  }

  if (!user) {
    return <AuthRequiredPage 
      title="Access Your Dashboard" 
      description="Sign in to view your personalized therapy dashboard, track progress, and access AI-powered mental wellness tools."
      redirectTo="/dashboard"
    />;
  }

  return <BulletproofDashboardLayout />;
};

export default Dashboard;
