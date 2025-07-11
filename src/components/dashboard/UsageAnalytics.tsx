import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock, Target, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface UsageStats {
  sessionsThisMonth: number;
  totalMinutes: number;
  goalCompletion: number;
  currentStreak: number;
  planLimits: {
    sessions: number;
    minutes: number;
    goals: number;
  };
}

const UsageAnalytics: React.FC = () => {
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsageStats();
  }, []);

  const fetchUsageStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch user statistics
      const { data: userStats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Fetch current month's sessions
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: monthSessions, count } = await supabase
        .from('therapy_sessions')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .gte('start_time', startOfMonth.toISOString());

      // Fetch goal completion rate
      const { data: goals } = await supabase
        .from('goals')
        .select('id')
        .eq('user_id', user.id);

      const { data: completedGoals } = await supabase
        .from('goals')
        .select('id')
        .eq('user_id', user.id)
        .eq('progress_percentage', 100);

      const totalGoals = goals?.length || 0;
      const completedCount = completedGoals?.length || 0;
      const goalCompletion = totalGoals > 0 ? (completedCount / totalGoals) * 100 : 0;

      // Calculate total minutes this month
      const totalMinutes = monthSessions?.reduce((sum, session) => {
        if (session.end_time) {
          const duration = new Date(session.end_time).getTime() - new Date(session.start_time).getTime();
          return sum + (duration / (1000 * 60));
        }
        return sum;
      }, 0) || 0;

      setStats({
        sessionsThisMonth: count || 0,
        totalMinutes: Math.round(totalMinutes),
        goalCompletion: Math.round(goalCompletion),
        currentStreak: userStats?.current_streak || 0,
        planLimits: {
          sessions: 10, // This would come from subscription plan
          minutes: 500,
          goals: 20,
        },
      });
    } catch (error) {
      console.error('Error fetching usage stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Usage Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Usage Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No usage data available</p>
        </CardContent>
      </Card>
    );
  }

  const sessionProgress = Math.min((stats.sessionsThisMonth / stats.planLimits.sessions) * 100, 100);
  const minuteProgress = Math.min((stats.totalMinutes / stats.planLimits.minutes) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Current Month Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            This Month's Usage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Therapy Sessions</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {stats.sessionsThisMonth} / {stats.planLimits.sessions}
                </span>
                <Badge variant={sessionProgress > 80 ? "destructive" : "secondary"}>
                  {Math.round(sessionProgress)}%
                </Badge>
              </div>
            </div>
            <Progress value={sessionProgress} className="h-2" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Session Minutes</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {stats.totalMinutes} / {stats.planLimits.minutes}
                </span>
                <Badge variant={minuteProgress > 80 ? "destructive" : "secondary"}>
                  {Math.round(minuteProgress)}%
                </Badge>
              </div>
            </div>
            <Progress value={minuteProgress} className="h-2" />
          </div>

          {(sessionProgress > 80 || minuteProgress > 80) && (
            <div className="p-3 bg-destructive/10 rounded-lg">
              <p className="text-sm text-destructive font-medium">
                Approaching plan limits
              </p>
              <p className="text-xs text-destructive/80 mt-1">
                Consider upgrading your plan to continue without interruption
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.currentStreak}</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-secondary" />
              <div>
                <p className="text-2xl font-bold">{stats.goalCompletion}%</p>
                <p className="text-xs text-muted-foreground">Goals Complete</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="h-5 w-5 mr-2" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.currentStreak >= 7 && (
              <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                    <Clock className="h-4 w-4 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">7-Day Streak</p>
                    <p className="text-xs text-muted-foreground">Consistent engagement</p>
                  </div>
                </div>
                <Badge>+150 pts</Badge>
              </div>
            )}
            
            {stats.sessionsThisMonth >= 10 && (
              <div className="flex items-center justify-between p-3 bg-primary/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Target className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">10 Sessions</p>
                    <p className="text-xs text-muted-foreground">Active participation</p>
                  </div>
                </div>
                <Badge>+100 pts</Badge>
              </div>
            )}

            {stats.goalCompletion >= 50 && (
              <div className="flex items-center justify-between p-3 bg-therapy-500/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-therapy-500 rounded-full flex items-center justify-center">
                    <Award className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Goal Achiever</p>
                    <p className="text-xs text-muted-foreground">50%+ goals completed</p>
                  </div>
                </div>
                <Badge>+200 pts</Badge>
              </div>
            )}

            {stats.currentStreak < 7 && stats.sessionsThisMonth < 10 && stats.goalCompletion < 50 && (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">
                  Complete more sessions and goals to unlock achievements!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsageAnalytics;