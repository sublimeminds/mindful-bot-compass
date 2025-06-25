
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayout from './dashboard/DashboardLayout';

const UserDashboard = () => {
  const { user, loading } = useAuth();

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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-therapy-900 mb-4">Please Sign In</h1>
          <p className="text-therapy-600 mb-6">You need to be signed in to access the dashboard.</p>
          <a 
            href="/auth" 
            className="inline-block bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return <DashboardLayout />;
};

export default UserDashboard;
