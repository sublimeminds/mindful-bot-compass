import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Settings, 
  Maximize2,
  Minimize2,
  Volume2,
  Activity,
  Brain,
  Heart
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEnhancedChat } from '@/hooks/useEnhancedChat';
import Professional2DAvatar from '@/components/avatar/Professional2DAvatar';
import EnhancedEmotionDetection from '@/components/emotion/EnhancedEmotionDetection';
import VoiceTherapyChat from '@/components/voice/VoiceTherapyChat';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  emotion?: string;
  confidence?: number;
  voiceData?: any;
}

interface TherapyMetrics {
  sessionDuration: number;
  emotionalRange: string[];
  engagementLevel: number;
  therapeuticProgress: number;
  stressLevel: number;
}

interface Enhanced3DTherapyChatProps {
  therapistId: string;
  sessionId?: string;
  onSessionEnd?: () => void;
  className?: string;
}

const Enhanced3DTherapyChat: React.FC<Enhanced3DTherapyChatProps> = ({
  therapistId,
  sessionId,
  onSessionEnd,
  className = ''
}) => {
  const { toast } = useToast();
  const { 
    messages, 
    setMessages, 
    isLoading, 
    sendMessage,
    playMessage 
  } = useEnhancedChat();

  // UI State
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);

  // Emotion & Analysis State
  const [currentEmotions, setCurrentEmotions] = useState<any[]>([]);
  const [therapeuticInsights, setTherapeuticInsights] = useState<any[]>([]);
  const [sessionMetrics, setSessionMetrics] = useState<TherapyMetrics>({
    sessionDuration: 0,
    emotionalRange: [],
    engagementLevel: 0.8,
    therapeuticProgress: 0.75,
    stressLevel: 0.3
  });

  // Avatar State
  const [avatarSpeaking, setAvatarSpeaking] = useState(false);
  const [avatarEmotion, setAvatarEmotion] = useState<'neutral' | 'happy' | 'concerned' | 'encouraging' | 'thoughtful'>('neutral');
  const [isListening, setIsListening] = useState(false);

  // Session Management
  const sessionStartTime = useRef<Date>(new Date());
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Enhanced message sending with emotion analysis
  const handleSendMessage = useCallback(async (content: string, isVoice = false, voiceData?: any) => {
    try {
      // Analyze user emotion if voice message
      if (isVoice && voiceData) {
        const { data: emotionData } = await supabase.functions.invoke('hume-emotion', {
          body: {
            action: 'analyzeVoice',
            audioData: voiceData,
            format: 'wav'
          }
        });

        if (emotionData) {
          setCurrentEmotions(emotionData.emotions);
          
          // Update session metrics based on emotion
          updateSessionMetrics(emotionData.emotions, emotionData.stressLevel);
        }
      }

      // Create enhanced message with metadata
      const enhancedMessage: Message = {
        id: Date.now().toString(),
        content,
        isUser: true,
        timestamp: new Date(),
        emotion: currentEmotions[0]?.name || 'neutral',
        confidence: currentEmotions[0]?.score || 0,
        voiceData: isVoice ? voiceData : undefined
      };

      setMessages(prev => [...prev, enhancedMessage]);

      // Generate AI response with therapist personality and emotion context
      const aiResponse = await generateTherapistResponse(content, currentEmotions, sessionMetrics);
      
      setMessages(prev => [...prev, aiResponse]);

      // Auto-play AI response if in voice mode
      if (micEnabled && aiResponse.content) {
        await playMessage(aiResponse.content);
      }

    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: "Message Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  }, [currentEmotions, sessionMetrics, setMessages, playMessage, micEnabled, toast]);

  const generateTherapistResponse = async (userMessage: string, emotions: any[], metrics: TherapyMetrics): Promise<Message> => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-therapy-chat-enhanced', {
        body: {
          message: userMessage,
          therapistId,
          sessionId,
          emotionalContext: emotions,
          sessionMetrics: metrics,
          conversationHistory: messages.slice(-10), // Last 10 messages for context
          useAdvancedPersonality: true
        }
      });

      if (error) throw error;

      return {
        id: (Date.now() + 1).toString(),
        content: data.response,
        isUser: false,
        timestamp: new Date(),
        emotion: data.therapistEmotion || 'empathetic',
        confidence: data.confidence || 0.9
      };
    } catch (error) {
      console.error('Failed to generate therapist response:', error);
      return {
        id: (Date.now() + 1).toString(),
        content: "I understand you're sharing something important with me. Could you tell me more about how you're feeling right now?",
        isUser: false,
        timestamp: new Date(),
        emotion: 'empathetic'
      };
    }
  };

  const updateSessionMetrics = useCallback((emotions: any[], stressLevel: number) => {
    setSessionMetrics(prev => {
      const newEmotions = emotions.map(e => e.name);
      const uniqueEmotions = [...new Set([...prev.emotionalRange, ...newEmotions])];
      
      return {
        ...prev,
        emotionalRange: uniqueEmotions,
        stressLevel: (prev.stressLevel + stressLevel) / 2, // Moving average
        engagementLevel: emotions.length > 0 ? 0.9 : prev.engagementLevel * 0.95,
        therapeuticProgress: prev.therapeuticProgress + (stressLevel < 0.5 ? 0.01 : -0.005)
      };
    });
  }, []);

  const handleEmotionUpdate = useCallback((emotions: any[], primaryEmotion: string, stressLevel: number) => {
    setCurrentEmotions(emotions);
    updateSessionMetrics(emotions, stressLevel);
  }, [updateSessionMetrics]);

  const handleTherapyInsights = useCallback((insights: any[]) => {
    setTherapeuticInsights(insights);
    
    // Show critical insights as toasts
    const criticalInsights = insights.filter(i => i.type === 'crisis_alert');
    criticalInsights.forEach(insight => {
      toast({
        title: "Important Insight",
        description: insight.message,
        variant: "destructive",
      });
    });
  }, [toast]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };


  const toggleCamera = async () => {
    if (!cameraEnabled) {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraEnabled(true);
      } catch (error) {
        toast({
          title: "Camera Access",
          description: "Could not access camera. Please check permissions.",
          variant: "destructive",
        });
      }
    } else {
      setCameraEnabled(false);
    }
  };

  // Session timer
  useEffect(() => {
    sessionTimerRef.current = setInterval(() => {
      const duration = Math.floor((Date.now() - sessionStartTime.current.getTime()) / 1000);
      setSessionMetrics(prev => ({ ...prev, sessionDuration: duration }));
    }, 1000);

    return () => {
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
      }
    };
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`${className} ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''} flex flex-col h-full`}>
      {/* Header with controls */}
      <Card className="border-b rounded-none">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-therapy-600" />
              <span>Enhanced AI Therapy Session</span>
              <Badge variant="outline" className="bg-therapy-100 text-therapy-700">
                {formatDuration(sessionMetrics.sessionDuration)}
              </Badge>
            </CardTitle>
            
            <div className="flex items-center space-x-2">
              
              <Button
                variant="outline"
                size="sm"
                onClick={toggleCamera}
                className={cameraEnabled ? 'bg-green-100' : ''}
              >
                {cameraEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMicEnabled(!micEnabled)}
                className={micEnabled ? 'bg-green-100' : 'bg-red-100'}
              >
                {micEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMetrics(!showMetrics)}
                className={showMetrics ? 'bg-blue-100' : ''}
              >
                <Activity className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main therapy interface */}
      <div className="flex-1 flex">
        {/* Left side - Enhanced 2D Avatar */}
        <div className="w-1/2 flex flex-col">
          <div className="flex-1 bg-gradient-to-br from-therapy-50 to-calm-50 flex items-center justify-center p-6">
            <Professional2DAvatar
              therapistId={therapistId}
              therapistName="AI Therapist"
              className="w-full h-full max-w-md"
              size="xl"
              showName={true}
              emotion={avatarEmotion}
              isListening={isListening}
              isSpeaking={avatarSpeaking}
              showVoiceIndicator={true}
              therapeuticMode={true}
            />
          </div>
        </div>

        {/* Right side - Controls and metrics */}
        <Separator orientation="vertical" />
        <div className="w-1/2 flex flex-col">
          {/* Voice chat controls */}
          <div className="p-4">
            <VoiceTherapyChat
              onMessageReceived={(message, isVoice) => handleSendMessage(message, isVoice)}
              onVoiceAnalysis={(emotion, stressLevel) => {
                setCurrentEmotions([{ name: emotion, score: stressLevel, intensity: 'medium' }]);
                updateSessionMetrics([{ name: emotion, score: stressLevel }], stressLevel);
                setAvatarEmotion(emotion as 'neutral' | 'happy' | 'concerned' | 'encouraging' | 'thoughtful');
                setIsListening(false);
              }}
              isTherapistSpeaking={avatarSpeaking}
            />
          </div>

          <Separator />

          {/* Chat messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.isUser
                        ? 'bg-therapy-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p>{message.content}</p>
                    {message.emotion && (
                      <Badge variant="outline" className="mt-1 text-xs">
                        {message.emotion}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Emotion detection */}
          <div className="p-4">
            <EnhancedEmotionDetection
              onEmotionUpdate={handleEmotionUpdate}
              onTherapyInsights={handleTherapyInsights}
              isActive={micEnabled || cameraEnabled}
              mode="realtime"
            />
          </div>

          {/* Session metrics */}
          {showMetrics && (
            <>
              <Separator />
              <div className="p-4 space-y-4">
                <h3 className="font-semibold text-therapy-700">Session Metrics</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-therapy-50 p-3 rounded-lg">
                    <div className="text-sm text-therapy-600">Engagement</div>
                    <div className="text-lg font-bold text-therapy-700">
                      {Math.round(sessionMetrics.engagementLevel * 100)}%
                    </div>
                  </div>
                  
                  <div className="bg-calm-50 p-3 rounded-lg">
                    <div className="text-sm text-calm-600">Progress</div>
                    <div className="text-lg font-bold text-calm-700">
                      {Math.round(sessionMetrics.therapeuticProgress * 100)}%
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-sm text-green-600">Stress Level</div>
                    <div className="text-lg font-bold text-green-700">
                      {Math.round((1 - sessionMetrics.stressLevel) * 100)}%
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm text-blue-600">Emotions</div>
                    <div className="text-lg font-bold text-blue-700">
                      {sessionMetrics.emotionalRange.length}
                    </div>
                  </div>
                </div>

                {/* Therapeutic insights */}
                {therapeuticInsights.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-therapy-600">Recent Insights</h4>
                    {therapeuticInsights.slice(0, 3).map((insight, index) => (
                      <div key={index} className="bg-white border border-therapy-200 p-2 rounded text-sm">
                        <div className="font-medium capitalize">{insight.type.replace('_', ' ')}</div>
                        <div className="text-gray-600">{insight.message}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer with session controls */}
      <Card className="border-t rounded-none">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="flex items-center space-x-1">
                <Heart className="h-3 w-3" />
                <span>Therapeutic Bond: Strong</span>
              </Badge>
              <Badge variant="outline" className="flex items-center space-x-1">
                <Activity className="h-3 w-3" />
                <span>Session Quality: Excellent</span>
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => window.location.reload()}>
                Restart Session
              </Button>
              <Button 
                variant="destructive" 
                onClick={onSessionEnd}
              >
                End Session
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Enhanced3DTherapyChat;