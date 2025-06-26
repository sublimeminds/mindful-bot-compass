
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayoutWithSidebar from '@/components/dashboard/DashboardLayoutWithSidebar';
import EnhancedIntegrationsHub from '@/components/integrations/EnhancedIntegrationsHub';

const EnhancedIntegrations = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
          <p className="text-therapy-600 font-medium">Loading Enhanced Integrations...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayoutWithSidebar>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Enhanced Integrations</h1>
          <p className="text-gray-600 mt-2">Advanced integration management with real-time monitoring and webhook support</p>
        </div>
        <EnhancedIntegrationsHub />
      </div>
    </DashboardLayoutWithSidebar>
  );
};

export default EnhancedIntegrations;
