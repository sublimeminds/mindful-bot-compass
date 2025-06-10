
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Calendar, Zap, TrendingUp, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface OptimalTiming {
  hour: number;
  day: string;
  effectiveness: number;
  userEngagement: number;
  completionRate: number;
  moodImprovement: number;
}

interface NotificationTiming {
  type: string;
  optimalHour: number;
  effectivenessScore: number;
  responseRate: number;
  userPreference: number;
}

const TimingOptimizationDashboard = () => {
  const { user } = useAuth();
  const [optimalTimings, setOptimalTimings] = useState<OptimalTiming[]>([]);
  const [notificationTimings, setNotificationTimings] = useState<NotificationTiming[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    optimizeTimings();
  }, [user]);

  const optimizeTimings = async () => {
    setIsOptimizing(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockOptimalTimings: OptimalTiming[] = [
      { hour: 9, day: 'Monday', effectiveness: 85, userEngagement: 78, completionRate: 92, moodImprovement: 7.2 },
      { hour: 14, day: 'Tuesday', effectiveness: 82, userEngagement: 75, completionRate: 88, moodImprovement: 6.8 },
      { hour: 18, day: 'Wednesday', effectiveness: 89, userEngagement: 85, completionRate: 95, moodImprovement: 8.1 },
      { hour: 19, day: 'Thursday', effectiveness: 87, userEngagement: 82, completionRate: 91, moodImprovement: 7.5 },
      { hour: 10, day: 'Friday', effectiveness: 80, userEngagement: 73, completionRate: 85, moodImprovement: 6.9 },
      { hour: 16, day: 'Saturday', effectiveness: 76, userEngagement: 69, completionRate: 82, moodImprovement: 6.5 },
      { hour: 11, day: 'Sunday', effectiveness: 78, userEngagement: 71, completionRate: 84, moodImprovement: 6.7 }
    ];

    const mockNotificationTimings: NotificationTiming[] = [
      { type: 'Session Reminders', optimalHour: 17, effectivenessScore: 91, responseRate: 68, userPreference: 85 },
      { type: 'Mood Check-ins', optimalHour: 9, effectivenessScore: 87, responseRate: 74, userPreference: 82 },
      { type: 'Progress Updates', optimalHour: 20, effectivenessScore: 83, responseRate: 59, userPreference: 78 },
      { type: 'Milestone Alerts', optimalHour: 12, effectivenessScore: 89, responseRate: 71, userPreference: 88 }
    ];

    setOptimalTimings(mockOptimalTimings);
    setNotificationTimings(mockNotificationTimings);
    setIsOptimizing(false);
  };

  const getTimeOfDayIcon = (hour: number) => {
    if (hour >= 6 && hour < 18) {
      return <Sun className="h-4 w-4 text-yellow-500" />;
    }
    return <Moon className="h-4 w-4 text-blue-500" />;
  };

  const getEffectivenessColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const sessionTimingData = optimalTimings.map(timing => ({
    day: timing.day.slice(0, 3),
    hour: timing.hour,
    effectiveness: timing.effectiveness,
    engagement: timing.userEngagement
  }));

  const notificationEffectivenessData = notificationTimings.map(timing => ({
    type: timing.type.split(' ')[0],
    hour: timing.optimalHour,
    effectiveness: timing.effectivenessScore,
    response: timing.responseRate
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-6 w-6 text-purple-500" />
              <CardTitle>AI Timing Optimization</CardTitle>
            </div>
            <Button 
              variant="outline" 
              onClick={optimizeTimings}
              disabled={isOptimizing}
            >
              {isOptimizing ? 'Optimizing...' : 'Refresh Analysis'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isOptimizing ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-purple-500 mx-auto mb-4 animate-pulse" />
              <p className="text-muted-foreground">Analyzing optimal timing patterns...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center space-y-1">
                <p className="text-2xl font-bold text-purple-500">
                  {Math.max(...optimalTimings.map(t => t.effectiveness))}%
                </p>
                <p className="text-xs text-muted-foreground">Peak Effectiveness</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-2xl font-bold text-blue-500">
                  {optimalTimings.find(t => t.effectiveness === Math.max(...optimalTimings.map(t => t.effectiveness)))?.hour}:00
                </p>
                <p className="text-xs text-muted-foreground">Optimal Hour</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-2xl font-bold text-green-500">
                  {Math.round(optimalTimings.reduce((sum, t) => sum + t.moodImprovement, 0) / optimalTimings.length * 10) / 10}
                </p>
                <p className="text-xs text-muted-foreground">Avg Mood Gain</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-2xl font-bold text-orange-500">
                  {Math.round(optimalTimings.reduce((sum, t) => sum + t.completionRate, 0) / optimalTimings.length)}%
                </p>
                <p className="text-xs text-muted-foreground">Completion Rate</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="sessions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sessions">Session Timing</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Optimal Session Times by Day</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {optimalTimings.map((timing, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="font-semibold">{timing.day}</div>
                        <div className="text-sm text-muted-foreground">
                          {timing.hour}:00
                        </div>
                      </div>
                      {getTimeOfDayIcon(timing.hour)}
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className={`text-lg font-bold ${getEffectivenessColor(timing.effectiveness)}`}>
                          {timing.effectiveness}%
                        </div>
                        <div className="text-xs text-muted-foreground">Effectiveness</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">
                          {timing.userEngagement}%
                        </div>
                        <div className="text-xs text-muted-foreground">Engagement</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">
                          {timing.moodImprovement}
                        </div>
                        <div className="text-xs text-muted-foreground">Mood Gain</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Session Effectiveness by Day</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sessionTimingData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="effectiveness" fill="#8b5cf6" name="Effectiveness %" />
                    <Bar dataKey="engagement" fill="#3b82f6" name="Engagement %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <div className="space-y-4">
            {notificationTimings.map((timing, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <h3 className="font-semibold">{timing.type}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>Optimal: {timing.optimalHour}:00</span>
                        </div>
                        {getTimeOfDayIcon(timing.optimalHour)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className={`text-lg font-bold ${getEffectivenessColor(timing.effectivenessScore)}`}>
                          {timing.effectivenessScore}%
                        </div>
                        <div className="text-xs text-muted-foreground">Effectiveness</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-blue-600">
                          {timing.responseRate}%
                        </div>
                        <div className="text-xs text-muted-foreground">Response Rate</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-purple-600">
                          {timing.userPreference}%
                        </div>
                        <div className="text-xs text-muted-foreground">User Preference</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Notification Effectiveness Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={notificationEffectivenessData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="effectiveness" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      name="Effectiveness %"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="response" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Response Rate %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TimingOptimizationDashboard;
