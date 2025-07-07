import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Flag, CheckCircle, Clock, Star } from 'lucide-react';

const MilestoneTracker = () => {
  const milestones = [
    {
      id: 1,
      title: "30-Day Mindfulness Streak",
      description: "Complete mindfulness practice for 30 consecutive days",
      progress: 25,
      target: 30,
      dueDate: "2024-02-15",
      status: "active",
      category: "Mindfulness",
      reward: "Meditation Badge"
    },
    {
      id: 2,
      title: "First Month Goals Complete",
      description: "Successfully complete all goals set for your first month",
      progress: 8,
      target: 10,
      dueDate: "2024-01-31",
      status: "active",
      category: "Achievement",
      reward: "Goal Master Badge"
    },
    {
      id: 3,
      title: "Therapy Session Milestone",
      description: "Attend 20 therapy sessions",
      progress: 20,
      target: 20,
      dueDate: "2024-01-20",
      status: "completed",
      category: "Therapy",
      reward: "Commitment Badge"
    },
    {
      id: 4,
      title: "Mood Tracking Consistency",
      description: "Log mood entries for 60 consecutive days",
      progress: 45,
      target: 60,
      dueDate: "2024-03-01",
      status: "active",
      category: "Wellness",
      reward: "Insight Badge"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'active': return <Clock className="w-4 h-4" />;
      default: return <Flag className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold therapy-text-gradient">Milestone Tracker</h1>
          <p className="text-muted-foreground">Track your major achievements and long-term goals</p>
        </div>
        <Button className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600">
          <Flag className="w-4 h-4 mr-2" />
          Create Milestone
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Flag className="w-8 h-8 text-therapy-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-therapy-600">4</p>
            <p className="text-sm text-muted-foreground">Total Milestones</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-calm-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-calm-600">1</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-harmony-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-harmony-600">3</p>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 text-balance-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-balance-600">4</p>
            <p className="text-sm text-muted-foreground">Badges Earned</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {milestones.map((milestone) => (
          <Card key={milestone.id} className="border-l-4 border-therapy-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{milestone.title}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{milestone.category}</Badge>
                  <Badge className={getStatusColor(milestone.status)}>
                    {getStatusIcon(milestone.status)}
                    <span className="ml-1">{milestone.status}</span>
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{milestone.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  Progress: {milestone.progress}/{milestone.target}
                </div>
                <div className="text-sm">
                  Due: {new Date(milestone.dueDate).toLocaleDateString()}
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-therapy-500 h-3 rounded-full transition-all duration-300" 
                  style={{width: `${(milestone.progress / milestone.target) * 100}%`}}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm">Reward: {milestone.reward}</span>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                  {milestone.status === 'active' && (
                    <Button size="sm" className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600">
                      Update Progress
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Milestone Rewards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="font-medium">Commitment Badge</p>
              <p className="text-sm text-muted-foreground">Earned Jan 20, 2024</p>
            </div>
            <div className="p-4 border rounded-lg text-center opacity-50">
              <Star className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="font-medium">Meditation Badge</p>
              <p className="text-sm text-muted-foreground">5 days remaining</p>
            </div>
            <div className="p-4 border rounded-lg text-center opacity-50">
              <Star className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="font-medium">Goal Master Badge</p>
              <p className="text-sm text-muted-foreground">2 goals remaining</p>
            </div>
            <div className="p-4 border rounded-lg text-center opacity-50">
              <Star className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="font-medium">Insight Badge</p>
              <p className="text-sm text-muted-foreground">15 days remaining</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MilestoneTracker;