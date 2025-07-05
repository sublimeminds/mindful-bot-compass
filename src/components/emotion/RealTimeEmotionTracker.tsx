import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Brain, Activity, TrendingUp } from 'lucide-react';
import { useSimpleApp } from '@/hooks/useSimpleApp';

const RealTimeEmotionTracker = () => {
  const { user } = useSimpleApp();
  const [emotionData, setEmotionData] = useState({
    mood: 5,
    anxiety: 3,
    stress: 4,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadEmotionData();
    }
  }, [user]);

  const loadEmotionData = async () => {
    setIsLoading(true);
    try {
      // Mock emotion data loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEmotionData({
        mood: Math.floor(Math.random() * 10) + 1,
        anxiety: Math.floor(Math.random() * 5) + 1,
        stress: Math.floor(Math.random() * 7) + 1,
      });
    } catch (error) {
      console.error('Error loading emotion data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Heart className="h-5 w-5 mr-2" />
          Real-Time Emotion Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading emotion data...</div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Mood</span>
              <Badge variant="secondary">{emotionData.mood}/10</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Anxiety</span>
              <Badge variant="secondary">{emotionData.anxiety}/5</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Stress</span>
              <Badge variant="secondary">{emotionData.stress}/7</Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimeEmotionTracker;
