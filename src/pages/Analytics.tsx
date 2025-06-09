
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, TrendingUp, Calendar, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSessionStats } from "@/hooks/useSessionStats";
import MoodChart from "@/components/analytics/MoodChart";
import ProgressReport from "@/components/analytics/ProgressReport";
import GoalProgress from "@/components/analytics/GoalProgress";
import SessionInsights from "@/components/analytics/SessionInsights";

const Analytics = () => {
  const navigate = useNavigate();
  const { stats, isLoading } = useSessionStats();
  const [timeRange, setTimeRange] = useState<string>('month');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Progress Analytics</h1>
              <p className="text-muted-foreground">Track your therapy journey and progress</p>
            </div>
          </div>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">Last 3 Months</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Session Insights Overview */}
        <SessionInsights />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Charts Section */}
          <div className="lg:col-span-2 space-y-6">
            <MoodChart timeRange={timeRange} />
            <ProgressReport timeRange={timeRange} />
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <GoalProgress />
            
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Sessions</span>
                  <span className="font-semibold">{stats.totalSessions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Avg Mood Improvement</span>
                  <span className="font-semibold">
                    {stats.averageMoodImprovement > 0 ? '+' : ''}{stats.averageMoodImprovement.toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">This Week</span>
                  <span className="font-semibold">{stats.weeklyProgress}/{stats.weeklyGoal}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
