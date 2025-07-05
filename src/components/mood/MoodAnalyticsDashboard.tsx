import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Heart, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Activity,
  Brain,
  Sun,
  Moon,
  BarChart3,
  Download
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

const MoodAnalyticsDashboard = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('30d');

  const { data: moodData, isLoading } = useQuery({
    queryKey: ['mood-analytics', user?.id, timeRange],
    queryFn: async () => {
      if (!user?.id) return null;

      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const startDate = startOfDay(subDays(new Date(), days));

      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching mood data:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user?.id,
  });

  // Process data for analytics
  const chartData = moodData?.map(entry => ({
    date: format(new Date(entry.created_at), 'MMM dd'),
    overall: entry.overall,
    anxiety: entry.anxiety,
    stress: entry.stress,
    energy: entry.energy,
    sleep: entry.sleep_quality,
    social: entry.social_connection
  })) || [];

  // Calculate statistics
  const stats = useMemo(() => {
    if (!moodData || moodData.length === 0) {
      return {
        averageMood: 0,
        moodTrend: 0,
        totalEntries: 0,
        streakDays: 0,
        bestMoodDay: 'N/A',
        worstMoodDay: 'N/A'
      };
    }

    const avgMood = moodData.reduce((sum, entry) => sum + entry.overall, 0) / moodData.length;
    const recent7 = moodData.slice(-7);
    const previous7 = moodData.slice(-14, -7);
    
    const recentAvg = recent7.length > 0 ? recent7.reduce((sum, entry) => sum + entry.overall, 0) / recent7.length : 0;
    const previousAvg = previous7.length > 0 ? previous7.reduce((sum, entry) => sum + entry.overall, 0) / previous7.length : 0;
    
    const trend = recentAvg - previousAvg;

    const bestEntry = moodData.reduce((best, entry) => 
      entry.overall > best.overall ? entry : best
    );
    const worstEntry = moodData.reduce((worst, entry) => 
      entry.overall < worst.overall ? entry : worst
    );

    return {
      averageMood: avgMood,
      moodTrend: trend,
      totalEntries: moodData.length,
      streakDays: moodData.length, // Simplified calculation
      bestMoodDay: format(new Date(bestEntry.created_at), 'MMM dd'),
      worstMoodDay: format(new Date(worstEntry.created_at), 'MMM dd')
    };
  }, [moodData]);

  // Mood distribution data for pie chart
  const moodDistribution = useMemo(() => {
    if (!moodData || moodData.length === 0) return [];

    const distribution = {
      'Great (8-10)': 0,
      'Good (6-7)': 0,
      'Okay (4-5)': 0,
      'Low (1-3)': 0
    };

    moodData.forEach(entry => {
      if (entry.overall >= 8) distribution['Great (8-10)']++;
      else if (entry.overall >= 6) distribution['Good (6-7)']++;
      else if (entry.overall >= 4) distribution['Okay (4-5)']++;
      else distribution['Low (1-3)']++;
    });

    return Object.entries(distribution).map(([name, value]) => ({
      name,
      value,
      percentage: ((value / moodData.length) * 100).toFixed(1)
    }));
  }, [moodData]);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Mood</p>
                <p className="text-2xl font-bold">{stats.averageMood.toFixed(1)}/10</p>
              </div>
              <Heart className="h-8 w-8 text-therapy-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Trend (7d)</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold">
                    {stats.moodTrend > 0 ? '+' : ''}{stats.moodTrend.toFixed(1)}
                  </p>
                  {stats.moodTrend > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500 ml-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 ml-1" />
                  )}
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Entries</p>
                <p className="text-2xl font-bold">{stats.totalEntries}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tracking Streak</p>
                <p className="text-2xl font-bold">{stats.streakDays} days</p>
              </div>
              <Activity className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Mood Trends Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[1, 10]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="overall" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  name="Overall Mood"
                />
                <Line 
                  type="monotone" 
                  dataKey="anxiety" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Anxiety"
                />
                <Line 
                  type="monotone" 
                  dataKey="stress" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  name="Stress"
                />
                <Line 
                  type="monotone" 
                  dataKey="energy" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Energy"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Mood Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={moodDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                  >
                    {moodDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Sleep & Energy Correlation */}
        <Card>
          <CardHeader>
            <CardTitle>Sleep Quality vs Energy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[1, 10]} />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="sleep" 
                    stackId="1" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.6}
                    name="Sleep Quality"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="energy" 
                    stackId="2" 
                    stroke="#10b981" 
                    fill="#10b981" 
                    fillOpacity={0.6}
                    name="Energy Level"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Best/Worst Days */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Best Mood Day</p>
                <p className="text-xl font-bold text-green-900">{stats.bestMoodDay}</p>
              </div>
              <Sun className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">Challenging Day</p>
                <p className="text-xl font-bold text-red-900">{stats.worstMoodDay}</p>
              </div>
              <Moon className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MoodAnalyticsDashboard;