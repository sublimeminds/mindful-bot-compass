
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useSessionStats } from '@/hooks/useSessionStats';
import { useSessionHistory } from '@/hooks/useSessionHistory';
import { Calendar, TrendingUp, MessageSquare, Clock } from 'lucide-react';

const SessionAnalyticsDashboard = () => {
  const { stats } = useSessionStats();
  const { sessionSummaries } = useSessionHistory();

  // Prepare data for charts
  const weeklyData = useMemo(() => {
    if (!sessionSummaries) return [];
    
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const sessionsOnDate = sessionSummaries.filter(session => 
        session.created_at.startsWith(date)
      );
      
      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        sessions: sessionsOnDate.length,
        avgMood: sessionsOnDate.length > 0 
          ? sessionsOnDate.reduce((sum, s) => sum + (s.mood_after || 5), 0) / sessionsOnDate.length
          : 0
      };
    });
  }, [sessionSummaries]);

  const moodTrendData = useMemo(() => {
    if (!sessionSummaries) return [];
    
    return sessionSummaries
      .filter(session => session.mood_before && session.mood_after)
      .slice(0, 10)
      .reverse()
      .map((session, index) => ({
        session: `Session ${index + 1}`,
        before: session.mood_before,
        after: session.mood_after,
        improvement: session.mood_after - session.mood_before
      }));
  }, [sessionSummaries]);

  return (
    <div className="space-y-6">
      {/* Session Frequency Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Weekly Session Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sessions" fill="hsl(var(--therapy-500))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Mood Improvement Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Mood Improvement Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={moodTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="session" />
              <YAxis domain={[1, 10]} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="before" 
                stroke="hsl(var(--muted-foreground))" 
                strokeDasharray="5 5"
                name="Before Session"
              />
              <Line 
                type="monotone" 
                dataKey="after" 
                stroke="hsl(var(--therapy-500))" 
                name="After Session"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Session Length</p>
                <p className="text-2xl font-bold">32 min</p>
              </div>
              <Clock className="h-6 w-6 text-therapy-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Messages Per Session</p>
                <p className="text-2xl font-bold">
                  {stats ? Math.round(stats.totalMessages / Math.max(stats.totalSessions, 1)) : 0}
                </p>
              </div>
              <MessageSquare className="h-6 w-6 text-therapy-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Weekly Goal</p>
                <p className="text-2xl font-bold">
                  {stats ? `${stats.weeklyProgress}/${stats.weeklyGoal}` : '0/3'}
                </p>
              </div>
              <TrendingUp className="h-6 w-6 text-therapy-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SessionAnalyticsDashboard;
