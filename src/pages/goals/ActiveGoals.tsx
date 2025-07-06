import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Target, Plus, TrendingUp, Calendar, CheckCircle } from 'lucide-react';

const ActiveGoals = () => {
  const goals = [
    {
      id: 1,
      title: "Daily Mindfulness Practice",
      description: "Practice mindfulness meditation for 10 minutes each day",
      progress: 85,
      target: 30,
      current: 25,
      unit: "days",
      deadline: "2024-02-15",
      category: "Mindfulness",
      priority: "high"
    },
    {
      id: 2,
      title: "Reduce Anxiety Levels",
      description: "Implement CBT techniques to manage anxiety symptoms",
      progress: 62,
      target: 100,
      current: 62,
      unit: "sessions",
      deadline: "2024-03-01",
      category: "Mental Health",
      priority: "high"
    },
    {
      id: 3,
      title: "Improve Sleep Quality",
      description: "Establish healthy sleep routine and track sleep patterns",
      progress: 45,
      target: 8,
      current: 3.6,
      unit: "hours avg",
      deadline: "2024-02-28",
      category: "Wellness",
      priority: "medium"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold therapy-text-gradient">Active Goals</h1>
          <p className="text-muted-foreground">Track your current wellness and therapy goals</p>
        </div>
        <Button className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600">
          <Plus className="w-4 h-4 mr-2" />
          New Goal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-therapy-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-therapy-600">{goals.length}</p>
            <p className="text-sm text-muted-foreground">Active Goals</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-calm-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-calm-600">64%</p>
            <p className="text-sm text-muted-foreground">Avg Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-harmony-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-harmony-600">7</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 text-balance-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-balance-600">12</p>
            <p className="text-sm text-muted-foreground">Days Left</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {goals.map((goal) => (
          <Card key={goal.id} className="border-l-4 border-therapy-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{goal.title}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge className={getPriorityColor(goal.priority)}>
                    {goal.priority.toUpperCase()}
                  </Badge>
                  <Badge variant="outline">{goal.category}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{goal.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-therapy-600">{goal.current}</p>
                    <p className="text-xs text-muted-foreground">of {goal.target} {goal.unit}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Deadline</p>
                  <p className="font-medium">{goal.deadline}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm font-bold">{goal.progress}%</span>
                </div>
                <Progress value={goal.progress} className="h-3" />
              </div>

              <div className="flex space-x-2">
                <Button size="sm" className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600">
                  Update Progress
                </Button>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
                <Button size="sm" variant="outline">
                  Edit Goal
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ActiveGoals;