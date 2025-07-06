
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { useRealEnhancedChat } from '@/hooks/useRealEnhancedChat';
import { useTherapist } from '@/contexts/TherapistContext';
import ThreeDTherapistAvatar from '@/components/avatar/ThreeDTherapistAvatar';
import { getAvatarIdForTherapist } from '@/services/therapistAvatarMapping';
import { 
  MessageCircle, 
  Send, 
  Volume2, 
  VolumeX, 
  Brain, 
  Heart, 
  Lightbulb,
  AlertTriangle,
  BarChart3,
  Settings
} from 'lucide-react';

const RealTherapyChatInterface = () => {
  const { user } = useSimpleApp();
  const { selectedTherapist } = useTherapist();
  const {
    messages,
    isLoading,
    isPlaying,
    userPreferences,
    sendMessage,
    playMessage,
    stopPlayback,
    loadPreferences,
    analyzeSession
  } = useRealEnhancedChat();
  
  const [input, setInput] = useState('');
  const [showInsights, setShowInsights] = useState(false);
  const [avatarEmotion, setAvatarEmotion] = useState<'neutral' | 'happy' | 'concerned' | 'encouraging' | 'thoughtful'>('neutral');
  const [detectedUserEmotion, setDetectedUserEmotion] = useState<string>('neutral');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const currentTherapist = selectedTherapist;
  const avatarId = getAvatarIdForTherapist(currentTherapist?.id || '1');

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mood-responsive avatar behavior
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      
      if (!lastMessage.isUser && lastMessage.emotion) {
        switch (lastMessage.emotion.toLowerCase()) {
          case 'happy':
          case 'joy':
          case 'positive':
            setAvatarEmotion('happy');
            break;
          case 'sad':
          case 'worried':
          case 'anxious':
            setAvatarEmotion('concerned');
            break;
          case 'encouraging':
          case 'supportive':
            setAvatarEmotion('encouraging');
            break;
          default:
            setAvatarEmotion('neutral');
        }
      }

      if (lastMessage.isUser) {
        const content = lastMessage.content.toLowerCase();
        if (content.includes('sad') || content.includes('upset')) {
          setDetectedUserEmotion('sad');
          setAvatarEmotion('concerned');
        } else if (content.includes('happy') || content.includes('great')) {
          setDetectedUserEmotion('happy');
          setAvatarEmotion('encouraging');
        } else if (content.includes('anxious') || content.includes('worried')) {
          setDetectedUserEmotion('anxious');
          setAvatarEmotion('concerned');
        }
      }
    }
  }, [messages]);

  const handleSend = async () => {
    if (input.trim()) {
      await sendMessage(input);
      setInput('');
    }
  };

  const handlePlayMessage = async (content: string) => {
    setIsSpeaking(true);
    await playMessage(content);
    setIsSpeaking(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getRiskLevelColor = (riskLevel?: string) => {
    switch (riskLevel) {
      case 'crisis': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'moderate': return 'bg-yellow-500 text-black';
      default: return 'bg-green-500 text-white';
    }
  };

  return (
    <div className="h-full flex gap-6">
      {/* Avatar Display */}
      <div className="w-80 flex-shrink-0">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Heart className="mr-2 h-5 w-5 text-therapy-600" />
              {currentTherapist?.name || 'Your Therapist'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-square">
              <Suspense fallback={<Skeleton className="w-full h-full rounded-lg" />}>
                <ThreeDTherapistAvatar
                  therapistId={avatarId}
                  emotion={avatarEmotion}
                  userEmotion={detectedUserEmotion}
                  isSpeaking={isSpeaking || isPlaying}
                  isListening={isLoading}
                  showControls={true}
                />
              </Suspense>
            </div>
            {currentTherapist && (
              <div className="space-y-2 text-center">
                <Badge variant="outline" className="w-full justify-center">
                  {currentTherapist.approach}
                </Badge>
                <p className="text-xs text-muted-foreground">
                  {currentTherapist.communicationStyle}
                </p>
              </div>
            )}
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm font-medium mb-1">Avatar Mood</div>
              <div className="text-xs text-muted-foreground capitalize">
                {avatarEmotion} • User: {detectedUserEmotion}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col">
        <Card className="h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold tracking-tight flex items-center">
            <Brain className="mr-2 h-5 w-5 text-therapy-600" />
            AI Therapy Assistant
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={analyzeSession}
              disabled={messages.length === 0}
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              Analyze
            </Button>
            <Badge variant="secondary" className="bg-therapy-100 text-therapy-800">
              <Heart className="mr-1 h-3 w-3" />
              Real AI Enhanced
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-4">
          <ScrollArea className="flex-1 mb-4">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Brain className="h-12 w-12 mx-auto mb-4 text-therapy-400" />
                  <p className="text-lg font-medium">Welcome to your AI therapy session</p>
                  <p className="text-sm">Share what's on your mind, and I'll provide personalized support.</p>
                </div>
              )}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex w-full ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    message.isUser 
                      ? 'bg-therapy-600 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    
                    {/* AI Message Metadata */}
                    {!message.isUser && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {message.emotion && (
                          <Badge variant="outline" className="text-xs">
                            😊 {message.emotion}
                          </Badge>
                        )}
                        {message.riskLevel && message.riskLevel !== 'low' && (
                          <Badge className={`text-xs ${getRiskLevelColor(message.riskLevel)}`}>
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {message.riskLevel}
                          </Badge>
                        )}
                        {message.techniques && message.techniques.length > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            <Lightbulb className="h-3 w-3 mr-1" />
                            {message.techniques[0]}
                          </Badge>
                        )}
                        {userPreferences?.voice_enabled && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2"
                            onClick={() => isPlaying ? stopPlayback() : handlePlayMessage(message.content)}
                          >
                            {isPlaying ? (
                              <VolumeX className="h-3 w-3" />
                            ) : (
                              <Volume2 className="h-3 w-3" />
                            )}
                          </Button>
                        )}
                      </div>
                    )}
                    
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="flex items-center space-x-2 border-t pt-4">
            <Input
              placeholder="Share what's on your mind..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={handleSend} 
              disabled={isLoading || !input.trim()}
              className="bg-therapy-600 hover:bg-therapy-700"
            >
              {isLoading ? (
                <>
                  <Brain className="mr-2 h-4 w-4 animate-spin" />
                  Thinking...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
        </Card>
      </div>

      {/* Session Insights Panel */}
      {messages.length > 5 && (
        <Card className="border-therapy-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-therapy-600" />
                <span className="text-sm font-medium">Session Progress</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {messages.length} messages
              </Badge>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Your conversation is being analyzed for personalized insights and recommendations.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RealTherapyChatInterface;
