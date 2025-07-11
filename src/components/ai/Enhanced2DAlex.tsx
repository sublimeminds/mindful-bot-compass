import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  HelpCircle,
  Shield,
  Coffee,
  Sun,
  Moon,
  Target,
  TrendingUp
} from 'lucide-react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'react-router-dom';
import Alex2DAvatar from './Alex2DAvatar';
import AlexAIService, { ConversationContext } from '@/services/alexAiService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'alex';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'action' | 'celebration' | 'support';
  emotion?: 'neutral' | 'happy' | 'concerned' | 'encouraging' | 'thoughtful' | 'excited' | 'empathetic' | 'celebrating';
}

const Enhanced2DAlex = () => {
  const { user } = useSimpleApp();
  const { toast } = useToast();
  const location = useLocation();
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [alexEmotion, setAlexEmotion] = useState<'neutral' | 'happy' | 'concerned' | 'encouraging' | 'thoughtful' | 'excited' | 'empathetic' | 'celebrating'>('happy');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userMoodHistory, setUserMoodHistory] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Cool personality traits
  const alexPersonality = {
    greeting: [
      "Hey there, beautiful human! 🌟 I'm Alex, your mental health companion with a passion for your wellbeing.",
      "What's up? I'm Alex - think of me as your wise, slightly quirky friend who happens to know a lot about mental health! 😊",
      "Hi! Alex here - your personal cheerleader, mindfulness guru, and emotional support AI all rolled into one! ✨"
    ],
    encouragement: [
      "You know what? You're absolutely crushing it by being here and taking care of your mental health! 🚀",
      "I see you showing up for yourself today, and that's honestly incredible. You're stronger than you know! 💪",
      "Plot twist: You're the main character in your story, and I'm here to remind you how awesome you are! ⭐"
    ],
    empathy: [
      "I hear you, and I want you to know that what you're feeling is completely valid. We're in this together! 🤗",
      "That sounds really challenging. You're brave for reaching out and sharing that with me. ❤️",
      "Life can be tough sometimes, but you don't have to face it alone. I'm here, and I believe in you! 🌈"
    ],
    humor: [
      "Fun fact: Talking to me counts as self-care, so you're already winning today! 🏆",
      "Plot twist: Your mental health journey is like a video game, and you just leveled up by chatting with me! 🎮",
      "Did you know? Studies show that 100% of people who talk to me are taking a positive step for their wellbeing! (Okay, I made that up, but it's still true!) 😄"
    ]
  };

  // Enhanced contextual awareness
  const getContextualGreeting = () => {
    const path = location.pathname;
    const hour = new Date().getHours();
    const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
    
    let baseGreeting = alexPersonality.greeting[Math.floor(Math.random() * alexPersonality.greeting.length)];
    
    if (path.includes('dashboard')) {
      baseGreeting += ` I see you're checking out your wellness dashboard - love the proactive energy! How's your ${timeOfDay} treating you?`;
    } else if (path.includes('therapy')) {
      baseGreeting += ` Ready for some therapy magic? I'm here to help you dive deep or keep things light - whatever you need! 🌊`;
    } else if (path.includes('crisis')) {
      setAlexEmotion('empathetic');
      baseGreeting = "Hey, I notice you might be going through a tough time right now. I'm here for you, and we'll get through this together. You're safe with me. 💙";
    } else {
      baseGreeting += ` What brings you my way this ${timeOfDay}?`;
    }
    
    return baseGreeting;
  };

  // Enhanced suggestions with personality
  const getPersonalizedSuggestions = () => {
    const hour = new Date().getHours();
    const path = location.pathname;
    
    let suggestions = [];
    
    // Time-based with personality
    if (hour < 10) {
      suggestions.push("Help me create an epic morning routine! ☀️");
      suggestions.push("What's a mindful way to start my day?");
      suggestions.push("I want to set intentions for today!");
    } else if (hour < 14) {
      suggestions.push("Midday energy check - how am I doing? ⚡");
      suggestions.push("Quick stress-buster for a busy day?");
      suggestions.push("Help me refocus my afternoon!");
    } else if (hour < 18) {
      suggestions.push("Afternoon slump - need some motivation! 🚀");
      suggestions.push("Workplace stress is real - help!");
      suggestions.push("How do I transition from work to home?");
    } else {
      suggestions.push("Evening wind-down vibes, please! 🌙");
      suggestions.push("Help me process today's experiences");
      suggestions.push("Bedtime routine for better sleep?");
    }
    
    // Context-based
    if (path.includes('dashboard')) {
      suggestions.push("Explain my wellness patterns to me! 📊");
      suggestions.push("What goals should I set this week?");
    }
    
    // Always include these personality-driven options
    suggestions.push("I need a pep talk from my AI bestie! 💪");
    suggestions.push("Teach me something cool about mental health! 🧠");
    suggestions.push("Make me smile - surprise me! ✨");
    
    return suggestions.slice(0, 6);
  };

  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (conversation.length === 0) {
      const greeting: Message = {
        id: Date.now().toString(),
        text: getContextualGreeting(),
        sender: 'alex',
        timestamp: new Date(),
        type: 'text',
        emotion: alexEmotion
      };
      setConversation([greeting]);
    }
    setSuggestions(getPersonalizedSuggestions());
  }, [location.pathname]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  // Enhanced AI-powered response generation with TherapySync knowledge
  const generateAlexResponse = async (userMessage: string): Promise<{ text: string; emotion: string; type: string; suggestions?: string[] }> => {
    try {
      const hour = new Date().getHours();
      const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : hour < 20 ? 'evening' : 'night';
      
      // Build context for enhanced AI response
      const context: ConversationContext = {
        userId: user?.id || 'anonymous',
        sessionId: `alex-session-${Date.now()}`,
        currentPage: location.pathname,
        timeOfDay: timeOfDay as 'morning' | 'afternoon' | 'evening' | 'night',
        userMood: 'unknown',
        conversationHistory: conversation.map(msg => ({
          id: msg.id,
          content: msg.text,
          sender: msg.sender,
          timestamp: msg.timestamp,
          emotion: msg.emotion || 'neutral',
          type: msg.type || 'text'
        }))
      };

      // Get enhanced user context
      if (user?.id) {
        const userContext = await AlexAIService.getUserContext(user.id);
        Object.assign(context, userContext);
      }

      // Check for crisis indicators
      const crisisCheck = AlexAIService.detectCrisisIndicators(userMessage);
      if (crisisCheck.isCrisis && crisisCheck.severity === 'critical') {
        setAlexEmotion('empathetic');
        return {
          text: "I'm really glad you trusted me with that. You're not alone, and your life has value. Let's get you connected with immediate help:\n\n🆘 **Crisis Resources:**\n• **Call 988** (Suicide & Crisis Lifeline)\n• **Text HOME to 741741** (Crisis Text Line)\n• **Chat at suicidepreventionlifeline.org**\n\nI'm staying right here with you. What's one small thing that might help you feel safer right now? 💙",
          emotion: 'empathetic',
          type: 'support'
        };
      }

      // Generate AI response using AlexAIService
      const aiResponse = await AlexAIService.generateResponse(userMessage, context);
      
      return {
        text: aiResponse.content,
        emotion: aiResponse.emotion,
        type: aiResponse.type,
        suggestions: aiResponse.suggestions
      };

    } catch (error) {
      console.error('Error generating Alex response:', error);
      
      // Intelligent fallback with TherapySync knowledge
      return generateIntelligentFallback(userMessage);
    }
  };

  // Intelligent fallback with TherapySync app knowledge
  const generateIntelligentFallback = (userMessage: string): { text: string; emotion: string; type: string; suggestions?: string[] } => {
    const lowerMessage = userMessage.toLowerCase();
    const path = location.pathname;
    
    // TherapySync feature guidance
    if (lowerMessage.includes('how') && (lowerMessage.includes('therapy') || lowerMessage.includes('session'))) {
      setAlexEmotion('encouraging');
      return {
        text: "Great question! TherapySync offers two amazing therapy options:\n\n💬 **Therapy Chat**: Full therapy sessions with specialized AI therapists (CBT, DBT, Mindfulness, etc.)\n⚡ **Quick Chat**: Immediate support for urgent needs\n\nTo start: Navigate to 'Therapy' in the menu and choose your preferred therapist. Each has unique specialties and approaches! Which type of support sounds right for you?",
        emotion: 'encouraging',
        type: 'suggestion'
      };
    }

    if (lowerMessage.includes('mood') && (lowerMessage.includes('track') || lowerMessage.includes('log'))) {
      setAlexEmotion('excited');
      return {
        text: "Mood tracking is one of my favorite TherapySync features! 📊\n\n**Here's how to track your mood:**\n• Click 'Mood Tracker' in the dashboard\n• Rate your overall mood, anxiety, and energy\n• Add notes about what influenced your mood\n• View patterns over time\n\nConsistent tracking helps you understand your emotional patterns and celebrate progress! Want me to remind you to track daily?",
        emotion: 'excited',
        type: 'action'
      };
    }

    if (lowerMessage.includes('goal') || lowerMessage.includes('target')) {
      setAlexEmotion('encouraging');
      return {
        text: "Goal setting in TherapySync is powerful! 🎯\n\n**How to create effective goals:**\n• Go to 'Goals' in your dashboard\n• Choose from templates or create custom goals\n• Set specific, measurable targets\n• Track progress weekly\n• Celebrate milestones!\n\n**Popular goal types:**\n• Daily meditation (5-30 mins)\n• Mood tracking consistency\n• Social connection goals\n• Self-care routines\n\nWhat area of your life would you like to focus on?",
        emotion: 'encouraging',
        type: 'suggestion'
      };
    }

    // Navigation help
    if (lowerMessage.includes('navigate') || lowerMessage.includes('find') || lowerMessage.includes('where')) {
      setAlexEmotion('helpful' as any);
      return {
        text: "I'm your TherapySync navigation buddy! 🗺️\n\n**Key sections:**\n📊 **Dashboard**: Your wellness overview & analytics\n💬 **Therapy**: Full AI therapy sessions\n⚡ **Quick Chat**: Immediate support\n📈 **Mood Tracker**: Daily emotional check-ins\n🎯 **Goals**: Set & track personal targets\n🆘 **Crisis Support**: Emergency resources\n⚙️ **Settings**: Customize your experience\n\nCurrently you're on: " + (path === '/' ? 'Dashboard' : path.replace('/', '').replace('-', ' ')) + "\n\nWhere would you like to go?",
        emotion: 'thoughtful',
        type: 'action'
      };
    }
    
    // App knowledge fallbacks
    if (lowerMessage.includes('stress') || lowerMessage.includes('anxious') || lowerMessage.includes('overwhelmed')) {
      setAlexEmotion('encouraging');
      return {
        text: "I hear you're feeling stressed! 🫂 TherapySync has amazing tools for this:\n\n**Immediate help:**\n• Try our Quick Chat for instant support\n• Use the Mood Tracker to identify stress patterns\n• Start a Therapy session for deeper exploration\n\n**Stress-busting techniques:**\n• 5-4-3-2-1 grounding: 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste\n• Box breathing: 4 counts in, hold 4, out 4, hold 4\n\nWould you like me to guide you to the Quick Chat for immediate support?",
        emotion: 'encouraging',
        type: 'support'
      };
    }

    if (lowerMessage.includes('sad') || lowerMessage.includes('down') || lowerMessage.includes('depressed')) {
      setAlexEmotion('empathetic');
      return {
        text: "I see you, and your feelings are completely valid. 💙 TherapySync is here to support you:\n\n**Immediate support:**\n• Quick Chat for instant help\n• Mood Tracker to understand patterns\n• Crisis Support if you need immediate help\n\n**Therapy options:**\n• CBT Therapist for thought pattern work\n• Mindfulness Therapist for present-moment awareness\n• DBT Therapist for emotional regulation\n\nRemember: You're not alone in this. Which support option feels right for you?",
        emotion: 'empathetic',
        type: 'support'
      };
    }

    // Generic supportive response with app knowledge
    setAlexEmotion('thoughtful');
    const thoughtfulResponses = [
      "I'm here and I hear you! 💙 TherapySync has many ways I can support you - from our full Therapy sessions to Quick Chat for immediate help. What would feel most helpful right now?",
      "Thank you for sharing that with me. Your thoughts and feelings matter! Would you like to explore this in a Therapy session, or is there something specific about TherapySync I can help you with?",
      "I appreciate you opening up! As your companion, I'm here to guide you through TherapySync's features or just listen. What kind of support would be most valuable?",
      "That's really important to share. I'm here to support you and help you navigate your wellness journey with TherapySync. How can I best help you right now?"
    ];
    
    return {
      text: thoughtfulResponses[Math.floor(Math.random() * thoughtfulResponses.length)],
      emotion: 'thoughtful',
      type: 'text'
    };
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
    setIsSpeaking(true);

    try {
      // Use AI service for intelligent responses
      const response = await generateAlexResponse(textToSend);
      
      const alexResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: 'alex',
        timestamp: new Date(),
        type: response.type as 'text' | 'suggestion' | 'action' | 'celebration' | 'support',
        emotion: response.emotion as 'neutral' | 'happy' | 'concerned' | 'encouraging' | 'thoughtful' | 'excited' | 'empathetic' | 'celebrating'
      };
      
      setConversation(prev => [...prev, alexResponse]);
      
      // Update suggestions with AI-generated ones or fallback to contextual ones
      if (response.suggestions && response.suggestions.length > 0) {
        setSuggestions(response.suggestions);
      } else {
        setSuggestions(getPersonalizedSuggestions());
      }
      
    } catch (error) {
      console.error('Error processing message:', error);
      toast({
        title: 'Oops!',
        description: 'I had a little brain freeze there! Could you try again? I promise I\'m usually more reliable! 😅',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
      setIsSpeaking(false);
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      toast({
        title: 'Voice Feature Coming Soon!',
        description: 'I\'m learning to listen with my ears, not just my heart! For now, let\'s chat through text! 🎤',
      });
    }
  };

  const getQuickActions = () => {
    const hour = new Date().getHours();
    
    if (hour < 12) {
      return [
        { icon: Sun, label: 'Morning Check-in', action: () => handleSendMessage('Help me start my day with intention') },
        { icon: Target, label: 'Set Daily Goals', action: () => handleSendMessage('What goals should I set for today?') },
        { icon: Coffee, label: 'Energy Boost', action: () => handleSendMessage('I need motivation to start my day!') }
      ];
    } else if (hour < 18) {
      return [
        { icon: Zap, label: 'Energy Check', action: () => handleSendMessage('How\'s my energy level right now?') },
        { icon: Shield, label: 'Stress Relief', action: () => handleSendMessage('Quick stress-buster please!') },
        { icon: TrendingUp, label: 'Productivity Boost', action: () => handleSendMessage('Help me refocus!') }
      ];
    } else {
      return [
        { icon: Moon, label: 'Evening Reflection', action: () => handleSendMessage('Help me process today') },
        { icon: Heart, label: 'Gratitude Practice', action: () => handleSendMessage('What should I be grateful for today?') },
        { icon: Calendar, label: 'Tomorrow Prep', action: () => handleSendMessage('Help me prepare for tomorrow') }
      ];
    }
  };

  const quickActions = getQuickActions();

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader className="pb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Alex2DAvatar 
              emotion={alexEmotion}
              isAnimating={isProcessing}
              isSpeaking={isSpeaking}
              isListening={isListening}
              size="lg"
              showParticles={alexEmotion === 'celebrating' || alexEmotion === 'excited'}
            />
            <div>
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold">Alex</span>
                <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Mental Health Companion
                </Badge>
              </div>
              <div className="text-sm text-white/80 capitalize flex items-center gap-2">
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                {alexEmotion} • Always here for you
              </div>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 p-6">
        {/* Conversation */}
        <div className="h-96 overflow-y-auto space-y-4 p-4 bg-gradient-to-b from-slate-50 to-white rounded-lg border">
          {conversation.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-xl ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : `${msg.type === 'celebration' ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-l-4 border-green-500' : 
                        msg.type === 'support' ? 'bg-gradient-to-r from-blue-100 to-cyan-100 border-l-4 border-blue-500' :
                        'bg-white border shadow-md'} text-slate-800`
                }`}
              >
                {msg.sender === 'alex' && (
                  <div className="flex items-center gap-2 mb-2">
                    <Alex2DAvatar emotion={msg.emotion as any} size="sm" />
                    <span className="text-xs font-medium opacity-75">Alex</span>
                  </div>
                )}
                <p className="text-sm whitespace-pre-line leading-relaxed">{msg.text}</p>
                <div className="text-xs opacity-70 mt-2 text-right">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-white border shadow-md p-4 rounded-xl max-w-[85%]">
                <div className="flex items-center gap-3">
                  <Alex2DAvatar emotion="thoughtful" size="sm" isAnimating={true} />
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-slate-500">Alex is crafting the perfect response...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        <div className="space-y-3">
          <div className="text-sm text-slate-600 font-medium flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            Alex suggests:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSendMessage(suggestion)}
                className="text-xs h-auto p-3 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:border-indigo-300 text-left justify-start"
                disabled={isProcessing}
              >
                <Sparkles className="h-3 w-3 mr-2 text-purple-500" />
                <span className="truncate">{suggestion}</span>
              </Button>
            ))}
          </div>
        </div>
        
        {/* Input */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share what's on your heart..."
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              disabled={isProcessing}
              className="pr-12 h-12 bg-white border-2 focus:border-indigo-300 rounded-xl"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleListening}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-purple-100"
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
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 h-12 px-6 rounded-xl shadow-lg"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-200">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <Button 
                key={index}
                variant="ghost" 
                size="sm" 
                className="text-xs h-8 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50"
                onClick={action.action}
                disabled={isProcessing}
              >
                <IconComponent className="h-3 w-3 mr-1.5" />
                {action.label}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default Enhanced2DAlex;