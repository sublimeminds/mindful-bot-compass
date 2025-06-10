
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, TrendingUp, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MoodTrackerWidget = () => {
  const navigate = useNavigate();
  const [todayMood, setTodayMood] = useState<number | null>(null);

  const moodEmojis = ['😢', '😟', '😐', '😊', '😄'];
  const moodLabels = ['Very Low', 'Low', 'Okay', 'Good', 'Great'];

  const handleQuickMoodLog = (mood: number) => {
    setTodayMood(mood);
    // In a real app, this would save to the database
    console.log('Mood logged:', mood);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Heart className="h-5 w-5 mr-2 text-therapy-600" />
          Mood Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {todayMood ? (
          <div className="text-center p-4 bg-therapy-50 rounded-lg">
            <div className="text-3xl mb-2">{moodEmojis[todayMood - 1]}</div>
            <div className="text-sm font-medium text-therapy-700">
              Today: {moodLabels[todayMood - 1]}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Logged successfully!
            </div>
          </div>
        ) : (
          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground">How are you feeling today?</p>
            <div className="flex justify-between">
              {moodEmojis.map((emoji, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuickMoodLog(index + 1)}
                  className="text-2xl hover:bg-therapy-50 hover:scale-110 transition-all"
                  title={moodLabels[index]}
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/mood-tracker')}
            className="w-full"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            View Mood Trends
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/mood-tracker')}
            className="w-full text-therapy-600 hover:text-therapy-700 hover:bg-therapy-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Detailed Mood Entry
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodTrackerWidget;
