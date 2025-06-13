
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Brain, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import DetailedMoodTracker from "@/components/mood/DetailedMoodTracker";
import MoodInsightsDashboard from "@/components/mood/MoodInsightsDashboard";
import Header from "@/components/Header";
import { useDebugLogger } from '@/utils/debugLogger';

const MoodTracking = () => {
  const log = useDebugLogger('MoodTracking');
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch real mood data from Supabase
  const { data: moodEntries = [], isLoading } = useQuery({
    queryKey: ['mood-entries', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(30);

      if (error) {
        console.error('Error fetching mood entries:', error);
        return [];
      }

      return data.map(entry => ({
        id: entry.id,
        userId: entry.user_id,
        timestamp: new Date(entry.created_at),
        overall: entry.overall,
        anxiety: entry.anxiety,
        depression: entry.depression,
        stress: entry.stress,
        energy: entry.energy,
        sleep_quality: entry.sleep_quality,
        social_connection: entry.social_connection,
        activities: entry.activities || [],
        triggers: entry.triggers || [],
        notes: entry.notes || ''
      }));
    },
    enabled: !!user?.id,
  });

  // Generate insights from real data
  const generateInsights = () => {
    if (moodEntries.length === 0) return [];

    const insights = [];
    const recentEntries = moodEntries.slice(0, 7);
    const averageRecent = recentEntries.reduce((sum, e) => sum + e.overall, 0) / recentEntries.length;

    if (averageRecent >= 7) {
      insights.push({
        type: 'positive' as const,
        title: 'Positive Trend',
        description: 'Your mood has been consistently good over the past week.',
        confidence: 0.8
      });
    } else if (averageRecent <= 4) {
      insights.push({
        type: 'warning' as const,
        title: 'Low Mood Pattern',
        description: 'Your mood has been lower than usual. Consider reaching out for support.',
        confidence: 0.75
      });
    }

    // Check for patterns
    const weekendMoods = recentEntries.filter(e => {
      const day = e.timestamp.getDay();
      return day === 0 || day === 6;
    });

    if (weekendMoods.length > 0 && recentEntries.length > weekendMoods.length) {
      const weekendAvg = weekendMoods.reduce((sum, e) => sum + e.overall, 0) / weekendMoods.length;
      const weekdayEntries = recentEntries.filter(e => {
        const day = e.timestamp.getDay();
        return day !== 0 && day !== 6;
      });
      const weekdayAvg = weekdayEntries.reduce((sum, e) => sum + e.overall, 0) / weekdayEntries.length;

      if (weekendAvg > weekdayAvg + 1) {
        insights.push({
          type: 'info' as const,
          title: 'Weekend Boost',
          description: 'Your mood tends to improve on weekends. Great work-life balance!',
          confidence: 0.7
        });
      }
    }

    return insights;
  };

  // Generate patterns from real data
  const generatePatterns = () => {
    if (moodEntries.length === 0) {
      return {
        bestTimeOfDay: 'Morning',
        worstTimeOfDay: 'Evening',
        averageMood: 5,
        moodVariability: 1,
        streak: 0
      };
    }

    const moods = moodEntries.map(e => e.overall);
    const averageMood = moods.reduce((sum, mood) => sum + mood, 0) / moods.length;
    const moodVariability = Math.sqrt(moods.reduce((sum, mood) => sum + Math.pow(mood - averageMood, 2), 0) / moods.length);

    return {
      bestTimeOfDay: 'Morning',
      worstTimeOfDay: 'Evening',
      averageMood: Math.round(averageMood * 10) / 10,
      moodVariability: Math.round(moodVariability * 10) / 10,
      streak: moodEntries.length
    };
  };

  useEffect(() => {
    log.info('MoodTracking component mounted', { 
      userId: user?.id,
      userEmail: user?.email,
      activeTab 
    });
  }, []);

  useEffect(() => {
    log.debug('Active tab changed', { activeTab });
  }, [activeTab]);

  const handleMoodSubmit = (moodData: any) => {
    log.info('Mood data submitted', { 
      moodData,
      userId: user?.id 
    });
    // Refresh the data
    window.location.reload();
  };

  const handleTabChange = (value: string) => {
    log.debug('Tab change requested', { from: activeTab, to: value });
    setActiveTab(value);
  };

  if (!user) {
    log.warn('User not authenticated, showing sign-in message');
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-8">Please sign in to track your mood.</div>
          </div>
        </div>
      </>
    );
  }

  const moodData = moodEntries.slice(0, 14).map((entry, index) => ({
    date: entry.timestamp.toISOString().split('T')[0],
    overall: entry.overall,
    anxiety: 10 - entry.anxiety, // Invert for better visualization
    energy: entry.energy,
    stress: entry.stress
  }));

  const insights = generateInsights();
  const patterns = generatePatterns();

  log.debug('Rendering MoodTracking for authenticated user', { 
    userId: user.id,
    activeTab,
    moodEntriesLength: moodEntries.length,
    insightsCount: insights.length
  });

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-8">Loading mood data...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold flex items-center">
                  <Brain className="h-6 w-6 mr-2" />
                  Mood Tracking
                </h1>
                <p className="text-muted-foreground">
                  Track and analyze your emotional well-being over time
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview" className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="log" className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Log Mood</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center space-x-2">
                <Brain className="h-4 w-4" />
                <span>History</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <MoodInsightsDashboard 
                moodData={moodData}
                insights={insights}
                patterns={patterns}
              />
            </TabsContent>

            <TabsContent value="log" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Log Your Current Mood</CardTitle>
                </CardHeader>
                <CardContent>
                  <DetailedMoodTracker onMoodSubmit={handleMoodSubmit} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mood History</CardTitle>
                </CardHeader>
                <CardContent>
                  {moodEntries.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No mood entries yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start logging your mood to see your history and trends
                      </p>
                      <Button onClick={() => setActiveTab('log')}>
                        Log Your First Mood
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {moodEntries.slice(0, 10).map(entry => (
                        <div key={entry.id} className="border-b pb-4 last:border-b-0">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm text-muted-foreground">
                              {entry.timestamp.toLocaleDateString()} at {entry.timestamp.toLocaleTimeString()}
                            </span>
                            <div className="flex space-x-4 text-sm">
                              <span>Mood: {entry.overall}/10</span>
                              <span>Energy: {entry.energy}/10</span>
                              <span>Stress: {entry.stress}/10</span>
                            </div>
                          </div>
                          
                          {entry.activities && entry.activities.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {entry.activities.map((activity, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {activity}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {entry.notes && (
                            <p className="text-sm text-muted-foreground">{entry.notes}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default MoodTracking;
