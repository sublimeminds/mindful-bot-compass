import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import NotificationTester from '@/components/notifications/NotificationTester';

const NotificationCenterPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-therapy-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold therapy-text-gradient mb-2">
            Notification Center
          </h1>
          <p className="text-gray-600">
            Stay up to date with your therapy journey and important alerts
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <NotificationCenter />
          </div>
          <div>
            <NotificationTester />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenterPage;