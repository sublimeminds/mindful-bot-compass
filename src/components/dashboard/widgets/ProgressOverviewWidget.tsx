
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Target, Calendar, MessageSquare, Award, Zap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const ProgressOverviewWidget = () => {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['user-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

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

      // Fetch mood entries for improvement calculation
      const { data: moodEntries } = await supabase
        .from('mood_entries')
        .select('overall, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      let averageMoodImprovement = 0;
      if (moodEntries && moodEntries.length >= 2) {
        const recent = moodEntries.slice(0, 5);
        const older = moodEntries.slice(5, 10);
        const recentAvg = recent.reduce((sum, entry) => sum + entry.overall, 0) / recent.length;
        const olderAvg = older.length > 0 ? older.reduce((sum, entry) => sum + entry.overall, 0) / older.length : recentAvg;
        averageMoodImprovement = recentAvg - olderAvg;
      }

      // Calculate weekly progress
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const { count: weeklyProgress } = await supabase
        .from('therapy_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', oneWeekAgo.toISOString());

      // Calculate longest streak
      const { data: allSessions } = await supabase
        .from('therapy_sessions')
        .select('created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      let longestStreak = 0;
      if (allSessions && allSessions.length > 0) {
        let currentStreak = 1;
        let maxStreak = 1;
        
        for (let i = 1; i < allSessions.length; i++) {
          const prevDate = new Date(allSessions[i - 1].created_at).toDateString();
          const currentDate = new Date(allSessions[i].created_at).toDateString();
          const dayDiff = (new Date(currentDate).getTime() - new Date(prevDate).getTime()) / (1000 * 60 * 60 * 24);
          
          if (dayDiff <= 1) {
            currentStreak++;
          } else {
            maxStreak = Math.max(maxStreak, currentStreak);
            currentStreak = 1;
          }
        }
        longestStreak = Math.max(maxStreak, currentStreak);
      }

      return {
        totalSessions: totalSessions || 0,
        totalMessages,
        averageMoodImprovement,
        weeklyProgress: weeklyProgress || 0,
        weeklyGoal: 3, // This could be fetched from user preferences
        longestStreak
      };
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading your progress...</div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Start your therapy journey to see your progress here
          </div>
        </CardContent>
      </Card>
    );
  }

  const progressPercentage = (stats.weeklyProgress / stats.weeklyGoal) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-therapy-600" />
          Your Progress Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-therapy-50 rounded-lg">
            <Calendar className="h-6 w-6 mx-auto mb-2 text-therapy-600" />
            <div className="text-2xl font-bold text-therapy-700">{stats.totalSessions}</div>
            <div className="text-sm text-muted-foreground">Total Sessions</div>
          </div>
          
          <div className="text-center p-4 bg-calm-50 rounded-lg">
            <MessageSquare className="h-6 w-6 mx-auto mb-2 text-calm-600" />
            <div className="text-2xl font-bold text-calm-700">{stats.totalMessages}</div>
            <div className="text-sm text-muted-foreground">Messages</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-green-700">
              {stats.averageMoodImprovement > 0 ? '+' : ''}{stats.averageMoodImprovement.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">Mood Improvement</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Award className="h-6 w-6 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold text-purple-700">{stats.longestStreak}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </div>
        </div>

        {/* Weekly Goal Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-therapy-600" />
              <span className="text-sm font-medium">Weekly Goal Progress</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {stats.weeklyProgress}/{stats.weeklyGoal} sessions
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          {progressPercentage >= 100 && (
            <div className="flex items-center space-x-1 text-sm text-green-600">
              <Zap className="h-3 w-3" />
              <span>Goal achieved! Great work!</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressOverviewWidget;
