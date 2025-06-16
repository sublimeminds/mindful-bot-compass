
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, TrendingUp, Brain, Target } from 'lucide-react';
import DetailedMoodTracker from '@/components/mood/DetailedMoodTracker';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface MoodEntry {
  id: string;
  overall: number;
  anxiety: number;
  stress: number;
  created_at: string;
}

const MoodTracking = () => {
  const { user } = useAuth();
  const [showDetailedTracker, setShowDetailedTracker] = useState(false);

  const { data: moodEntries, isLoading, error } = useQuery({
    queryKey: ['mood-entries', user?.id],
    queryFn: async (): Promise<MoodEntry[]> => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching mood entries:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user?.id
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {(error as Error).message}</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Mood Tracking</h1>
          <p className="text-muted-foreground">
            Track your mood and identify patterns to improve your wellbeing.
          </p>
        </div>
        <Button onClick={() => setShowDetailedTracker(true)}>
          Detailed Mood Tracker
        </Button>
      </div>

      {showDetailedTracker && (
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Mood Tracker</CardTitle>
            </CardHeader>
            <CardContent>
              <DetailedMoodTracker onMoodSubmit={() => setShowDetailedTracker(false)} />
            </CardContent>
          </Card>
        </div>
      )}

      {moodEntries && moodEntries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {moodEntries.map((entry) => (
            <Card key={entry.id}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(entry.created_at).toLocaleDateString()}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-therapy-500" />
                  <span>Overall Mood:</span>
                  <Badge variant="secondary">{entry.overall}/10</Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Brain className="h-4 w-4 text-yellow-500" />
                  <span>Anxiety Level:</span>
                  <Badge variant="secondary">{entry.anxiety}/10</Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-blue-500" />
                  <span>Stress Level:</span>
                  <Badge variant="secondary">{entry.stress}/10</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <h3 className="text-lg font-medium">No mood entries yet</h3>
          <p className="text-muted-foreground">
            Start tracking your mood to see your progress.
          </p>
        </div>
      )}
    </div>
  );
};

export default MoodTracking;
