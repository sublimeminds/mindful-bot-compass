import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEliteSystemIntegration } from '@/hooks/useEliteSystemIntegration';
import { useEliteSystemActivation } from '@/hooks/useEliteSystemActivation';
import { useRealTimeEliteIntegration } from '@/hooks/useRealTimeEliteIntegration';
import BulletproofDashboardLayout from '@/components/dashboard/BulletproofDashboardLayout';
import Professional2DAvatar from '@/components/avatar/Professional2DAvatar';
import EmotionCameraDetection from '@/components/avatar/EmotionCameraDetection';
import VoiceRecorder from '@/components/voice/VoiceRecorder';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Camera, 
  CameraOff,
  MessageSquare,
  Brain,
  Heart
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TherapistPersonality {
  id: string;
  name: string;
  approach: string;
  communication_style: string;
  color_scheme: string;
  description: string;
}

const EnhancedTherapyChatWithAvatar = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const {
    messages,
    isLoading,
    isPlaying,
    userPreferences,
    currentSessionId,
    sendMessage,
    playMessage,
    stopPlayback,
    loadPreferences,
    analyzeSession,
    initiateEliteSession,
    processMessage
  } = useEliteSystemIntegration();
  
  // Elite System activation and monitoring
  const { systemStatus, activateEliteSystem } = useEliteSystemActivation();
  
  // Real-time Elite integration
  const realTimeElite = useRealTimeEliteIntegration();

  const [messageInput, setMessageInput] = useState('');
  const [currentTherapist, setCurrentTherapist] = useState<TherapistPersonality | null>(null);
  const [userEmotion, setUserEmotion] = useState<string>('neutral');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }
    
    if (user) {
      loadPreferences();
      loadCurrentTherapist();
    }
  }, [user, loading, navigate, loadPreferences]);

  // Initialize Elite System when user starts chatting  
  useEffect(() => {
    if (user && messages.length === 1 && !systemStatus.isActivated) {
      console.log('🚀 Auto-activating Elite System for enhanced therapy session');
      activateEliteSystem();
    }
  }, [user, messages.length, systemStatus.isActivated, activateEliteSystem]);

  const loadCurrentTherapist = async () => {
    if (!user) return;
    
    try {
      const { data: relationship } = await supabase
        .from('therapeutic_relationship')
        .select('therapist_id')
        .eq('user_id', user.id)
        .single();

      if (relationship?.therapist_id) {
        const { data: therapist } = await supabase
          .from('therapist_personalities')
          .select('*')
          .eq('id', relationship.therapist_id)
          .single();

        if (therapist) {
          setCurrentTherapist(therapist);
        }
      }
    } catch (error) {
      console.error('Error loading therapist:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;
    
    await sendMessage(messageInput);
    setMessageInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmotionDetected = useCallback((emotion: any) => {
    setUserEmotion(emotion.emotion);
  }, []);

  const handleVoiceTranscription = useCallback((text: string) => {
    setMessageInput(text);
  }, []);

  const handleVoiceRecordingStateChange = useCallback((isRecording: boolean) => {
    setIsListening(isRecording);
  }, []);

  const handlePlayMessage = async (content: string) => {
    setIsSpeaking(true);
    await playMessage(content);
    setIsSpeaking(false);
  };

  const toggleCamera = () => {
    setCameraEnabled(!cameraEnabled);
  };

  const toggleVoice = () => {
    if (voiceEnabled && isSpeaking) {
      stopPlayback();
    }
    setVoiceEnabled(!voiceEnabled);
  };

  // Get avatar emotion based on recent messages and user emotion
  const getAvatarEmotion = () => {
    if (userEmotion === 'sad') return 'concerned';
    if (userEmotion === 'happy') return 'encouraging';
    if (userEmotion === 'angry' || userEmotion === 'frustrated') return 'thoughtful';
    if (isLoading) return 'thoughtful';
    return 'neutral';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
          <p className="text-therapy-600 font-medium">Loading Enhanced Therapy...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <BulletproofDashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="h-6 w-6 text-therapy-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">AI Therapy Session</h1>
                <p className="text-gray-600 mt-1">
                  {currentTherapist ? `With Dr. ${currentTherapist.name}` : 'Enhanced AI Therapy'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                Current Mood: {userEmotion}
              </Badge>
              
              {/* Elite System Status Indicator */}
              <Badge 
                variant={systemStatus.isActivated ? "default" : "secondary"} 
                className={systemStatus.isActivated ? "bg-green-600 text-white" : ""}
              >
                <Brain className="mr-1 h-3 w-3" />
                Elite AI {systemStatus.isActivated ? 'Active' : 'Inactive'}
              </Badge>
              
              <Button
                variant="outline"
                size="sm"
                onClick={toggleCamera}
                className={cameraEnabled ? 'bg-green-50 border-green-200' : ''}
              >
                {cameraEnabled ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={toggleVoice}
                className={voiceEnabled ? 'bg-blue-50 border-blue-200' : ''}
              >
                {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Main Chat Area */}
          <div className="lg:col-span-2 flex flex-col">
            <Card className="flex-1 flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Therapy Conversation
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                {/* Messages */}
                <ScrollArea className="flex-1 mb-4">
                  <div className="space-y-4 pr-4">
                    {messages.length === 0 && (
                      <div className="text-center text-muted-foreground py-8">
                        <Brain className="h-12 w-12 mx-auto mb-4 text-therapy-300" />
                        <p className="text-lg font-semibold mb-2">Welcome to your therapy session</p>
                        <p>How are you feeling today? I'm here to listen and support you.</p>
                      </div>
                    )}
                    
                    {messages.map((message, index) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] p-4 rounded-lg ${
                            message.isUser
                              ? 'bg-therapy-500 text-white'
                              : 'bg-gray-100 text-gray-900 border border-gray-200'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          
                          {/* Message metadata */}
                          <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                            <span>{message.timestamp.toLocaleTimeString()}</span>
                            
                            {!message.isUser && (
                              <div className="flex items-center gap-2">
                                {message.emotion && (
                                  <Badge variant="outline" className="text-xs">
                                    {message.emotion}
                                  </Badge>
                                )}
                                
                                {voiceEnabled && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handlePlayMessage(message.content)}
                                    disabled={isSpeaking}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Volume2 className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                          
                          {/* Crisis level indicator */}
                          {message.riskLevel === 'crisis' && (
                            <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded text-red-800 text-xs">
                              🚨 Crisis support resources are available
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 border border-gray-200 p-4 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-therapy-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-therapy-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                              <div className="w-2 h-2 bg-therapy-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                            <span className="text-sm text-gray-600">Thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Share what's on your mind..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !messageInput.trim()}
                    size="sm"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Avatar & Emotion Detection Sidebar */}
          <div className="space-y-4">
            {/* Enhanced 2D Therapist Avatar */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="h-80 bg-gradient-to-br from-therapy-50 to-calm-50 flex items-center justify-center">
                  <Professional2DAvatar
                    therapistId={currentTherapist?.id || 'dr-sarah-chen'}
                    therapistName={currentTherapist?.name || 'AI Therapist'}
                    className="w-full h-full"
                    size="xl"
                    showName={true}
                    emotion={getAvatarEmotion()}
                    isListening={isListening}
                    isSpeaking={isSpeaking}
                    showVoiceIndicator={true}
                    therapeuticMode={true}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Emotion Detection */}
            {cameraEnabled && (
              <EmotionCameraDetection
                onEmotionDetected={handleEmotionDetected}
                isActive={cameraEnabled}
                showPreview={true}
              />
            )}

            {/* Voice Input */}
            <VoiceRecorder
              onTranscription={handleVoiceTranscription}
              onRecordingStateChange={handleVoiceRecordingStateChange}
              userId={user?.id}
              sessionId={currentSessionId}
              isEnabled={voiceEnabled}
            />

            {/* Session Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Session Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Messages:</span>
                  <Badge variant="outline">{messages.length}</Badge>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span>Emotion Detection:</span>
                  <Badge variant={cameraEnabled ? 'default' : 'secondary'}>
                    {cameraEnabled ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span>Voice Response:</span>
                  <Badge variant={voiceEnabled ? 'default' : 'secondary'}>
                    {voiceEnabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => navigate('/therapy-plan')}
                >
                  View Therapy Plan
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => navigate('/therapist-selection')}
                >
                  Change Therapist
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => navigate('/settings')}
                >
                  Session Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </BulletproofDashboardLayout>
  );
};

export default EnhancedTherapyChatWithAvatar;