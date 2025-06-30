
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, MessageCircle, X, Minimize2, Maximize2, HelpCircle, Lightbulb, Heart, Users, Brain, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  context?: string;
}

interface PageContext {
  route: string;
  title: string;
  features: string[];
  quickActions: string[];
  helpTopics: string[];
}

const ContextualAISupport = () => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pageContext, setPageContext] = useState<PageContext | null>(null);

  // Page context mapping
  const getPageContext = (pathname: string): PageContext => {
    const contexts: Record<string, PageContext> = {
      '/': {
        route: '/',
        title: t('support.contexts.home.title', 'Welcome to TherapySync'),
        features: [t('support.contexts.home.features.therapy', 'AI Therapy Sessions'), t('support.contexts.home.features.progress', 'Progress Tracking'), t('support.contexts.home.features.community', 'Community Support')],
        quickActions: [t('support.contexts.home.actions.start', 'Start First Session'), t('support.contexts.home.actions.explore', 'Explore Features'), t('support.contexts.home.actions.pricing', 'View Pricing')],
        helpTopics: [t('support.contexts.home.help.getting_started', 'Getting Started'), t('support.contexts.home.help.account', 'Account Setup'), t('support.contexts.home.help.features', 'Feature Overview')]
      },
      '/dashboard': {
        route: '/dashboard',
        title: t('support.contexts.dashboard.title', 'Your Dashboard'),
        features: [t('support.contexts.dashboard.features.overview', 'Progress Overview'), t('support.contexts.dashboard.features.sessions', 'Recent Sessions'), t('support.contexts.dashboard.features.goals', 'Goals Tracking')],
        quickActions: [t('support.contexts.dashboard.actions.session', 'Start New Session'), t('support.contexts.dashboard.actions.goals', 'Set New Goal'), t('support.contexts.dashboard.actions.progress', 'View Progress')],
        helpTopics: [t('support.contexts.dashboard.help.navigation', 'Dashboard Navigation'), t('support.contexts.dashboard.help.widgets', 'Understanding Widgets'), t('support.contexts.dashboard.help.customization', 'Customization Options')]
      },
      '/therapy-chat': {
        route: '/therapy-chat',
        title: t('support.contexts.therapy.title', 'AI Therapy Session'),
        features: [t('support.contexts.therapy.features.ai', 'AI Therapist'), t('support.contexts.therapy.features.techniques', 'Therapeutic Techniques'), t('support.contexts.therapy.features.progress', 'Session Progress')],
        quickActions: [t('support.contexts.therapy.actions.techniques', 'Learn Techniques'), t('support.contexts.therapy.actions.crisis', 'Crisis Support'), t('support.contexts.therapy.actions.specialist', 'Find Specialist')],
        helpTopics: [t('support.contexts.therapy.help.communication', 'How to Communicate'), t('support.contexts.therapy.help.techniques', 'Available Techniques'), t('support.contexts.therapy.help.privacy', 'Privacy & Safety')]
      },
      '/profile': {
        route: '/profile',
        title: t('support.contexts.profile.title', 'Profile Settings'),
        features: [t('support.contexts.profile.features.personal', 'Personal Info'), t('support.contexts.profile.features.preferences', 'Therapy Preferences'), t('support.contexts.profile.features.privacy', 'Privacy Settings')],
        quickActions: [t('support.contexts.profile.actions.update', 'Update Profile'), t('support.contexts.profile.actions.security', 'Security Settings'), t('support.contexts.profile.actions.preferences', 'Set Preferences')],
        helpTopics: [t('support.contexts.profile.help.setup', 'Profile Setup'), t('support.contexts.profile.help.privacy', 'Privacy Controls'), t('support.contexts.profile.help.data', 'Data Management')]
      }
    };

    return contexts[pathname] || {
      route: pathname,
      title: t('support.contexts.default.title', 'TherapySync Help'),
      features: [t('support.contexts.default.features.general', 'General Support')],
      quickActions: [t('support.contexts.default.actions.help', 'Get Help'), t('support.contexts.default.actions.contact', 'Contact Support')],
      helpTopics: [t('support.contexts.default.help.general', 'General Help'), t('support.contexts.default.help.contact', 'Contact Support')]
    };
  };

  useEffect(() => {
    setPageContext(getPageContext(location.pathname));
  }, [location.pathname, i18n.language]);

  useEffect(() => {
    if (isOpen && pageContext && messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content: t('support.welcome', `Hello! I'm your AI assistant for ${pageContext.title}. I can help you with: ${pageContext.features.join(', ')}. What would you like to know?`, {
          pageTitle: pageContext.title,
          features: pageContext.features.join(', ')
        }),
        sender: 'ai',
        timestamp: new Date(),
        context: pageContext.route
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, pageContext, t]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('contextual-ai-support', {
        body: {
          message: input,
          pageContext: pageContext,
          language: i18n.language,
          conversationHistory: messages.slice(-5) // Last 5 messages for context
        }
      });

      if (error) throw error;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: 'ai',
        timestamp: new Date(),
        context: pageContext?.route
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Support Error:', error);
      toast({
        title: t('support.error.title', 'Support Error'),
        description: t('support.error.description', 'Unable to get AI response. Please try again.'),
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    setInput(action);
    sendMessage();
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700 border-0"
        >
          <Bot className="h-6 w-6 text-white" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-96 ${isMinimized ? 'h-16' : 'h-[600px]'} shadow-2xl border-therapy-200`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-lg">
              <Bot className="h-5 w-5 mr-2 text-therapy-600" />
              {t('support.title', 'AI Support')}
            </CardTitle>
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
          {!isMinimized && pageContext && (
            <div className="flex flex-wrap gap-1 mt-2">
              <Badge variant="outline" className="text-xs">
                {pageContext.title}
              </Badge>
            </div>
          )}
        </CardHeader>

        {!isMinimized && (
          <CardContent className="flex flex-col h-[500px]">
            {/* Quick Actions */}
            {pageContext && (
              <div className="mb-4 space-y-2">
                <div className="text-sm font-medium text-slate-600">
                  {t('support.quickActions', 'Quick Actions')}:
                </div>
                <div className="flex flex-wrap gap-1">
                  {pageContext.quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction(action)}
                      className="text-xs"
                    >
                      {action}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <ScrollArea className="flex-1 mb-4">
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
                          : 'bg-slate-100 text-slate-900'
                      }`}
                    >
                      <div className="text-sm">{message.content}</div>
                      <div className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 text-slate-900 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-4 w-4 animate-spin" />
                        <span className="text-sm">{t('support.thinking', 'Thinking...')}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="flex space-x-2">
              <Input
                placeholder={t('support.placeholder', 'Ask me anything...')}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="bg-therapy-600 hover:bg-therapy-700 text-white"
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ContextualAISupport;
