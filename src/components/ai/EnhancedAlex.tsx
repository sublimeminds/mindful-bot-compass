import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Bot, 
  MessageCircle, 
  Lightbulb, 
  Heart, 
  Zap, 
  Star, 
  Mic, 
  MicOff,
  Send,
  Sparkles,
  Brain,
  Calendar,
  Map,
  Settings,
  HelpCircle
} from 'lucide-react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'react-router-dom';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'alex';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'action';
}

const EnhancedAlex = () => {
  const { user } = useSimpleApp();
  const { toast } = useToast();
  const location = useLocation();
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [alexMood, setAlexMood] = useState<'friendly' | 'helpful' | 'encouraging' | 'thoughtful'>('friendly');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Contextual responses based on current page
  const getContextualGreeting = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return "Hey there! I see you're exploring your dashboard. How can I help you navigate your wellness journey today?";
    if (path.includes('billing')) return "I'm here to help with any billing questions you might have. Is everything looking good with your subscription?";
    if (path.includes('sessions')) return "Looking at your therapy sessions? I'd love to help you prepare for your next session or reflect on recent ones.";
    if (path.includes('notifications')) return "Staying on top of your notifications? That's great! Let me know if you need help prioritizing anything.";
    return "Hello! I'm Alex, your AI wellness companion. I'm here to support you on your mental health journey. How are you feeling today?";
  };

  // Enhanced suggestions based on context and user state
  const getContextualSuggestions = () => {
    const path = location.pathname;
    const baseTime = new Date().getHours();
    
    let suggestions = [];
    
    // Time-based suggestions
    if (baseTime < 12) {
      suggestions.push("Help me start my day with intention");
      suggestions.push("What's a good morning mindfulness practice?");
    } else if (baseTime < 17) {
      suggestions.push("I'm feeling stressed at work");
      suggestions.push("Quick relaxation technique for busy days");
    } else {
      suggestions.push("Help me wind down for the evening");
      suggestions.push("Reflection questions for today");
    }
    
    // Context-based suggestions
    if (path.includes('dashboard')) {
      suggestions.push("Explain my wellness metrics");
      suggestions.push("Set a new goal for this week");
    } else if (path.includes('sessions')) {
      suggestions.push("Prepare me for my next session");
      suggestions.push("What should I discuss with my therapist?");
    } else if (path.includes('billing')) {
      suggestions.push("What features do I get with my plan?");
      suggestions.push("How can I make the most of my subscription?");
    }
    
    // Always include these
    suggestions.push("How can I practice self-care today?");
    suggestions.push("I need encouragement");
    
    return suggestions.slice(0, 4);
  };

  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (conversation.length === 0) {
      // Initial greeting
      const greeting: Message = {
        id: Date.now().toString(),
        text: getContextualGreeting(),
        sender: 'alex',
        timestamp: new Date(),
        type: 'text'
      };
      setConversation([greeting]);
    }
    setSuggestions(getContextualSuggestions());
  }, [location.pathname]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const generateAlexResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Contextual responses based on current page
    const path = location.pathname;
    
    // Emotional support responses
    if (lowerMessage.includes('stress') || lowerMessage.includes('anxious')) {
      setAlexMood('encouraging');
      return "I understand you're feeling stressed. Take a deep breath with me. Remember, you've overcome challenges before, and you have the strength to handle this too. Would you like to try a quick grounding exercise?";
    }
    
    if (lowerMessage.includes('sad') || lowerMessage.includes('down')) {
      setAlexMood('thoughtful');
      return "I hear that you're going through a difficult time. Your feelings are valid, and it's okay to sit with them. Sometimes healing starts with simply acknowledging where we are. What would feel most supportive right now?";
    }
    
    if (lowerMessage.includes('goal') || lowerMessage.includes('motivation')) {
      setAlexMood('encouraging');
      return "Setting goals is such a powerful step! I believe in your ability to achieve what you set your mind to. What's one small step you could take today toward your bigger vision?";
    }
    
    // Page-specific responses
    if (path.includes('dashboard') && (lowerMessage.includes('metrics') || lowerMessage.includes('progress'))) {
      return "Your dashboard shows your wellness journey beautifully! I can see you've been consistent with mood tracking, which is fantastic. The patterns here can help us understand what works best for you. What stands out to you?";
    }
    
    if (path.includes('sessions') && lowerMessage.includes('prepare')) {
      return "Great question! Before your session, consider: What's been on your mind lately? Any patterns in your mood or thoughts? What would you like to explore or work on? Remember, there's no 'right' thing to discuss - your therapist is there to support whatever feels important to you.";
    }
    
    if (path.includes('billing') && lowerMessage.includes('features')) {
      return "Your Pro plan gives you access to all our AI therapists, unlimited sessions, crisis support, family features, and premium wellness tools. You're getting amazing value! Is there a particular feature you'd like to explore more?";
    }
    
    // Encouragement and motivation
    if (lowerMessage.includes('encouragement') || lowerMessage.includes('motivation')) {
      setAlexMood('encouraging');
      return "You are braver than you believe, stronger than you seem, and more loved than you know. Every step you're taking toward better mental health - even the small ones - matters so much. I'm proud of you for being here and doing this work. 🌟";
    }
    
    // Self-care suggestions
    if (lowerMessage.includes('self-care') || lowerMessage.includes('take care')) {
      return "Self-care isn't selfish - it's essential! Here are some ideas: Take 5 deep breaths, drink some water, step outside for fresh air, write down 3 things you're grateful for, or simply rest. What sounds most appealing to you right now?";
    }
    
    // Default thoughtful responses
    const defaultResponses = [
      "That's really insightful. Tell me more about what you're experiencing.",
      "I appreciate you sharing that with me. How does that make you feel?",
      "It sounds like you're really reflecting deeply. What would be most helpful for you right now?",
      "Thank you for trusting me with your thoughts. What support do you need?",
      "I'm here to listen and support you. What would you like to explore together?"
    ];
    
    setAlexMood('thoughtful');
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || message;
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setConversation(prev => [...prev, userMessage]);
    setMessage('');
    setIsProcessing(true);

    try {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const alexResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAlexResponse(textToSend),
        sender: 'alex',
        timestamp: new Date(),
        type: 'text'
      };
      
      setConversation(prev => [...prev, alexResponse]);
      
      // Update suggestions based on conversation
      setSuggestions(getContextualSuggestions());
      
    } catch (error) {
      console.error('Error processing message:', error);
      toast({
        title: 'Connection Issue',
        description: 'I had trouble processing that. Could you try again?',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      toast({
        title: 'Voice Feature',
        description: 'Voice input is coming soon! For now, I can chat through text.',
      });
    }
  };

  const getMoodColor = () => {
    switch (alexMood) {
      case 'encouraging': return 'from-green-500 to-emerald-500';
      case 'thoughtful': return 'from-purple-500 to-indigo-500';
      case 'helpful': return 'from-blue-500 to-cyan-500';
      default: return 'from-therapy-500 to-calm-500';
    }
  };

  const getMoodEmoji = () => {
    switch (alexMood) {
      case 'encouraging': return '🌟';
      case 'thoughtful': return '💭';
      case 'helpful': return '🤝';
      default: return '😊';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className={`h-10 w-10 bg-gradient-to-r ${getMoodColor()}`}>
              <AvatarFallback className="text-white font-bold">
                {getMoodEmoji()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span>Alex</span>
                <Badge variant="outline" className="text-xs">
                  AI Companion
                </Badge>
              </div>
              <div className="text-sm text-slate-500 capitalize">{alexMood} mode</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-slate-500">Online</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Conversation */}
        <div className="h-80 overflow-y-auto space-y-4 p-4 bg-slate-50 rounded-lg">
          {conversation.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.sender === 'user'
                    ? 'bg-therapy-600 text-white'
                    : 'bg-white text-slate-800 shadow-sm border'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <div className="text-xs opacity-70 mt-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-white text-slate-800 shadow-sm border p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-therapy-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-therapy-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-therapy-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-xs text-slate-500">Alex is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        <div className="space-y-2">
          <div className="text-sm text-slate-600 font-medium">Suggested topics:</div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSendMessage(suggestion)}
                className="text-xs h-8 hover:bg-therapy-50"
                disabled={isProcessing}
              >
                <Lightbulb className="h-3 w-3 mr-1" />
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Input */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share what's on your mind..."
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              disabled={isProcessing}
              className="pr-12"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleListening}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
              disabled={isProcessing}
            >
              {isListening ? (
                <MicOff className="h-4 w-4 text-red-500" />
              ) : (
                <Mic className="h-4 w-4 text-slate-500" />
              )}
            </Button>
          </div>
          <Button 
            onClick={() => handleSendMessage()} 
            disabled={isProcessing || !message.trim()}
            className="bg-gradient-to-r from-therapy-600 to-calm-600 hover:from-therapy-700 hover:to-calm-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-2 pt-2 border-t">
          <Button variant="ghost" size="sm" className="text-xs">
            <Calendar className="h-3 w-3 mr-1" />
            Schedule
          </Button>
          <Button variant="ghost" size="sm" className="text-xs">
            <Heart className="h-3 w-3 mr-1" />
            Mood Check
          </Button>
          <Button variant="ghost" size="sm" className="text-xs">
            <Brain className="h-3 w-3 mr-1" />
            Exercises
          </Button>
          <Button variant="ghost" size="sm" className="text-xs">
            <HelpCircle className="h-3 w-3 mr-1" />
            Help
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedAlex;