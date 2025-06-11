
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface EmotionState {
  current: string;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  suggestions: string[];
}

const EmotionIndicator: React.FC = () => {
  const [emotion, setEmotion] = useState<EmotionState>({
    current: 'neutral',
    confidence: 0.8,
    trend: 'stable',
    suggestions: []
  });

  // Mock emotion updates - in real implementation this would come from emotion analysis
  useEffect(() => {
    const emotions = ['calm', 'thoughtful', 'hopeful', 'processing', 'reflective'];
    const trends: ('up' | 'down' | 'stable')[] = ['up', 'down', 'stable'];
    
    const interval = setInterval(() => {
      setEmotion({
        current: emotions[Math.floor(Math.random() * emotions.length)],
        confidence: 0.6 + Math.random() * 0.4,
        trend: trends[Math.floor(Math.random() * trends.length)],
        suggestions: [
          'Continue sharing your thoughts',
          'Take a moment to breathe',
          'Explore this feeling deeper'
        ]
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      calm: 'text-blue-600 bg-blue-50',
      thoughtful: 'text-purple-600 bg-purple-50',
      hopeful: 'text-green-600 bg-green-50',
      processing: 'text-yellow-600 bg-yellow-50',
      reflective: 'text-indigo-600 bg-indigo-50',
      neutral: 'text-gray-600 bg-gray-50'
    };
    return colors[emotion] || colors.neutral;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-600" />;
      default:
        return <Minus className="h-3 w-3 text-gray-600" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-sm">
          <Heart className="h-4 w-4" />
          <span>Emotional State</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Current Emotion */}
        <div className="flex items-center justify-between">
          <Badge 
            variant="secondary" 
            className={`${getEmotionColor(emotion.current)} capitalize`}
          >
            {emotion.current}
          </Badge>
          <div className="flex items-center space-x-1">
            {getTrendIcon(emotion.trend)}
            <span className="text-xs text-muted-foreground">
              {Math.round(emotion.confidence * 100)}%
            </span>
          </div>
        </div>

        {/* Suggestions */}
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Suggestions</p>
          <div className="space-y-1">
            {emotion.suggestions.slice(0, 2).map((suggestion, index) => (
              <p key={index} className="text-xs text-muted-foreground">
                • {suggestion}
              </p>
            ))}
          </div>
        </div>

        {/* Note */}
        <p className="text-xs text-muted-foreground italic">
          Based on conversation analysis
        </p>
      </CardContent>
    </Card>
  );
};

export default EmotionIndicator;
