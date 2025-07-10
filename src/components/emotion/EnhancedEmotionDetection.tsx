import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, Heart, AlertTriangle, TrendingUp } from 'lucide-react';

interface EmotionData {
  name: string;
  score: number;
  intensity: 'low' | 'medium' | 'high';
  therapeuticRelevance: 'minimal' | 'notable' | 'moderate_concern' | 'high_concern';
}

interface TherapyInsight {
  type: 'crisis_alert' | 'positive_indicator' | 'concern' | 'opportunity';
  message: string;
  emotions: string[];
}

interface EnhancedEmotionDetectionProps {
  onEmotionUpdate?: (emotions: EmotionData[], primaryEmotion: string, stressLevel: number) => void;
  onTherapyInsights?: (insights: TherapyInsight[]) => void;
  isActive?: boolean;
  mode?: 'voice' | 'text' | 'realtime';
}

const EnhancedEmotionDetection: React.FC<EnhancedEmotionDetectionProps> = ({
  onEmotionUpdate,
  onTherapyInsights,
  isActive = false,
  mode = 'voice'
}) => {
  const [emotions, setEmotions] = useState<EmotionData[]>([]);
  const [primaryEmotion, setPrimaryEmotion] = useState<string>('neutral');
  const [stressLevel, setStressLevel] = useState<number>(0);
  const [insights, setInsights] = useState<TherapyInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string>('');

  // Enhanced emotion analysis using Hume AI
  const analyzeVoiceEmotion = useCallback(async (audioData: ArrayBuffer) => {
    try {
      setIsAnalyzing(true);
      setError('');

      const { data, error } = await supabase.functions.invoke('hume-emotion', {
        body: {
          action: 'analyzeVoice',
          audioData: Array.from(new Uint8Array(audioData)),
          format: 'wav'
        }
      });

      if (error) throw error;

      const { emotions: detectedEmotions, primaryEmotion: primary, stressLevel: stress, therapyInsights } = data;
      
      setEmotions(detectedEmotions);
      setPrimaryEmotion(primary);
      setStressLevel(stress);
      setInsights(therapyInsights);

      // Notify parent components
      onEmotionUpdate?.(detectedEmotions, primary, stress);
      onTherapyInsights?.(therapyInsights);

    } catch (err) {
      console.error('Voice emotion analysis failed:', err);
      setError('Failed to analyze voice emotions');
    } finally {
      setIsAnalyzing(false);
    }
  }, [onEmotionUpdate, onTherapyInsights]);

  const analyzeTextEmotion = useCallback(async (text: string) => {
    try {
      setIsAnalyzing(true);
      setError('');

      const { data, error } = await supabase.functions.invoke('hume-emotion', {
        body: {
          action: 'analyzeText',
          text
        }
      });

      if (error) throw error;

      const { emotions: detectedEmotions, sentiment, therapeuticConcerns } = data;
      
      setEmotions(detectedEmotions);
      setPrimaryEmotion(detectedEmotions[0]?.name || 'neutral');
      
      // Convert therapeutic concerns to insights
      const concernInsights: TherapyInsight[] = therapeuticConcerns.map((concern: any) => ({
        type: concern.level === 'urgent' ? 'crisis_alert' : 'concern',
        message: concern.recommendation,
        emotions: [concern.emotion]
      }));
      
      setInsights(concernInsights);
      onTherapyInsights?.(concernInsights);

    } catch (err) {
      console.error('Text emotion analysis failed:', err);
      setError('Failed to analyze text emotions');
    } finally {
      setIsAnalyzing(false);
    }
  }, [onTherapyInsights]);

  const getEmotionColor = (emotion: EmotionData) => {
    if (emotion.therapeuticRelevance === 'high_concern') return 'bg-red-100 text-red-800 border-red-200';
    if (emotion.therapeuticRelevance === 'moderate_concern') return 'bg-orange-100 text-orange-800 border-orange-200';
    if (emotion.therapeuticRelevance === 'notable') return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'crisis_alert': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'positive_indicator': return <Heart className="h-4 w-4 text-green-600" />;
      case 'concern': return <Brain className="h-4 w-4 text-orange-600" />;
      case 'opportunity': return <TrendingUp className="h-4 w-4 text-blue-600" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };


  return (
    <div className="space-y-4">
      {/* Primary Emotion Display */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-sm">
            <Brain className="h-4 w-4 text-therapy-600" />
            <span>Enhanced Emotion Analysis</span>
            {isAnalyzing && (
              <div className="w-4 h-4 border-2 border-therapy-600 border-t-transparent rounded-full animate-spin" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Primary Emotion */}
          <div className="text-center">
            <div className="text-2xl font-bold text-therapy-600 capitalize mb-1">
              {primaryEmotion}
            </div>
            <div className="text-sm text-muted-foreground">Primary Emotion</div>
          </div>

          {/* Stress Level */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Stress Level</span>
              <span className="text-sm text-muted-foreground">{Math.round(stressLevel * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  stressLevel > 0.7 ? 'bg-red-500' : 
                  stressLevel > 0.4 ? 'bg-orange-500' : 'bg-green-500'
                }`}
                style={{ width: `${stressLevel * 100}%` }}
              />
            </div>
          </div>

          {/* Detected Emotions */}
          {emotions.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Detected Emotions</h4>
              <div className="flex flex-wrap gap-2">
                {emotions.slice(0, 5).map((emotion, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className={`${getEmotionColor(emotion)} text-xs`}
                  >
                    {emotion.name} ({Math.round(emotion.score * 100)}%)
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Therapy Insights */}
      {insights.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Therapy Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights.map((insight, index) => (
              <Alert key={index} className={
                insight.type === 'crisis_alert' ? 'border-red-200 bg-red-50' :
                insight.type === 'positive_indicator' ? 'border-green-200 bg-green-50' :
                'border-blue-200 bg-blue-50'
              }>
                <div className="flex items-start space-x-2">
                  {getInsightIcon(insight.type)}
                  <AlertDescription className="text-sm">
                    <div className="font-medium mb-1 capitalize">
                      {insight.type.replace('_', ' ')}
                    </div>
                    <div>{insight.message}</div>
                    {insight.emotions.length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs font-medium">Related emotions: </span>
                        <span className="text-xs">{insight.emotions.join(', ')}</span>
                      </div>
                    )}
                  </AlertDescription>
                </div>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default EnhancedEmotionDetection;