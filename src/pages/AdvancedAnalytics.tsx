
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayoutWithSidebar from '@/components/dashboard/DashboardLayoutWithSidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdvancedPerformanceMonitor from '@/components/analytics/AdvancedPerformanceMonitor';
import UserBehaviorDashboard from '@/components/analytics/UserBehaviorDashboard';
import BusinessIntelligenceDashboard from '@/components/analytics/BusinessIntelligenceDashboard';
import { BarChart3, Users, Monitor, TrendingUp } from 'lucide-react';

const AdvancedAnalytics = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
          <p className="text-therapy-600 font-medium">Loading Advanced Analytics...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics & Performance</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive analytics dashboard with performance monitoring, user behavior insights, and business intelligence
          </p>
        </div>

        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="performance" className="flex items-center space-x-2">
              <Monitor className="h-4 w-4" />
              <span>Performance Monitor</span>
            </TabsTrigger>
            <TabsTrigger value="behavior" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>User Behavior</span>
            </TabsTrigger>
            <TabsTrigger value="business" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Business Intelligence</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="performance">
            <AdvancedPerformanceMonitor />
          </TabsContent>

          <TabsContent value="behavior">
            <UserBehaviorDashboard />
          </TabsContent>

          <TabsContent value="business">
            <BusinessIntelligenceDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayoutWithSidebar>
  );
};

export default AdvancedAnalytics;
