import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  BarChart3, 
  Calendar, 
  Target, 
  Brain,
  Zap,
  Clock,
  Award
} from 'lucide-react';

const AnalyticsPage = () => {
  // Mock analytics data
  const overallMetrics = {
    therapyProgress: 78,
    goalCompletion: 65,
    moodImprovement: 23,
    sessionFrequency: 2.4
  };

  const weeklyData = [
    { day: 'Mon', mood: 7, sessions: 1, goals: 3 },
    { day: 'Tue', mood: 6, sessions: 0, goals: 2 },
    { day: 'Wed', mood: 8, sessions: 1, goals: 4 },
    { day: 'Thu', mood: 7, sessions: 0, goals: 3 },
    { day: 'Fri', mood: 8, sessions: 1, goals: 5 },
    { day: 'Sat', mood: 9, sessions: 0, goals: 2 },
    { day: 'Sun', mood: 8, sessions: 0, goals: 1 }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-therapy-600 to-harmony-600 bg-clip-text text-transparent">
          Advanced Analytics
        </h1>
        <p className="text-muted-foreground mt-1">
          Comprehensive insights into your mental health journey and progress
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-therapy-200 bg-gradient-to-r from-therapy-25 to-therapy-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-therapy-700">Therapy Progress</p>
                <p className="text-2xl font-bold text-therapy-800">{overallMetrics.therapyProgress}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-therapy-600" />
            </div>
            <Progress value={overallMetrics.therapyProgress} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card className="border-harmony-200 bg-gradient-to-r from-harmony-25 to-harmony-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-harmony-700">Goal Completion</p>
                <p className="text-2xl font-bold text-harmony-800">{overallMetrics.goalCompletion}%</p>
              </div>
              <Target className="h-8 w-8 text-harmony-600" />
            </div>
            <Progress value={overallMetrics.goalCompletion} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card className="border-flow-200 bg-gradient-to-r from-flow-25 to-flow-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-flow-700">Mood Improvement</p>
                <p className="text-2xl font-bold text-flow-800">+{overallMetrics.moodImprovement}%</p>
              </div>
              <Brain className="h-8 w-8 text-flow-600" />
            </div>
            <div className="mt-2 text-xs text-flow-600">vs last month</div>
          </CardContent>
        </Card>
        
        <Card className="border-calm-200 bg-gradient-to-r from-calm-25 to-calm-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-calm-700">Session Frequency</p>
                <p className="text-2xl font-bold text-calm-800">{overallMetrics.sessionFrequency}/week</p>
              </div>
              <Calendar className="h-8 w-8 text-calm-600" />
            </div>
            <div className="mt-2 text-xs text-calm-600">optimal range</div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-therapy-600" />
            Weekly Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-4">
            {weeklyData.map((day) => (
              <div key={day.day} className="text-center">
                <p className="text-sm font-medium mb-2">{day.day}</p>
                <div className="space-y-2">
                  <div className="bg-therapy-100 rounded p-2">
                    <p className="text-xs text-therapy-700">Mood</p>
                    <p className="text-lg font-bold text-therapy-800">{day.mood}</p>
                  </div>
                  <div className="bg-harmony-100 rounded p-2">
                    <p className="text-xs text-harmony-700">Sessions</p>
                    <p className="text-lg font-bold text-harmony-800">{day.sessions}</p>
                  </div>
                  <div className="bg-flow-100 rounded p-2">
                    <p className="text-xs text-flow-700">Goals</p>
                    <p className="text-lg font-bold text-flow-800">{day.goals}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights & Recommendations */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2 text-therapy-600" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-therapy-500 pl-4">
                <h3 className="font-semibold">Peak Performance Pattern</h3>
                <p className="text-sm text-muted-foreground">
                  Your mood scores are consistently highest on Fridays and Saturdays.
                </p>
                <Badge variant="outline" className="mt-1">High Confidence</Badge>
              </div>
              <div className="border-l-4 border-harmony-500 pl-4">
                <h3 className="font-semibold">Session Timing Optimization</h3>
                <p className="text-sm text-muted-foreground">
                  Morning sessions show 15% better engagement compared to afternoon.
                </p>
                <Badge variant="outline" className="mt-1">Medium Confidence</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2 text-therapy-600" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-therapy-500 rounded-full flex items-center justify-center">
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium">7-Day Streak</p>
                  <p className="text-sm text-muted-foreground">Daily mood tracking</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-harmony-500 rounded-full flex items-center justify-center">
                  <Target className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium">Goal Milestone</p>
                  <p className="text-sm text-muted-foreground">Completed 10 therapy goals</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-flow-500 rounded-full flex items-center justify-center">
                  <Brain className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium">Insight Unlocked</p>
                  <p className="text-sm text-muted-foreground">Discovered anxiety trigger pattern</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-4">
        <Button>
          <BarChart3 className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
        <Button variant="outline">
          <Zap className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>
    </div>
  );
};

export default AnalyticsPage;