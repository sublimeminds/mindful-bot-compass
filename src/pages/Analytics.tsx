import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Calendar, Target, Brain } from 'lucide-react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { analyticsService, AnalyticsData } from '@/services/analyticsService';
import SessionInsights from '@/components/analytics/SessionInsights';
import MoodChart from '@/components/analytics/MoodChart';
import GoalProgress from '@/components/analytics/GoalProgress';
import ProgressReport from '@/components/analytics/ProgressReport';

const Analytics = () => {
  const { user } = useSimpleApp();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [dateRange, setDateRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalyticsData();
  }, [user, dateRange]);

  const loadAnalyticsData = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await analyticsService.getAnalyticsData(user.id, dateRange);
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 animate-spin" />
              <p>Loading analytics data...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardContent className="p-6">
            <p className="text-red-500">Error: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardContent className="p-6">
            <p>No analytics data available.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-therapy-500" />
              Analytics Dashboard
            </CardTitle>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SessionInsights sessionStats={analyticsData.sessionStats} insights={analyticsData.insights} patterns={analyticsData.patterns} />
            <MoodChart moodTrends={analyticsData.moodTrends} moodEntries={analyticsData.moodEntries} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <GoalProgress goalProgress={analyticsData.goalProgress} />
          </div>
        </CardContent>
      </Card>
      <ProgressReport analyticsData={analyticsData} dateRange={dateRange} />
    </div>
  );
};

export default Analytics;
