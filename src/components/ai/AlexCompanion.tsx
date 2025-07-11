import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  Sparkles, 
  HelpCircle, 
  BookOpen, 
  Settings, 
  Home,
  Zap,
  Heart,
  Brain,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import alexAvatar from '@/assets/alex-companion.png';

interface AlexCompanionProps {
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

const AlexCompanion: React.FC<AlexCompanionProps> = ({ 
  isMinimized = false, 
  onToggleMinimize 
}) => {
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([
    {
      type: 'alex',
      content: "Hi! I'm Alex, your TherapySync AI companion. I'm here to help you navigate the platform and answer any questions about our features. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const commonQuestions = [
    { text: "How do I start a therapy session?", category: "getting-started" },
    { text: "What AI features are available?", category: "ai-features" },
    { text: "How does mood tracking work?", category: "features" },
    { text: "How do I access crisis support?", category: "crisis-help" },
    { text: "Can I customize my therapy approach?", category: "personalization" }
  ];

  const getAlexResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('therapy session') || lowerMessage.includes('start session')) {
      return "To start a therapy session, head to your Dashboard and click 'Begin Session'. Our AI will adapt to your needs in real-time, using advanced OpenAI and Anthropic models for the most natural conversation experience.";
    }
    
    if (lowerMessage.includes('ai') || lowerMessage.includes('features')) {
      return "TherapySync offers cutting-edge AI features including: Voice therapy with emotion detection, Personalized therapy plans, Real-time crisis detection, Multi-language support (29 languages), and Cultural sensitivity awareness. Everything is powered by both OpenAI and Anthropic for the best possible experience!";
    }
    
    if (lowerMessage.includes('mood') || lowerMessage.includes('tracking')) {
      return "Our mood tracking uses AI analytics to identify patterns and provide insights. You can log moods daily, view trend analysis, get personalized recommendations, and receive alerts for concerning patterns. It all integrates with your therapy sessions for comprehensive care.";
    }
    
    if (lowerMessage.includes('crisis') || lowerMessage.includes('emergency')) {
      return "Crisis support is available 24/7. Our AI monitors conversations for crisis indicators and can instantly connect you with emergency resources, professional oversight, and your emergency contacts. Your safety is our top priority.";
    }
    
    if (lowerMessage.includes('customize') || lowerMessage.includes('personalize')) {
      return "Absolutely! You can customize your therapy approach (CBT, DBT, mindfulness, etc.), choose your AI therapist personality, set session preferences, configure voice settings, and adjust cultural considerations. Everything adapts to your unique needs.";
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('how to')) {
      return "I can help with any TherapySync questions! Try asking about therapy sessions, AI features, mood tracking, crisis support, community features, family accounts, or anything else. I'm here to make your mental wellness journey smoother.";
    }
    
    return "That's a great question! I can help you with therapy sessions, AI features, mood tracking, crisis support, settings, and navigating the platform. Feel free to ask me anything specific, or check out our comprehensive help section for detailed guides.";
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const userMessage = {
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setConversation(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    // Simulate Alex typing and responding
    setTimeout(() => {
      const alexResponse = {
        type: 'alex',
        content: getAlexResponse(message),
        timestamp: new Date()
      };
      
      setConversation(prev => [...prev, alexResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickQuestion = (question: string) => {
    setMessage(question);
    setTimeout(() => handleSendMessage(), 100);
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={onToggleMinimize}
          className="rounded-full w-16 h-16 bg-gradient-to-r from-therapy-500 to-harmony-500 hover:from-therapy-600 hover:to-harmony-600 shadow-lg"
        >
          <Avatar className="w-10 h-10">
            <AvatarImage src={alexAvatar} alt="Alex AI Companion" />
            <AvatarFallback className="bg-therapy-100">
              <Bot className="h-6 w-6 text-therapy-600" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-[600px]">
      <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-therapy-500 to-harmony-500 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10 border-2 border-white/30">
                <AvatarImage src={alexAvatar} alt="Alex AI Companion" />
                <AvatarFallback className="bg-therapy-100">
                  <Bot className="h-6 w-6 text-therapy-600" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">Alex</CardTitle>
                <CardDescription className="text-white/80 text-sm">
                  Your AI Therapy Companion
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                Online
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleMinimize}
                className="text-white hover:bg-white/10 p-1"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Quick Questions */}
          <div className="p-4 border-b bg-therapy-25">
            <p className="text-sm font-medium text-therapy-700 mb-3">Quick Questions:</p>
            <div className="flex flex-wrap gap-2">
              {commonQuestions.slice(0, 3).map((q, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickQuestion(q.text)}
                  className="text-xs hover:bg-therapy-50 border-therapy-200"
                >
                  {q.text}
                </Button>
              ))}
            </div>
          </div>

          {/* Conversation */}
          <div className="h-80 overflow-y-auto p-4 space-y-4">
            {conversation.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.type === 'user'
                      ? 'bg-therapy-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-therapy-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-therapy-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-therapy-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t bg-gray-50">
            <div className="flex space-x-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask Alex anything about TherapySync..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || isTyping}
                className="bg-therapy-500 hover:bg-therapy-600"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">
                Powered by TherapySync AI
              </p>
              <div className="flex space-x-1">
                <Button variant="ghost" size="sm" className="p-1">
                  <HelpCircle className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" className="p-1">
                  <BookOpen className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlexCompanion;