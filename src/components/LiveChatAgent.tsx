
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
  Bot,
  User
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface ChatMessage {
  id: string;
  type: 'user' | 'agent';
  message: string;
  timestamp: Date;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

const LiveChatAgent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial greeting
      const greeting: ChatMessage = {
        id: '1',
        type: 'agent',
        message: `Hi ${user?.user_metadata?.full_name || 'there'}! 👋 I'm your TherapySync AI Assistant. I can help you navigate the platform, show your recent sessions, or answer any questions about our features. How can I assist you today?`,
        timestamp: new Date(),
        actions: [
          { label: 'Show Recent Sessions', action: () => handleShowSessions() },
          { label: 'Platform Tour', action: () => handlePlatformTour() },
          { label: 'Crisis Support', action: () => handleCrisisSupport() }
        ]
      };
      setMessages([greeting]);
    }
  }, [isOpen, user]);

  const handleShowSessions = () => {
    const sessionMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'agent',
      message: 'Here are your recent therapy sessions:\n\n• Session with Dr. Sarah Chen - 2 days ago (Anxiety management)\n• Session with Dr. Marcus Williams - 5 days ago (Emotional regulation)\n• Session with Dr. Elena Rodriguez - 1 week ago (Mindfulness practice)\n\nWould you like to continue with any of these therapists or explore new approaches?',
      timestamp: new Date(),
      actions: [
        { label: 'Book New Session', action: () => handleBookSession() },
        { label: 'View Progress', action: () => handleViewProgress() }
      ]
    };
    setMessages(prev => [...prev, sessionMessage]);
  };

  const handlePlatformTour = () => {
    const tourMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'agent',
      message: 'I\'d be happy to give you a tour! Our platform has several key areas:\n\n🏠 Dashboard - Your therapy hub\n💬 Chat Interface - Where therapy happens\n📊 Progress Tracker - Monitor your journey\n📚 Resource Library - Educational content\n⚙️ Settings - Customize your experience\n🆘 Crisis Support - 24/7 emergency help\n\nWhich area would you like to explore first?',
      timestamp: new Date(),
      actions: [
        { label: 'Dashboard Overview', action: () => handleDashboardTour() },
        { label: 'Start Therapy Session', action: () => handleStartSession() }
      ]
    };
    setMessages(prev => [...prev, tourMessage]);
  };

  const handleCrisisSupport = () => {
    const crisisMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'agent',
      message: '🚨 Crisis Support is available 24/7. If you\'re experiencing a mental health emergency:\n\n• Call 988 (Suicide & Crisis Lifeline)\n• Text HOME to 741741 (Crisis Text Line)\n• Use our Crisis Chat feature for immediate support\n• Contact emergency services if in immediate danger\n\nOur AI monitors conversations for crisis indicators and can connect you with human counselors instantly. Your safety is our priority.',
      timestamp: new Date(),
      actions: [
        { label: 'Crisis Chat', action: () => handleCrisisChat() },
        { label: 'Emergency Contacts', action: () => handleEmergencyContacts() }
      ]
    };
    setMessages(prev => [...prev, crisisMessage]);
  };

  const handleBookSession = () => {
    const bookMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'agent',
      message: 'Great! I can help you book a new session. Based on your recent sessions, I recommend:\n\n1. Dr. Sarah Chen (CBT) - Available today at 3 PM\n2. Dr. Marcus Williams (DBT) - Available tomorrow at 10 AM\n3. Try a new therapist - Dr. James Park (Trauma-focused)\n\nWould you like to book with one of these or explore other options?',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, bookMessage]);
  };

  const handleViewProgress = () => {
    const progressMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'agent',
      message: 'Your progress looks great! 📈\n\n• 15 sessions completed this month\n• Mood improvement: +32%\n• Anxiety levels: Decreased by 28%\n• Goals achieved: 7 out of 10\n• Consistency streak: 12 days\n\nYou\'re making excellent progress! Keep up the great work with your mental health journey.',
      timestamp: new Date(),
      actions: [
        { label: 'Detailed Analytics', action: () => handleDetailedAnalytics() },
        { label: 'Set New Goals', action: () => handleSetGoals() }
      ]
    };
    setMessages(prev => [...prev, progressMessage]);
  };

  const handleDashboardTour = () => {
    const dashboardMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'agent',
      message: 'Let me show you around the Dashboard! 🏠\n\nYour dashboard is designed to be your mental health command center:\n\n• Quick session start buttons at the top\n• Recent activity feed shows your progress\n• Mood tracker for daily check-ins\n• Upcoming appointments and reminders\n• Progress stats and achievement badges\n• Recommended actions based on your patterns\n\nThe dashboard adapts to your usage patterns and provides personalized recommendations.',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, dashboardMessage]);
  };

  const handleStartSession = () => {
    const sessionMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'agent',
      message: 'Perfect! Let\'s start a therapy session. 🎯\n\nI can help you:\n• Choose the right AI therapist for your current mood\n• Set up voice or text-based conversation\n• Configure session duration (15-60 minutes)\n• Enable privacy settings and recording preferences\n\nWhat type of session would you like today?',
      timestamp: new Date(),
      actions: [
        { label: 'Quick Session (15 min)', action: () => handleQuickSession() },
        { label: 'Full Session (45 min)', action: () => handleFullSession() }
      ]
    };
    setMessages(prev => [...prev, sessionMessage]);
  };

  const handleCrisisChat = () => {
    console.log('Opening crisis chat...');
  };

  const handleEmergencyContacts = () => {
    console.log('Opening emergency contacts...');
  };

  const handleDetailedAnalytics = () => {
    console.log('Opening detailed analytics...');
  };

  const handleSetGoals = () => {
    console.log('Opening goal setting...');
  };

  const handleQuickSession = () => {
    console.log('Starting quick session...');
  };

  const handleFullSession = () => {
    console.log('Starting full session...');
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

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I understand you're looking for help with that. Let me provide you with some guidance...",
        "That's a great question! Based on your usage patterns, I recommend...",
        "I can definitely help you with that. Here are some options...",
        "Thanks for reaching out! Let me walk you through the process..."
      ];

      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-therapy-600 to-calm-600 hover:from-therapy-700 hover:to-calm-700 text-white rounded-full w-16 h-16 shadow-2xl hover:shadow-therapy-500/25 transition-all duration-300 hover:scale-110 border-0"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
        <div className="absolute -top-12 right-0 bg-black/80 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap">
          Need help? Chat with AI Assistant
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-96 bg-white/95 backdrop-blur-sm shadow-2xl border-0 transition-all duration-300 ${isMinimized ? 'h-16' : 'h-96'}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-therapy-600 to-calm-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold">AI Assistant</CardTitle>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs opacity-90">Online</span>
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
                      {message.type === 'agent' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                      <span className="text-xs opacity-75">
                        {message.type === 'agent' ? 'AI Assistant' : 'You'}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-line">{message.message}</p>
                    {message.actions && (
                      <div className="mt-2 space-y-1">
                        {message.actions.map((action, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={action.action}
                            className="text-xs h-6 px-2 bg-white/20 border-white/30 text-gray-700 hover:bg-white/30"
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 p-3 rounded-lg mr-4 max-w-xs">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4" />
                      <span className="text-xs opacity-75">AI Assistant</span>
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
                  placeholder="Type your message..."
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
