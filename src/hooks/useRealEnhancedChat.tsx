
import { useState, useCallback } from 'react';
import { useSimpleApp } from './useSimpleApp';
import { realAIService, ConversationContext } from '@/services/realAiService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { useTherapist } from '@/contexts/TherapistContext';

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  emotion?: string;
  techniques?: string[];
  insights?: string[];
  riskLevel?: 'low' | 'moderate' | 'high' | 'crisis';
}

export interface UserPreferences {
  voice_enabled: boolean;
  response_style: string;
  preferred_techniques: string[];
  communication_style: string;
}

export const useRealEnhancedChat = () => {
  const { user } = useSimpleApp();
  const { toast } = useToast();
  const { selectedTherapist } = useTherapist();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);

  const loadPreferences = useCallback(async () => {
    if (!user) return;

    try {
      const { data: prefs } = await supabase
        .from('personalization_configs')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (prefs) {
        setUserPreferences({
          voice_enabled: true,
          response_style: prefs.communication_style || 'supportive',
          preferred_techniques: prefs.preferred_techniques || [],
          communication_style: prefs.communication_style || 'warm'
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  }, [user]);

  const createNewSession = useCallback(async () => {
    if (!user) return '';

    try {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setCurrentSessionId(sessionId);
      
      // Store session start in database
      await supabase.from('session_messages').insert({
        session_id: sessionId,
        sender: 'system',
        content: 'Session started',
        timestamp: new Date().toISOString()
      });

      return sessionId;
    } catch (error) {
      console.error('Error creating session:', error);
      return '';
    }
  }, [user]);

  const sendMessage = useCallback(async (content: string) => {
    if (!user || !content.trim()) return;

    setIsLoading(true);
    const sessionId = currentSessionId || await createNewSession();

    // Add user message immediately
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      content,
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      // Store user message in database
      await supabase.from('session_messages').insert({
        session_id: sessionId,
        sender: 'user',
        content,
        timestamp: new Date().toISOString()
      });

      // Get recent goals for context
      const { data: recentGoals } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_completed', false)
        .order('created_at', { ascending: false })
        .limit(3);

      // Build conversation context with therapist information
      const context: ConversationContext = {
        userId: user.id,
        sessionId,
        conversationHistory: messages.map(m => ({
          role: m.isUser ? 'user' : 'assistant',
          content: m.content
        })),
        recentGoals: recentGoals || [],
        therapist: selectedTherapist
      };

      // Get AI response with selected therapist context
      const aiResponse = await realAIService.generateTherapyResponse(content, context);

      // Handle crisis situation
      if (aiResponse.riskLevel === 'crisis') {
        toast({
          title: "🚨 Crisis Support Available",
          description: "If you're in immediate danger, please call 911 or text HOME to 741741",
          variant: "destructive"
        });
      }

      // Create AI message
      const aiMessage: Message = {
        id: `ai_${Date.now()}`,
        content: aiResponse.message,
        isUser: false,
        timestamp: new Date(),
        emotion: aiResponse.emotion,
        techniques: aiResponse.techniques,
        insights: aiResponse.insights,
        riskLevel: aiResponse.riskLevel
      };

      setMessages(prev => [...prev, aiMessage]);

      // Store AI response in database
      await supabase.from('session_messages').insert({
        session_id: sessionId,
        sender: 'assistant',
        content: aiResponse.message,
        emotion: aiResponse.emotion,
        timestamp: new Date().toISOString()
      });

      // Show follow-up questions if available
      if (aiResponse.followUpQuestions && aiResponse.followUpQuestions.length > 0) {
        toast({
          title: "💭 Follow-up Questions",
          description: aiResponse.followUpQuestions[0]
        });
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        content: "I'm having trouble processing your message right now. Please try again.",
        isUser: false,
        timestamp: new Date(),
        riskLevel: 'low'
      };
      setMessages(prev => [...prev, errorMessage]);

      toast({
        title: "Connection Error",
        description: "Unable to process your message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, messages, currentSessionId, createNewSession, toast]);

  const playMessage = useCallback(async (messageContent: string) => {
    if (!userPreferences?.voice_enabled) return;

    try {
      setIsPlaying(true);
      
      // Use Web Speech API for text-to-speech
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(messageContent);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        
        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Error playing message:', error);
      setIsPlaying(false);
    }
  }, [userPreferences]);

  const stopPlayback = useCallback(() => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    setIsPlaying(false);
  }, []);

  const analyzeSession = useCallback(async () => {
    if (!currentSessionId) return null;

    try {
      const insights = await realAIService.analyzeSessionInsights(currentSessionId);
      
      toast({
        title: "📊 Session Analysis Complete",
        description: insights.summary || "Your session has been analyzed for insights."
      });

      return insights;
    } catch (error) {
      console.error('Error analyzing session:', error);
      return null;
    }
  }, [currentSessionId, toast]);

  return {
    messages,
    isLoading,
    isPlaying,
    userPreferences,
    currentSessionId,
    sendMessage,
    playMessage,
    stopPlayback,
    loadPreferences,
    analyzeSession
  };
};
