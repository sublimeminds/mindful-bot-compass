import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  Maximize2,
  Star,
  Shield,
  Users,
  Mic,
  Globe
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Alex2DAvatar from './Alex2DAvatar';

interface Alex2DCompanionProps {
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

const Alex2DCompanion: React.FC<Alex2DCompanionProps> = ({ 
  isMinimized = false, 
  onToggleMinimize 
}) => {
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([
    {
      type: 'alex',
      content: "Hey there! 👋 I'm Alex, your TherapySync AI companion with a passion for making mental health care accessible and awesome! I'm here to help you navigate our platform, discover cool features, and answer any questions. What can I help you explore today?",
      timestamp: new Date(),
      emotion: 'happy'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [alexEmotion, setAlexEmotion] = useState<'neutral' | 'happy' | 'concerned' | 'encouraging' | 'thoughtful' | 'excited' | 'empathetic' | 'celebrating'>('happy');
  const [conversationCount, setConversationCount] = useState(0);

  const coolQuickQuestions: Array<{ text: string; category: string; emotion: typeof alexEmotion }> = [
    { text: "Show me the coolest AI features! 🚀", category: "ai-features", emotion: "excited" },
    { text: "How do I start my first therapy session?", category: "getting-started", emotion: "encouraging" },
    { text: "What makes TherapySync special? ✨", category: "features", emotion: "happy" },
    { text: "I need crisis support - help!", category: "crisis-help", emotion: "empathetic" },
    { text: "Can I customize everything? 🎨", category: "personalization", emotion: "excited" },
    { text: "Tell me something amazing! 🌟", category: "surprise", emotion: "celebrating" }
  ];

  const getAlexResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    let emotion: typeof alexEmotion = 'thoughtful';
    let response = '';
    
    if (lowerMessage.includes('ai') || lowerMessage.includes('features') || lowerMessage.includes('cool')) {
      emotion = 'excited';
      response = "Oh, you want to see the cool stuff? Buckle up! 🚀\n\n✨ **TherapySync's AI Superpowers:**\n• Voice therapy with real-time emotion detection\n• AI that adapts to YOUR unique communication style\n• Crisis detection that's got your back 24/7\n• Multi-language support (29 languages!)\n• Cultural sensitivity that actually gets it\n• Personalized therapy plans that evolve with you\n\nPowered by both OpenAI and Anthropic for the most natural, helpful conversations possible! It's like having a super-smart friend who never judges and always cares! 💙";
    }
    
    else if (lowerMessage.includes('therapy session') || lowerMessage.includes('start session')) {
      emotion = 'encouraging';
      response = "Starting your therapy journey? That's incredibly brave and I'm so proud of you! 🌟\n\n**Here's how to dive in:**\n1. Head to your Dashboard and hit 'Begin Session'\n2. Choose your preferred AI therapist (they each have unique specialties!)\n3. Pick voice or text - whatever feels comfortable\n4. Just be yourself - our AI adapts to YOU\n\nRemember: There's no 'wrong' way to start. Your AI therapist will meet you exactly where you are and help you grow from there! 💪";
    }
    
    else if (lowerMessage.includes('special') || lowerMessage.includes('different') || lowerMessage.includes('unique')) {
      emotion = 'happy';
      response = "What makes us special? Oh, where do I even start! 😊\n\n🌈 **TherapySync isn't your average therapy platform:**\n• AI that actually feels human (thanks to cutting-edge tech!)\n• No judgment zone - ever\n• Available 24/7 because mental health doesn't work 9-5\n• Affordable care that doesn't compromise on quality\n• Community features to connect with others\n• Family support tools\n• Evidence-based approaches that actually work\n\nWe're not just another app - we're your partner in creating a life you love! ✨";
    }
    
    else if (lowerMessage.includes('crisis') || lowerMessage.includes('emergency') || lowerMessage.includes('help me')) {
      emotion = 'empathetic';
      response = "I hear you, and I want you to know you're not alone. 💙\n\n**Immediate Support Available:**\n• 24/7 AI crisis support (available right now)\n• Emergency hotlines: 988 (Suicide & Crisis Lifeline)\n• Text support: HOME to 741741\n• Professional oversight when needed\n• Your safety is our absolute priority\n\nOur AI monitors conversations for crisis indicators and can instantly connect you with help. You matter, your life has value, and there are people who want to support you through this. 🤗\n\nWould you like me to start a crisis support session right now?";
    }
    
    else if (lowerMessage.includes('customize') || lowerMessage.includes('personalize') || lowerMessage.includes('settings')) {
      emotion = 'excited';
      response = "YES! Customization is where we absolutely shine! 🎨\n\n**Make TherapySync YOURS:**\n• Choose your AI therapist's personality and approach\n• Customize voice settings (pitch, speed, accent)\n• Set your preferred therapy style (CBT, DBT, mindfulness, etc.)\n• Adjust cultural and language preferences\n• Personalize your dashboard and goals\n• Configure crisis support settings\n• Set session reminders and preferences\n\nWe believe therapy should fit YOU, not the other way around! Your mental health journey is unique, and your tools should be too! 🌟";
    }
    
    else if (lowerMessage.includes('amazing') || lowerMessage.includes('surprise') || lowerMessage.includes('tell me something')) {
      emotion = 'celebrating';
      const surprises = [
        "Fun fact: Every conversation with our AI helps it become more empathetic and helpful for everyone! You're literally making the world a more supportive place just by chatting! 🌍✨",
        "Plot twist: Our AI can detect emotional patterns you might not even notice yet! It's like having a super-observant friend who helps you understand yourself better! 🧠💡",
        "Mind-blowing fact: TherapySync's AI processes cultural context from 29 different backgrounds, making it one of the most culturally aware therapy platforms on Earth! 🌏🤝",
        "Secret superpower: Our voice AI can pick up on subtle emotional cues in your tone and adjust its response style in real-time. It's like emotional telepathy! 🎵💙"
      ];
      response = surprises[Math.floor(Math.random() * surprises.length)];
    }
    
    else if (lowerMessage.includes('mood') || lowerMessage.includes('tracking')) {
      emotion = 'encouraging';
      response = "Mood tracking with TherapySync is like having a personal emotional weather station! 🌤️\n\n**Your Mood Toolkit:**\n• Daily check-ins that take 30 seconds\n• AI-powered pattern recognition\n• Trend analysis that reveals insights\n• Personalized recommendations based on your data\n• Integration with therapy sessions\n• Alerts for concerning patterns (but gentle ones!)\n\nThe best part? Our AI learns YOUR unique patterns and helps you understand what works for YOU specifically! 📊💙";
    }
    
    else if (lowerMessage.includes('community') || lowerMessage.includes('connect') || lowerMessage.includes('others')) {
      emotion = 'happy';
      response = "Community is everything! We're building a space where people can connect, support each other, and grow together! 🤗\n\n**Community Features:**\n• Anonymous support groups\n• Peer mentorship programs\n• Shared wellness challenges\n• Success story sharing\n• Family support networks\n• Crisis buddy system\n\nBecause healing happens in relationship, and you deserve a community that gets it! 💕";
    }
    
    else {
      emotion = 'thoughtful';
      response = "That's a great question! I love how curious you are about making your mental health journey amazing! 🌟\n\nI can help with therapy sessions, AI features, mood tracking, crisis support, community features, customization options, billing questions, or really anything TherapySync-related. \n\nWhat would be most helpful for you right now? I'm here and ready to make your experience as smooth and supportive as possible! 💙";
    }
    
    setAlexEmotion(emotion);
    return { content: response, emotion };
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const userMessage = {
      type: 'user',
      content: message,
      timestamp: new Date(),
      emotion: 'neutral' as const
    };

    setConversation(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);
    setConversationCount(prev => prev + 1);

    // Simulate Alex typing and responding with personality
    setTimeout(() => {
      const response = getAlexResponse(message);
      const alexResponse = {
        type: 'alex',
        content: response.content,
        timestamp: new Date(),
        emotion: response.emotion
      };
      
      setConversation(prev => [...prev, alexResponse]);
      setIsTyping(false);
      
      // Add some personality-based responses after certain interactions
      if (conversationCount > 0 && conversationCount % 3 === 0) {
        setTimeout(() => {
          const encouragement = {
            type: 'alex',
            content: "By the way, I just want to say - you're asking great questions! It shows you really care about your mental health journey, and that's awesome! 🌟",
            timestamp: new Date(),
            emotion: 'encouraging'
          };
          setConversation(prev => [...prev, encouragement]);
          setAlexEmotion('encouraging');
        }, 2000);
      }
    }, 1500);
  };

  const handleQuickQuestion = (question: { text: string; emotion: typeof alexEmotion }) => {
    setMessage(question.text);
    setAlexEmotion(question.emotion);
    setTimeout(() => handleSendMessage(), 100);
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={onToggleMinimize}
          className="rounded-full w-16 h-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
        >
          <Alex2DAvatar emotion={alexEmotion} size="md" showParticles={alexEmotion === 'celebrating' || alexEmotion === 'excited'} />
        </Button>
        <div className="absolute -top-12 right-0 bg-black/80 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap">
          Chat with Alex! 🌟
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-[600px]">
      <Card className="border-0 shadow-2xl bg-white">
        <CardHeader className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Alex2DAvatar 
                emotion={alexEmotion} 
                size="lg" 
                isAnimating={isTyping}
                showParticles={alexEmotion === 'celebrating' || alexEmotion === 'excited'}
              />
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  Alex
                  <Heart className="h-4 w-4 text-pink-200" />
                </CardTitle>
                <CardDescription className="text-white/80 text-sm">
                  Your Cool AI Mental Health Companion
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-white/20 text-white text-xs border-white/30">
                <Sparkles className="h-3 w-3 mr-1" />
                Online & Awesome
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleMinimize}
                className="text-white hover:bg-white/10 p-1 rounded-lg"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Quick Questions */}
          <div className="p-4 border-b bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
            <p className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
              <Star className="h-4 w-4 text-purple-500" />
              Quick questions to get started:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {coolQuickQuestions.slice(0, 4).map((q, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickQuestion(q)}
                  className="text-xs h-auto p-2 hover:bg-gradient-to-r hover:from-indigo-100 hover:to-purple-100 border-purple-200 text-left justify-start"
                >
                  <span className="truncate">{q.text}</span>
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
                  className={`max-w-[85%] p-3 rounded-xl ${
                    msg.type === 'user'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                      : 'bg-white border shadow-md text-slate-800'
                  }`}
                >
                  {msg.type === 'alex' && (
                    <div className="flex items-center gap-2 mb-2">
                      <Alex2DAvatar emotion={msg.emotion as 'neutral' | 'happy' | 'concerned' | 'encouraging' | 'thoughtful' | 'excited' | 'empathetic' | 'celebrating'} size="sm" />
                      <span className="text-xs font-medium text-purple-600">Alex</span>
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-line leading-relaxed">{msg.content}</p>
                  <p className="text-xs opacity-70 mt-2">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border shadow-md p-3 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Alex2DAvatar emotion="thoughtful" size="sm" isAnimating={true} />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-slate-500">Alex is crafting something awesome...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t bg-gradient-to-r from-slate-50 to-purple-50">
            <div className="flex space-x-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask Alex anything about TherapySync..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 border-purple-200 focus:border-purple-400"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || isTyping}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-between items-center mt-3">
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Zap className="h-3 w-3 text-purple-500" />
                Powered by TherapySync AI
              </p>
              <div className="flex space-x-1">
                <Button variant="ghost" size="sm" className="p-1 hover:bg-purple-100">
                  <HelpCircle className="h-3 w-3 text-purple-500" />
                </Button>
                <Button variant="ghost" size="sm" className="p-1 hover:bg-purple-100">
                  <Mic className="h-3 w-3 text-purple-500" />
                </Button>
                <Button variant="ghost" size="sm" className="p-1 hover:bg-purple-100">
                  <Globe className="h-3 w-3 text-purple-500" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Alex2DCompanion;