import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Heart, Zap, Shield } from 'lucide-react';
import VoiceEnhancedAvatar from './VoiceEnhancedAvatar';
import EnhancedCameraEmotionDetection from './EnhancedCameraEmotionDetection';
import { emotionDetector, EmotionResult } from '@/services/advancedEmotionDetection';
import { intelligentAvatarSystem, TherapeuticResponse } from '@/services/intelligentAvatarSystem';

interface IntelligentAvatarManagerProps {
  therapistId: string;
  therapistName?: string;
  isListening?: boolean;
  isSpeaking?: boolean;
  currentMessage?: string;
  enableCameraDetection?: boolean;
  enableVoiceDetection?: boolean;
  enableTextAnalysis?: boolean;
  className?: string;
}

const IntelligentAvatarManager: React.FC<IntelligentAvatarManagerProps> = ({
  therapistId,
  therapistName,
  isListening = false,
  isSpeaking = false,
  currentMessage,
  enableCameraDetection = true,
  enableVoiceDetection = true,
  enableTextAnalysis = true,
  className = "w-full h-full"
}) => {
  const [currentEmotion, setCurrentEmotion] = useState<EmotionResult | null>(null);
  const [avatarResponse, setAvatarResponse] = useState<TherapeuticResponse | null>(null);
  const [multiModalEmotion, setMultiModalEmotion] = useState<EmotionResult | null>(null);
  const [sessionMetrics, setSessionMetrics] = useState({
    totalEmotions: 0,
    averageValence: 0,
    averageArousal: 0,
    dominantEmotion: 'neutral' as string,
    riskLevel: 'low' as 'low' | 'medium' | 'high'
  });

  // Handle camera emotion detection
  const handleCameraEmotion = useCallback((emotion: EmotionResult) => {
    setCurrentEmotion(emotion);
    processMultiModalEmotion(emotion, null, null);
  }, []);

  // Handle voice emotion detection (from audio analysis)
  const handleVoiceEmotion = useCallback(async (audioData: Float32Array) => {
    if (!enableVoiceDetection) return;

    try {
      const voiceEmotion = await emotionDetector.detectFromVoice(audioData);
      if (voiceEmotion) {
        processMultiModalEmotion(null, voiceEmotion, null);
      }
    } catch (error) {
      console.error('Voice emotion detection error:', error);
    }
  }, [enableVoiceDetection]);

  // Handle text emotion analysis
  const handleTextEmotion = useCallback(async (text: string) => {
    if (!enableTextAnalysis || !text.trim()) return;

    try {
      const textEmotion = await emotionDetector.detectFromText(text);
      if (textEmotion) {
        processMultiModalEmotion(null, null, textEmotion);
      }
    } catch (error) {
      console.error('Text emotion detection error:', error);
    }
  }, [enableTextAnalysis]);

  // Process multi-modal emotion fusion
  const processMultiModalEmotion = useCallback((
    cameraEmotion: EmotionResult | null,
    voiceEmotion: EmotionResult | null,
    textEmotion: EmotionResult | null
  ) => {
    // Fuse emotions from different modalities
    const fusedEmotion = emotionDetector.fuseMultiModalEmotions(
      cameraEmotion,
      textEmotion, // Note: we put text before voice as it's often more reliable
      voiceEmotion
    );

    if (fusedEmotion) {
      setMultiModalEmotion(fusedEmotion);
      
      // Generate intelligent avatar response
      const response = intelligentAvatarSystem.updateUserEmotion(fusedEmotion);
      setAvatarResponse(response);

      // Update session metrics
      updateSessionMetrics(fusedEmotion);
    }
  }, []);

  // Analyze current message for text emotion
  useEffect(() => {
    if (currentMessage && enableTextAnalysis) {
      handleTextEmotion(currentMessage);
    }
  }, [currentMessage, enableTextAnalysis, handleTextEmotion]);

  // Update session metrics
  const updateSessionMetrics = (emotion: EmotionResult) => {
    setSessionMetrics(prev => {
      const newTotal = prev.totalEmotions + 1;
      const newAvgValence = (prev.averageValence * prev.totalEmotions + emotion.valence) / newTotal;
      const newAvgArousal = (prev.averageArousal * prev.totalEmotions + emotion.arousal) / newTotal;
      
      // Get current session context
      const sessionContext = intelligentAvatarSystem.getSessionContext();
      
      return {
        totalEmotions: newTotal,
        averageValence: newAvgValence,
        averageArousal: newAvgArousal,
        dominantEmotion: emotion.emotion,
        riskLevel: sessionContext.crisisLevel > 0.7 ? 'high' : sessionContext.crisisLevel > 0.4 ? 'medium' : 'low'
      };
    });
  };

  // Get avatar emotion state
  const getAvatarEmotion = (): 'neutral' | 'happy' | 'concerned' | 'encouraging' | 'thoughtful' => {
    if (!avatarResponse) return 'neutral';

    const { primary } = avatarResponse.emotion;
    
    // Map therapeutic emotions to avatar display emotions
    const emotionMap: Record<string, 'neutral' | 'happy' | 'concerned' | 'encouraging' | 'thoughtful'> = {
      joy: 'happy',
      encouragement: 'encouraging',
      empathy: 'thoughtful',
      compassion: 'concerned',
      understanding: 'thoughtful',
      validation: 'encouraging',
      safety: 'concerned',
      support: 'encouraging',
      acceptance: 'neutral',
      hope: 'encouraging'
    };

    return emotionMap[primary] || 'neutral';
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case 'joy':
      case 'happiness':
      case 'excitement':
        return '😊';
      case 'sadness':
      case 'melancholy':
        return '😢';
      case 'anger':
      case 'frustration':
        return '😠';
      case 'fear':
      case 'anxiety':
        return '😰';
      case 'surprise':
        return '😲';
      case 'trust':
      case 'safety':
        return '🤗';
      default:
        return '😐';
    }
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Main Avatar Display */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="h-full">
            <CardContent className="p-6 h-full">
              <VoiceEnhancedAvatar
                therapistId={therapistId}
                therapistName={therapistName}
                emotion={getAvatarEmotion()}
                isListening={isListening}
                isSpeaking={isSpeaking}
                currentMessage={currentMessage}
                className="w-full h-full min-h-[400px]"
              />
            </CardContent>
          </Card>

          {/* Intervention Display */}
          {avatarResponse?.intervention && (
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Heart className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-xs">
                        {avatarResponse.intervention.type}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Priority: {avatarResponse.intervention.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {avatarResponse.intervention.message}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Emotion Detection & Analytics */}
        <div className="space-y-4">
          {/* Camera Emotion Detection */}
          {enableCameraDetection && (
            <EnhancedCameraEmotionDetection
              onEmotionDetected={handleCameraEmotion}
              isActive={true}
              showPreview={true}
              enableMLModels={true}
            />
          )}

          {/* Current Multi-Modal Emotion */}
          {multiModalEmotion && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Fused Emotion Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    {getEmotionIcon(multiModalEmotion.emotion)}
                    {multiModalEmotion.emotion}
                  </span>
                  <Badge variant="secondary">
                    {Math.round(multiModalEmotion.confidence * 100)}%
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Intensity:</span>
                    <span className="ml-1 font-medium">{multiModalEmotion.intensity}/10</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Valence:</span>
                    <span className={`ml-1 font-medium ${multiModalEmotion.valence > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {multiModalEmotion.valence.toFixed(2)}
                    </span>
                  </div>
                </div>

                {multiModalEmotion.microExpressions && multiModalEmotion.microExpressions.length > 0 && (
                  <div>
                    <span className="text-xs text-muted-foreground">Micro-expressions:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {multiModalEmotion.microExpressions.map((expr, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {expr}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Session Metrics */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Session Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="block text-muted-foreground">Emotions</span>
                  <span className="font-medium">{sessionMetrics.totalEmotions}</span>
                </div>
                <div>
                  <span className="block text-muted-foreground">Dominant</span>
                  <span className="font-medium">{sessionMetrics.dominantEmotion}</span>
                </div>
                <div>
                  <span className="block text-muted-foreground">Avg Mood</span>
                  <span className={`font-medium ${sessionMetrics.averageValence > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {sessionMetrics.averageValence.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="block text-muted-foreground">Energy</span>
                  <span className="font-medium">{sessionMetrics.averageArousal.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Risk Level
                  </span>
                  <Badge className={getRiskLevelColor(sessionMetrics.riskLevel)}>
                    {sessionMetrics.riskLevel}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Avatar State */}
          {avatarResponse && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Avatar Response</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Primary:</span>
                  <Badge variant="secondary">{avatarResponse.emotion.primary}</Badge>
                </div>
                {avatarResponse.emotion.secondary && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Secondary:</span>
                    <Badge variant="outline">{avatarResponse.emotion.secondary}</Badge>
                  </div>
                )}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Intensity:</span>
                  <span>{avatarResponse.emotion.intensity}/10</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Posture:</span>
                  <span className="capitalize">{avatarResponse.bodyLanguage.posture.replace('_', ' ')}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntelligentAvatarManager;