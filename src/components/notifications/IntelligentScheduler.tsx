
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Clock, TrendingUp, Users, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface ScheduledNotification {
  id: string;
  type: 'session_reminder' | 'mood_checkin' | 'goal_update' | 'insight';
  title: string;
  scheduledTime: Date;
  priority: 'low' | 'medium' | 'high';
  aiOptimized: boolean;
  engagementScore: number;
  status: 'pending' | 'sent' | 'delivered' | 'opened';
}

interface OptimizationMetrics {
  engagementRate: number;
  openRate: number;
  responseRate: number;
  optimalTimes: string[];
  userActivity: Array<{ hour: number; activity: number }>;
}

const IntelligentScheduler = () => {
  const [scheduledNotifications, setScheduledNotifications] = useState<ScheduledNotification[]>([]);
  const [metrics, setMetrics] = useState<OptimizationMetrics>({
    engagementRate: 78,
    openRate: 85,
    responseRate: 62,
    optimalTimes: ['09:00', '13:00', '18:00'],
    userActivity: []
  });
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    // Generate sample data
    const sampleNotifications: ScheduledNotification[] = [
      {
        id: '1',
        type: 'session_reminder',
        title: 'Your therapy session starts in 30 minutes',
        scheduledTime: new Date(Date.now() + 30 * 60 * 1000),
        priority: 'high',
        aiOptimized: true,
        engagementScore: 0.89,
        status: 'pending'
      },
      {
        id: '2',
        type: 'mood_checkin',
        title: 'How are you feeling today?',
        scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        priority: 'medium',
        aiOptimized: true,
        engagementScore: 0.76,
        status: 'pending'
      },
      {
        id: '3',
        type: 'insight',
        title: 'Weekly progress insight available',
        scheduledTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
        priority: 'low',
        aiOptimized: false,
        engagementScore: 0.65,
        status: 'pending'
      }
    ];

    const activityData = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      activity: Math.floor(Math.random() * 100)
    }));

    setScheduledNotifications(sampleNotifications);
    setMetrics(prev => ({ ...prev, userActivity: activityData }));
  }, []);

  const handleOptimizeSchedule = async () => {
    setIsOptimizing(true);
    
    // Simulate AI optimization
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setScheduledNotifications(prev =>
      prev.map(notification => ({
        ...notification,
        aiOptimized: true,
        engagementScore: Math.min(notification.engagementScore + 0.1, 1.0),
        scheduledTime: new Date(notification.scheduledTime.getTime() + Math.random() * 60 * 60 * 1000)
      }))
    );
    
    setIsOptimizing(false);
  };

  const getStatusColor = (status: ScheduledNotification['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'sent': return 'bg-blue-500';
      case 'delivered': return 'bg-green-500';
      case 'opened': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityIcon = (priority: ScheduledNotification['priority']) => {
    switch (priority) {
      case 'high': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'low': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">AI-Powered Notification Scheduler</h2>
        <p className="text-muted-foreground">
          Machine learning optimizes notification timing for maximum engagement
        </p>
      </div>

      {/* Optimization Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Engagement Rate</p>
                <p className="text-2xl font-bold">{metrics.engagementRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
            <Progress value={metrics.engagementRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open Rate</p>
                <p className="text-2xl font-bold">{metrics.openRate}%</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <Progress value={metrics.openRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Response Rate</p>
                <p className="text-2xl font-bold">{metrics.responseRate}%</p>
              </div>
              <Brain className="h-8 w-8 text-purple-500" />
            </div>
            <Progress value={metrics.responseRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* User Activity Pattern */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Daily Activity Pattern
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={metrics.userActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="activity" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Optimal Times */}
      <Card>
        <CardHeader>
          <CardTitle>AI-Identified Optimal Times</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {metrics.optimalTimes.map(time => (
              <Badge key={time} variant="outline" className="bg-green-50 text-green-700">
                <Clock className="h-3 w-3 mr-1" />
                {time}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            These times show the highest engagement rates based on your activity patterns
          </p>
        </CardContent>
      </Card>

      {/* Scheduled Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Upcoming Notifications</CardTitle>
            <Button 
              onClick={handleOptimizeSchedule}
              disabled={isOptimizing}
              variant="outline"
            >
              <Brain className="h-4 w-4 mr-2" />
              {isOptimizing ? 'Optimizing...' : 'AI Optimize'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scheduledNotifications.map(notification => (
              <div key={notification.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(notification.status)}`} />
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    {getPriorityIcon(notification.priority)}
                    <h4 className="font-medium">{notification.title}</h4>
                    {notification.aiOptimized && (
                      <Badge variant="secondary" className="text-xs">
                        <Brain className="h-3 w-3 mr-1" />
                        AI Optimized
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Scheduled for {formatTime(notification.scheduledTime)}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {Math.round(notification.engagementScore * 100)}% engagement
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {notification.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="font-medium text-blue-900">Timing Optimization</p>
              <p className="text-sm text-blue-700">
                Your engagement is 23% higher when notifications are sent between 9-11 AM. 
                Consider moving mood check-ins to this window.
              </p>
            </div>
            
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="font-medium text-green-900">Content Personalization</p>
              <p className="text-sm text-green-700">
                Session reminders with specific technique mentions have 18% higher response rates.
              </p>
            </div>
            
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="font-medium text-purple-900">Frequency Adjustment</p>
              <p className="text-sm text-purple-700">
                Your current notification frequency appears optimal. Maintain current schedule.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntelligentScheduler;
