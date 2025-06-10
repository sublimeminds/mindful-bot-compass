
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Brain, BarChart3, Plus, TrendingUp, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import DetailedMoodTracker from "@/components/mood/DetailedMoodTracker";
import MoodInsightsDashboard from "@/components/mood/MoodInsightsDashboard";
import { MoodTrackingService, DetailedMood } from "@/services/moodTrackingService";
import { useToast } from "@/hooks/use-toast";
import { format, startOfMonth, endOfMonth } from 'date-fns';

interface MoodEntry {
  id: string;
  userId: string;
  timestamp: Date;
  overall: number;
  anxiety: number;
  energy: number;
  stress: number;
  depression?: number;
  sleep_quality?: number;
  social_connection?: number;
  activities?: string[];
  triggers?: string[];
  notes?: string;
  weather?: string;
}

const MoodTracking = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch mood entries from Supabase
  const { data: moodEntries = [], isLoading, refetch } = useQuery({
    queryKey: ['mood-entries', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      
      return data.map(entry => ({
        id: entry.id,
        userId: entry.user_id,
        timestamp: new Date(entry.created_at),
        overall: entry.overall,
        anxiety: entry.anxiety,
        depression: entry.depression || entry.anxiety,
        stress: entry.stress,
        energy: entry.energy,
        sleep_quality: entry.sleep_quality,
        social_connection: entry.social_connection,
        activities: entry.activities || [],
        triggers: entry.triggers || [],
        notes: entry.notes,
        weather: entry.weather
      })) as MoodEntry[];
    },
    enabled: !!user?.id,
  });

  const handleMoodSubmit = async (
    mood: DetailedMood, 
    activities: string[], 
    triggers: string[], 
    notes: string
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('mood_entries')
        .insert({
          user_id: user.id,
          overall: mood.overall,
          anxiety: mood.anxiety,
          depression: mood.depression,
          stress: mood.stress,
          energy: mood.energy,
          sleep_quality: mood.sleep_quality,
          social_connection: mood.social_connection,
          activities,
          triggers,
          notes
        });

      if (error) throw error;

      refetch();
      setActiveTab('overview');

      toast({
        title: "Mood Logged Successfully",
        description: "Your mood data has been saved and insights updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log mood. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Generate insights and patterns
  const patterns = MoodTrackingService.analyzeMoodPatterns(moodEntries);
  const correlations = MoodTrackingService.getMoodCorrelations(moodEntries);
  const aiInsights = MoodTrackingService.getMoodInsights(moodEntries);

  // Transform data for insights dashboard
  const moodData = moodEntries.slice(0, 30).reverse().map(entry => ({
    date: format(entry.timestamp, 'MMM dd'),
    overall: entry.overall,
    anxiety: entry.anxiety,
    energy: entry.energy,
    stress: entry.stress
  }));

  const insights = [
    ...aiInsights,
    {
      type: 'info' as const,
      title: 'Time Patterns',
      description: `You tend to feel best during the ${patterns.bestTime} and lowest during the ${patterns.worstTime}.`,
      confidence: 0.8
    }
  ];

  const dashboardPatterns = {
    bestTimeOfDay: patterns.bestTime,
    worstTimeOfDay: patterns.worstTime,
    averageMood: moodEntries.length > 0 ? moodEntries.reduce((sum, entry) => sum + entry.overall, 0) / moodEntries.length : 0,
    moodVariability: moodEntries.length > 0 ? Math.sqrt(moodEntries.reduce((sum, entry) => sum + Math.pow(entry.overall - (moodEntries.reduce((s, e) => s + e.overall, 0) / moodEntries.length), 2), 0) / moodEntries.length) : 0,
    streak: 7 // Mock streak - could be calculated based on consecutive days
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">Loading your mood data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <Brain className="h-6 w-6 mr-2" />
                Mood Tracking
              </h1>
              <p className="text-muted-foreground">
                Track and analyze your mood patterns for better mental health insights
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        {moodEntries.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Entries</p>
                    <p className="text-2xl font-bold">{moodEntries.length}</p>
                  </div>
                  <Calendar className="h-6 w-6 text-therapy-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">This Month</p>
                    <p className="text-2xl font-bold">
                      {moodEntries.filter(entry => {
                        const entryDate = new Date(entry.timestamp);
                        const monthStart = startOfMonth(new Date());
                        const monthEnd = endOfMonth(new Date());
                        return entryDate >= monthStart && entryDate <= monthEnd;
                      }).length}
                    </p>
                  </div>
                  <TrendingUp className="h-6 w-6 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Mood</p>
                    <p className="text-2xl font-bold">{dashboardPatterns.averageMood.toFixed(1)}/10</p>
                  </div>
                  <Brain className="h-6 w-6 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Trend</p>
                    <p className={`text-lg font-bold ${patterns.trend === 'improving' ? 'text-green-600' : patterns.trend === 'declining' ? 'text-red-600' : 'text-gray-600'}`}>
                      {patterns.trend === 'improving' ? '↗️ Up' : patterns.trend === 'declining' ? '↘️ Down' : '➡️ Stable'}
                    </p>
                  </div>
                  <BarChart3 className="h-6 w-6 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Overview & Insights</span>
            </TabsTrigger>
            <TabsTrigger value="log" className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Log Mood</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>History</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {moodEntries.length > 0 ? (
              <MoodInsightsDashboard 
                moodData={moodData}
                insights={insights}
                patterns={dashboardPatterns}
              />
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No mood data yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start logging your mood to see patterns and insights
                  </p>
                  <Button onClick={() => setActiveTab('log')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Log Your First Mood
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="log" className="space-y-6">
            <DetailedMoodTracker 
              onMoodSubmit={handleMoodSubmit}
            />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            {moodEntries.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Mood History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {moodEntries.slice(0, 20).map(entry => (
                      <div key={entry.id} className="border-b pb-4 last:border-b-0">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm text-muted-foreground">
                            {format(entry.timestamp, 'MMM dd, yyyy • h:mm a')}
                          </span>
                          <div className="flex space-x-4 text-sm">
                            <span>Overall: {entry.overall}/10</span>
                            <span>Energy: {entry.energy}/10</span>
                            <span>Anxiety: {entry.anxiety}/10</span>
                          </div>
                        </div>
                        
                        {entry.activities && entry.activities.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {entry.activities.map((activity, idx) => (
                              <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                {activity}
                              </span>
                            ))}
                          </div>
                        )}

                        {entry.notes && (
                          <p className="text-sm text-muted-foreground">{entry.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No mood history yet</h3>
                  <p className="text-muted-foreground">
                    Your mood entries will appear here once you start logging
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MoodTracking;
