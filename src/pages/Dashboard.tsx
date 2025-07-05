
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import SimpleDashboard from '@/components/dashboard/SimpleDashboard';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';
import { useSafeNavigation } from '@/components/bulletproof/SafeRouter';

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
    return (
      <SafeComponentWrapper name="DashboardAuthRequired">
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
          <div className="text-center max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-6">Please sign in to access your dashboard.</p>
            <button 
              onClick={() => navigate('/auth')}
              className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              Sign In
            </button>
          </div>
        </div>
      </SafeComponentWrapper>
    );
  }

  return <SimpleDashboard />;
};

export default Dashboard;
