
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Send, Phone, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CrisisDetectionService } from '@/services/crisisDetectionService';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai' | 'agent';
  timestamp: Date;
  isTyping?: boolean;
  needsEscalation?: boolean;
  crisisLevel?: 'mild' | 'moderate' | 'severe';
}

const LiveChatWidget = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hi! I'm your AI support assistant. I'm here to help with any questions about TherapySync, technical issues, or connect you with human support if needed. How can I help you today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [escalationOffered, setEscalationOffered] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Crisis detection
    const crisisIndicator = CrisisDetectionService.analyzeCrisisLevel(userMessage);
    if (crisisIndicator && crisisIndicator.type === 'severe') {
      return CrisisDetectionService.generateCrisisResponse(crisisIndicator) + 
        "\n\nI'm connecting you with a crisis counselor immediately. Please hold on.";
    }

    // Smart routing based on message content
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('billing') || lowerMessage.includes('payment') || lowerMessage.includes('subscription')) {
      return "I can help you with billing questions! For account-specific billing issues, I'll need to connect you with our billing specialist. In the meantime, you can check your subscription status in Settings > Billing, or visit our Pricing page for plan details. Would you like me to connect you with a human agent?";
    }
    
    if (lowerMessage.includes('technical') || lowerMessage.includes('bug') || lowerMessage.includes('error')) {
      return "I understand you're experiencing a technical issue. Let me help troubleshoot this. Can you describe what happens when the error occurs? Also, which device and browser are you using? If this is a complex technical issue, I can escalate to our technical support team.";
    }
    
    if (lowerMessage.includes('therapy') || lowerMessage.includes('session') || lowerMessage.includes('ai therapist')) {
      return "I'd be happy to help with therapy-related questions! Our AI therapists are available 24/7 and support 29 languages. You can start a session anytime from your Dashboard. For questions about therapy approaches or if you need human therapist support, I can connect you with our clinical team. What specific aspect would you like help with?";
    }

    // General supportive response
    return "Thank you for reaching out! I'm here to help with any questions about TherapySync. Whether it's technical support, account issues, therapy features, or billing questions, I'll do my best to assist you. If needed, I can also connect you with our human support team. What would you like help with?";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Crisis detection
    const crisisIndicator = CrisisDetectionService.analyzeCrisisLevel(inputMessage);
    if (crisisIndicator) {
      if (crisisIndicator.type === 'severe') {
        toast({
          title: "Crisis Support Activated",
          description: "Connecting you with immediate crisis support resources.",
          variant: "destructive"
        });
      }
    }

    // Simulate AI response delay
    setTimeout(async () => {
      const aiResponse = await generateAIResponse(inputMessage);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        needsEscalation: crisisIndicator?.type === 'severe',
        crisisLevel: crisisIndicator?.type
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);

      // Offer escalation after a few messages
      if (messages.length > 4 && !escalationOffered) {
        setTimeout(() => {
          const escalationMessage: ChatMessage = {
            id: (Date.now() + 2).toString(),
            content: "I notice we've been chatting for a bit. Would you like me to connect you with a human support agent who might be able to provide more personalized assistance?",
            sender: 'ai',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, escalationMessage]);
          setEscalationOffered(true);
        }, 2000);
      }
    }, 1500);
  };

  const handleEscalateToHuman = () => {
    const escalationMessage: ChatMessage = {
      id: Date.now().toString(),
      content: "I'm connecting you with a human support agent. They'll be with you shortly. Your conversation history will be shared to provide seamless support.",
      sender: 'ai',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, escalationMessage]);
    
    toast({
      title: "Connecting to Human Agent",
      description: "A support specialist will join the chat shortly.",
    });

    // Simulate human agent joining
    setTimeout(() => {
      const agentMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "Hi! I'm Sarah from the TherapySync support team. I can see your previous conversation with our AI assistant. How can I help you today?",
        sender: 'agent',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, agentMessage]);
    }, 3000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-slate-600">
            {isConnected ? 'Connected to AI Support' : 'Reconnecting...'}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleEscalateToHuman}
          className="text-therapy-600 border-therapy-200 hover:bg-therapy-50"
        >
          <Phone className="h-4 w-4 mr-2" />
          Talk to Human
        </Button>
      </div>

      {/* Chat Messages */}
      <Card className="h-96">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-therapy-600 text-white'
                      : message.sender === 'agent'
                      ? 'bg-blue-100 text-blue-900 border border-blue-200'
                      : 'bg-slate-100 text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    {message.sender === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : message.sender === 'agent' ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                    <span className="text-xs font-medium">
                      {message.sender === 'user' ? 'You' : message.sender === 'agent' ? 'Support Agent' : 'AI Assistant'}
                    </span>
                    {message.crisisLevel && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {message.crisisLevel}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm">{message.content}</p>
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-100 text-slate-900 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4" />
                    <span className="text-sm">AI Assistant is typing...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>
      </Card>

      {/* Message Input */}
      <div className="flex space-x-2">
        <Input
          placeholder="Type your message here..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button 
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || isTyping}
          className="therapy-gradient-bg text-white border-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default LiveChatWidget;
