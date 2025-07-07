import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Repeat, TrendingUp, Calendar, CheckCircle } from 'lucide-react';

const HabitFormation = () => {
  const habits = [
    {
      id: 1,
      name: "Morning Meditation",
      streak: 23,
      target: 30,
      frequency: "Daily",
      status: "forming",
      completion: 77,
      lastCompleted: "Today"
    },
    {
      id: 2,
      name: "Evening Journal",
      streak: 45,
      target: 21,
      frequency: "Daily",
      status: "established",
      completion: 100,
      lastCompleted: "Today"
    },
    {
      id: 3,
      name: "Weekly Therapy",
      streak: 8,
      target: 12,
      frequency: "Weekly",
      status: "forming",
      completion: 67,
      lastCompleted: "2 days ago"
    },
    {
      id: 4,
      name: "Gratitude Practice",
      streak: 67,
      target: 21,
      frequency: "Daily",
      status: "established",
      completion: 100,
      lastCompleted: "Today"
    }
  ];

  const habitStages = [
    { stage: "Honeymoon", days: "1-7", description: "Initial enthusiasm and motivation" },
    { stage: "Disillusionment", days: "8-21", description: "Reality sets in, motivation decreases" },
    { stage: "Second Nature", days: "22-66", description: "Habit becomes more automatic" },
    { stage: "Established", days: "66+", description: "Habit is fully formed and automatic" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'established': return 'bg-green-100 text-green-800';
      case 'forming': return 'bg-blue-100 text-blue-800';
      case 'struggling': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold therapy-text-gradient">Habit Formation</h1>
          <p className="text-muted-foreground">Build lasting positive habits through consistent practice</p>
        </div>
        <Button className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600">
          <Repeat className="w-4 h-4 mr-2" />
          Add New Habit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Repeat className="w-8 h-8 text-therapy-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-therapy-600">4</p>
            <p className="text-sm text-muted-foreground">Active Habits</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-calm-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-calm-600">2</p>
            <p className="text-sm text-muted-foreground">Established</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-harmony-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-harmony-600">45</p>
            <p className="text-sm text-muted-foreground">Longest Streak</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 text-balance-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-balance-600">86%</p>
            <p className="text-sm text-muted-foreground">Success Rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {habits.map((habit) => (
          <Card key={habit.id} className="border-l-4 border-therapy-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{habit.name}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{habit.frequency}</Badge>
                  <Badge className={getStatusColor(habit.status)}>
                    {habit.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-therapy-50 rounded-lg">
                  <p className="text-2xl font-bold text-therapy-600">{habit.streak}</p>
                  <p className="text-xs text-muted-foreground">Current Streak</p>
                </div>
                <div className="p-3 bg-calm-50 rounded-lg">
                  <p className="text-2xl font-bold text-calm-600">{habit.target}</p>
                  <p className="text-xs text-muted-foreground">Formation Target</p>
                </div>
                <div className="p-3 bg-harmony-50 rounded-lg">
                  <p className="text-2xl font-bold text-harmony-600">{habit.completion}%</p>
                  <p className="text-xs text-muted-foreground">Progress</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Habit Formation Progress</span>
                <span className="text-sm font-bold">{Math.min(100, (habit.streak / habit.target) * 100).toFixed(0)}%</span>
              </div>
              <Progress value={Math.min(100, (habit.streak / habit.target) * 100)} className="h-3" />

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last completed: {habit.lastCompleted}</span>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    View History
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600">
                    Mark Complete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Habit Formation Stages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {habitStages.map((stage, index) => (
              <div key={index} className="p-4 border rounded-lg text-center">
                <div className="w-8 h-8 rounded-full bg-therapy-100 text-therapy-600 flex items-center justify-center mx-auto mb-2 font-bold">
                  {index + 1}
                </div>
                <p className="font-medium">{stage.stage}</p>
                <p className="text-sm text-therapy-600">{stage.days} days</p>
                <p className="text-xs text-muted-foreground mt-2">{stage.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HabitFormation;