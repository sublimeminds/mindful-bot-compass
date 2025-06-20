
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, TrendingUp, Brain, Target } from 'lucide-react';
import { useSimpleApp } from '@/hooks/useSimpleApp';

interface MoodEntry {
  id: string;
  overall: number;
  anxiety: number;
  stress: number;
  created_at: string;
}

const MoodTracking = () => {
  const { user } = useSimpleApp();
  const [showDetailedTracker, setShowDetailedTracker] = useState(false);

  // Mock data for demonstration
  const moodEntries: MoodEntry[] = [
    {
      id: '1',
      overall: 7,
      anxiety: 4,
      stress: 5,
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      overall: 6,
      anxiety: 6,
      stress: 7,
      created_at: new Date(Date.now() - 86400000).toISOString()
    }
  ];

  const handleMoodSubmit = () => {
    setShowDetailedTracker(false);
    console.log('Mood submitted');
  };

  if (!user) {
    return <div>Please log in to track your mood.</div>;
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
          Track Mood
        </Button>
      </div>

      {showDetailedTracker && (
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Mood Tracker</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>Rate your current mood from 1-10:</p>
                <Button onClick={handleMoodSubmit}>
                  Submit Mood Entry
                </Button>
              </div>
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
