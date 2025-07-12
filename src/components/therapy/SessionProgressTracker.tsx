import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { 
  TrendingUp, 
  Target, 
  Heart, 
  Brain, 
  Clock, 
  CheckCircle,
  BarChart3,
  Calendar
} from 'lucide-react';

interface SessionMetrics {
  totalSessions: number;
  avgMoodImprovement: number;
  currentStreak: number;
  weeklyGoalProgress: number;
  recentTechniques: string[];
  nextMilestone: string;
}

interface SessionProgressTrackerProps {
  currentSessionId?: string;
  isLive?: boolean;
}

const SessionProgressTracker = ({ currentSessionId, isLive = false }: SessionProgressTrackerProps) => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<SessionMetrics>({
    totalSessions: 0,
    avgMoodImprovement: 0,
    currentStreak: 0,
    weeklyGoalProgress: 0,
    recentTechniques: [],
    nextMilestone: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProgressMetrics();
    }
  }, [user, currentSessionId]);

  const loadProgressMetrics = async () => {
    if (!user) return;

    try {
      // Get user stats
      const { data: userStats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Get recent session data
      const { data: recentSessions } = await supabase
        .from('therapy_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      // Get recent techniques used
      const { data: recentTechniques } = await supabase
        .from('session_technique_tracking')
        .select('technique_name')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      // Calculate metrics
      const totalSessions = userStats?.total_sessions || 0;
      const avgMoodImprovement = calculateMoodImprovement(recentSessions || []);
      const currentStreak = userStats?.current_streak || 0;
      const weeklyGoalProgress = calculateWeeklyProgress(recentSessions || []);
      const techniques = [...new Set(recentTechniques?.map(t => t.technique_name) || [])];
      
      setMetrics({
        totalSessions,
        avgMoodImprovement,
        currentStreak,
        weeklyGoalProgress,
        recentTechniques: techniques,
        nextMilestone: getNextMilestone(totalSessions)
      });
    } catch (error) {
      console.error('Error loading progress metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMoodImprovement = (sessions: any[]) => {
    if (sessions.length === 0) return 0;
    
    const improvements = sessions
      .filter(s => s.session_data?.checkOut?.mood && s.session_data?.checkIn?.mood)
      .map(s => s.session_data.checkOut.mood - s.session_data.checkIn.mood);
    
    return improvements.length > 0 
      ? Math.round((improvements.reduce((a, b) => a + b, 0) / improvements.length) * 10) / 10
      : 0;
  };

  const calculateWeeklyProgress = (sessions: any[]) => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    
    const weekSessions = sessions.filter(s => 
      new Date(s.created_at) >= weekStart
    );
    
    return Math.min((weekSessions.length / 3) * 100, 100); // Goal of 3 sessions per week
  };

  const getNextMilestone = (totalSessions: number) => {
    if (totalSessions < 5) return `${5 - totalSessions} sessions to First Week Complete`;
    if (totalSessions < 10) return `${10 - totalSessions} sessions to Two Week Milestone`;
    if (totalSessions < 25) return `${25 - totalSessions} sessions to Monthly Champion`;
    if (totalSessions < 50) return `${50 - totalSessions} sessions to Therapy Veteran`;
    return 'Therapy Master - Keep going!';
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <Card className={`${isLive ? 'bg-gradient-to-r from-therapy-50 to-calm-50 border-therapy-200' : ''}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-therapy-600" />
          Progress Tracking
          {isLive && (
            <Badge variant="outline" className="text-xs">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
              Live
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-white/50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target className="h-4 w-4 text-therapy-600" />
              <span className="text-xs text-muted-foreground">Sessions</span>
            </div>
            <div className="text-xl font-bold text-therapy-600">{metrics.totalSessions}</div>
          </div>
          
          <div className="text-center p-3 bg-white/50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-xs text-muted-foreground">Mood ↑</span>
            </div>
            <div className="text-xl font-bold text-red-500">
              {metrics.avgMoodImprovement > 0 ? '+' : ''}{metrics.avgMoodImprovement}
            </div>
          </div>
          
          <div className="text-center p-3 bg-white/50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-xs text-muted-foreground">Streak</span>
            </div>
            <div className="text-xl font-bold text-green-500">{metrics.currentStreak}</div>
          </div>
          
          <div className="text-center p-3 bg-white/50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span className="text-xs text-muted-foreground">Week</span>
            </div>
            <div className="text-xl font-bold text-blue-500">{Math.round(metrics.weeklyGoalProgress)}%</div>
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              Weekly Goal Progress
            </span>
            <span className="font-medium">{Math.round(metrics.weeklyGoalProgress)}%</span>
          </div>
          <Progress value={metrics.weeklyGoalProgress} className="h-2" />
          <p className="text-xs text-muted-foreground">Goal: 3 sessions per week</p>
        </div>

        {/* Recent Techniques */}
        {metrics.recentTechniques.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-sm font-medium">
              <Brain className="h-3 w-3" />
              Recent Techniques
            </div>
            <div className="flex flex-wrap gap-1">
              {metrics.recentTechniques.map((technique, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {technique}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Next Milestone */}
        <div className="p-3 bg-gradient-to-r from-therapy-100 to-calm-100 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-therapy-600" />
            <span className="font-medium">Next Milestone:</span>
          </div>
          <p className="text-sm text-therapy-700 mt-1">{metrics.nextMilestone}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionProgressTracker;