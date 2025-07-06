import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Target, Calendar, BarChart3 } from 'lucide-react';

const GoalProgress = () => {
  const progressData = [
    {
      goal: "Daily Mindfulness Practice",
      current: 25,
      target: 30,
      unit: "days",
      progress: 83,
      trend: "+5%",
      category: "Mindfulness"
    },
    {
      goal: "Weekly Therapy Sessions",
      current: 12,
      target: 16,
      unit: "sessions",
      progress: 75,
      trend: "+12%",
      category: "Therapy"
    },
    {
      goal: "Sleep Quality Improvement",
      current: 7.2,
      target: 8.0,
      unit: "hours",
      progress: 90,
      trend: "+8%",
      category: "Wellness"
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold therapy-text-gradient">Goal Progress</h1>
          <p className="text-muted-foreground">Track your progress across all active goals</p>
        </div>
        <Badge variant="outline" className="text-therapy-600">
          <BarChart3 className="w-4 h-4 mr-1" />
          Progress Tracking
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-therapy-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-therapy-600">3</p>
            <p className="text-sm text-muted-foreground">Active Goals</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-calm-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-calm-600">83%</p>
            <p className="text-sm text-muted-foreground">Avg Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 text-harmony-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-harmony-600">12</p>
            <p className="text-sm text-muted-foreground">Days Remaining</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BarChart3 className="w-8 h-8 text-balance-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-balance-600">+8%</p>
            <p className="text-sm text-muted-foreground">Weekly Growth</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {progressData.map((item, index) => (
          <Card key={index} className="border-l-4 border-therapy-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{item.goal}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{item.category}</Badge>
                  <Badge className="bg-green-100 text-green-800">
                    {item.trend}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <p className="text-3xl font-bold text-therapy-600">{item.current}</p>
                  <p className="text-xs text-muted-foreground">of {item.target} {item.unit}</p>
                </div>
                <div className="flex-1 mx-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm font-bold">{item.progress}%</span>
                  </div>
                  <Progress value={item.progress} className="h-3" />
                </div>
                <div className="text-center">
                  <TrendingUp className="w-8 h-8 text-green-500 mx-auto" />
                  <p className="text-sm text-green-600">On Track</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Goals Completed</span>
                <span className="font-bold">2/3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Average Progress</span>
                <span className="font-bold">83%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Streak Days</span>
                <span className="font-bold">15</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Weekly Improvement</span>
                <span className="font-bold text-green-600">+8%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-therapy-50 rounded-lg">
                <p className="font-medium text-sm">Complete 30-day mindfulness streak</p>
                <p className="text-xs text-muted-foreground">5 days remaining</p>
              </div>
              <div className="p-3 bg-calm-50 rounded-lg">
                <p className="font-medium text-sm">Reach 16 therapy sessions</p>
                <p className="text-xs text-muted-foreground">4 sessions to go</p>
              </div>
              <div className="p-3 bg-harmony-50 rounded-lg">
                <p className="font-medium text-sm">Achieve 8-hour sleep average</p>
                <p className="text-xs text-muted-foreground">0.8 hours improvement needed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GoalProgress;