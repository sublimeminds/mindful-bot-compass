
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { EmotionData } from '@/types/voiceInteraction';
import { Brain } from 'lucide-react';

interface VoiceEmotionAnalysisProps {
  emotion: EmotionData | null;
}

const VoiceEmotionAnalysis: React.FC<VoiceEmotionAnalysisProps> = ({
  emotion
}) => {
  if (!emotion) return null;

  const getEmotionColor = (emotionType: string) => {
    const colors: Record<string, string> = {
      happy: 'bg-yellow-100 text-yellow-800',
      sad: 'bg-blue-100 text-blue-800',
      angry: 'bg-red-100 text-red-800',
      calm: 'bg-green-100 text-green-800',
      excited: 'bg-orange-100 text-orange-800',
      neutral: 'bg-gray-100 text-gray-800'
    };
    return colors[emotionType] || colors.neutral;
  };

  return (
    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center mb-3">
        <Brain className="h-4 w-4 mr-2 text-blue-600" />
        <span className="font-medium text-blue-800">Emotion Analysis</span>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Primary:</span>
          <Badge className={getEmotionColor(emotion.primary)}>
            {emotion.primary}
          </Badge>
          <span className="text-xs text-gray-600">
            ({Math.round(emotion.confidence * 100)}%)
          </span>
        </div>
        
        {emotion.secondary && (
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Secondary:</span>
            <Badge variant="outline">
              {emotion.secondary}
            </Badge>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
          <div>Valence: {emotion.valence.toFixed(2)}</div>
          <div>Arousal: {emotion.arousal.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

export default VoiceEmotionAnalysis;
