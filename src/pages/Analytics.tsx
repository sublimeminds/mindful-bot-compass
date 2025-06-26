
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayoutWithSidebar from '@/components/dashboard/DashboardLayoutWithSidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ComprehensiveAnalyticsDashboard from '@/components/analytics/ComprehensiveAnalyticsDashboard';
import UserBehaviorInsights from '@/components/analytics/UserBehaviorInsights';
import { BarChart3, Brain, TrendingUp, User } from 'lucide-react';

const Analytics = () => {
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
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive analysis of your mental wellness journey with AI-powered insights
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="behavior" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Behavior Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="predictions" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span>AI Predictions</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <ComprehensiveAnalyticsDashboard />
          </TabsContent>

          <TabsContent value="behavior">
            <UserBehaviorInsights />
          </TabsContent>

          <TabsContent value="predictions">
            <div className="text-center py-12">
              <Brain className="h-16 w-16 mx-auto mb-4 text-therapy-600" />
              <h3 className="text-xl font-semibold mb-2">AI Predictions Coming Soon</h3>
              <p className="text-muted-foreground">
                Advanced predictive analytics for mental health trends and personalized recommendations
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayoutWithSidebar>
  );
};

export default Analytics;
