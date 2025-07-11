import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  X, 
  Send, 
  Minimize2, 
  Maximize2, 
  HelpCircle,
  Calendar,
  BarChart3,
  Settings,
  Shield,
  HeadphonesIcon,
  User,
  ArrowRight,
  Play,
  TrendingUp,
  CreditCard,
  Users,
  Bot,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Alex2DAvatar from '@/components/ai/Alex2DAvatar';

interface ChatMessage {
  id: string;
  type: 'user' | 'agent';
  message: string;
  timestamp: Date;
  actions?: Array<{
    label: string;
    action: () => void;
    icon?: React.ElementType;
  }>;
}

const LiveChatAgent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [avatarEmotion, setAvatarEmotion] = useState<'neutral' | 'happy' | 'concerned' | 'encouraging' | 'thoughtful' | 'excited' | 'empathetic' | 'celebrating'>('happy');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial greeting from Alex - Platform Support
      const greeting: ChatMessage = {
        id: '1',
        type: 'agent',
        message: `Hi ${user?.user_metadata?.full_name || 'there'}! 👋 I'm Alex, your TherapySync platform guide. I'm here to help you navigate the platform, find features, and get technical support.\n\nFor personal support and therapy sessions, I'll direct you to our AI therapists. How can I help you with the platform today?`,
        timestamp: new Date(),
        actions: [
          { label: 'Start Therapy Session', action: () => handleStartTherapy(), icon: Play },
          { label: 'Platform Tour', action: () => handlePlatformTour(), icon: HelpCircle },
          { label: 'Need Help?', action: () => handleGetHelp(), icon: HeadphonesIcon }
        ]
      };
      setMessages([greeting]);
      setAvatarEmotion('happy');
    }
  }, [isOpen, user]);

  const handleStartTherapy = () => {
    const therapyMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'agent',
      message: 'Perfect! Let me get you to your therapy session. 🎯\n\nI\'ll take you to our therapy chat where you can:\n• Choose your AI therapist\n• Start voice or text sessions\n• Access crisis support if needed\n• Continue previous conversations\n\nReady to begin your session?',
      timestamp: new Date(),
      actions: [
        { label: 'Go to Therapy Chat', action: () => navigate('/therapy-chat'), icon: ArrowRight },
        { label: 'Learn About Therapists', action: () => handleTherapistInfo(), icon: Users }
      ]
    };
    setMessages(prev => [...prev, therapyMessage]);
  };

  const handlePlatformTour = () => {
    const tourMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'agent',
      message: 'Great! Let me show you around TherapySync! 🏠\n\n**Key Platform Areas:**\n• **Dashboard** - Your mental health hub with progress tracking\n• **Therapy Chat** - Where you connect with AI therapists\n• **Analytics** - Track your mood and progress over time\n• **Settings** - Customize your experience\n• **Profile** - Manage your account and preferences\n\nWhich area would you like to explore first?',
      timestamp: new Date(),
      actions: [
        { label: 'Visit Dashboard', action: () => navigate('/dashboard'), icon: BarChart3 },
        { label: 'Go to Settings', action: () => navigate('/settings'), icon: Settings },
        { label: 'View Profile', action: () => navigate('/profile'), icon: User }
      ]
    };
    setMessages(prev => [...prev, tourMessage]);
  };

  const handleGetHelp = () => {
    const helpMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'agent',
      message: 'I\'m here to help with platform questions! 🤝\n\n**Common Support Topics:**\n• Account and billing questions\n• Technical issues or bugs\n• Feature explanations\n• Navigation help\n• Privacy and security\n\n**For Personal Support:** Please use our therapy chat for emotional support, mental health conversations, or crisis situations.\n\nWhat can I help you with?',
      timestamp: new Date(),
      actions: [
        { label: 'Account & Billing', action: () => handleBillingHelp(), icon: CreditCard },
        { label: 'Technical Issues', action: () => handleTechnicalHelp(), icon: Settings },
        { label: 'Crisis Support', action: () => handleCrisisRedirect(), icon: Shield }
      ]
    };
    setMessages(prev => [...prev, helpMessage]);
  };

  const handleTherapistInfo = () => {
    const therapistMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'agent',
      message: 'Our AI therapists are specially trained for different approaches! 🧠\n\n**Available Therapists:**\n• Dr. Sarah Chen - Cognitive Behavioral Therapy (CBT)\n• Dr. Marcus Williams - Dialectical Behavior Therapy (DBT)\n• Dr. Elena Rodriguez - Mindfulness-Based Therapy\n• Dr. James Park - Trauma-Focused Therapy\n\nEach therapist adapts to your needs and provides personalized support. Ready to meet them?',
      timestamp: new Date(),
      actions: [
        { label: 'Start Therapy Session', action: () => navigate('/therapy-chat'), icon: Play }
      ]
    };
    setMessages(prev => [...prev, therapistMessage]);
  };

  const handleBillingHelp = () => {
    const billingMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'agent',
      message: 'I can help with account and billing questions! 💳\n\n**Common Solutions:**\n• Check your subscription status in Settings\n• Update payment methods in your profile\n• View billing history and invoices\n• Cancel or upgrade your plan\n\nFor complex billing issues, I can connect you with our support team.',
      timestamp: new Date(),
      actions: [
        { label: 'Go to Settings', action: () => navigate('/settings'), icon: Settings },
        { label: 'View Pricing', action: () => navigate('/pricing'), icon: CreditCard }
      ]
    };
    setMessages(prev => [...prev, billingMessage]);
  };

  const handleTechnicalHelp = () => {
    const techMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'agent',
      message: 'Let me help troubleshoot technical issues! 🔧\n\n**Quick Fixes:**\n• Refresh the page for loading issues\n• Check your internet connection\n• Clear browser cache if needed\n• Try using a different browser\n\n**Still having problems?** I can help you contact our technical support team.',
      timestamp: new Date(),
      actions: [
        { label: 'Test Therapy Chat', action: () => navigate('/therapy-chat'), icon: Play },
        { label: 'Check Dashboard', action: () => navigate('/dashboard'), icon: BarChart3 }
      ]
    };
    setMessages(prev => [...prev, techMessage]);
  };

  const handleCrisisRedirect = () => {
    const crisisMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'agent',
      message: '🚨 **Crisis Support Available**\n\nI\'m redirecting you to immediate help:\n\n**Emergency Resources:**\n• Call 988 (Suicide & Crisis Lifeline)\n• Text HOME to 741741 (Crisis Text Line)\n• Contact emergency services if in immediate danger\n\n**Platform Support:**\nOur AI therapists provide 24/7 crisis support and can escalate to human counselors when needed.',
      timestamp: new Date(),
      actions: [
        { label: 'Start Crisis Session', action: () => navigate('/therapy-chat'), icon: Shield },
        { label: 'Emergency Contacts', action: () => handleEmergencyContacts(), icon: HeadphonesIcon }
      ]
    };
    setMessages(prev => [...prev, crisisMessage]);
  };

  const handleEmergencyContacts = () => {
    const emergencyMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'agent',
      message: '📞 **Emergency Contacts:**\n\n**US Crisis Lines:**\n• 988 - Suicide & Crisis Lifeline\n• 1-800-366-8288 - Self-Injury Outreach\n• 1-866-488-7386 - Trevor Project (LGBTQ+)\n\n**Text Support:**\n• Text HOME to 741741 - Crisis Text Line\n\n**Remember:** Our AI therapists are also available 24/7 for immediate support.',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, emergencyMessage]);
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);
    setIsSpeaking(true);
    setAvatarEmotion('thoughtful');

    // Simulate platform support responses
    setTimeout(() => {
      let response = '';
      const lowerMessage = currentMessage.toLowerCase();

      if (lowerMessage.includes('therapy') || lowerMessage.includes('talk') || lowerMessage.includes('help me') || lowerMessage.includes('depressed') || lowerMessage.includes('anxious')) {
        response = "I can see you're looking for personal support. Let me connect you with our AI therapists who are specially trained to help with emotional and mental health concerns. I'll guide you there! 🤗";
      } else if (lowerMessage.includes('dashboard') || lowerMessage.includes('progress')) {
        response = "I can help you navigate to your dashboard where you'll find your progress tracking, mood analytics, and session history. Would you like me to take you there?";
      } else if (lowerMessage.includes('billing') || lowerMessage.includes('payment') || lowerMessage.includes('subscription')) {
        response = "I can help with billing questions! You can manage your subscription, payment methods, and view billing history in your account settings. Let me guide you there.";
      } else if (lowerMessage.includes('settings') || lowerMessage.includes('account')) {
        response = "I can help you navigate to your settings where you can customize your experience, manage notifications, and update your account preferences.";
      } else {
        response = "I'm here to help you navigate the TherapySync platform! I can assist with account questions, feature explanations, or guide you to the right area. For personal support, our AI therapists are available 24/7 in the therapy chat.";
      }

      const supportActions = [
        { label: 'Start Therapy Session', action: () => navigate('/therapy-chat'), icon: Play },
        { label: 'Visit Dashboard', action: () => navigate('/dashboard'), icon: BarChart3 },
        { label: 'Go to Settings', action: () => navigate('/settings'), icon: Settings }
      ];

      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        message: response,
        timestamp: new Date(),
        actions: supportActions
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
      setIsSpeaking(false);
      setAvatarEmotion('encouraging');
    }, 2000);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="relative bg-gradient-to-r from-therapy-600 to-calm-600 hover:from-therapy-700 hover:to-calm-700 text-white rounded-full w-16 h-16 shadow-2xl hover:shadow-therapy-500/25 transition-all duration-300 hover:scale-110 border-0 overflow-hidden"
        >
          <Alex2DAvatar
            emotion={avatarEmotion}
            size="lg"
            showParticles={avatarEmotion === 'celebrating' || avatarEmotion === 'excited'}
            className="w-full h-full"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
            <Sparkles className="h-2.5 w-2.5 text-white" />
          </div>
        </Button>
        <div className="absolute -top-12 right-0 bg-black/80 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap">
          Need help? Chat with Alex
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-96 bg-white/95 backdrop-blur-sm shadow-2xl border-0 transition-all duration-300 ${isMinimized ? 'h-16' : 'h-96'}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-therapy-600 to-calm-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-3">
            <Alex2DAvatar
              emotion={avatarEmotion}
              size="md"
              isSpeaking={isSpeaking}
              isListening={isTyping}
              showParticles={avatarEmotion === 'celebrating' || avatarEmotion === 'excited'}
            />
            <div>
              <CardTitle className="text-sm font-semibold flex items-center space-x-2">
                <span>Alex - Platform Support</span>
                <Bot className="h-4 w-4" />
              </CardTitle>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs opacity-90">AI Assistant Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white hover:bg-white/20 p-1 h-8 w-8"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-1 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            <CardContent className="p-4 h-64 overflow-y-auto space-y-3">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs p-3 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-r from-therapy-500 to-calm-500 text-white ml-4' 
                      : 'bg-gray-100 text-gray-800 mr-4'
                  }`}>
                    <div className="flex items-center space-x-2 mb-1">
                      {message.type === 'agent' ? (
                        <Alex2DAvatar
                          emotion={avatarEmotion}
                          size="sm"
                        />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                      <span className="text-xs opacity-75">
                        {message.type === 'agent' ? 'Alex (AI Support)' : 'You'}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-line">{message.message}</p>
                    {message.actions && (
                      <div className="mt-2 space-y-1">
                        {message.actions.map((action, index) => {
                          const IconComponent = action.icon;
                          return (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={action.action}
                              className="text-xs h-6 px-2 bg-white/20 border-white/30 text-gray-700 hover:bg-white/30 flex items-center space-x-1"
                            >
                              {IconComponent && <IconComponent className="h-3 w-3" />}
                              <span>{action.label}</span>
                            </Button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 p-3 rounded-lg mr-4 max-w-xs">
                    <div className="flex items-center space-x-2">
                      <Alex2DAvatar
                        emotion="thoughtful"
                        size="sm"
                        isAnimating={true}
                      />
                      <span className="text-xs opacity-75">Alex (AI Support)</span>
                    </div>
                    <div className="flex space-x-1 mt-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>

            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about platform features..."
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-therapy-500 text-sm"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim()}
                  className="bg-gradient-to-r from-therapy-600 to-calm-600 hover:from-therapy-700 hover:to-calm-700 text-white p-2 h-10 w-10 border-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default LiveChatAgent;
