
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { BarChart3, TrendingUp, Clock, Target } from 'lucide-react';

const SessionAnalytics = () => {
  const { user } = useSimpleApp();

  // Mock analytics data
  const analytics = {
    totalSessions: 12,
    averageDuration: 35,
    improvementScore: 78,
    completionRate: 85,
    recentSessions: [
      { id: '1', date: '2024-01-15', duration: 45, mood_before: 4, mood_after: 7 },
      { id: '2', date: '2024-01-13', duration: 30, mood_before: 3, mood_after: 6 },
      { id: '3', date: '2024-01-10', duration: 40, mood_before: 5, mood_after: 8 }
    ]
  };

  if (!user) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p>Please log in to view your session analytics.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Session Analytics</h1>
        <p className="text-muted-foreground">
          Track your therapy progress and session insights.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalSessions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.averageDuration}m</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Improvement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.improvementScore}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.completionRate}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.recentSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{session.date}</p>
                  <p className="text-sm text-muted-foreground">{session.duration} minutes</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    {session.mood_before} → {session.mood_after}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionAnalytics;
