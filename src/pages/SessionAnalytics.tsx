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
        // Fetch real session data
        const { data: sessions } = await supabase
          .from('therapy_sessions')
          .select('*')
          .eq('user_id', user?.id);

        // Fetch mood data for average
        const { data: moods } = await supabase
          .from('mood_entries')
          .select('overall')
          .eq('user_id', user?.id);

        // Fetch goals for completion rate
        const { data: goals } = await supabase
          .from('goals')
          .select('*')
          .eq('user_id', user?.id);

        const totalSessions = sessions?.length || 0;
        const averageMood = moods?.length > 0 
          ? (moods.reduce((sum, mood) => sum + mood.overall, 0) / moods.length).toFixed(1)
          : 0;
        
        const completedGoals = goals?.filter(g => g.is_completed).length || 0;
        const totalGoals = goals?.length || 0;
        const goalCompletionRate = totalGoals > 0 ? (completedGoals / totalGoals) : 0;

        // Calculate total time from sessions
        const totalMinutes = sessions?.reduce((sum, session) => {
          if (session.start_time && session.end_time) {
            const duration = new Date(session.end_time).getTime() - new Date(session.start_time).getTime();
            return sum + Math.floor(duration / (1000 * 60));
          }
          return sum;
        }, 0) || 0;

        const timeSpent = totalMinutes > 60 
          ? `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`
          : `${totalMinutes}m`;

        setSessionData({
          totalSessions,
          averageMood,
          goalCompletionRate,
          timeSpent
        });
      } catch (error) {
        console.error('Error fetching session data:', error);
        // Fallback to zeros
        setSessionData({
          totalSessions: 0,
          averageMood: 0,
          goalCompletionRate: 0,
          timeSpent: '0m'
        });
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
