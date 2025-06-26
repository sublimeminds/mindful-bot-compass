
import React from 'react';
import DashboardLayoutWithSidebar from '@/components/dashboard/DashboardLayoutWithSidebar';
import AdvancedAnalyticsDashboard from '@/components/analytics/AdvancedAnalyticsDashboard';
import PredictiveAnalytics from '@/components/analytics/PredictiveAnalytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Brain } from 'lucide-react';

const Analytics = () => {
  return (
    <DashboardLayoutWithSidebar>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="mr-3 h-8 w-8 text-therapy-600" />
            Analytics & Intelligence
          </h1>
          <p className="text-gray-600 mt-2">Advanced analytics and AI-powered insights for better outcomes</p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dashboard" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics Dashboard
            </TabsTrigger>
            <TabsTrigger value="predictive" className="flex items-center">
              <Brain className="h-4 w-4 mr-2" />
              Predictive Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <AdvancedAnalyticsDashboard />
          </TabsContent>

          <TabsContent value="predictive">
            <PredictiveAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayoutWithSidebar>
  );
};

export default Analytics;
