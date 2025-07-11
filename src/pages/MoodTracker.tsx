import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Calendar, TrendingUp, Smile, AlertTriangle, Heart } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MoodTracker = () => {
  const { user } = useAuth();
  const [currentMood, setCurrentMood] = useState(5);
  const [moodEntries, setMoodEntries] = useState<any[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [triggers, setTriggers] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      fetchMoodEntries();
    }
  }, [user]);

  const fetchMoodEntries = async () => {
    try {
      const { data } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(30);
      
      setMoodEntries(data || []);
      
      // Process data for weekly chart
      const last7Days = data?.slice(0, 7).reverse().map((entry, index) => ({
        day: new Date(entry.created_at).toLocaleDateString('en-US', { weekday: 'short' }),
        mood: entry.overall,
        date: entry.created_at
      })) || [];
      
      setWeeklyData(last7Days);
    } catch (error) {
      console.error('Error fetching mood entries:', error);
    }
  };

  const logMood = async () => {
    if (!user) return;

    try {
      await supabase.from('mood_entries').insert({
        user_id: user.id,
        overall: currentMood,
        energy: currentMood,
        stress: 10 - currentMood,
        anxiety: Math.max(1, 10 - currentMood),
        triggers: triggers
      });

      setCurrentMood(5);
      setTriggers([]);
      fetchMoodEntries();
    } catch (error) {
      console.error('Error logging mood:', error);
    }
  };

  const toggleTrigger = (trigger: string) => {
    setTriggers(prev => 
      prev.includes(trigger) 
        ? prev.filter(t => t !== trigger)
        : [...prev, trigger]
    );
  };

  const getMoodEmoji = (mood: number) => {
    if (mood <= 2) return '😢';
    if (mood <= 4) return '😞';
    if (mood <= 6) return '😐';
    if (mood <= 8) return '🙂';
    return '😊';
  };

  const getMoodLabel = (mood: number) => {
    if (mood <= 2) return 'Very Low';
    if (mood <= 4) return 'Low';
    if (mood <= 6) return 'Neutral';
    if (mood <= 8) return 'Good';
    return 'Excellent';
  };

  const averageMood = moodEntries.length > 0 
    ? moodEntries.reduce((sum, entry) => sum + entry.overall, 0) / moodEntries.length 
    : 0;

  const commonTriggers = [
    'Work Stress', 'Family', 'Health', 'Money', 'Relationships', 
    'Sleep', 'Weather', 'Social Media', 'Exercise', 'Diet'
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mood Tracker</h1>
          <p className="text-gray-600 mt-1">Monitor your emotional well-being and identify patterns</p>
        </div>
        <Button onClick={logMood}>
          <Heart className="w-4 h-4 mr-2" />
          Log Current Mood
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Mood</CardTitle>
            <Smile className="h-4 w-4 text-therapy-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageMood.toFixed(1)}/10</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entries This Week</CardTitle>
            <Calendar className="h-4 w-4 text-therapy-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyData.length}</div>
            <p className="text-xs text-muted-foreground">Days tracked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trend</CardTitle>
            <TrendingUp className="h-4 w-4 text-therapy-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+0.5</div>
            <p className="text-xs text-muted-foreground">Improvement this week</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="log" className="space-y-4">
        <TabsList>
          <TabsTrigger value="log">Log Mood</TabsTrigger>
          <TabsTrigger value="trends">Trends & Patterns</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="log" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>How are you feeling right now?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-6xl mb-2">{getMoodEmoji(currentMood)}</div>
                <div className="text-xl font-medium">{getMoodLabel(currentMood)}</div>
                <div className="text-sm text-gray-500">Mood: {currentMood}/10</div>
              </div>
              
              <div className="px-4">
                <Slider
                  value={[currentMood]}
                  onValueChange={(value) => setCurrentMood(value[0])}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Very Low</span>
                  <span>Neutral</span>
                  <span>Excellent</span>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">What's affecting your mood? (Optional)</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {commonTriggers.map((trigger) => (
                    <Button
                      key={trigger}
                      variant={triggers.includes(trigger) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleTrigger(trigger)}
                    >
                      {trigger}
                    </Button>
                  ))}
                </div>
              </div>

              <Button onClick={logMood} className="w-full">
                Log This Mood Entry
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>7-Day Mood Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[1, 10]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="mood" 
                    stroke="hsl(var(--therapy-600))" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--therapy-600))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {moodEntries.slice(0, 5).map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{getMoodEmoji(entry.overall)}</span>
                        <div>
                          <div className="font-medium">{getMoodLabel(entry.overall)}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(entry.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm font-medium">{entry.overall}/10</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Common Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-therapy-50 rounded border-l-4 border-therapy-500">
                    <div className="font-medium text-sm">Best Day</div>
                    <div className="text-xs text-gray-600">Fridays tend to be your highest mood days</div>
                  </div>
                  <div className="p-3 bg-orange-50 rounded border-l-4 border-orange-500">
                    <div className="font-medium text-sm">Watch Out</div>
                    <div className="text-xs text-gray-600">Monday mornings show lower mood patterns</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded border-l-4 border-green-500">
                    <div className="font-medium text-sm">Improving</div>
                    <div className="text-xs text-gray-600">Overall trend shows positive improvement</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>AI Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-orange-500 mt-1" />
                    <div>
                      <h3 className="font-medium">Stress Pattern Detected</h3>
                      <p className="text-sm text-gray-600">
                        Your mood tends to dip on Monday mornings. Consider implementing a relaxing Sunday evening routine.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="w-5 h-5 text-green-500 mt-1" />
                    <div>
                      <h3 className="font-medium">Positive Trend</h3>
                      <p className="text-sm text-gray-600">
                        Your average mood has improved by 15% over the last month. Keep up the great work!
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Heart className="w-5 h-5 text-therapy-500 mt-1" />
                    <div>
                      <h3 className="font-medium">Recommendation</h3>
                      <p className="text-sm text-gray-600">
                        Based on your patterns, practicing mindfulness in the morning might help stabilize your mood throughout the day.
                      </p>
                    </div>
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

export default MoodTracker;