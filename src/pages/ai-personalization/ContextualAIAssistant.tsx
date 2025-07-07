import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bot, 
  MessageSquare, 
  Clock, 
  MapPin, 
  Calendar,
  Cloud,
  Activity,
  Brain,
  Heart,
  Lightbulb,
  Settings,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Zap,
  Shield,
  User
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface ContextualData {
  time: string;
  day: string;
  weather: string;
  location: string;
  recentMood: string;
  lastSession: string;
  currentGoals: string[];
  stressLevel: number;
  energyLevel: number;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  context?: string;
  suggestions?: string[];
}

const ContextualAIAssistant = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [contextualData, setContextualData] = useState<ContextualData | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Mock contextual data
  useEffect(() => {
    const mockContextualData: ContextualData = {
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      day: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
      weather: 'Partly cloudy, 72°F',
      location: 'San Francisco, CA',
      recentMood: 'Slightly anxious',
      lastSession: '2 days ago - Mindfulness session',
      currentGoals: ['Daily meditation', 'Sleep consistency', 'Stress management'],
      stressLevel: 6,
      energyLevel: 4,
    };

    setContextualData(mockContextualData);

    // Initial AI greeting
    const welcomeMessage: Message = {
      id: '1',
      type: 'assistant',
      content: `Hello! I'm your contextual AI assistant. I see it's ${mockContextualData.time} on ${mockContextualData.day}. Based on your recent mood patterns and current stress level, I'm here to provide personalized support. How are you feeling right now?`,
      timestamp: new Date().toISOString(),
      context: 'Greeting based on time and recent mood data',
      suggestions: [
        'I need help managing stress',
        'Can you suggest a quick relaxation technique?',
        'I want to talk about my goals',
        'I\'m feeling overwhelmed'
      ]
    };

    setMessages([welcomeMessage]);
  }, []);

  const generateAIResponse = (userMessage: string): Message => {
    const responses = [
      {
        trigger: ['stress', 'anxious', 'overwhelmed'],
        response: `I understand you're feeling stressed. Given that it's ${contextualData?.time} and your stress level is at ${contextualData?.stressLevel}/10, let's try a quick breathing exercise. The 4-7-8 technique works well for immediate relief.`,
        context: 'Stress management based on current time and stress level',
        suggestions: ['Guide me through breathing', 'What other techniques can help?', 'Why am I feeling this way?']
      },
      {
        trigger: ['tired', 'exhausted', 'energy'],
        response: `Your energy level is at ${contextualData?.energyLevel}/10 today. Since it's ${contextualData?.day}, this might be normal for this day of the week. Let's explore some gentle energy-boosting activities that won't overstimulate you.`,
        context: 'Energy management based on current levels and day patterns',
        suggestions: ['Suggest energy boosters', 'Check my sleep patterns', 'Plan rest time']
      },
      {
        trigger: ['goals', 'progress', 'achievement'],
        response: `I see you're working on ${contextualData?.currentGoals.join(', ')}. Your last session was ${contextualData?.lastSession}. Given your current mood state, let's focus on small, achievable steps today.`,
        context: 'Goal discussion based on current active goals and session history',
        suggestions: ['Review my progress', 'Adjust my goals', 'Set a small win for today']
      },
      {
        trigger: ['sleep', 'insomnia', 'rest'],
        response: `Sleep is crucial for your wellness goals. Given that it's ${contextualData?.time}, let's talk about your sleep routine. Your stress level of ${contextualData?.stressLevel}/10 might be affecting your sleep quality.`,
        context: 'Sleep guidance based on current time and stress correlation',
        suggestions: ['Plan my bedtime routine', 'What\'s affecting my sleep?', 'Quick relaxation for sleep']
      }
    ];

    const matchedResponse = responses.find(r => 
      r.trigger.some(trigger => userMessage.toLowerCase().includes(trigger))
    );

    if (matchedResponse) {
      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: matchedResponse.response,
        timestamp: new Date().toISOString(),
        context: matchedResponse.context,
        suggestions: matchedResponse.suggestions
      };
    }

    // Default contextual response
    return {
      id: Date.now().toString(),
      type: 'assistant',
      content: `I understand. Based on your current context - it's ${contextualData?.time} on ${contextualData?.day}, and your recent mood has been ${contextualData?.recentMood}. Let me help you work through this. Can you tell me more about what's on your mind?`,
      timestamp: new Date().toISOString(),
      context: 'General response with current contextual awareness',
      suggestions: ['I need specific help', 'Let\'s work on goals', 'Check my mood patterns', 'Suggest coping strategies']
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    toast({
      title: voiceEnabled ? "Voice Disabled" : "Voice Enabled",
      description: voiceEnabled ? "AI responses will be text-only" : "AI will respond with voice",
    });
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      toast({
        title: "Listening...",
        description: "Speak now, I'm listening to your voice input",
      });
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contextual AI Assistant</h1>
          <p className="text-gray-600 mt-2">AI that understands your current situation and adapts to help</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            onClick={toggleVoice}
            className="flex items-center space-x-2"
          >
            {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            <span>{voiceEnabled ? 'Voice On' : 'Voice Off'}</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Context Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-therapy-600" />
                <span>Current Context</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {contextualData && (
                <>
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{contextualData.time}, {contextualData.day}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <Cloud className="h-4 w-4 text-gray-500" />
                    <span>{contextualData.weather}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{contextualData.location}</span>
                  </div>
                  
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Current State</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center space-x-1">
                          <Heart className="h-3 w-3 text-red-500" />
                          <span>Mood</span>
                        </span>
                        <span>{contextualData.recentMood}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center space-x-1">
                          <Activity className="h-3 w-3 text-orange-500" />
                          <span>Stress</span>
                        </span>
                        <Badge variant={contextualData.stressLevel > 7 ? 'destructive' : contextualData.stressLevel > 4 ? 'secondary' : 'default'}>
                          {contextualData.stressLevel}/10
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center space-x-1">
                          <Zap className="h-3 w-3 text-green-500" />
                          <span>Energy</span>
                        </span>
                        <Badge variant={contextualData.energyLevel > 7 ? 'default' : contextualData.energyLevel > 4 ? 'secondary' : 'destructive'}>
                          {contextualData.energyLevel}/10
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Active Goals</p>
                    <div className="space-y-1">
                      {contextualData.currentGoals.map((goal, index) => (
                        <div key={index} className="flex items-center space-x-2 text-xs">
                          <div className="w-2 h-2 bg-therapy-500 rounded-full"></div>
                          <span>{goal}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Privacy Notice */}
          <Card className="mt-4">
            <CardContent className="p-4">
              <div className="flex items-start space-x-2">
                <Shield className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-gray-700">Privacy Protected</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Your conversations are encrypted and never stored permanently.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center space-x-2">
                <Bot className="h-5 w-5 text-therapy-600" />
                <span>Contextual AI Chat</span>
                <Badge variant="outline" className="ml-auto">
                  Context-Aware
                </Badge>
              </CardTitle>
            </CardHeader>
            
            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`p-2 rounded-full ${message.type === 'user' ? 'bg-therapy-100' : 'bg-gray-100'}`}>
                    {message.type === 'user' ? 
                      <User className="h-4 w-4 text-therapy-600" /> : 
                      <Bot className="h-4 w-4 text-gray-600" />
                    }
                  </div>
                  
                  <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                    <div className={`rounded-lg p-3 ${message.type === 'user' ? 'bg-therapy-100 text-therapy-900' : 'bg-gray-50 text-gray-900'}`}>
                      <p>{message.content}</p>
                    </div>
                    
                    {message.context && (
                      <p className="text-xs text-gray-500 mt-1 flex items-center space-x-1">
                        <Brain className="h-3 w-3" />
                        <span>{message.context}</span>
                      </p>
                    )}
                    
                    {message.suggestions && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-xs"
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-full bg-gray-100">
                    <Bot className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            
            {/* Input */}
            <div className="border-t p-4">
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleListening}
                  className={isListening ? 'bg-red-50 border-red-200' : ''}
                >
                  {isListening ? 
                    <MicOff className="h-4 w-4 text-red-600" /> : 
                    <Mic className="h-4 w-4" />
                  }
                </Button>
                
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message... (AI considers your current context)"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                
                <Button onClick={handleSendMessage} className="flex items-center space-x-2">
                  <Send className="h-4 w-4" />
                  <span>Send</span>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContextualAIAssistant;