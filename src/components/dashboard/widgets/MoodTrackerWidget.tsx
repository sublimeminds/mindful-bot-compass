import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, TrendingUp, Calendar } from 'lucide-react';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';

const MoodTrackerWidget = () => {
  const [currentMood, setCurrentMood] = useState<number | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  const handleMoodSelect = (mood: number) => {
    setCurrentMood(mood);
    setIsTracking(true);
    // Simulate API call
    setTimeout(() => {
      setIsTracking(false);
    }, 1000);
  };

  const moodOptions = [
    { value: 1, emoji: '😢', label: 'Very Low' },
    { value: 2, emoji: '😟', label: 'Low' },
    { value: 3, emoji: '😐', label: 'Neutral' },
    { value: 4, emoji: '😊', label: 'Good' },
    { value: 5, emoji: '😄', label: 'Great' }
  ];

  return (
    <SafeComponentWrapper name="MoodTrackerWidget">
      <Card className="bg-white/90 backdrop-blur-sm border border-therapy-100 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-harmony-50 to-balance-50">
          <CardTitle className="flex items-center text-harmony-800">
            <Heart className="h-5 w-5 mr-2" />
            Mood Tracker
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {currentMood ? (
            <div className="text-center space-y-4">
              <div className="text-4xl">
                {moodOptions.find(m => m.value === currentMood)?.emoji}
              </div>
              <p className="text-sm text-muted-foreground">
                Today's mood: {moodOptions.find(m => m.value === currentMood)?.label}
              </p>
              <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                <div className="flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>7-day avg: 3.8</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>12 day streak</span>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setCurrentMood(null)}
                className="text-xs"
              >
                Update Mood
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground text-center">
                How are you feeling today?
              </p>
              <div className="grid grid-cols-5 gap-2">
                {moodOptions.map((mood) => (
                  <Button
                    key={mood.value}
                    variant="outline"
                    size="sm"
                    className="h-12 flex flex-col space-y-1 hover:bg-harmony-50"
                    onClick={() => handleMoodSelect(mood.value)}
                    disabled={isTracking}
                  >
                    <span className="text-lg">{mood.emoji}</span>
                    <span className="text-xs">{mood.value}</span>
                  </Button>
                ))}
              </div>
              {isTracking && (
                <div className="text-center">
                  <div className="inline-flex items-center text-xs text-muted-foreground">
                    <div className="animate-spin rounded-full h-3 w-3 border-b border-primary mr-2"></div>
                    Saving mood...
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </SafeComponentWrapper>
  );
};

export default MoodTrackerWidget;