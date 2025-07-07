import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle, Target, TrendingUp } from 'lucide-react';

const WeeklyView = () => {
  const weeklyGoals = [
    {
      goal: "Daily Mindfulness Practice",
      progress: 5,
      target: 7,
      streak: 5,
      status: "on-track"
    },
    {
      goal: "Exercise 3 times",
      progress: 2,
      target: 3,
      streak: 2,
      status: "on-track"
    },
    {
      goal: "Journal Writing",
      progress: 6,
      target: 7,
      streak: 6,
      status: "ahead"
    },
    {
      goal: "Sleep 8 hours",
      progress: 3,
      target: 7,
      streak: 1,
      status: "behind"
    }
  ];

  const dailyProgress = [
    { day: "Mon", completed: 3, total: 4 },
    { day: "Tue", completed: 4, total: 4 },
    { day: "Wed", completed: 3, total: 4 },
    { day: "Thu", completed: 4, total: 4 },
    { day: "Fri", completed: 2, total: 4 },
    { day: "Sat", completed: 3, total: 4 },
    { day: "Sun", completed: 0, total: 4 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ahead': return 'bg-green-100 text-green-800';
      case 'on-track': return 'bg-blue-100 text-blue-800';
      case 'behind': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold therapy-text-gradient">Weekly View</h1>
          <p className="text-muted-foreground">Your goals and progress for this week</p>
        </div>
        <Button className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600">
          <Calendar className="w-4 h-4 mr-2" />
          Plan Next Week
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-therapy-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-therapy-600">4</p>
            <p className="text-sm text-muted-foreground">Active Goals</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-calm-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-calm-600">67%</p>
            <p className="text-sm text-muted-foreground">Completion Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-harmony-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-harmony-600">16</p>
            <p className="text-sm text-muted-foreground">Total Actions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 text-balance-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-balance-600">5</p>
            <p className="text-sm text-muted-foreground">Best Streak</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Goals Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyGoals.map((goal, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{goal.goal}</span>
                    <Badge className={getStatusColor(goal.status)}>
                      {goal.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm">
                      Progress: {goal.progress}/{goal.target} days
                    </div>
                    <div className="text-sm">
                      Streak: {goal.streak} days
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-therapy-500 h-2 rounded-full" 
                      style={{width: `${(goal.progress / goal.target) * 100}%`}}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Progress Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dailyProgress.map((day, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium w-8">{day.day}</span>
                    <div className="w-full bg-gray-200 rounded-full h-2 min-w-[100px]">
                      <div 
                        className="bg-calm-500 h-2 rounded-full" 
                        style={{width: `${(day.completed / day.total) * 100}%`}}
                      ></div>
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    {day.completed}/{day.total}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Week Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-therapy-50 rounded-lg">
              <p className="text-2xl font-bold text-therapy-600">19</p>
              <p className="text-sm text-muted-foreground">Goals Completed</p>
            </div>
            <div className="p-4 bg-calm-50 rounded-lg">
              <p className="text-2xl font-bold text-calm-600">+15%</p>
              <p className="text-sm text-muted-foreground">vs Last Week</p>
            </div>
            <div className="p-4 bg-harmony-50 rounded-lg">
              <p className="text-2xl font-bold text-harmony-600">2</p>
              <p className="text-sm text-muted-foreground">New Habits Formed</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeeklyView;