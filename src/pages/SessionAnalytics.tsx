import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { BarChart3, TrendingUp, Clock, Target } from 'lucide-react';

const SessionAnalytics = () => {
  const { user } = useAuth();
  const [sessionData, setSessionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionData = async () => {
      setLoading(true);
      try {
        // Mock data for demonstration
        const mockData = {
          totalSessions: 42,
          averageMood: 7.8,
          goalCompletionRate: 0.85,
          timeSpent: '35 hours'
        };
        setSessionData(mockData);
      } catch (error) {
        console.error('Error fetching session data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSessionData();
    }
  }, [user]);

  if (loading) {
    return <p>Loading session analytics...</p>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Session Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sessionData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="flex flex-col items-center justify-center">
                  <div className="text-2xl font-bold">{sessionData.totalSessions}</div>
                  <div className="text-sm text-muted-foreground">Total Sessions</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center justify-center">
                  <div className="text-2xl font-bold">{sessionData.averageMood}</div>
                  <div className="text-sm text-muted-foreground">Average Mood</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center justify-center">
                  <div className="text-2xl font-bold">{sessionData.goalCompletionRate * 100}%</div>
                  <div className="text-sm text-muted-foreground">Goal Completion Rate</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center justify-center">
                  <div className="text-2xl font-bold">{sessionData.timeSpent}</div>
                  <div className="text-sm text-muted-foreground">Time Spent</div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <p>No session data available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionAnalytics;
