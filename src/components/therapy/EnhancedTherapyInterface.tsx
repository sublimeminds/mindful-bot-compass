
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageCircle, 
  Send, 
  Volume2, 
  VolumeX, 
  Brain, 
  Heart,
  AlertTriangle,
  Phone
} from 'lucide-react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { useTherapist } from '@/contexts/TherapistContext';
import { chatService } from '@/services/chatService';
import { OpenAIService } from '@/services/openAiService';
import { EnhancedCrisisDetectionService } from '@/services/enhancedCrisisDetectionService';
import { voiceService } from '@/services/voiceService';
import SessionTimer from '@/components/session/SessionTimer';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  emotion?: string;
}

interface EnhancedTherapyInterfaceProps {
  sessionId: string;
  onEndSession: () => void;
}

const EnhancedTherapyInterface = ({ sessionId, onEndSession }: EnhancedTherapyInterfaceProps) => {
  const { user } = useSimpleApp();
  const { selectedTherapist } = useTherapist();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionStart] = useState(new Date());
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [crisisAlert, setCrisisAlert] = useState<any>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Load existing messages if any
    const loadMessages = async () => {
      if (sessionId) {
        const existingMessages = await chatService.getSessionMessages(sessionId);
        setMessages(existingMessages.map(msg => ({
          id: msg.id,
          content: msg.content,
          sender: msg.sender,
          timestamp: msg.timestamp,
          emotion: msg.emotion
        })));
      }
    };
    loadMessages();
  }, [sessionId]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Check for crisis indicators
      const crisisIndicator = EnhancedCrisisDetectionService.analyzeEnhancedCrisisLevel(input);
      if (crisisIndicator && crisisIndicator.urgencyLevel === 'immediate') {
        setCrisisAlert(crisisIndicator);
      }

      // Save user message
      await chatService.sendMessage(sessionId, input, 'user');

      // Get AI response
      const response = await OpenAIService.sendTherapyMessage(
        input,
        messages.map(msg => ({ role: msg.sender === 'user' ? 'user' : 'assistant', content: msg.content })),
        selectedTherapist,
        user?.id
      );

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        sender: 'ai',
        timestamp: new Date(),
        emotion: response.emotion
      };

      setMessages(prev => [...prev, aiMessage]);

      // Save AI message
      await chatService.sendMessage(sessionId, response.message, 'ai');

      // Play voice if enabled
      if (voiceEnabled && voiceService.hasApiKey()) {
        await voiceService.playText(response.message, {
          voiceId: "9BWtsMINqrJLrRacOk9x",
          emotionAnalysis: true
        });
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble responding right now. Please try again.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
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

  const dismissCrisisAlert = () => {
    setCrisisAlert(null);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Crisis Alert */}
      {crisisAlert && (
        <Card className="mb-4 border-red-500 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-6 w-6 text-red-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-red-800">Crisis Support Needed</h3>
                  <p className="text-red-700 mb-3">
                    {EnhancedCrisisDetectionService.generateEnhancedResponse(crisisAlert)}
                  </p>
                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                      <Phone className="h-4 w-4 mr-2" />
                      Call 988
                    </Button>
                    <Button size="sm" variant="outline" onClick={dismissCrisisAlert}>
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Session Header */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2 text-therapy-500" />
              Therapy Session with {selectedTherapist?.name || 'AI Therapist'}
            </CardTitle>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setVoiceEnabled(!voiceEnabled)}
              >
                {voiceEnabled ? (
                  <Volume2 className="h-4 w-4 text-green-600" />
                ) : (
                  <VolumeX className="h-4 w-4 text-gray-400" />
                )}
              </Button>
              <SessionTimer
                startTime={sessionStart}
                onEndSession={onEndSession}
              />
            </div>
          </div>
          {selectedTherapist && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Badge variant="secondary">{selectedTherapist.approach}</Badge>
              <span>•</span>
              <span>{selectedTherapist.specialties.join(', ')}</span>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Chat Messages */}
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-[500px] p-4">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <Brain className="h-12 w-12 mx-auto mb-4 text-therapy-300" />
                  <p>Welcome to your therapy session. How are you feeling today?</p>
                </div>
              )}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-therapy-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs ${
                        message.sender === 'user' ? 'text-therapy-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                      {message.emotion && (
                        <Badge variant="outline" className="text-xs">
                          {message.emotion}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center space-x-2">
                      <Brain className="h-4 w-4 animate-spin text-therapy-500" />
                      <span className="text-sm text-gray-600">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={chatBottomRef} />
            </div>
          </ScrollArea>
        </CardContent>

        {/* Message Input */}
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Share what's on your mind..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={isLoading || !input.trim()}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EnhancedTherapyInterface;
