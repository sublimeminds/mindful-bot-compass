
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayoutWithSidebar from '@/components/dashboard/DashboardLayoutWithSidebar';
import AnalyticsIntegration from '@/components/integrations/AnalyticsIntegration';

const IntegrationsAnalytics = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
          <p className="text-therapy-600 font-medium">Loading Analytics...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayoutWithSidebar>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-therapy-900">Integration Analytics</h1>
          <p className="text-therapy-600 mt-2">
            Monitor your integration usage and performance metrics
          </p>
        </div>
        <AnalyticsIntegration />
      </div>
    </DashboardLayoutWithSidebar>
  );
};

export default IntegrationsAnalytics;
