import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  MessageCircle, 
  Send, 
  Mic, 
  MicOff, 
  Brain, 
  Heart, 
  Activity,
  AlertTriangle,
  Clock,
  Lightbulb,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import VoiceTherapyChat from '@/components/voice/VoiceTherapyChat';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  emotion?: string;
  riskLevel?: 'low' | 'moderate' | 'high' | 'crisis';
  interventions?: string[];
  insights?: string[];
}

interface SessionMetrics {
  engagementScore: number;
  emotionalState: string;
  progressIndicators: string[];
  riskAssessment: string;
  recommendedTechniques: string[];
}

const EnhancedTherapyChatInterface = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionMetrics, setSessionMetrics] = useState<SessionMetrics>({
    engagementScore: 0,
    emotionalState: 'neutral',
    progressIndicators: [],
    riskAssessment: 'low',
    recommendedTechniques: []
  });
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [sessionStartTime] = useState(new Date());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      initializeSession();
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeSession = async () => {
    try {
      const { data: session, error } = await supabase
        .from('therapy_sessions')
        .insert({
          user_id: user?.id,
          start_time: sessionStartTime.toISOString(),
          mood_before: 5
        })
        .select()
        .single();

      if (error) throw error;
      
      setSessionId(session.id);
      
      // Add welcome message
      const welcomeMessage: Message = {
        id: 'welcome',
        content: "Hello! I'm here to provide therapeutic support. How are you feeling today, and what would you like to work on in our session?",
        sender: 'ai',
        timestamp: new Date(),
        emotion: 'supportive'
      };
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Error initializing session:', error);
      toast({
        title: "Session Error",
        description: "Failed to start therapy session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async (messageContent: string, isVoice = false) => {
    if (!messageContent.trim() || !sessionId) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: messageContent,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Store user message
      await supabase.from('session_messages').insert({
        session_id: sessionId,
        content: messageContent,
        sender: 'user',
        timestamp: new Date().toISOString()
      });

      // Get AI response with enhanced context
      const { data: aiResponse, error } = await supabase.functions.invoke('ai-therapy-chat', {
        body: {
          message: messageContent,
          sessionId: sessionId,
          isVoice: isVoice,
          conversationHistory: messages.slice(-5), // Last 5 messages for context
          userProfile: {
            userId: user?.id,
            sessionDuration: Date.now() - sessionStartTime.getTime()
          }
        }
      });

      if (error) throw error;

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: aiResponse.message,
        sender: 'ai',
        timestamp: new Date(),
        emotion: aiResponse.emotion,
        riskLevel: aiResponse.riskLevel,
        interventions: aiResponse.interventions,
        insights: aiResponse.insights
      };

      setMessages(prev => [...prev, aiMessage]);

      // Update session metrics
      if (aiResponse.metrics) {
        setSessionMetrics(aiResponse.metrics);
      }

      // Store AI message
      await supabase.from('session_messages').insert({
        session_id: sessionId,
        content: aiResponse.message,
        sender: 'ai',
        emotion: aiResponse.emotion,
        timestamp: new Date().toISOString()
      });

      // Handle crisis intervention if needed
      if (aiResponse.riskLevel === 'crisis') {
        toast({
          title: "🚨 Crisis Support",
          description: "I'm concerned about your safety. Let's work on this together.",
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Message Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    sendMessage(input);
    setInput('');
  };

  const handleVoiceMessage = (transcript: string) => {
    sendMessage(transcript, true);
  };

  const handleVoiceAnalysis = (emotion: string, stressLevel: number) => {
    setSessionMetrics(prev => ({
      ...prev,
      emotionalState: emotion,
      engagementScore: Math.max(prev.engagementScore, stressLevel * 100)
    }));
  };

  const endSession = async () => {
    if (!sessionId) return;

    try {
      await supabase
        .from('therapy_sessions')
        .update({
          end_time: new Date().toISOString(),
          mood_after: 7, // This would be collected from user
        })
        .eq('id', sessionId);

      toast({
        title: "Session Complete",
        description: "Your therapy session has been saved successfully.",
      });
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  const getRiskLevelColor = (riskLevel?: string) => {
    switch (riskLevel) {
      case 'crisis': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'moderate': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  return (
    <div className="h-full max-h-screen flex flex-col lg:flex-row gap-6 p-6">
      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col">
        <Card className="flex-1 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-2xl font-bold tracking-tight flex items-center">
              <Brain className="mr-2 h-6 w-6 text-therapy-600" />
              Enhanced AI Therapy
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-therapy-100">
                Session Active
              </Badge>
              <Button variant="outline" size="sm" onClick={endSession}>
                <Clock className="h-4 w-4 mr-1" />
                End Session
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col">
            {/* Messages Area */}
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex w-full ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] rounded-lg p-4 ${
                      message.sender === 'user'
                        ? 'bg-therapy-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      
                      {/* AI Message Metadata */}
                      {message.sender === 'ai' && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {message.emotion && (
                            <Badge variant="outline" className="text-xs">
                              <Heart className="h-3 w-3 mr-1" />
                              {message.emotion}
                            </Badge>
                          )}
                          {message.riskLevel && message.riskLevel !== 'low' && (
                            <Badge variant="outline" className="text-xs">
                              <AlertTriangle className={`h-3 w-3 mr-1 ${getRiskLevelColor(message.riskLevel)}`} />
                              {message.riskLevel}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Insights and Interventions */}
                      {message.insights && message.insights.length > 0 && (
                        <div className="mt-2 text-xs text-gray-600">
                          <div className="flex items-center">
                            <Lightbulb className="h-3 w-3 mr-1" />
                            <span className="font-medium">Insights:</span>
                          </div>
                          <ul className="list-disc list-inside mt-1">
                            {message.insights.map((insight, idx) => (
                              <li key={idx}>{insight}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="text-xs text-gray-500 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="mt-4 space-y-4">
              {/* Voice Chat Integration */}
              {isVoiceMode && (
                <VoiceTherapyChat
                  onMessageReceived={handleVoiceMessage}
                  onVoiceAnalysis={handleVoiceAnalysis}
                  isTherapistSpeaking={isLoading}
                />
              )}

              {/* Text Input */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsVoiceMode(!isVoiceMode)}
                >
                  {isVoiceMode ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Input
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  disabled={isLoading}
                />
                <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
                  {isLoading ? (
                    <Activity className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Session Analytics Sidebar */}
      <div className="w-full lg:w-80 space-y-4">
        {/* Real-time Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Session Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Engagement Score</span>
                <span>{Math.round(sessionMetrics.engagementScore)}%</span>
              </div>
              <Progress value={sessionMetrics.engagementScore} className="h-2" />
            </div>

            <div>
              <div className="text-sm font-medium mb-2">Emotional State</div>
              <Badge variant="outline" className="w-full justify-center">
                <Heart className="h-3 w-3 mr-1" />
                {sessionMetrics.emotionalState}
              </Badge>
            </div>

            <div>
              <div className="text-sm font-medium mb-2">Risk Assessment</div>
              <Badge 
                variant="outline" 
                className={`w-full justify-center ${getRiskLevelColor(sessionMetrics.riskAssessment)}`}
              >
                <AlertTriangle className="h-3 w-3 mr-1" />
                {sessionMetrics.riskAssessment}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Recommended Techniques */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Lightbulb className="h-5 w-5 mr-2" />
              Recommended Techniques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sessionMetrics.recommendedTechniques.length > 0 ? (
                sessionMetrics.recommendedTechniques.map((technique, index) => (
                  <Badge key={index} variant="outline" className="w-full justify-start">
                    {technique}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-gray-500">Continue the conversation to get personalized recommendations</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Progress Indicators */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Progress Indicators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sessionMetrics.progressIndicators.length > 0 ? (
                sessionMetrics.progressIndicators.map((indicator, index) => (
                  <div key={index} className="text-sm p-2 bg-therapy-50 rounded">
                    {indicator}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Progress tracking will appear as the session continues</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedTherapyChatInterface;