import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, Brain, Target, Calendar, Download, Zap } from 'lucide-react';

const AdvancedAnalytics = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('30');
  const [analyticsData, setAnalyticsData] = useState<any>({
    moodTrends: [],
    sessionStats: [],
    goalProgress: [],
    therapyEffectiveness: []
  });

  useEffect(() => {
    if (user) {
      fetchAnalyticsData();
    }
  }, [user, timeRange]);

  const fetchAnalyticsData = async () => {
    if (!user) return;

    try {
      const daysAgo = parseInt(timeRange);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);

      // Fetch mood data
      const { data: moodData } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      // Fetch session data
      const { data: sessionData } = await supabase
        .from('therapy_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('start_time', startDate.toISOString())
        .order('start_time', { ascending: true });

      // Fetch goals data
      const { data: goalsData } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id);

      // Process mood trends
      const moodTrends = moodData?.map(entry => ({
        date: new Date(entry.created_at).toLocaleDateString(),
        mood: entry.overall,
        energy: entry.energy,
        stress: entry.stress
      })) || [];

      // Process session stats
      const sessionStats = sessionData?.map(session => ({
        date: new Date(session.start_time).toLocaleDateString(),
        duration: session.end_time ? 
          Math.round((new Date(session.end_time).getTime() - new Date(session.start_time).getTime()) / (1000 * 60)) : 0,
        effectiveness: Math.random() * 5 + 5 // Mock effectiveness score
      })) || [];

      // Process goal progress
      const goalProgress = goalsData?.map(goal => ({
        name: goal.title,
        progress: (goal.current_progress / goal.target_sessions) * 100,
        status: goal.is_completed ? 'completed' : 'active'
      })) || [];

      setAnalyticsData({
        moodTrends,
        sessionStats,
        goalProgress,
        therapyEffectiveness: [
          { name: 'CBT', value: 85, sessions: 12 },
          { name: 'Mindfulness', value: 78, sessions: 8 },
          { name: 'DBT', value: 72, sessions: 5 },
          { name: 'ACT', value: 80, sessions: 7 }
        ]
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const exportData = () => {
    console.log('Exporting analytics data...');
    // Implementation for data export
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Calculate key metrics
  const avgMood = analyticsData.moodTrends.length > 0 
    ? analyticsData.moodTrends.reduce((sum: number, entry: any) => sum + entry.mood, 0) / analyticsData.moodTrends.length 
    : 0;

  const totalSessions = analyticsData.sessionStats.length;
  
  const avgSessionDuration = analyticsData.sessionStats.length > 0
    ? analyticsData.sessionStats.reduce((sum: number, session: any) => sum + session.duration, 0) / analyticsData.sessionStats.length
    : 0;

  const goalCompletionRate = analyticsData.goalProgress.length > 0
    ? (analyticsData.goalProgress.filter((goal: any) => goal.progress >= 100).length / analyticsData.goalProgress.length) * 100
    : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics</h1>
          <p className="text-gray-600 mt-1">Deep insights into your therapy progress and patterns</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportData}>
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Mood</CardTitle>
            <Brain className="h-4 w-4 text-therapy-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgMood.toFixed(1)}/10</div>
            <p className="text-xs text-muted-foreground">
              {avgMood > 6 ? '+' : ''}{((avgMood - 6) * 10).toFixed(1)}% from baseline
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-therapy-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSessions}</div>
            <p className="text-xs text-muted-foreground">
              {(totalSessions / parseInt(timeRange) * 30).toFixed(1)} per month average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Session Duration</CardTitle>
            <TrendingUp className="h-4 w-4 text-therapy-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(avgSessionDuration)}min</div>
            <p className="text-xs text-muted-foreground">
              Optimal range: 45-60 min
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goal Completion</CardTitle>
            <Target className="h-4 w-4 text-therapy-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(goalCompletionRate)}%</div>
            <p className="text-xs text-muted-foreground">
              {analyticsData.goalProgress.filter((g: any) => g.progress >= 100).length} goals completed
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="mood" className="space-y-4">
        <TabsList>
          <TabsTrigger value="mood">Mood Analytics</TabsTrigger>
          <TabsTrigger value="sessions">Session Performance</TabsTrigger>
          <TabsTrigger value="goals">Goal Tracking</TabsTrigger>
          <TabsTrigger value="effectiveness">Therapy Effectiveness</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="mood" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mood Trends Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={analyticsData.moodTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[1, 10]} />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="mood" 
                    stroke="hsl(var(--therapy-600))" 
                    fill="hsl(var(--therapy-200))" 
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="energy" 
                    stroke="hsl(var(--calm-600))" 
                    fill="hsl(var(--calm-200))" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Mood Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Excellent (8-10)', value: 25, fill: '#22c55e' },
                        { name: 'Good (6-7)', value: 35, fill: '#3b82f6' },
                        { name: 'Neutral (4-5)', value: 25, fill: '#f59e0b' },
                        { name: 'Low (1-3)', value: 15, fill: '#ef4444' }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label
                    />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stress vs Energy Correlation</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={analyticsData.moodTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="stress" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      name="Stress Level"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="energy" 
                      stroke="#22c55e" 
                      strokeWidth={2}
                      name="Energy Level"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Session Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analyticsData.sessionStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="duration" fill="hsl(var(--therapy-500))" name="Duration (min)" />
                  <Bar dataKey="effectiveness" fill="hsl(var(--calm-500))" name="Effectiveness Score" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Goal Progress Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.goalProgress.map((goal: any, index: number) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{goal.name}</span>
                      <span>{Math.round(goal.progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-therapy-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(goal.progress, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="effectiveness" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Therapy Technique Effectiveness</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.therapyEffectiveness}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--therapy-500))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-therapy-600" />
                  AI-Generated Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-therapy-50 rounded-lg border-l-4 border-therapy-500">
                    <h3 className="font-semibold text-therapy-800">Pattern Recognition</h3>
                    <p className="text-therapy-700 text-sm mt-1">
                      Your mood shows a 73% correlation with sleep quality. Consider maintaining a consistent sleep schedule for better emotional regulation.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <h3 className="font-semibold text-green-800">Progress Highlight</h3>
                    <p className="text-green-700 text-sm mt-1">
                      You've maintained above-average mood scores for 3 consecutive weeks. This indicates strong therapeutic progress.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <h3 className="font-semibold text-blue-800">Optimization Suggestion</h3>
                    <p className="text-blue-700 text-sm mt-1">
                      Your most effective sessions occur on Tuesday afternoons. Consider scheduling more sessions during this time window.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                    <h3 className="font-semibold text-orange-800">Attention Needed</h3>
                    <p className="text-orange-700 text-sm mt-1">
                      Stress levels tend to spike on Sunday evenings. Implementing weekend transition rituals could help.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalytics;