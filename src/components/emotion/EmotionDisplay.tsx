
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Brain, Zap } from 'lucide-react';

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

interface EmotionDisplayProps {
  emotion: EmotionData;
  className?: string;
}

const EmotionDisplay = ({ emotion, className }: EmotionDisplayProps) => {
  const getEmotionColor = (emotionType: string) => {
    const colors = {
      joy: 'bg-green-100 text-green-800',
      sadness: 'bg-blue-100 text-blue-800',
      anger: 'bg-red-100 text-red-800',
      fear: 'bg-purple-100 text-purple-800',
      surprise: 'bg-yellow-100 text-yellow-800',
      neutral: 'bg-gray-100 text-gray-800'
    };
    return colors[emotionType as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getEmotionIcon = (emotionType: string) => {
    switch (emotionType) {
      case 'joy': return '😊';
      case 'sadness': return '😢';
      case 'anger': return '😠';
      case 'fear': return '😰';
      case 'surprise': return '😲';
      default: return '😐';
    }
  };

  return (
    <Card className={className}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Brain className="h-4 w-4 text-therapy-600" />
            <span className="text-sm font-medium">Emotion Analysis</span>
          </div>
          <Badge variant="outline" className={getEmotionColor(emotion.dominant_emotion)}>
            {getEmotionIcon(emotion.dominant_emotion)} {emotion.dominant_emotion}
          </Badge>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Confidence</span>
            <span>{(emotion.confidence * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-therapy-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${emotion.confidence * 100}%` }}
            />
          </div>
        </div>

        <div className="mt-2 grid grid-cols-3 gap-1 text-xs">
          {Object.entries(emotion.emotions).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="text-muted-foreground capitalize">{key}</div>
              <div className="font-medium">{(value * 100).toFixed(0)}%</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionDisplay;
