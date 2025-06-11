
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  MessageCircle,
  Clock,
  Square
} from "lucide-react";
import { useSession } from "@/contexts/SessionContext";
import { useTherapist } from "@/contexts/TherapistContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { voiceService } from "@/services/voiceService";
import { useVoiceInteraction } from "@/hooks/useVoiceInteraction";
import { format } from "date-fns";

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  emotion?: 'positive' | 'negative' | 'neutral';
}

interface TherapyChatInterfaceProps {
  onEndSession?: () => void;
  voiceEnabled?: boolean;
  onVoiceToggle?: (enabled: boolean) => void;
}

const TherapyChatInterface = ({ 
  onEndSession, 
  voiceEnabled = false,
  onVoiceToggle 
}: TherapyChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [currentPlayingMessageId, setCurrentPlayingMessageId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { currentSession, addMessage } = useSession();
  const { currentTherapist } = useTherapist();
  const { toast } = useToast();

  const {
    isListening,
    isSupported: voiceInputSupported,
    transcript,
    startListening,
    stopListening,
    clearTranscript
  } = useVoiceInteraction();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-set transcript as input when voice input is complete
  useEffect(() => {
    if (transcript && !isListening) {
      setInput(transcript);
      clearTranscript();
    }
  }, [transcript, isListening, clearTranscript]);

  // Welcome message when session starts
  useEffect(() => {
    if (currentSession && messages.length === 0 && currentTherapist) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        content: `Hello! I'm ${currentTherapist.name}, your ${currentTherapist.title}. I'm here to support you through this therapy session. How are you feeling today?`,
        isUser: false,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      
      // Auto-play welcome message if voice is enabled
      if (voiceEnabled && voiceService.hasApiKey()) {
        playVoiceMessage(welcomeMessage.content, 'welcome');
      }
    }
  }, [currentSession, currentTherapist, messages.length, voiceEnabled]);

  const playVoiceMessage = async (text: string, messageId: string) => {
    if (!voiceEnabled || !voiceService.hasApiKey() || isVoicePlaying) return;

    try {
      setIsVoicePlaying(true);
      setCurrentPlayingMessageId(messageId);
      
      // Get the appropriate voice for the current therapist
      const voiceId = getTherapistVoiceId(currentTherapist?.id || 'default');
      
      await voiceService.playText(text, {
        voiceId,
        model: "eleven_multilingual_v2",
        stability: 0.75,
        similarityBoost: 0.85
      });
    } catch (error) {
      console.error('Voice playback error:', error);
      toast({
        title: "Voice Error",
        description: "Unable to play voice message. Please check your settings.",
        variant: "destructive",
      });
    } finally {
      setIsVoicePlaying(false);
      setCurrentPlayingMessageId(null);
    }
  };

  const stopVoiceMessage = () => {
    if (isVoicePlaying) {
      voiceService.stop();
      setIsVoicePlaying(false);
      setCurrentPlayingMessageId(null);
    }
  };

  const getTherapistVoiceId = (therapistId: string): string => {
    const voiceMap: Record<string, string> = {
      'aria': '9BWtsMINqrJLrRacOk9x', // Aria - calm, therapeutic
      'sarah': 'EXAVITQu4vr4xnSDxMaL', // Sarah - warm, supportive
      'lily': 'pFZP5JQG7iQjIQuC4Bku', // Lily - gentle, empathetic
      'default': '9BWtsMINqrJLrRacOk9x' // Default to Aria
    };
    return voiceMap[therapistId] || voiceMap.default;
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading || !currentSession || !user) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    await addMessage(input.trim(), 'user');
    
    const currentInput = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      // Convert messages to conversation history format
      const conversationHistory = messages.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.content
      }));

      // Call the Supabase Edge Function for AI therapy chat
      const { data, error } = await supabase.functions.invoke('ai-therapy-chat', {
        body: {
          message: currentInput,
          userId: user.id,
          therapistPersonality: currentTherapist,
          conversationHistory: conversationHistory
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to get AI response');
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: data.response || 'I understand. Can you tell me more about that?',
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      await addMessage(aiMessage.content, 'ai');
      
      // Auto-play AI response if voice is enabled
      if (voiceEnabled && voiceService.hasApiKey()) {
        // Small delay to ensure message is rendered
        setTimeout(() => {
          playVoiceMessage(aiMessage.content, aiMessage.id);
        }, 300);
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fallback response
      const fallbackMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I'm here to listen. Can you share what's on your mind today?",
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, fallbackMessage]);
      await addMessage(fallbackMessage.content, 'ai');

      toast({
        title: "Connection Issue",
        description: "I'm still here to help. Please continue sharing your thoughts.",
        variant: "default",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!currentSession) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Active Session</h3>
          <p className="text-muted-foreground">
            Please start a therapy session to begin chatting.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!currentTherapist) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Therapist Selected</h3>
          <p className="text-muted-foreground">
            Please select a therapist to begin your session.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Chat Header */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={`/therapist-${currentTherapist.id}.jpg`} />
                <AvatarFallback className="bg-therapy-100 text-therapy-700">
                  {currentTherapist.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{currentTherapist.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{currentTherapist.title}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Clock className="h-3 w-3 mr-1" />
                Session Active
              </Badge>
              {voiceEnabled && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  <Volume2 className="h-3 w-3 mr-1" />
                  Voice On
                </Badge>
              )}
              {isVoicePlaying && (
                <Badge variant="outline" className="bg-green-50 text-green-700 animate-pulse">
                  Speaking...
                </Badge>
              )}
              {onEndSession && (
                <Button variant="outline" size="sm" onClick={onEndSession}>
                  End Session
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Chat Messages */}
      <Card className="flex-grow flex flex-col">
        <CardContent className="flex-grow p-0">
          <ScrollArea className="h-[500px] p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.isUser ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    {message.isUser ? (
                      <AvatarFallback className="bg-therapy-500 text-white">
                        {user?.user_metadata?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    ) : (
                      <AvatarFallback className="bg-therapy-100 text-therapy-700">
                        {currentTherapist.name.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  
                  <div className={`flex-grow max-w-[80%] ${message.isUser ? 'text-right' : ''}`}>
                    <div
                      className={`rounded-lg p-3 ${
                        message.isUser
                          ? 'bg-therapy-500 text-white'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    
                    <div className={`flex items-center mt-1 space-x-2 ${
                      message.isUser ? 'justify-end' : 'justify-start'
                    }`}>
                      <span className="text-xs text-muted-foreground">
                        {format(message.timestamp, 'HH:mm')}
                      </span>
                      {!message.isUser && voiceEnabled && voiceService.hasApiKey() && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (currentPlayingMessageId === message.id && isVoicePlaying) {
                              stopVoiceMessage();
                            } else {
                              playVoiceMessage(message.content, message.id);
                            }
                          }}
                          className="h-6 w-6 p-0"
                          disabled={isVoicePlaying && currentPlayingMessageId !== message.id}
                        >
                          {currentPlayingMessageId === message.id && isVoicePlaying ? (
                            <Square className="h-3 w-3" />
                          ) : (
                            <Volume2 className="h-3 w-3" />
                          )}
                        </Button>
                      )}
                      {message.emotion && (
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            message.emotion === 'positive' ? 'text-green-600' :
                            message.emotion === 'negative' ? 'text-red-600' : 'text-gray-600'
                          }`}
                        >
                          {message.emotion === 'positive' ? '😊' : 
                           message.emotion === 'negative' ? '😔' : '😐'}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-start space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-therapy-100 text-therapy-700">
                      {currentTherapist.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-therapy-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-therapy-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-therapy-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>

        {/* Chat Input */}
        <div className="border-t p-4">
          {/* Voice transcript display */}
          {transcript && (
            <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
              <span className="text-blue-700 font-medium">Voice input: </span>
              <span className="text-blue-900">{transcript}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            {/* Voice Input Button */}
            {voiceInputSupported && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleVoiceInput}
                className={`${isListening ? 'bg-red-100 text-red-600 animate-pulse' : ''}`}
                disabled={isLoading}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            )}
            
            {/* Voice Control Button */}
            {onVoiceToggle && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onVoiceToggle(!voiceEnabled)}
                className={voiceEnabled ? 'bg-green-100 text-green-600' : ''}
              >
                {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
            )}
            
            <Input
              type="text"
              placeholder="Type your message or use voice input..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-grow"
              disabled={isLoading}
            />
            
            <Button 
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              size="sm"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <div className="mt-2 text-xs text-muted-foreground text-center">
            {voiceInputSupported ? 'Press Enter to send • Click mic for voice input' : 'Press Enter to send • Shift+Enter for new line'}
            {voiceEnabled && !voiceService.hasApiKey() && (
              <span className="text-amber-600 ml-2">• Add ElevenLabs API key for voice responses</span>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TherapyChatInterface;
