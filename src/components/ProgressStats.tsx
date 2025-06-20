
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Target, Calendar, MessageSquare } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSimpleApp } from '@/hooks/useSimpleApp';

const ProgressStats = () => {
  const { user } = useSimpleApp();

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['progress-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      try {
        // Fetch total sessions
        const { count: totalSessions } = await supabase
          .from('therapy_sessions')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        // Fetch total messages
        const { data: sessions } = await supabase
          .from('therapy_sessions')
          .select('id')
          .eq('user_id', user.id);

        let totalMessages = 0;
        if (sessions) {
          for (const session of sessions) {
            const { count } = await supabase
              .from('session_messages')
              .select('*', { count: 'exact', head: true })
              .eq('session_id', session.id);
            totalMessages += count || 0;
          }
        }

        // Calculate mood improvement
        const { data: moodEntries } = await supabase
          .from('mood_entries')
          .select('overall, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        let averageMoodImprovement = 0;
        if (moodEntries && moodEntries.length >= 2) {
          const recent = moodEntries.slice(0, 5);
          const older = moodEntries.slice(5);
          if (older.length > 0) {
            const recentAvg = recent.reduce((sum, entry) => sum + entry.overall, 0) / recent.length;
            const olderAvg = older.reduce((sum, entry) => sum + entry.overall, 0) / older.length;
            averageMoodImprovement = recentAvg - olderAvg;
          }
        }

        // Calculate weekly progress
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const { count: weeklyProgress } = await supabase
          .from('therapy_sessions')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('created_at', oneWeekAgo.toISOString());

        return {
          totalSessions: totalSessions || 0,
          totalMessages,
          averageMoodImprovement,
          weeklyGoal: 3,
          weeklyProgress: weeklyProgress || 0,
        };
      } catch (err) {
        console.error('Error fetching progress stats:', err);
        throw err;
      }
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Start your therapy journey to see your progress statistics
      </div>
    );
  }

  const progressPercentage = Math.min((stats.weeklyProgress / stats.weeklyGoal) * 100, 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalSessions}</div>
          <p className="text-xs text-muted-foreground">
            Therapy sessions completed
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Messages</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalMessages}</div>
          <p className="text-xs text-muted-foreground">
            Total conversations
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Mood Improvement</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.averageMoodImprovement > 0 ? '+' : ''}{stats.averageMoodImprovement.toFixed(1)}
          </div>
          <p className="text-xs text-muted-foreground">
            Average improvement
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Weekly Progress</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.weeklyProgress}/{stats.weeklyGoal}</div>
          {progressPercentage > 0 && (
            <Progress 
              value={progressPercentage} 
              className="mt-2" 
            />
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Sessions this week
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressStats;
