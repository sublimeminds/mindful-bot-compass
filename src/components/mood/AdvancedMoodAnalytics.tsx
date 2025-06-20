import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Calendar, Brain, Heart, BarChart3, Target, Zap, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSimpleApp } from '@/hooks/useSimpleApp';

interface MoodEntry {
  id: string;
  overall: number;
  anxiety: number;
  stress: number;
  energy: number;
  sleep: number;
  social: number;
  work: number;
  created_at: string;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#a4de6c', '#d0ed57'];

const AdvancedMoodAnalytics = () => {
  const { user } = useSimpleApp();
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedCategory, setSelectedCategory] = useState('overall');

  const { data: moodEntries = [], isLoading, error } = useQuery({
    queryKey: ['mood-entries', user?.id, timeRange],
    queryFn: async (): Promise<MoodEntry[]> => {
      if (!user?.id) return [];

      const startDate = new Date();
      if (timeRange === '7d') {
        startDate.setDate(startDate.getDate() - 7);
      } else if (timeRange === '30d') {
        startDate.setDate(startDate.getDate() - 30);
      } else if (timeRange === '90d') {
        startDate.setDate(startDate.getDate() - 90);
      }

      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching mood entries:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user?.id
  });

  const categoryOptions = useMemo(() => [
    { value: 'overall', label: 'Overall Mood', icon: Heart },
    { value: 'anxiety', label: 'Anxiety Level', icon: Brain },
    { value: 'stress', label: 'Stress Level', icon: Zap },
    { value: 'energy', label: 'Energy Level', icon: Brain },
    { value: 'sleep', label: 'Sleep Quality', icon: Brain },
    { value: 'social', label: 'Social Interaction', icon: Brain },
    { value: 'work', label: 'Work Productivity', icon: Brain }
  ], []);

  const chartData = useMemo(() => {
    return moodEntries.map(entry => ({
      date: new Date(entry.created_at).toLocaleDateString(),
      [selectedCategory]: entry[selectedCategory]
    }));
  }, [moodEntries, selectedCategory]);

  const averageMood = useMemo(() => {
    if (moodEntries.length === 0) return 0;
    const sum = moodEntries.reduce((acc, entry) => acc + entry[selectedCategory], 0);
    return sum / moodEntries.length;
  }, [moodEntries, selectedCategory]);

  const categoryLabel = categoryOptions.find(option => option.value === selectedCategory)?.label || 'Mood';

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {(error as Error).message}</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-therapy-600" />
              Mood Analytics
            </div>
            <div className="flex items-center space-x-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Line type="monotone" dataKey={selectedCategory} stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center mt-4">
            <h3 className="text-lg font-medium">Average {categoryLabel}: {averageMood.toFixed(1)}</h3>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedMoodAnalytics;
