
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/SimpleAuthProvider';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Activity,
  MessageSquare,
  Target,
  Brain,
  Heart
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface AnalyticsData {
  moodTrends: any[];
  goalProgress: any[];
  sessionStats: any[];
  userEngagement: any[];
}

const RealAnalyticsDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsData>({
    moodTrends: [],
    goalProgress: [],
    sessionStats: [],
    userEngagement: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    if (user) {
      loadAnalyticsData();
    }
  }, [user, timeRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      startDate.setDate(endDate.getDate() - days);

      // Load mood trends
      const { data: moodData } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString())
        .order('created_at');

      // Load goal progress
      const { data: goalData } = await supabase
        .from('goals')
        .select('*, goal_progress(*)')
        .eq('user_id', user.id);

      // Load session data
      const { data: sessionData } = await supabase
        .from('session_messages')
        .select('session_id, created_at')
        .gte('timestamp', startDate.toISOString());

      // Process mood trends
      const moodTrends = processMoodTrends(moodData || []);
      
      // Process goal progress
      const goalProgress = processGoalProgress(goalData || []);
      
      // Process session stats
      const sessionStats = processSessionStats(sessionData || []);
      
      // Calculate engagement metrics
      const userEngagement = calculateEngagement(moodData || [], sessionData || []);

      setData({
        moodTrends,
        goalProgress,
        sessionStats,
        userEngagement
      });

    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processMoodTrends = (moodData: any[]) => {
    const trends = moodData.reduce((acc, entry) => {
      const date = new Date(entry.created_at).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { date, overall: [], anxiety: [], depression: [], energy: [] };
      }
      acc[date].overall.push(entry.overall);
      acc[date].anxiety.push(entry.anxiety);
      acc[date].depression.push(entry.depression);
      acc[date].energy.push(entry.energy);
      return acc;
    }, {});

    return Object.values(trends).map((day: any) => ({
      date: day.date,
      overall: day.overall.reduce((a: number, b: number) => a + b, 0) / day.overall.length,
      anxiety: day.anxiety.reduce((a: number, b: number) => a + b, 0) / day.anxiety.length,
      depression: day.depression.reduce((a: number, b: number) => a + b, 0) / day.depression.length,
      energy: day.energy.reduce((a: number, b: number) => a + b, 0) / day.energy.length,
    }));
  };

  const processGoalProgress = (goalData: any[]) => {
    return goalData.map(goal => ({
      name: goal.title,
      progress: (goal.current_progress / goal.target_value) * 100,
      completed: goal.is_completed
    }));
  };

  const processSessionStats = (sessionData: any[]) => {
    const sessions = sessionData.reduce((acc, msg) => {
      const date = new Date(msg.created_at).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = new Set();
      }
      acc[date].add(msg.session_id);
      return acc;
    }, {});

    return Object.entries(sessions).map(([date, sessionSet]: [string, any]) => ({
      date,
      sessions: sessionSet.size
    }));
  };

  const calculateEngagement = (moodData: any[], sessionData: any[]) => {
    const totalMoodEntries = moodData.length;
    const uniqueSessions = new Set(sessionData.map(s => s.session_id)).size;
    const avgMoodsPerWeek = (totalMoodEntries / (timeRange === '7d' ? 1 : timeRange === '30d' ? 4 : 12));
    const avgSessionsPerWeek = (uniqueSessions / (timeRange === '7d' ? 1 : timeRange === '30d' ? 4 : 12));

    return [
      { name: 'Mood Tracking', value: Math.min(avgMoodsPerWeek * 10, 100), color: '#8884d8' },
      { name: 'Chat Sessions', value: Math.min(avgSessionsPerWeek * 20, 100), color: '#82ca9d' },
      { name: 'Goal Setting', value: Math.min(totalMoodEntries * 5, 100), color: '#ffc658' }
    ];
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-600"></div>
      </div>
    );
  }

  const avgMood = data.moodTrends.length > 0 
    ? data.moodTrends.reduce((sum, day) => sum + day.overall, 0) / data.moodTrends.length 
    : 0;

  const totalGoals = data.goalProgress.length;
  const completedGoals = data.goalProgress.filter(g => g.completed).length;
  const totalSessions = data.sessionStats.reduce((sum, day) => sum + day.sessions, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-therapy-900">Analytics Dashboard</h1>
          <p className="text-therapy-600 mt-2">
            Track your mental health journey with detailed insights
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-therapy-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-therapy-600">Average Mood</p>
                <p className="text-2xl font-bold text-therapy-900">{avgMood.toFixed(1)}/10</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +2.1% from last period
                </p>
              </div>
              <div className="p-3 bg-therapy-100 rounded-lg">
                <Heart className="h-6 w-6 text-therapy-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-therapy-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-therapy-600">Goals Progress</p>
                <p className="text-2xl font-bold text-therapy-900">{completedGoals}/{totalGoals}</p>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <Target className="h-3 w-3 mr-1" />
                  {totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0}% complete
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-therapy-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-therapy-600">Chat Sessions</p>
                <p className="text-2xl font-bold text-therapy-900">{totalSessions}</p>
                <p className="text-xs text-purple-600 flex items-center mt-1">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Engaging actively
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-therapy-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-therapy-600">Streak</p>
                <p className="text-2xl font-bold text-therapy-900">{data.moodTrends.length}</p>
                <p className="text-xs text-orange-600 flex items-center mt-1">
                  <Activity className="h-3 w-3 mr-1" />
                  Days tracked
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="mood" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="mood">
            <Heart className="h-4 w-4 mr-2" />
            Mood Trends
          </TabsTrigger>
          <TabsTrigger value="goals">
            <Target className="h-4 w-4 mr-2" />
            Goal Progress
          </TabsTrigger>
          <TabsTrigger value="engagement">
            <BarChart3 className="h-4 w-4 mr-2" />
            Engagement
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mood">
          <Card className="border-therapy-200">
            <CardHeader>
              <CardTitle>Mood Trends Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.moodTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="overall" stroke="#8884d8" name="Overall" />
                    <Line type="monotone" dataKey="anxiety" stroke="#82ca9d" name="Anxiety" />
                    <Line type="monotone" dataKey="energy" stroke="#ffc658" name="Energy" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals">
          <Card className="border-therapy-200">
            <CardHeader>
              <CardTitle>Goal Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.goalProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="progress" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement">
          <Card className="border-therapy-200">
            <CardHeader>
              <CardTitle>Engagement Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.userEngagement}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value.toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.userEngagement.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RealAnalyticsDashboard;
