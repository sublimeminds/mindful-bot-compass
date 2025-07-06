import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Target, Zap } from 'lucide-react';

const SessionPlanner = () => {
  const upcomingSessions = [
    {
      id: 1,
      title: "Morning Mindfulness",
      time: "09:00 AM",
      date: "Today",
      type: "Mindfulness",
      duration: "20 min"
    },
    {
      id: 2,
      title: "Evening Reflection",
      time: "07:00 PM", 
      date: "Today",
      type: "Reflection",
      duration: "15 min"
    },
    {
      id: 3,
      title: "Weekly Check-in",
      time: "10:00 AM",
      date: "Tomorrow",
      type: "Assessment",
      duration: "30 min"
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold therapy-text-gradient">Session Planner</h1>
          <p className="text-muted-foreground">Plan and schedule your therapy sessions</p>
        </div>
        <Button className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600">
          <Calendar className="w-4 h-4 mr-2" />
          Schedule Session
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 text-therapy-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-therapy-600">5</p>
            <p className="text-sm text-muted-foreground">This Week</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-calm-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-calm-600">3</p>
            <p className="text-sm text-muted-foreground">Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-harmony-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-harmony-600">12</p>
            <p className="text-sm text-muted-foreground">Monthly Goal</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="w-8 h-8 text-balance-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-balance-600">85%</p>
            <p className="text-sm text-muted-foreground">On Track</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{session.title}</p>
                    <p className="text-sm text-muted-foreground">{session.date} at {session.time}</p>
                    <p className="text-xs text-therapy-600">{session.type} • {session.duration}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Modify
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start bg-therapy-50 hover:bg-therapy-100 text-therapy-700">
                <Clock className="w-4 h-4 mr-2" />
                15-minute Quick Session
              </Button>
              <Button className="w-full justify-start bg-calm-50 hover:bg-calm-100 text-calm-700">
                <Target className="w-4 h-4 mr-2" />
                30-minute Deep Session
              </Button>
              <Button className="w-full justify-start bg-harmony-50 hover:bg-harmony-100 text-harmony-700">
                <Calendar className="w-4 h-4 mr-2" />
                Weekly Planning Session
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SessionPlanner;