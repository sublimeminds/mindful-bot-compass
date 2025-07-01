import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Bot,
  User,
  Activity,
  Heart,
  Brain,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { VoiceIntegrationService } from '@/services/voiceIntegrationService';
import { useAuth } from '@/hooks/useAuth';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  emotion?: string;
  isVoice?: boolean;
  aiMetadata?: {
    emotion_detected?: string;
    stress_level?: number;
    therapeutic_approach?: string;
    confidence?: number;
  };
}

interface EnhancedTherapyChatProps {
  className?: string;
}

const EnhancedTherapyChat = ({ className }: EnhancedTherapyChatProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [currentEmotion, setCurrentEmotion] = useState('neutral');
  const [stressLevel, setStressLevel] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Send welcome message
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        content: "Hello! I'm your AI therapist. I'm here to listen and support you. How are you feeling today?",
        sender: 'ai',
        timestamp: new Date(),
        aiMetadata: {
          therapeutic_approach: 'welcoming',
          confidence: 1.0
        }
      };
      setMessages([welcomeMessage]);
      
      if (autoSpeak) {
        speakText(welcomeMessage.content);
      }
    }
  }, []);

  const sendMessage = async (content: string, isVoice = false, emotion?: string) => {
    if (!content.trim() || !user) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
      emotion,
      isVoice
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Get AI response
      const { data, error } = await supabase.functions.invoke('ai-therapy-chat', {
        body: {
          message: content,
          context: {
            emotion: emotion || currentEmotion,
            stress_level: stressLevel,
            is_voice: isVoice,
            user_id: user.id,
            conversation_history: messages.slice(-10) // Last 10 messages for context
          }
        }
      });

      if (error) throw error;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: 'ai',
        timestamp: new Date(),
        aiMetadata: data.metadata
      };

      setMessages(prev => [...prev, aiMessage]);

      // Update emotion and stress if detected
      if (data.metadata?.emotion_detected) {
        setCurrentEmotion(data.metadata.emotion_detected);
      }
      if (data.metadata?.stress_level !== undefined) {
        setStressLevel(data.metadata.stress_level);
      }

      // Speak AI response if enabled
      if (autoSpeak && !isVoice) {
        await speakText(data.response);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendText = () => {
    sendMessage(inputText);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  const startVoiceRecording = async () => {
    try {
      setIsRecording(true);
      const mediaRecorder = await VoiceIntegrationService.startRecording();
      mediaRecorderRef.current = mediaRecorder;
      
      toast({
        title: "Recording Started",
        description: "Speak now... Tap the microphone again to stop.",
      });
    } catch (error) {
      console.error('Failed to start recording:', error);
      toast({
        title: "Recording Failed",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
      setIsRecording(false);
    }
  };

  const stopVoiceRecording = async () => {
    if (!mediaRecorderRef.current) return;

    try {
      setIsRecording(false);
      setIsLoading(true);

      const audioBlob = await VoiceIntegrationService.stopRecording(mediaRecorderRef.current);
      mediaRecorderRef.current = null;

      // Convert speech to text
      const transcript = await VoiceIntegrationService.convertSpeechToText(audioBlob);

      if (transcript.trim()) {
        // Simulate emotion detection from voice
        const emotions = ['calm', 'anxious', 'sad', 'happy', 'stressed', 'hopeful'];
        const detectedEmotion = emotions[Math.floor(Math.random() * emotions.length)];
        
        await sendMessage(transcript, true, detectedEmotion);
      } else {
        toast({
          title: "No Speech Detected",
          description: "Please try speaking more clearly.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to process recording:', error);
      toast({
        title: "Processing Failed",
        description: "Could not process your voice message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = async (text: string) => {
    if (!autoSpeak || !text.trim()) return;

    try {
      const base64Audio = await VoiceIntegrationService.convertTextToSpeech(text, {
        voice: 'nova',
        model: 'tts-1',
        speed: 0.9
      });

      await VoiceIntegrationService.playBase64Audio(base64Audio);
    } catch (error) {
      console.error('Failed to speak text:', error);
    }
  };

  const getEmotionColor = (emotion?: string) => {
    switch (emotion) {
      case 'happy': case 'hopeful': return 'text-green-600';
      case 'sad': case 'anxious': return 'text-blue-600';
      case 'stressed': case 'angry': return 'text-red-600';
      case 'calm': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const getEmotionIcon = (emotion?: string) => {
    switch (emotion) {
      case 'happy': case 'hopeful': return '😊';
      case 'sad': return '😢';
      case 'anxious': case 'stressed': return '😰';
      case 'angry': return '😠';
      case 'calm': return '😌';
      default: return '😐';
    }
  };

  return (
    <div className={`flex flex-col h-full space-y-4 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-therapy-600" />
              <span>AI Therapy Chat</span>
              <Badge variant="outline" className="bg-therapy-100 text-therapy-700">
                Enhanced
              </Badge>
            </CardTitle>
            
            <div className="flex items-center space-x-4">
              {/* Current Emotion */}
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-therapy-600" />
                <span className={`text-sm font-medium ${getEmotionColor(currentEmotion)}`}>
                  {getEmotionIcon(currentEmotion)} {currentEmotion}
                </span>
              </div>
              
              {/* Stress Level */}
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-therapy-600" />
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-therapy-500 to-calm-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${stressLevel * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600">{Math.round(stressLevel * 100)}%</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Messages */}
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 flex flex-col p-4">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg space-y-2 ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-therapy-500 to-therapy-600 text-white'
                        : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-900 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      {message.sender === 'user' ? (
                        <User className="h-3 w-3" />
                      ) : (
                        <Bot className="h-3 w-3" />
                      )}
                      <span className="text-xs opacity-70">
                        {message.sender === 'user' ? 'You' : 'AI Therapist'}
                      </span>
                      {message.isVoice && (
                        <Mic className="h-3 w-3 opacity-70" />
                      )}
                      {message.aiMetadata?.confidence && (
                        <Sparkles className="h-3 w-3 opacity-70" />
                      )}
                    </div>
                    
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    
                    <div className="flex items-center justify-between text-xs opacity-70">
                      <span>{message.timestamp.toLocaleTimeString()}</span>
                      {message.emotion && (
                        <span className="flex items-center space-x-1">
                          <span>{getEmotionIcon(message.emotion)}</span>
                          <span className="capitalize">{message.emotion}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-4 py-3 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-3 w-3" />
                      <span className="text-xs text-gray-600">AI Therapist</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Activity className="h-4 w-4 animate-spin text-therapy-600" />
                      <span className="text-sm text-gray-600">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t pt-4 mt-4">
            <div className="flex items-center space-x-2 mb-3">
              {/* Voice Settings */}
              <div className="flex items-center space-x-2">
                <Switch
                  checked={voiceEnabled}
                  onCheckedChange={setVoiceEnabled}
                  id="voice-enabled"
                />
                <Label htmlFor="voice-enabled" className="text-xs">Voice</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={autoSpeak}
                  onCheckedChange={setAutoSpeak}
                  id="auto-speak"
                />
                <Label htmlFor="auto-speak" className="text-xs">Auto-speak</Label>
              </div>
            </div>

            <div className="flex space-x-2">
              <Input
                placeholder="Type your message or use voice..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading || isRecording}
                className="flex-1"
              />
              
              {voiceEnabled && (
                <Button
                  size="icon"
                  variant={isRecording ? "destructive" : "outline"}
                  onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                  disabled={isLoading}
                  className={isRecording ? "animate-pulse" : ""}
                >
                  {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              )}
              
              <Button
                onClick={handleSendText}
                disabled={isLoading || !inputText.trim() || isRecording}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedTherapyChat;