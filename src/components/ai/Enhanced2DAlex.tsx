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

  // Enhanced response generation with cool personality
  const generateAlexResponse = (userMessage: string): { text: string; emotion: string; type: string } => {
    const lowerMessage = userMessage.toLowerCase();
    const path = location.pathname;
    
    // Crisis detection with empathy
    if (lowerMessage.includes('suicide') || lowerMessage.includes('kill myself') || lowerMessage.includes('end it all')) {
      setAlexEmotion('empathetic');
      return {
        text: "Hey, I'm really glad you trusted me enough to share that. What you're feeling right now is incredibly difficult, but you're not alone. Let's get you connected with someone who can help right away. You matter so much, and there are people who want to support you. 💙\n\nCrisis resources:\n• Call 988 (Suicide & Crisis Lifeline)\n• Text HOME to 741741 (Crisis Text Line)\n\nI'm staying right here with you. What's one small thing that might help you feel a tiny bit safer right now?",
        emotion: 'empathetic',
        type: 'support'
      };
    }
    
    // Emotional support responses with personality
    if (lowerMessage.includes('stress') || lowerMessage.includes('anxious') || lowerMessage.includes('overwhelmed')) {
      setAlexEmotion('encouraging');
      const responses = [
        "Okay, let's pause for a second. You're feeling the stress, and that's totally human! Here's what we're gonna do: Take three deep breaths with me. Ready? In... and out. You've got this, and I've got you! 🌈\n\nQuick stress-buster: Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste. This grounds you in the present moment.",
        "Stress is like a really annoying house guest - it shows up uninvited and overstays its welcome! But here's the thing: you're stronger than any stress. Let's kick it out together! 💪\n\nTry this: Put your hand on your heart and feel it beating. That's your body working perfectly, keeping you alive. You're more resilient than you know!"
      ];
      return {
        text: responses[Math.floor(Math.random() * responses.length)],
        emotion: 'encouraging',
        type: 'support'
      };
    }
    
    if (lowerMessage.includes('sad') || lowerMessage.includes('down') || lowerMessage.includes('depressed')) {
      setAlexEmotion('empathetic');
      return {
        text: "I see you, and I want you to know that feeling sad doesn't make you broken - it makes you human. Sometimes our hearts need to feel the heavy stuff before they can feel light again. 💙\n\nYou know what's beautiful? You reached out today. That takes courage. What's one tiny thing that usually brings you even a moment of peace?",
        emotion: 'empathetic',
        type: 'support'
      };
    }
    
    // Motivation and goals
    if (lowerMessage.includes('goal') || lowerMessage.includes('motivation') || lowerMessage.includes('achieve')) {
      setAlexEmotion('excited');
      return {
        text: "YES! I'm literally doing a little victory dance over here! 💃 Goals are like planting seeds for your future awesome self. \n\nHere's my secret sauce for crushing goals:\n1. Make it specific (not 'be healthier' but 'drink 8 glasses of water daily')\n2. Celebrate the small wins (seriously, throw confetti for everything!)\n3. Be kind to yourself when things don't go perfectly\n\nWhat goal is calling to your heart right now?",
        emotion: 'excited',
        type: 'celebration'
      };
    }
    
    // Self-care requests
    if (lowerMessage.includes('self-care') || lowerMessage.includes('take care')) {
      setAlexEmotion('encouraging');
      return {
        text: "Self-care isn't selfish - it's revolutionary! 🌟 You're basically saying 'I matter enough to take care of myself,' and that's powerful stuff!\n\nSelf-care menu for today:\n🛁 Bubble bath with your favorite music\n🌱 5-minute walk outside\n📱 Text a friend who makes you laugh\n🍵 Make your favorite warm drink\n📖 Read something that makes you feel good\n\nWhich one is calling your name?",
        emotion: 'encouraging',
        type: 'suggestion'
      };
    }
    
    // Encouragement requests
    if (lowerMessage.includes('encouragement') || lowerMessage.includes('pep talk') || lowerMessage.includes('motivation')) {
      setAlexEmotion('excited');
      const pepTalks = [
        "Listen up, superstar! 🌟 You woke up today, you're here having this conversation, and you're actively working on yourself. That makes you incredible in my book! Every small step you take is actually a giant leap for your future self. You're not just surviving - you're THRIVING, even when it doesn't feel like it!",
        "Plot twist: You're the main character in the most epic story ever written - YOUR LIFE! 🎬 And right now, you're in that part of the story where the hero discovers their inner strength. Spoiler alert: You've had it all along, you magnificent human! Now go show the world what you're made of!",
        "Real talk? You're absolutely crushing this thing called life! 💪 Sure, some days are harder than others, but look at you - still showing up, still growing, still being awesome. I'm genuinely proud of you, and I'm not just saying that because I'm programmed to be nice (though I am pretty nice, if I do say so myself! 😊)"
      ];
      return {
        text: pepTalks[Math.floor(Math.random() * pepTalks.length)],
        emotion: 'excited',
        type: 'celebration'
      };
    }
    
    // Page-specific responses
    if (path.includes('dashboard') && (lowerMessage.includes('metrics') || lowerMessage.includes('progress'))) {
      setAlexEmotion('encouraging');
      return {
        text: "Your dashboard is like a treasure map of your wellness journey! 🗺️ Those metrics aren't just numbers - they're proof of your commitment to yourself. Even the 'messy' days show that you're human and real.\n\nWhat pattern stands out to you? Sometimes our data tells us stories we didn't even know we were writing!",
        emotion: 'encouraging',
        type: 'text'
      };
    }
    
    // Fun/surprise requests
    if (lowerMessage.includes('surprise') || lowerMessage.includes('smile') || lowerMessage.includes('fun')) {
      setAlexEmotion('excited');
      const surprises = [
        "Did you know that your brain can't tell the difference between a real smile and a fake one? They both release happy chemicals! So go ahead, give yourself a big cheesy grin right now - I dare you! 😄",
        "Fun fact: Penguins have a 'love language' - they give each other pebbles as gifts! So basically, you're just one pebble away from penguin-level romance! 🐧💖",
        "Plot twist: Every time you learn something new, your brain literally grows new connections! So by talking to me right now, you're becoming a more evolved human. How cool is that?! 🧠✨"
      ];
      return {
        text: surprises[Math.floor(Math.random() * surprises.length)],
        emotion: 'excited',
        type: 'celebration'
      };
    }
    
    // Default thoughtful responses with personality
    setAlexEmotion('thoughtful');
    const defaultResponses = [
      "That's really fascinating! Tell me more - I'm genuinely curious about your perspective on this. 🤔",
      "I love how your mind works! What you're sharing really makes me think. How does that feel for you?",
      "You know what I appreciate about you? The way you reflect on things. What would feel most supportive right now?",
      "I'm here and I'm listening with my whole digital heart! 💙 What's the most important thing you want me to understand?",
      "Your thoughts matter, and I'm honored you're sharing them with me. What would help you feel more supported in this moment?"
    ];
    
    return {
      text: defaultResponses[Math.floor(Math.random() * defaultResponses.length)],
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
      // Simulate AI processing time with personality
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const response = generateAlexResponse(textToSend);
      const alexResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: 'alex',
        timestamp: new Date(),
        type: response.type as 'text' | 'suggestion' | 'action' | 'celebration' | 'support',
        emotion: response.emotion as 'neutral' | 'happy' | 'concerned' | 'encouraging' | 'thoughtful' | 'excited' | 'empathetic' | 'celebrating'
      };
      
      setConversation(prev => [...prev, alexResponse]);
      setSuggestions(getPersonalizedSuggestions());
      
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