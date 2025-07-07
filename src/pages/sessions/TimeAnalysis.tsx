import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, TrendingUp, BarChart3 } from 'lucide-react';

const TimeAnalysis = () => {
  const timeData = [
    {
      timeSlot: "6:00 AM - 9:00 AM",
      sessionCount: 45,
      avgEffectiveness: 89,
      completion: 94
    },
    {
      timeSlot: "9:00 AM - 12:00 PM", 
      sessionCount: 78,
      avgEffectiveness: 92,
      completion: 96
    },
    {
      timeSlot: "12:00 PM - 3:00 PM",
      sessionCount: 34,
      avgEffectiveness: 78,
      completion: 82
    },
    {
      timeSlot: "6:00 PM - 9:00 PM",
      sessionCount: 67,
      avgEffectiveness: 85,
      completion: 88
    }
  ];

  const weeklyData = [
    { day: "Monday", sessions: 23, duration: "32 min" },
    { day: "Tuesday", sessions: 28, duration: "28 min" },
    { day: "Wednesday", sessions: 31, duration: "35 min" },
    { day: "Thursday", sessions: 25, duration: "30 min" },
    { day: "Friday", sessions: 29, duration: "33 min" },
    { day: "Saturday", sessions: 18, duration: "25 min" },
    { day: "Sunday", sessions: 15, duration: "22 min" }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold therapy-text-gradient">Time Analysis</h1>
          <p className="text-muted-foreground">Analyze session timing patterns and optimal scheduling</p>
        </div>
        <Badge variant="outline" className="text-therapy-600">
          <Clock className="w-4 h-4 mr-1" />
          Time Analytics
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-therapy-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-therapy-600">28 min</p>
            <p className="text-sm text-muted-foreground">Avg Session Length</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 text-calm-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-calm-600">9-12 AM</p>
            <p className="text-sm text-muted-foreground">Peak Time</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-harmony-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-harmony-600">92%</p>
            <p className="text-sm text-muted-foreground">Peak Effectiveness</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BarChart3 className="w-8 h-8 text-balance-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-balance-600">169</p>
            <p className="text-sm text-muted-foreground">Weekly Sessions</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Time Slot Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {timeData.map((slot, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{slot.timeSlot}</span>
                    <Badge className="bg-green-100 text-green-800">
                      {slot.avgEffectiveness}% effective
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center">
                      <p className="font-bold text-therapy-600">{slot.sessionCount}</p>
                      <p className="text-muted-foreground">Sessions</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-calm-600">{slot.avgEffectiveness}%</p>
                      <p className="text-muted-foreground">Effectiveness</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-harmony-600">{slot.completion}%</p>
                      <p className="text-muted-foreground">Completion</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {weeklyData.map((day, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="font-medium">{day.day}</span>
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="font-bold text-therapy-600">{day.sessions}</p>
                      <p className="text-xs text-muted-foreground">Sessions</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-calm-600">{day.duration}</p>
                      <p className="text-xs text-muted-foreground">Avg Duration</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TimeAnalysis;