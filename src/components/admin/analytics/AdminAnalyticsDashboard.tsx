
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Users, TrendingUp, Brain } from 'lucide-react';
import UserEngagementMetrics from './UserEngagementMetrics';
import SessionStatistics from './SessionStatistics';
import TherapistPerformanceData from './TherapistPerformanceData';
import AnalyticsOverview from './AnalyticsOverview';

const AdminAnalyticsDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BarChart3 className="h-6 w-6 text-green-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
            <p className="text-gray-400">Monitor user engagement, sessions, and therapist performance</p>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <AnalyticsOverview />

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="engagement" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800">
          <TabsTrigger value="engagement" className="data-[state=active]:bg-green-600">
            <Users className="h-4 w-4 mr-2" />
            User Engagement
          </TabsTrigger>
          <TabsTrigger value="sessions" className="data-[state=active]:bg-green-600">
            <TrendingUp className="h-4 w-4 mr-2" />
            Session Statistics
          </TabsTrigger>
          <TabsTrigger value="therapists" className="data-[state=active]:bg-green-600">
            <Brain className="h-4 w-4 mr-2" />
            Therapist Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="engagement">
          <UserEngagementMetrics />
        </TabsContent>

        <TabsContent value="sessions">
          <SessionStatistics />
        </TabsContent>

        <TabsContent value="therapists">
          <TherapistPerformanceData />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalyticsDashboard;
