
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { EmotionalIntelligenceService, EmotionalState } from '@/services/emotionalIntelligenceService';
import { useAuth } from '@/contexts/AuthContext';

const RealTimeEmotionTracker: React.FC = () => {
  const { user } = useAuth();
  const [currentEmotion, setCurrentEmotion] = useState<EmotionalState | null>(null);
  const [emotionHistory, setEmotionHistory] = useState<EmotionalState[]>([]);
  const [prediction, setPrediction] = useState<any>(null);
  const [isTracking, setIsTracking] = useState(false);

  // Load initial emotional state
  useEffect(() => {
    if (user) {
      loadEmotionalBaseline();
      startEmotionTracking();
    }
  }, [user]);

  const loadEmotionalBaseline = async () => {
    try {
      // Get recent emotional states for baseline
      const baseline: EmotionalState = {
        primary: 'neutral',
        intensity: 0.5,
        valence: 0,
        arousal: 0.5,
        confidence: 0.8,
        timestamp: new Date()
      };
      setCurrentEmotion(baseline);
    } catch (error) {
      console.error('Error loading emotional baseline:', error);
    }
  };

  const startEmotionTracking = useCallback(() => {
    setIsTracking(true);
    
    // Simulate real-time emotion updates (in real app, this would come from actual analysis)
    const interval = setInterval(async () => {
      if (user) {
        try {
          // Get prediction for emotional trajectory
          const trajectoryPrediction = await EmotionalIntelligenceService.predictEmotionalTrajectory(user.id);
          setPrediction(trajectoryPrediction);
        } catch (error) {
          console.error('Error getting emotion prediction:', error);
        }
      }
    }, 30000); // Update every 30 seconds

    return () => {
      clearInterval(interval);
      setIsTracking(false);
    };
  }, [user]);

  const analyzeTextEmotion = async (text: string) => {
    if (!user) return;
    
    try {
      const emotion = await EmotionalIntelligenceService.analyzeEmotionalState(text);
      setCurrentEmotion(emotion);
      setEmotionHistory(prev => [...prev.slice(-9), emotion]); // Keep last 10
      
      // Track the emotion
      await EmotionalIntelligenceService.trackEmotionalJourney(user.id, emotion);
    } catch (error) {
      console.error('Error analyzing text emotion:', error);
    }
  };

  const getEmotionColor = (emotion: string) => {
    const colors = {
      joy: 'bg-yellow-500',
      happiness: 'bg-yellow-500',
      sadness: 'bg-blue-500',
      anger: 'bg-red-500',
      anxiety: 'bg-orange-500',
      fear: 'bg-purple-500',
      disgust: 'bg-green-500',
      surprise: 'bg-pink-500',
      neutral: 'bg-gray-500'
    };
    return colors[emotion as keyof typeof colors] || colors.neutral;
  };

  const getEmotionIcon = (valence: number) => {
    if (valence > 0.3) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (valence < -0.3) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Activity className="h-4 w-4 text-gray-500" />;
  };

  if (!user) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Heart className="h-5 w-5 text-red-500" />
          <span>Real-Time Emotional Intelligence</span>
          {isTracking && (
            <Badge variant="outline" className="ml-auto">
              <Activity className="h-3 w-3 mr-1" />
              Live
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Emotional State */}
        {currentEmotion && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Current Emotion</span>
              {getEmotionIcon(currentEmotion.valence)}
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge className={`${getEmotionColor(currentEmotion.primary)} text-white`}>
                {currentEmotion.primary}
              </Badge>
              {currentEmotion.secondary && (
                <Badge variant="outline">{currentEmotion.secondary}</Badge>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <label className="text-gray-600">Intensity</label>
                <Progress value={currentEmotion.intensity * 100} className="h-2 mt-1" />
                <span className="text-xs text-gray-500">{Math.round(currentEmotion.intensity * 100)}%</span>
              </div>
              <div>
                <label className="text-gray-600">Valence</label>
                <Progress 
                  value={(currentEmotion.valence + 1) * 50} 
                  className="h-2 mt-1" 
                />
                <span className="text-xs text-gray-500">
                  {currentEmotion.valence > 0 ? 'Positive' : currentEmotion.valence < 0 ? 'Negative' : 'Neutral'}
                </span>
              </div>
              <div>
                <label className="text-gray-600">Energy</label>
                <Progress value={currentEmotion.arousal * 100} className="h-2 mt-1" />
                <span className="text-xs text-gray-500">{Math.round(currentEmotion.arousal * 100)}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Emotion History */}
        {emotionHistory.length > 0 && (
          <div className="space-y-3">
            <span className="text-sm font-medium">Recent Emotional Journey</span>
            <div className="flex space-x-2 overflow-x-auto">
              {emotionHistory.map((emotion, index) => (
                <div key={index} className="flex-shrink-0 text-center">
                  <div className={`w-8 h-8 rounded-full ${getEmotionColor(emotion.primary)} mb-1`} />
                  <span className="text-xs text-gray-600">{emotion.primary}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Predictive Insights */}
        {prediction && (
          <div className="space-y-3 p-3 bg-blue-50 rounded-lg">
            <span className="text-sm font-medium text-blue-900">24-Hour Emotional Forecast</span>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700">Predicted state</span>
                <Badge className={`${getEmotionColor(prediction.prediction.primary)} text-white`}>
                  {prediction.prediction.primary}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700">Confidence</span>
                <span className="text-sm font-medium text-blue-900">
                  {Math.round(prediction.confidence * 100)}%
                </span>
              </div>
              
              {prediction.interventionNeeded && (
                <div className="mt-3 p-2 bg-orange-100 rounded border-l-4 border-orange-500">
                  <p className="text-sm text-orange-800 font-medium">Intervention Suggested</p>
                  <ul className="text-xs text-orange-700 mt-1 space-y-1">
                    {prediction.suggestedInterventions.map((intervention: string, idx: number) => (
                      <li key={idx}>• {intervention}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Test Input for Emotion Analysis */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Test Emotion Detection</label>
          <textarea
            className="w-full p-2 border rounded-md text-sm"
            placeholder="Type something to analyze your emotional state..."
            onBlur={(e) => {
              if (e.target.value.trim()) {
                analyzeTextEmotion(e.target.value);
              }
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeEmotionTracker;
