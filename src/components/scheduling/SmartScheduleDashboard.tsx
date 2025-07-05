
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Brain, TrendingUp, Target, Bell, BarChart3, Settings, Plus, CheckCircle } from 'lucide-react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { ToastService } from '@/services/toastService';

const SmartScheduleDashboard = () => {
  const { user, loading } = useSimpleApp();
  const navigate = useNavigate();
  const [scheduleData, setScheduleData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
        return;
      }
      loadScheduleData();
    }
  }, [user, loading, navigate]);

  const loadScheduleData = async () => {
    setIsLoading(true);
    try {
      // Mock smart scheduling data
      const mockData = {
        optimalTime: 'Afternoon (2-4 PM)',
        sessionFrequency: '3 times per week',
        nextSession: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        weeklyGoal: 3,
        completedSessions: 2,
        streak: 5,
        recommendations: [
          'Tuesday afternoons show 23% better engagement',
          'Consider 45-minute sessions for deeper reflection',
          'Your mood improves most after Monday sessions'
        ],
        upcomingSessions: [
          { date: 'Today, 3:00 PM', type: 'Anxiety Management', status: 'scheduled' },
          { date: 'Wednesday, 2:30 PM', type: 'Mindfulness Practice', status: 'scheduled' },
          { date: 'Friday, 4:00 PM', type: 'Weekly Review', status: 'suggested' }
        ]
      };
      setScheduleData(mockData);
    } catch (error) {
      console.error('Error loading schedule data:', error);
      ToastService.genericError('Failed to load smart schedule data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleScheduleSession = () => {
    ToastService.genericSuccess('Session Scheduled', 'Your therapy session has been added to your calendar.');
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
          <p className="text-therapy-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated (redirect will happen)
  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
          <p className="text-therapy-600">Loading your smart schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-therapy-900 mb-4">Smart Scheduling</h1>
        <p className="text-therapy-600 max-w-2xl mx-auto">
          AI-powered scheduling that learns your patterns and optimizes your therapy sessions for maximum impact.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-therapy-600">This Week</p>
                <p className="text-2xl font-bold text-therapy-900">{scheduleData.completedSessions}/{scheduleData.weeklyGoal}</p>
              </div>
              <Target className="h-8 w-8 text-therapy-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-therapy-600">Current Streak</p>
                <p className="text-2xl font-bold text-therapy-900">{scheduleData.streak} days</p>
              </div>
              <TrendingUp className="h-8 w-8 text-therapy-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-therapy-600">Optimal Time</p>
                <p className="text-lg font-semibold text-therapy-900">2-4 PM</p>
              </div>
              <Clock className="h-8 w-8 text-therapy-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-therapy-600">Next Session</p>
                <p className="text-lg font-semibold text-therapy-900">Today 3PM</p>
              </div>
              <Calendar className="h-8 w-8 text-therapy-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Upcoming Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scheduleData.upcomingSessions.map((session, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium text-therapy-900">{session.type}</p>
                    <p className="text-sm text-therapy-600">{session.date}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {session.status === 'scheduled' ? (
                      <Badge variant="default" className="bg-therapy-100 text-therapy-700">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Scheduled
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-therapy-600">
                        Suggested
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
              <Button 
                className="w-full mt-4" 
                variant="outline"
                onClick={handleScheduleSession}
              >
                <Plus className="h-4 w-4 mr-2" />
                Schedule New Session
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              AI Insights & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scheduleData.recommendations.map((rec, index) => (
                <div key={index} className="p-4 bg-therapy-50 border-l-4 border-therapy-500 rounded">
                  <p className="text-therapy-800">{rec}</p>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Detailed Analytics
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Optimal Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Your Optimal Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-therapy-900 mb-2">Best Time</h3>
                <p className="text-therapy-600">{scheduleData.optimalTime}</p>
                <p className="text-sm text-therapy-500 mt-1">Based on your engagement patterns</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-therapy-900 mb-2">Frequency</h3>
                <p className="text-therapy-600">{scheduleData.sessionFrequency}</p>
                <p className="text-sm text-therapy-500 mt-1">Optimized for your goals</p>
              </div>
              <Button variant="outline" className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Customize Schedule
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reminders & Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Smart Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded">
                <span className="text-therapy-700">Session reminders</span>
                <Badge className="bg-therapy-100 text-therapy-700">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded">
                <span className="text-therapy-700">Mood check-ins</span>
                <Badge className="bg-therapy-100 text-therapy-700">Daily</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded">
                <span className="text-therapy-700">Progress updates</span>
                <Badge className="bg-therapy-100 text-therapy-700">Weekly</Badge>
              </div>
              <Button variant="outline" className="w-full">
                Manage Notifications
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SmartScheduleDashboard;
