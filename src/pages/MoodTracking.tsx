
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Brain, BarChart3, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import DetailedMoodTracker from "@/components/mood/DetailedMoodTracker";
import MoodPatterns from "@/components/mood/MoodPatterns";
import { MoodTrackingService, DetailedMood, MoodEntry } from "@/services/moodTrackingService";
import { useToast } from "@/hooks/use-toast";

const MoodTracking = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [activeTab, setActiveTab] = useState('log');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for demonstration - in a real app, this would come from Supabase
  useEffect(() => {
    if (user) {
      // Generate some sample mood data for demonstration
      const sampleEntries: MoodEntry[] = [
        {
          id: '1',
          userId: user.id,
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          mood: { overall: 6, anxiety: 4, depression: 3, stress: 5, energy: 7, sleep_quality: 6, social_connection: 5 },
          activities: ['Exercise', 'Work', 'Reading'],
          triggers: ['Work Stress'],
          notes: 'Had a good workout in the morning'
        },
        {
          id: '2',
          userId: user.id,
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          mood: { overall: 8, anxiety: 2, depression: 2, stress: 3, energy: 8, sleep_quality: 8, social_connection: 7 },
          activities: ['Socializing', 'Meditation', 'Cooking'],
          triggers: [],
          notes: 'Great day with friends, felt very connected'
        },
        {
          id: '3',
          userId: user.id,
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          mood: { overall: 4, anxiety: 7, depression: 5, stress: 8, energy: 3, sleep_quality: 4, social_connection: 3 },
          activities: ['Work'],
          triggers: ['Work Stress', 'Lack of Sleep'],
          notes: 'Difficult day at work, stayed up too late'
        }
      ];
      setMoodEntries(sampleEntries);
    }
  }, [user]);

  const handleMoodSubmit = async (
    mood: DetailedMood, 
    activities: string[], 
    triggers: string[], 
    notes: string
  ) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const newEntry: MoodEntry = {
        id: Date.now().toString(),
        userId: user.id,
        timestamp: new Date(),
        mood,
        activities,
        triggers,
        notes
      };

      setMoodEntries(prev => [newEntry, ...prev]);
      setActiveTab('patterns');

      toast({
        title: "Mood Logged Successfully",
        description: "Your mood data has been saved and patterns updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log mood. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const patterns = MoodTrackingService.analyzeMoodPatterns(moodEntries);
  const correlations = MoodTrackingService.getMoodCorrelations(moodEntries);
  const insights = MoodTrackingService.getMoodInsights(moodEntries);

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
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

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="log" className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Log Mood</span>
            </TabsTrigger>
            <TabsTrigger value="patterns" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Patterns & Insights</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="log" className="space-y-6">
            <DetailedMoodTracker 
              onMoodSubmit={handleMoodSubmit}
            />
          </TabsContent>

          <TabsContent value="patterns" className="space-y-6">
            {moodEntries.length > 0 ? (
              <MoodPatterns 
                patterns={patterns}
                correlations={correlations}
                insights={insights}
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
        </Tabs>
      </div>
    </div>
  );
};

export default MoodTracking;
