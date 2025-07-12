import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useStructuredSession } from '@/hooks/useStructuredSession';
import Professional2DAvatar from '@/components/avatar/Professional2DAvatar';
import EmotionCameraDetection from '@/components/avatar/EmotionCameraDetection';
import VoiceRecorder from '@/components/voice/VoiceRecorder';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  Heart,
  Clock,
  BookOpen,
  Target,
  Activity,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface StructuredSessionInterfaceProps {
  therapyApproach: string;
  onSessionComplete: (summary: any) => void;
  initialMood?: number;
}

const StructuredSessionInterface: React.FC<StructuredSessionInterfaceProps> = ({
  therapyApproach,
  onSessionComplete,
  initialMood = 5
}) => {
  const { user } = useAuth();
  const [messageInput, setMessageInput] = useState('');
  const [userEmotion, setUserEmotion] = useState<string>('neutral');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const {
    sessionState,
    messages,
    isLoading,
    timeRemaining,
    phaseTransitionAlert,
    systemHealth,
    sendMessage,
    pauseSession,
    resumeSession,
    endSession,
    getSessionProgress,
    getPhaseProgress,
    getCurrentPhaseInfo,
    getSessionStats
  } = useStructuredSession({
    therapyApproach,
    userId: user?.id || '',
    initialMood,
    onSessionComplete,
    onHealthAlert: (health) => {
      console.warn('System health alert:', health);
    }
  });

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;
    
    const success = await sendMessage(messageInput);
    if (success) {
      setMessageInput('');
    }
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

  const getAvatarEmotion = () => {
    if (userEmotion === 'sad') return 'concerned';
    if (userEmotion === 'happy') return 'encouraging';
    if (userEmotion === 'angry' || userEmotion === 'frustrated') return 'thoughtful';
    if (isLoading) return 'thoughtful';
    return 'neutral';
  };

  const currentPhase = getCurrentPhaseInfo();
  const sessionProgress = getSessionProgress();
  const phaseProgress = getPhaseProgress();
  const sessionStats = getSessionStats();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Session Header with Structured Phases */}
      <div className="mb-6 bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-semibold">Structured Therapy Session</span>
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {timeRemaining}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {therapyApproach}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              Mood: {userEmotion}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            {systemHealth && (
              <Badge 
                variant={systemHealth.status === 'healthy' ? 'default' : 'destructive'}
                className="flex items-center gap-1"
              >
                <Activity className="h-3 w-3" />
                System: {systemHealth.status}
              </Badge>
            )}
          </div>
        </div>

        {/* Phase Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">
              Current Phase: {currentPhase?.name || 'Unknown'}
            </span>
            <span className="text-muted-foreground">
              Session Progress: {Math.round(sessionProgress)}%
            </span>
          </div>
          <Progress value={sessionProgress} className="h-2" />
          
          {currentPhase && (
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Phase Goal:</span> {currentPhase.description}
            </div>
          )}
        </div>

        {/* Phase Transition Alert */}
        {phaseTransitionAlert && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-800">{phaseTransitionAlert}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-300px)]">
        {/* Main Structured Chat Area */}
        <div className="lg:col-span-2 flex flex-col">
          <Card className="flex-1 flex flex-col">
            <CardHeader className="flex-shrink-0">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                {currentPhase?.name || 'Therapy Conversation'}
                <Badge variant="outline" className="ml-auto">
                  Playbook-Guided
                </Badge>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 mb-4">
                <div className="space-y-4 pr-4">
                  {messages.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      <Brain className="h-12 w-12 mx-auto mb-4 text-therapy-300" />
                      <p className="text-lg font-semibold mb-2">Structured Session Started</p>
                      <p>Your {therapyApproach} session is beginning with our evidence-based approach.</p>
                      <p className="text-sm mt-2">This session follows a structured playbook for optimal therapeutic outcomes.</p>
                    </div>
                  )}
                  
                  {messages.map((message, index) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] p-4 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-therapy-500 text-white'
                            : 'bg-gray-100 text-gray-900 border border-gray-200'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        
                        {/* Structured message metadata */}
                        {message.phaseId && (
                          <div className="mt-2 pt-2 border-t border-gray-200/50">
                            <div className="flex items-center gap-2 text-xs opacity-70">
                              <Badge variant="outline" className="text-xs">
                                Phase: {message.phaseId}
                              </Badge>
                              {message.emotion && (
                                <span className="italic">Emotion: {message.emotion}</span>
                              )}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                          <span>{message.timestamp.toLocaleTimeString()}</span>
                          
                          {message.sender !== 'user' && voiceEnabled && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {/* TODO: Implement voice playback */}}
                              disabled={isSpeaking}
                              className="h-6 w-6 p-0"
                            >
                              <Volume2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
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
                          <span className="text-sm text-gray-600">Therapist is processing using structured approach...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="flex gap-2">
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Share your thoughts in this structured session..."
                  disabled={isLoading}
                  className="flex-1"
                />
                
                {voiceEnabled && (
                  <VoiceRecorder
                    onTranscription={handleVoiceTranscription}
                    onRecordingStateChange={handleVoiceRecordingStateChange}
                    isEnabled={!isLoading}
                  />
                )}
                
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !messageInput.trim()}
                  className="bg-therapy-600 hover:bg-therapy-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Structured Session Panel */}
        <div className="space-y-6">
          {/* AI Avatar */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Therapist</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-4">
                <Professional2DAvatar
                  therapistId="structured-session"
                  therapistName="AI Therapist"
                  emotion={getAvatarEmotion()}
                  isListening={isListening}
                  isSpeaking={isSpeaking}
                  className="mx-auto"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCameraEnabled(!cameraEnabled)}
                  >
                    {cameraEnabled ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setVoiceEnabled(!voiceEnabled)}
                  >
                    {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Session Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5" />
                Session Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Messages Exchanged</span>
                  <span className="font-semibold">{sessionStats?.messageCount || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Current Phase</span>
                  <span className="font-semibold">{currentPhase?.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Phase Progress</span>
                  <span className="font-semibold">{Math.round(phaseProgress)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Emotional Tone</span>
                  <span className="font-semibold capitalize">{userEmotion}</span>
                </div>
              </div>

              {/* Session Controls */}
              <div className="pt-4 border-t space-y-2">
                <Button
                  onClick={pauseSession}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Pause Session
                </Button>
                <Button
                  onClick={() => endSession()}
                  variant="destructive"
                  size="sm"
                  className="w-full"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  End Session
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Emotion Detection */}
          {cameraEnabled && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Emotion Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <EmotionCameraDetection
                  onEmotionDetected={handleEmotionDetected}
                  isActive={cameraEnabled}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default StructuredSessionInterface;