
import { useState, useCallback } from 'react';
import { useSimpleApp } from './useSimpleApp';
import { realAIService, ConversationContext } from '@/services/realAiService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { useTherapist } from '@/contexts/TherapistContext';
import { adaptiveTherapyPlanService } from '@/services/adaptiveTherapyPlanService';
import { SessionAnalyticsService } from '@/services/sessionAnalyticsService';

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
      
      // Prepare session with adaptive insights
      await adaptiveTherapyPlanService.prepareSessionWithAdaptiveInsights(user.id, sessionId);
      
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

      // Check for real-time adaptations based on current session state
      const sessionData = {
        messages: [...messages, userMessage],
        currentMood: getCurrentMoodFromMessages([...messages, userMessage]),
        initialMood: getInitialMoodFromSession(messages),
        avgResponseLength: calculateAverageResponseLength(messages.filter(m => m.isUser)),
        interactionDepth: messages.length,
        lastUsedTechnique: getLastUsedTechnique(messages)
      };

      const currentMetrics = {
        averageResponseTime: calculateAverageResponseTime(messages),
        engagementScore: calculateEngagementScore(sessionData)
      };

      // Invoke real-time adaptation function
      const { data: adaptationData } = await supabase.functions.invoke('real-time-therapy-adaptation', {
        body: {
          user_id: user.id,
          session_id: sessionId,
          session_data: sessionData,
          current_metrics: currentMetrics
        }
      });

      // Apply adaptations if needed
      let adaptiveContext = '';
      if (adaptationData?.adaptation_needed && adaptationData.adaptations) {
        const adaptations = adaptationData.adaptations.adaptations;
        
        if (adaptations.crisis_protocols?.length > 0) {
          adaptiveContext += `CRISIS PROTOCOLS: ${adaptations.crisis_protocols.join(', ')}. `;
        }
        
        if (adaptations.technique_changes?.length > 0) {
          adaptiveContext += `TECHNIQUE CHANGES: ${adaptations.technique_changes.join(', ')}. `;
        }
        
        if (adaptations.approach_adjustments?.length > 0) {
          adaptiveContext += `APPROACH ADJUSTMENTS: ${adaptations.approach_adjustments.join(', ')}. `;
        }
        
        if (adaptations.intensity_modifications?.length > 0) {
          adaptiveContext += `INTENSITY: ${adaptations.intensity_modifications.join(', ')}. `;
        }

        console.log('🔄 Real-time adaptations applied:', adaptations);
      }

      // Get recent goals for context
      const { data: recentGoals } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_completed', false)
        .order('created_at', { ascending: false })
        .limit(3);

      // Build conversation context with therapist information and adaptive context
      const context: ConversationContext = {
        userId: user.id,
        sessionId,
        conversationHistory: messages.map(m => ({
          role: m.isUser ? 'user' : 'assistant',
          content: m.content
        })),
        recentGoals: recentGoals || [],
        therapist: selectedTherapist,
        adaptiveContext: adaptiveContext || undefined
      };

      // Get AI response with adaptive context
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

      // Log adaptation data if available
      if (adaptationData?.adaptation_needed) {
        console.log('📊 Session analytics:', {
          userId: user.id,
          sessionId,
          adaptationApplied: true,
          adaptationTriggers: adaptationData.triggers?.map((t: any) => t.type) || []
        });
      }

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
  }, [user, messages, currentSessionId, createNewSession, toast, selectedTherapist]);

  // Helper functions for session analysis
  const getCurrentMoodFromMessages = (messages: Message[]): number => {
    const recentUserMessages = messages.filter(m => m.isUser).slice(-3);
    // Simple sentiment analysis - could be enhanced with AI
    const totalSentiment = recentUserMessages.reduce((sum, msg) => {
      const words = msg.content.toLowerCase().split(' ');
      let sentiment = 5; // neutral
      
      // Positive indicators
      if (words.some(w => ['good', 'better', 'happy', 'grateful', 'hopeful'].includes(w))) sentiment += 2;
      
      // Negative indicators  
      if (words.some(w => ['bad', 'worse', 'sad', 'hopeless', 'terrible'].includes(w))) sentiment -= 2;
      
      return sum + sentiment;
    }, 0);
    
    return recentUserMessages.length > 0 ? totalSentiment / recentUserMessages.length : 5;
  };

  const getInitialMoodFromSession = (messages: Message[]): number => {
    const firstUserMessage = messages.find(m => m.isUser);
    if (!firstUserMessage) return 5;
    return getCurrentMoodFromMessages([firstUserMessage]);
  };

  const calculateAverageResponseLength = (userMessages: Message[]): number => {
    if (userMessages.length === 0) return 0;
    const totalLength = userMessages.reduce((sum, msg) => sum + msg.content.length, 0);
    return totalLength / userMessages.length;
  };

  const getLastUsedTechnique = (messages: Message[]): string | undefined => {
    const aiMessages = messages.filter(m => !m.isUser && m.techniques?.length);
    const lastAiMessage = aiMessages[aiMessages.length - 1];
    return lastAiMessage?.techniques?.[0];
  };

  const calculateAverageResponseTime = (messages: Message[]): number => {
    // Simplified - would need to track actual response times
    return 45; // Default 45 seconds
  };

  const calculateEngagementScore = (sessionData: any): number => {
    let score = 0.5;
    
    if (sessionData.avgResponseLength > 50) score += 0.2;
    if (sessionData.interactionDepth > 5) score += 0.2;
    if (sessionData.currentMood > sessionData.initialMood) score += 0.1;
    
    return Math.min(score, 1.0);
  };

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
    if (!currentSessionId || !user) return null;

    try {
      // Run comprehensive session analysis
      const insights = await realAIService.analyzeSessionInsights(currentSessionId);
      
      // Get session analytics for effectiveness scoring
      const sessionAnalytics = await SessionAnalyticsService.getSessionAnalytics(user.id, '1d');
      
      // Update adaptive therapy plan effectiveness
      if (sessionAnalytics.effectivenessScore) {
        await adaptiveTherapyPlanService.updatePlanEffectiveness(
          user.id, 
          currentSessionId, 
          sessionAnalytics.effectivenessScore / 100
        );
      }
      
      // Trigger adaptive plan analysis for next session
      await adaptiveTherapyPlanService.analyzeAndAdaptPlan(user.id);
      
      toast({
        title: "📊 Session Analysis Complete",
        description: insights.summary || "Your session has been analyzed and therapy plan updated."
      });

      return insights;
    } catch (error) {
      console.error('Error analyzing session:', error);
      return null;
    }
  }, [currentSessionId, user, toast]);

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
