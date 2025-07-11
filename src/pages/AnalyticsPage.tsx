import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { 
  TrendingUp, 
  BarChart3, 
  Calendar, 
  Target, 
  Brain,
  Zap,
  Clock,
  Award
} from 'lucide-react';

const AnalyticsPage = () => {
  const { user } = useAuth();
  const [overallMetrics, setOverallMetrics] = React.useState({
    therapyProgress: 0,
    goalCompletion: 0,
    moodImprovement: 0,
    sessionFrequency: 0
  });

  React.useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) return;

      try {
        // Fetch goals for completion rate
        const { data: goals } = await supabase
          .from('goals')
          .select('*')
          .eq('user_id', user.id);

        // Fetch sessions for frequency
        const { data: sessions } = await supabase
          .from('therapy_sessions')
          .select('*')
          .eq('user_id', user.id);

        // Fetch mood data for improvement
        const { data: moods } = await supabase
          .from('mood_entries')
          .select('overall, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });

        // Calculate metrics
        const completedGoals = goals?.filter(g => g.is_completed).length || 0;
        const totalGoals = goals?.length || 0;
        const goalCompletion = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

        // Calculate therapy progress based on sessions and goals
        const therapyProgress = Math.min(((sessions?.length || 0) * 10 + completedGoals * 20), 100);

        // Calculate mood improvement
        let moodImprovement = 0;
        if (moods && moods.length > 1) {
          const firstMood = moods[0].overall;
          const recentMoods = moods.slice(-7); // Last 7 entries
          const avgRecentMood = recentMoods.reduce((sum, m) => sum + m.overall, 0) / recentMoods.length;
          moodImprovement = ((avgRecentMood - firstMood) / firstMood) * 100;
        }

        // Calculate session frequency (sessions per week)
        const sessionFrequency = sessions && sessions.length > 0 
          ? (sessions.length / 4) // Assuming 4 weeks of data
          : 0;

        setOverallMetrics({
          therapyProgress: Math.round(therapyProgress),
          goalCompletion: Math.round(goalCompletion),
          moodImprovement: Math.round(moodImprovement),
          sessionFrequency: Number(sessionFrequency.toFixed(1))
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    fetchAnalytics();
  }, [user]);

  const [weeklyData, setWeeklyData] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchWeeklyData = async () => {
      if (!user) return;

      try {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const weeklyStats = [];

        for (let i = 0; i < 7; i++) {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          const dayName = days[date.getDay() === 0 ? 6 : date.getDay() - 1];

          // Fetch mood for this day
          const { data: dayMoods } = await supabase
            .from('mood_entries')
            .select('overall')
            .eq('user_id', user.id)
            .gte('created_at', date.toISOString().split('T')[0])
            .lt('created_at', new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

          // Fetch sessions for this day
          const { data: daySessions } = await supabase
            .from('therapy_sessions')
            .select('id')
            .eq('user_id', user.id)
            .gte('start_time', date.toISOString().split('T')[0])
            .lt('start_time', new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

          const avgMood = dayMoods && dayMoods.length > 0
            ? dayMoods.reduce((sum, m) => sum + m.overall, 0) / dayMoods.length
            : 0;

          weeklyStats.push({
            day: dayName,
            mood: Math.round(avgMood),
            sessions: daySessions?.length || 0,
            goals: Math.floor(Math.random() * 5) + 1 // Mock goals for now
          });
        }

        setWeeklyData(weeklyStats);
      } catch (error) {
        console.error('Error fetching weekly data:', error);
        // Fallback data
        setWeeklyData([
          { day: 'Mon', mood: 0, sessions: 0, goals: 0 },
          { day: 'Tue', mood: 0, sessions: 0, goals: 0 },
          { day: 'Wed', mood: 0, sessions: 0, goals: 0 },
          { day: 'Thu', mood: 0, sessions: 0, goals: 0 },
          { day: 'Fri', mood: 0, sessions: 0, goals: 0 },
          { day: 'Sat', mood: 0, sessions: 0, goals: 0 },
          { day: 'Sun', mood: 0, sessions: 0, goals: 0 }
        ]);
      }
    };

    fetchWeeklyData();
  }, [user]);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-therapy-600 to-harmony-600 bg-clip-text text-transparent">
          Advanced Analytics
        </h1>
        <p className="text-muted-foreground mt-1">
          Comprehensive insights into your mental health journey and progress
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-therapy-200 bg-gradient-to-r from-therapy-25 to-therapy-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-therapy-700">Therapy Progress</p>
                <p className="text-2xl font-bold text-therapy-800">{overallMetrics.therapyProgress}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-therapy-600" />
            </div>
            <Progress value={overallMetrics.therapyProgress} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card className="border-harmony-200 bg-gradient-to-r from-harmony-25 to-harmony-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-harmony-700">Goal Completion</p>
                <p className="text-2xl font-bold text-harmony-800">{overallMetrics.goalCompletion}%</p>
              </div>
              <Target className="h-8 w-8 text-harmony-600" />
            </div>
            <Progress value={overallMetrics.goalCompletion} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card className="border-flow-200 bg-gradient-to-r from-flow-25 to-flow-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-flow-700">Mood Improvement</p>
                <p className="text-2xl font-bold text-flow-800">+{overallMetrics.moodImprovement}%</p>
              </div>
              <Brain className="h-8 w-8 text-flow-600" />
            </div>
            <div className="mt-2 text-xs text-flow-600">vs last month</div>
          </CardContent>
        </Card>
        
        <Card className="border-calm-200 bg-gradient-to-r from-calm-25 to-calm-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-calm-700">Session Frequency</p>
                <p className="text-2xl font-bold text-calm-800">{overallMetrics.sessionFrequency}/week</p>
              </div>
              <Calendar className="h-8 w-8 text-calm-600" />
            </div>
            <div className="mt-2 text-xs text-calm-600">optimal range</div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-therapy-600" />
            Weekly Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-4">
            {weeklyData.map((day) => (
              <div key={day.day} className="text-center">
                <p className="text-sm font-medium mb-2">{day.day}</p>
                <div className="space-y-2">
                  <div className="bg-therapy-100 rounded p-2">
                    <p className="text-xs text-therapy-700">Mood</p>
                    <p className="text-lg font-bold text-therapy-800">{day.mood}</p>
                  </div>
                  <div className="bg-harmony-100 rounded p-2">
                    <p className="text-xs text-harmony-700">Sessions</p>
                    <p className="text-lg font-bold text-harmony-800">{day.sessions}</p>
                  </div>
                  <div className="bg-flow-100 rounded p-2">
                    <p className="text-xs text-flow-700">Goals</p>
                    <p className="text-lg font-bold text-flow-800">{day.goals}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights & Recommendations */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2 text-therapy-600" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-therapy-500 pl-4">
                <h3 className="font-semibold">Peak Performance Pattern</h3>
                <p className="text-sm text-muted-foreground">
                  Your mood scores are consistently highest on Fridays and Saturdays.
                </p>
                <Badge variant="outline" className="mt-1">High Confidence</Badge>
              </div>
              <div className="border-l-4 border-harmony-500 pl-4">
                <h3 className="font-semibold">Session Timing Optimization</h3>
                <p className="text-sm text-muted-foreground">
                  Morning sessions show 15% better engagement compared to afternoon.
                </p>
                <Badge variant="outline" className="mt-1">Medium Confidence</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2 text-therapy-600" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-therapy-500 rounded-full flex items-center justify-center">
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium">7-Day Streak</p>
                  <p className="text-sm text-muted-foreground">Daily mood tracking</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-harmony-500 rounded-full flex items-center justify-center">
                  <Target className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium">Goal Milestone</p>
                  <p className="text-sm text-muted-foreground">Completed 10 therapy goals</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-flow-500 rounded-full flex items-center justify-center">
                  <Brain className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium">Insight Unlocked</p>
                  <p className="text-sm text-muted-foreground">Discovered anxiety trigger pattern</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-4">
        <Button>
          <BarChart3 className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
        <Button variant="outline">
          <Zap className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>
    </div>
  );
};

export default AnalyticsPage;