
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { CalendarDays, TrendingUp, Brain, Heart } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSimpleApp } from '@/hooks/useSimpleApp';

interface MoodEntry {
  id: string;
  user_id: string;
  overall: number;
  anxiety: number;
  depression: number;
  stress: number;
  energy: number;
  sleep_quality: number;
  social_connection: number;
  notes: string;
  activities: string[];
  triggers: string[];
  weather: string;
  created_at: string;
  timestamp: string;
}

const AdvancedMoodAnalytics = () => {
  const { user } = useSimpleApp();
  const [timeRange, setTimeRange] = useState('7d');

  const { data: moodEntries = [], isLoading } = useQuery({
    queryKey: ['mood-analytics', user?.id, timeRange],
    queryFn: async () => {
      if (!user?.id) return [];

      const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysBack);

      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as MoodEntry[];
    },
    enabled: !!user?.id,
  });

  // Calculate trends and insights
  const calculateTrends = () => {
    if (moodEntries.length < 2) return null;

    const recent = moodEntries.slice(-3);
    const earlier = moodEntries.slice(0, 3);

    const recentAvg = recent.reduce((sum, entry) => sum + entry.overall, 0) / recent.length;
    const earlierAvg = earlier.reduce((sum, entry) => sum + entry.overall, 0) / earlier.length;

    return {
      trend: recentAvg > earlierAvg ? 'improving' : recentAvg < earlierAvg ? 'declining' : 'stable',
      change: Math.abs(recentAvg - earlierAvg).toFixed(1)
    };
  };

  const trends = calculateTrends();

  // Prepare chart data
  const chartData = moodEntries.map(entry => ({
    date: new Date(entry.created_at).toLocaleDateString(),
    overall: entry.overall,
    anxiety: entry.anxiety,
    stress: entry.stress,
    energy: entry.energy
  }));

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Mood Analytics</h2>
        <select 
          value={timeRange} 
          onChange={(e) => setTimeRange(e.target.value)}
          className="border rounded-md px-3 py-2"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Average Mood</p>
                <p className="text-2xl font-bold">
                  {moodEntries.length > 0 
                    ? (moodEntries.reduce((sum, entry) => sum + entry.overall, 0) / moodEntries.length).toFixed(1)
                    : 'N/A'
                  }/10
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Trend</p>
                <p className="text-2xl font-bold capitalize">
                  {trends?.trend || 'Stable'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CalendarDays className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Entries</p>
                <p className="text-2xl font-bold">{moodEntries.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mood Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Mood Trends Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[1, 10]} />
              <Tooltip />
              <Line type="monotone" dataKey="overall" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="anxiety" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="stress" stroke="#f59e0b" strokeWidth={2} />
              <Line type="monotone" dataKey="energy" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedMoodAnalytics;
