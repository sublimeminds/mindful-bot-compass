
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, LineChart, Line, AreaChart, Area } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface SessionData {
  sessionVolume: Array<{ date: string; sessions: number; messages: number }>;
  sessionDuration: Array<{ duration: string; count: number }>;
  hourlyDistribution: Array<{ hour: string; sessions: number }>;
  completionRates: {
    completed: number;
    abandoned: number;
    completionRate: number;
  };
  averageMetrics: {
    messagesPerSession: number;
    sessionDuration: number;
    moodImprovement: number;
  };
}

const SessionStatistics = () => {
  const [data, setData] = useState<SessionData>({
    sessionVolume: [],
    sessionDuration: [],
    hourlyDistribution: [],
    completionRates: { completed: 0, abandoned: 0, completionRate: 0 },
    averageMetrics: { messagesPerSession: 0, sessionDuration: 0, moodImprovement: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessionData();
  }, []);

  const fetchSessionData = async () => {
    try {
      setLoading(true);

      // Get session volume for last 14 days
      const sessionVolume = [];
      for (let i = 13; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        const { data: sessions, error: sessionsError } = await supabase
          .from('therapy_sessions')
          .select('id')
          .gte('start_time', date.toISOString())
          .lt('start_time', nextDate.toISOString());

        const { data: messages, error: messagesError } = await supabase
          .from('session_messages')
          .select('session_id')
          .in('session_id', sessions?.map(s => s.id) || []);

        sessionVolume.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          sessions: sessions?.length || 0,
          messages: messages?.length || 0
        });
      }

      // Get session duration distribution
      const { data: completedSessions } = await supabase
        .from('therapy_sessions')
        .select('start_time, end_time')
        .not('end_time', 'is', null);

      const durationBuckets = {
        '0-10m': 0,
        '10-20m': 0,
        '20-30m': 0,
        '30-45m': 0,
        '45-60m': 0,
        '60m+': 0
      };

      let totalDuration = 0;
      completedSessions?.forEach(session => {
        const duration = (new Date(session.end_time).getTime() - new Date(session.start_time).getTime()) / (1000 * 60);
        totalDuration += duration;

        if (duration <= 10) durationBuckets['0-10m']++;
        else if (duration <= 20) durationBuckets['10-20m']++;
        else if (duration <= 30) durationBuckets['20-30m']++;
        else if (duration <= 45) durationBuckets['30-45m']++;
        else if (duration <= 60) durationBuckets['45-60m']++;
        else durationBuckets['60m+']++;
      });

      const sessionDuration = Object.entries(durationBuckets).map(([duration, count]) => ({
        duration,
        count
      }));

      // Get hourly distribution
      const { data: allSessions } = await supabase
        .from('therapy_sessions')
        .select('start_time');

      const hourlyBuckets = Array.from({ length: 24 }, (_, i) => ({
        hour: `${i.toString().padStart(2, '0')}:00`,
        sessions: 0
      }));

      allSessions?.forEach(session => {
        const hour = new Date(session.start_time).getHours();
        hourlyBuckets[hour].sessions++;
      });

      // Calculate completion rates
      const { count: totalSessions } = await supabase
        .from('therapy_sessions')
        .select('*', { count: 'exact', head: true });

      const { count: completedSessionsCount } = await supabase
        .from('therapy_sessions')
        .select('*', { count: 'exact', head: true })
        .not('end_time', 'is', null);

      const completed = completedSessionsCount || 0;
      const abandoned = (totalSessions || 0) - completed;
      const completionRate = totalSessions ? (completed / totalSessions) * 100 : 0;

      // Calculate average metrics
      const { data: sessionMessages } = await supabase
        .from('session_messages')
        .select('session_id');

      const sessionMessageCounts = sessionMessages?.reduce((acc, msg) => {
        acc[msg.session_id] = (acc[msg.session_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const messagesPerSession = Object.keys(sessionMessageCounts).length > 0
        ? Object.values(sessionMessageCounts).reduce((sum, count) => sum + count, 0) / Object.keys(sessionMessageCounts).length
        : 0;

      const averageSessionDuration = completedSessions?.length > 0
        ? totalDuration / completedSessions.length
        : 0;

      // Calculate mood improvement
      const { data: sessionsWithMood } = await supabase
        .from('therapy_sessions')
        .select('mood_before, mood_after')
        .not('mood_before', 'is', null)
        .not('mood_after', 'is', null);

      const moodImprovement = sessionsWithMood?.length > 0
        ? sessionsWithMood.reduce((sum, session) => sum + (session.mood_after - session.mood_before), 0) / sessionsWithMood.length
        : 0;

      setData({
        sessionVolume,
        sessionDuration,
        hourlyDistribution: hourlyBuckets,
        completionRates: { completed, abandoned, completionRate },
        averageMetrics: {
          messagesPerSession: Math.round(messagesPerSession * 10) / 10,
          sessionDuration: Math.round(averageSessionDuration),
          moodImprovement: Math.round(moodImprovement * 10) / 10
        }
      });
    } catch (error) {
      console.error('Error fetching session data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-600 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-sm">Session Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-2">
              {Math.round(data.completionRates.completionRate)}%
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Completed:</span>
                <Badge variant="default">{data.completionRates.completed}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Abandoned:</span>
                <Badge variant="destructive">{data.completionRates.abandoned}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-sm">Average Messages per Session</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {data.averageMetrics.messagesPerSession}
            </div>
            <p className="text-xs text-gray-400 mt-2">Messages exchanged per session</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-sm">Average Mood Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              +{data.averageMetrics.moodImprovement}
            </div>
            <p className="text-xs text-gray-400 mt-2">Average mood change per session</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Session Volume */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Session Volume (14 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                sessions: {
                  label: "Sessions",
                  color: "#3b82f6",
                },
                messages: {
                  label: "Messages",
                  color: "#10b981",
                },
              }}
              className="h-64"
            >
              <AreaChart data={data.sessionVolume}>
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area 
                  type="monotone" 
                  dataKey="sessions" 
                  stackId="1"
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.3}
                />
                <Area 
                  type="monotone" 
                  dataKey="messages" 
                  stackId="2"
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Session Duration Distribution */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Session Duration Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: {
                  label: "Sessions",
                  color: "#f59e0b",
                },
              }}
              className="h-64"
            >
              <BarChart data={data.sessionDuration}>
                <XAxis dataKey="duration" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="#f59e0b" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Hourly Distribution */}
        <Card className="bg-gray-800 border-gray-700 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Session Distribution by Hour</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                sessions: {
                  label: "Sessions",
                  color: "#8b5cf6",
                },
              }}
              className="h-64"
            >
              <LineChart data={data.hourlyDistribution}>
                <XAxis dataKey="hour" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="sessions" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  dot={{ fill: "#8b5cf6", strokeWidth: 2 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SessionStatistics;
