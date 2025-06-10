
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bot, 
  Send, 
  Minimize2, 
  Maximize2, 
  X, 
  Lightbulb, 
  MessageCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface ContextualTip {
  route: string;
  tips: string[];
  quickActions: Array<{
    label: string;
    action: string;
  }>;
}

const IntelligentAssistant = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const contextualTips: ContextualTip[] = [
    {
      route: '/',
      tips: [
        'Welcome! Start by exploring your dashboard or beginning a therapy session.',
        'Check your mood tracking to see patterns in your mental health.',
        'Set goals to track your progress over time.'
      ],
      quickActions: [
        { label: 'Start Session', action: 'start-session' },
        { label: 'Track Mood', action: 'track-mood' }
      ]
    },
    {
      route: '/chat',
      tips: [
        'Be open and honest in your responses for the best therapeutic experience.',
        'Use the voice feature if you prefer speaking over typing.',
        'Take your time - there\'s no rush in therapy sessions.'
      ],
      quickActions: [
        { label: 'Voice Mode', action: 'voice-mode' },
        { label: 'Session History', action: 'session-history' }
      ]
    },
    {
      route: '/mood',
      tips: [
        'Track your mood daily for better insights into your mental health patterns.',
        'Include notes about what influenced your mood.',
        'Review your mood trends in the analytics section.'
      ],
      quickActions: [
        { label: 'Log Mood', action: 'log-mood' },
        { label: 'View Patterns', action: 'view-patterns' }
      ]
    }
  ];

  useEffect(() => {
    if (messages.length === 0 && user) {
      // Welcome message
      const welcomeMessage: Message = {
        id: '1',
        type: 'assistant',
        content: `Hello ${user.user_metadata?.name || 'there'}! I'm your AI therapy assistant. I'm here to help guide you through your mental health journey. How can I assist you today?`,
        timestamp: new Date(),
        suggestions: ['Tell me about therapy sessions', 'How do I track my mood?', 'Help me set goals']
      };
      setMessages([welcomeMessage]);
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getCurrentContextualTip = () => {
    return contextualTips.find(tip => tip.route === location.pathname) || contextualTips[0];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = generateAIResponse(inputValue);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (input: string): { content: string; suggestions?: string[] } => {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('mood') || lowerInput.includes('feeling')) {
      return {
        content: 'Tracking your mood is a great way to understand your mental health patterns. You can log your current mood, add notes about what\'s influencing it, and view trends over time. Would you like me to guide you to the mood tracking section?',
        suggestions: ['Take me to mood tracking', 'How often should I track mood?', 'What affects mood?']
      };
    }

    if (lowerInput.includes('session') || lowerInput.includes('therapy')) {
      return {
        content: 'Therapy sessions are personalized conversations with our AI therapist. You can discuss your feelings, work through challenges, and learn coping strategies. Each session is private and designed to help you grow. Ready to start a session?',
        suggestions: ['Start a session now', 'What happens in a session?', 'How long are sessions?']
      };
    }

    if (lowerInput.includes('goal') || lowerInput.includes('progress')) {
      return {
        content: 'Setting goals helps you track your mental health journey. You can create specific, measurable goals and monitor your progress over time. Goals can be about mood, habits, relationships, or personal growth. Would you like help setting up goals?',
        suggestions: ['Help me set goals', 'View my progress', 'Goal examples']
      };
    }

    if (lowerInput.includes('help') || lowerInput.includes('how')) {
      const currentTip = getCurrentContextualTip();
      return {
        content: `Based on where you are in the app, here are some helpful tips: ${currentTip.tips[0]} You can also explore other features like notifications, analytics, and techniques.`,
        suggestions: currentTip.quickActions.map(action => action.label)
      };
    }

    return {
      content: 'I\'m here to help you navigate your mental health journey. You can ask me about therapy sessions, mood tracking, goal setting, or any other feature. What would you like to know more about?',
      suggestions: ['Start a therapy session', 'Track my mood', 'Set up goals', 'View my progress']
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-14 w-14 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg"
        >
          <Bot className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
      isMinimized ? 'w-80' : 'w-96'
    }`}>
      <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-sm">AI Assistant</CardTitle>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-muted-foreground">Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0">
            <ScrollArea className="h-96 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      {message.suggestions && (
                        <div className="mt-2 space-y-1">
                          {message.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="text-xs h-7 mr-1 mb-1"
                              onClick={() => handleSuggestionClick(suggestion)}
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
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-900 p-3 rounded-lg">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            <div className="p-4 border-t">
              <div className="flex items-center space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything about your therapy journey..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {/* Contextual tips */}
              <div className="mt-3">
                <div className="flex items-center space-x-1 mb-2">
                  <Lightbulb className="h-3 w-3 text-yellow-500" />
                  <span className="text-xs font-medium text-muted-foreground">Quick tip</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {getCurrentContextualTip().tips[0]}
                </p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default IntelligentAssistant;
