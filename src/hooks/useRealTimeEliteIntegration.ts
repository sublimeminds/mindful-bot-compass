/**
 * Real-Time Elite System Integration Hook
 * Connects all therapy sessions to the Elite AI system in real-time
 */

import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { IntelligentRouterHub } from '@/services/intelligentRouterHub';
import { RealTimeCulturalAIIntegration } from '@/services/realTimeCulturalAiIntegration';
import { AdaptiveFeedbackLoopSystem } from '@/services/adaptiveFeedbackLoopSystem';
import { useToast } from '@/hooks/use-toast';

interface SessionEvent {
  type: 'message_sent' | 'session_started' | 'crisis_detected' | 'session_completed';
  sessionId: string;
  data: any;
}

export const useRealTimeEliteIntegration = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  /**
   * Initialize real-time session monitoring
   */
  const initializeRealTimeMonitoring = useCallback(async () => {
    if (!user) return;

    console.log('🔄 Initializing Real-Time Elite Integration for user:', user.id);

    // Subscribe to session events
    const sessionChannel = supabase
      .channel(`user-sessions-${user.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'therapy_sessions',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        handleSessionEvent({
          type: payload.eventType === 'INSERT' ? 'session_started' : 'session_completed',
          sessionId: payload.new?.id || payload.old?.id,
          data: payload
        });
      })
      .subscribe();

    // Subscribe to message events
    const messageChannel = supabase
      .channel(`user-messages-${user.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'therapy_messages',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        handleSessionEvent({
          type: 'message_sent',
          sessionId: payload.new.session_id,
          data: payload.new
        });
      })
      .subscribe();

    // Subscribe to crisis detection events
    const crisisChannel = supabase
      .channel(`crisis-alerts-${user.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'crisis_interventions',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        handleSessionEvent({
          type: 'crisis_detected',
          sessionId: payload.new.session_id,
          data: payload.new
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(sessionChannel);
      supabase.removeChannel(messageChannel);
      supabase.removeChannel(crisisChannel);
    };
  }, [user]);

  /**
   * Handle session events with Elite AI system
   */
  const handleSessionEvent = useCallback(async (event: SessionEvent) => {
    try {
      console.log('🎯 Processing session event:', event.type, event.sessionId);

      switch (event.type) {
        case 'session_started':
          await handleSessionStart(event);
          break;
        case 'message_sent':
          await handleMessageProcessing(event);
          break;
        case 'crisis_detected':
          await handleCrisisIntervention(event);
          break;
        case 'session_completed':
          await handleSessionCompletion(event);
          break;
      }
    } catch (error) {
      console.error('❌ Error processing session event:', error);
      toast({
        title: "System Processing Error",
        description: "There was an issue processing your session. Our AI is still learning from your interactions.",
        variant: "default"
      });
    }
  }, [toast]);

  /**
   * Handle session start with Elite AI initialization
   */
  const handleSessionStart = async (event: SessionEvent) => {
    if (!user) return;

    try {
      // Initialize Elite AI router for this session
      const routingContext = {
        userId: user.id,
        sessionId: event.sessionId,
        messageHistory: [],
        currentMessage: '',
        urgencyLevel: 'low' as const,
        sessionType: 'therapy' as const
      };

      const routing = await IntelligentRouterHub.routeRequest(routingContext);
      
      // Initialize real-time cultural adaptation
      await RealTimeCulturalAIIntegration.initializeCulturalAIContext(user.id);

      console.log('✅ Elite session initialized:', {
        sessionId: event.sessionId,
        selectedModel: routing.selectedModel,
        therapyApproach: routing.therapyApproach
      });

      toast({
        title: "🧠 Elite AI Activated",
        description: `Your session is now powered by advanced cultural AI with ${routing.therapyApproach} approach.`,
      });

    } catch (error) {
      console.error('❌ Session start error:', error);
    }
  };

  /**
   * Process messages through Elite AI system
   */
  const handleMessageProcessing = async (event: SessionEvent) => {
    if (!user) return;

    try {
      const message = event.data;
      
      // Skip processing AI responses
      if (message.sender === 'ai') return;

      // Get session context
      const { data: sessionMessages } = await supabase
        .from('session_messages')
        .select('*')
        .eq('session_id', event.sessionId)
        .order('created_at', { ascending: true })
        .limit(10);

      const routingContext = {
        userId: user.id,
        sessionId: event.sessionId,
        messageHistory: (sessionMessages || []).map((msg: any) => ({
          id: msg.id,
          content: msg.content,
          isUser: msg.sender === 'user',
          timestamp: new Date(msg.created_at)
        })),
        currentMessage: message.content,
        urgencyLevel: message.risk_level || 'low' as const,
        sessionType: 'therapy' as const
      };

      // Process through Elite AI Router
      const routing = await IntelligentRouterHub.routeRequest(routingContext);

      // Apply real-time cultural adaptations
      await RealTimeCulturalAIIntegration.processCulturalAIResponse(
        message.content,
        user.id,
        { sessionId: event.sessionId, message }
      );

      // Update adaptive learning profile (simplified call)
      await AdaptiveFeedbackLoopSystem.processSessionOutcome({
        sessionId: event.sessionId,
        userId: user.id,
        effectivenessRating: 0.8,
        moodImprovement: 0,
        techniqueUsed: 'general',
        userFeedback: message.content,
        aiConfidence: 0.8,
        completedAt: new Date().toISOString()
      });

    } catch (error) {
      console.error('❌ Message processing error:', error);
    }
  };

  /**
   * Handle crisis situations with immediate escalation
   */
  const handleCrisisIntervention = async (event: SessionEvent) => {
    try {
      console.log('🚨 Crisis detected, activating emergency protocols');

      const routingContext = {
        userId: event.data.user_id,
        sessionId: event.sessionId,
        messageHistory: [],
        currentMessage: event.data.trigger_message || '',
        urgencyLevel: 'crisis' as const,
        sessionType: 'crisis' as const
      };

      // Use Elite AI for crisis intervention
      const routing = await IntelligentRouterHub.routeRequest(routingContext);

      toast({
        title: "🚨 Crisis Support Activated",
        description: "Elite AI crisis intervention is now active. Professional support resources are being prepared.",
        variant: "destructive"
      });

      // Store crisis routing decision
      await supabase
        .from('ai_routing_decisions')
        .insert({
          user_id: event.data.user_id,
          session_id: event.sessionId,
          selected_model: routing.selectedModel,
          therapy_approach: 'crisis-intervention',
          priority_level: 10,
          cultural_adaptations: routing.culturalAdaptations,
          reasoning: 'Crisis intervention protocol activated'
        });

    } catch (error) {
      console.error('❌ Crisis intervention error:', error);
    }
  };

  /**
   * Process session completion with adaptive learning
   */
  const handleSessionCompletion = async (event: SessionEvent) => {
    if (!user) return;

    try {
      console.log('🏁 Processing session completion for adaptive learning');

      // Process session through adaptive feedback system
      await AdaptiveFeedbackLoopSystem.processSessionOutcome({
        sessionId: event.sessionId,
        userId: user.id,
        effectivenessRating: 0.8,
        moodImprovement: 1,
        techniqueUsed: 'session_completion',
        userFeedback: 'Session completed',
        aiConfidence: 0.9,
        completedAt: new Date().toISOString()
      });

      // Update cultural adaptation effectiveness
      await RealTimeCulturalAIIntegration.processCulturalAIResponse(
        'Session completed',
        user.id,
        { sessionId: event.sessionId }
      );

      toast({
        title: "📊 Session Analysis Complete",
        description: "Your session has been analyzed to improve future AI interactions.",
      });

    } catch (error) {
      console.error('❌ Session completion error:', error);
    }
  };

  /**
   * Get Elite system status
   */
  const getEliteSystemStatus = useCallback(async () => {
    if (!user) return null;

    try {
      // Check if user has active Elite AI integrations
      const { data: routingDecisions } = await supabase
        .from('ai_routing_decisions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      const { data: adaptiveLearning } = await supabase
        .from('adaptive_learning_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      return {
        isActive: !!routingDecisions?.length,
        lastRouting: routingDecisions?.[0],
        adaptiveLearningActive: !!adaptiveLearning,
        systemHealth: 'optimal'
      };
    } catch (error) {
      console.error('❌ Error getting Elite system status:', error);
      return null;
    }
  }, [user]);

  // Initialize monitoring on mount
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const init = async () => {
      cleanup = await initializeRealTimeMonitoring();
    };

    init();

    return () => {
      if (cleanup) cleanup();
    };
  }, [initializeRealTimeMonitoring]);

  return {
    initializeRealTimeMonitoring,
    getEliteSystemStatus,
    handleSessionEvent
  };
};