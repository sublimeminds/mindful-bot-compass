
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Brain, Smile, Frown, Angry, AlertCircle, Meh } from 'lucide-react';

interface EmotionData {
  dominant_emotion: string;
  confidence: number;
  emotions: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
    neutral: number;
  };
}

interface EmotionTrackerProps {
  emotionData?: EmotionData;
  onEmotionSelect?: (emotion: string) => void;
  showDetailedView?: boolean;
}

const EmotionTracker = ({ emotionData, onEmotionSelect, showDetailedView = false }: EmotionTrackerProps) => {
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');

  const emotions = [
    { name: 'joy', icon: Smile, color: 'bg-green-100 text-green-800', label: 'Joyful' },
    { name: 'sadness', icon: Frown, color: 'bg-blue-100 text-blue-800', label: 'Sad' },
    { name: 'anger', icon: Angry, color: 'bg-red-100 text-red-800', label: 'Angry' },
    { name: 'fear', icon: Heart, color: 'bg-purple-100 text-purple-800', label: 'Anxious' },
    { name: 'surprise', icon: AlertCircle, color: 'bg-yellow-100 text-yellow-800', label: 'Surprised' },
    { name: 'neutral', icon: Meh, color: 'bg-gray-100 text-gray-800', label: 'Neutral' }
  ];

  const handleEmotionClick = (emotion: string) => {
    setSelectedEmotion(emotion);
    onEmotionSelect?.(emotion);
  };

  const getEmotionPercentage = (emotion: string): number => {
    if (!emotionData) return 0;
    return Math.round((emotionData.emotions[emotion as keyof typeof emotionData.emotions] || 0) * 100);
  };

  const getDominantEmotion = () => {
    if (!emotionData) return emotions[5]; // neutral
    return emotions.find(e => e.name === emotionData.dominant_emotion) || emotions[5];
  };

  if (!showDetailedView && emotionData) {
    const dominantEmotion = getDominantEmotion();
    const Icon = dominantEmotion.icon;
    
    return (
      <div className="flex items-center space-x-2">
        <Badge className={dominantEmotion.color}>
          <Icon className="h-3 w-3 mr-1" />
          {dominantEmotion.label}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {Math.round(emotionData.confidence * 100)}% confidence
        </span>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="h-5 w-5 mr-2" />
          Emotion Tracker
        </CardTitle>
        {emotionData && (
          <div className="text-sm text-muted-foreground">
            Current emotion: <strong>{getDominantEmotion().label}</strong> 
            ({Math.round(emotionData.confidence * 100)}% confidence)
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {emotions.map((emotion) => {
            const Icon = emotion.icon;
            const percentage = getEmotionPercentage(emotion.name);
            const isSelected = selectedEmotion === emotion.name;
            const isDominant = emotionData?.dominant_emotion === emotion.name;
            
            return (
              <Button
                key={emotion.name}
                variant={isSelected || isDominant ? "default" : "outline"}
                size="sm"
                onClick={() => handleEmotionClick(emotion.name)}
                className={`flex flex-col items-center p-4 h-auto space-y-2 ${
                  isDominant ? 'ring-2 ring-therapy-500' : ''
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs font-medium">{emotion.label}</span>
                {emotionData && (
                  <span className="text-xs opacity-70">{percentage}%</span>
                )}
              </Button>
            );
          })}
        </div>

        {emotionData && showDetailedView && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Emotion Breakdown:</h4>
            {emotions.map((emotion) => {
              const percentage = getEmotionPercentage(emotion.name);
              return (
                <div key={emotion.name} className="flex items-center justify-between text-sm">
                  <span className="capitalize">{emotion.label}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-muted rounded-full h-2">
                      <div 
                        className="bg-therapy-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-8">{percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionTracker;
