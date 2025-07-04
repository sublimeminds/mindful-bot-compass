import React, { useEffect, useState } from 'react';
import DashboardLayoutWithSidebar from '@/components/dashboard/DashboardLayoutWithSidebar';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Safe auth check without hooks
    const checkAuth = async () => {
      try {
        const session = localStorage.getItem('sb-dbwrbjmraodegffupnx-auth-token');
        if (!session) {
          window.location.href = '/auth';
          return;
        }
        setUser({ id: 'user' }); // Mock user for now
      } catch (error) {
        console.error('Auth check failed:', error);
        window.location.href = '/auth';
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
          <p className="text-therapy-600 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  return <DashboardLayoutWithSidebar />;
};

export default Dashboard;