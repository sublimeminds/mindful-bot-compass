import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useConversationMemory } from './useConversationMemory';
import { useProactiveCare } from './useProactiveCare';
import { useContextualAwareness } from './useContextualAwareness';
import { useTherapeuticRelationship } from './useTherapeuticRelationship';
import { useEnhancedMicroInteractions } from './useEnhancedMicroInteractions';
import { useEnhancedCrisisSupport } from './useEnhancedCrisisSupport';

interface EnhancedMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  emotion?: string;
  riskLevel?: string;
  techniques?: string[];
  continuityElements?: string[];
  relationshipStage?: string;
  contextualAdaptations?: any;
}

export const useHumanLikeAIIntegration = (therapistId: string) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<EnhancedMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Initialize all human-like components
  const conversationMemory = useConversationMemory();
  const proactiveCare = useProactiveCare();
  const contextualAwareness = useContextualAwareness();
  const therapeuticRelationship = useTherapeuticRelationship();
  const microInteractions = useEnhancedMicroInteractions(therapistId);
  const crisisSupport = useEnhancedCrisisSupport();

  const startEnhancedSession = useCallback(async () => {
    if (!user) return null;

    const sessionId = `session_${Date.now()}`;
    setCurrentSessionId(sessionId);

    // Initialize relationship if needed
    await therapeuticRelationship.initializeRelationship();

    // Create session continuity
    const previousMemories = await conversationMemory.getRelevantMemories('session_start');
    const callbacks = conversationMemory.generateCallbacks(previousMemories);

    // Store session continuity
    await (supabase as any).from('session_continuity').insert({
      user_id: user.id,
      session_id: sessionId,
      transition_context: { callbacks, previousMemories },
      emotional_state_carry_over: {},
      unresolved_topics: {},
      follow_up_needed: callbacks.length > 0
    });

    return sessionId;
  }, [user, conversationMemory, therapeuticRelationship]);

  const sendEnhancedMessage = useCallback(async (content: string) => {
    if (!user || !currentSessionId) return;

    setIsLoading(true);

    try {
      // Create user message
      const userMessage: EnhancedMessage = {
        id: `msg_${Date.now()}`,
        content,
        isUser: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);

      // 1. Crisis Detection
      const crisisDetection = crisisSupport.detectCrisisIndicators(content, messages.map(m => m.content));
      
      if (crisisDetection.requiresImmediate) {
        await crisisSupport.createCrisisSession(currentSessionId, crisisDetection.crisisLevel, crisisDetection);
      }

      // 2. Extract Memory Elements
      await conversationMemory.addMemory({
        title: 'User concern detected',
        content: content,
        memory_type: 'concern',
        emotional_context: { userEmotion: 'unknown', crisisLevel: crisisDetection.crisisLevel },
        importance_score: crisisDetection.crisisScore / 10,
        tags: ['user_concern', crisisDetection.crisisLevel]
      });

      // 3. Get Contextual Awareness
      const context = contextualAwareness.getCurrentContext();
      const contextualGreeting = contextualAwareness.getContextualGreeting(context!);
      const seasonalAdaptation = contextualAwareness.getSeasonalAdaptation(context!);

      // 4. Get Relevant Memories for Continuity
      const relevantMemories = await conversationMemory.getRelevantMemories(content);
      const callbacks = conversationMemory.generateCallbacks(relevantMemories);

      // 5. Check Therapeutic Relationship Stage
      const relationshipStage = therapeuticRelationship.relationship?.relationship_stage || 'initial';
      const personalSharing = therapeuticRelationship.getTherapistPersonalSharing();

      // 6. Call Enhanced AI Edge Function
      const response = await supabase.functions.invoke('human-like-ai-therapy-chat', {
        body: {
          message: content,
          userId: user.id,
          sessionId: currentSessionId,
          therapistId,
          crisisDetection,
          relevantMemories,
          callbacks,
          contextualData: {
            timeOfDay: context?.timeOfDay,
            season: context?.season,
            greeting: contextualGreeting,
            adaptation: seasonalAdaptation
          },
          relationshipData: {
            stage: relationshipStage,
            trustLevel: therapeuticRelationship.relationship?.trust_level || 1,
            personalSharing,
            canAccessFeatures: {
              personalSharing: therapeuticRelationship.canAccessFeature('personal_sharing'),
              deeperTechniques: therapeuticRelationship.canAccessFeature('deeper_techniques'),
              vulnerableConversations: therapeuticRelationship.canAccessFeature('vulnerable_conversations')
            }
          },
          microInteractionPrefs: {
            typingPattern: microInteractions.typingPattern,
            reactionStyle: 'empathetic'
          }
        }
      });

      let aiResponseText = 'I understand what you\'re sharing. Can you tell me more about that?';
      let responseMetadata = {};

      if (response.data) {
        aiResponseText = response.data.response || aiResponseText;
        responseMetadata = response.data.metadata || {};
      }

      // 7. Apply Relationship-Based Response Enhancement
      const enhancedResponse = therapeuticRelationship.getRelationshipBasedResponse(aiResponseText);

      // 8. Apply Contextual Adaptations
      const contextuallyAdaptedResponse = contextualAwareness.adaptResponseToContext(enhancedResponse, context!);

      // 9. Simulate Human-Like Typing
      let displayedText = '';
      const aiMessage: EnhancedMessage = {
        id: `msg_${Date.now() + 1}`,
        content: '',
        isUser: false,
        timestamp: new Date(),
        emotion: (responseMetadata as any)?.emotion || 'supportive',
        riskLevel: crisisDetection.crisisLevel,
        techniques: (responseMetadata as any)?.techniques || [],
        continuityElements: callbacks.map(c => c.title),
        relationshipStage,
        contextualAdaptations: context
      };

      setMessages(prev => [...prev, aiMessage]);

      // Simulate typing with personality
      await microInteractions.simulateTyping(contextuallyAdaptedResponse, (partial) => {
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessage.id ? { ...msg, content: partial } : msg
        ));
      });

      // 10. Update Trust Level Based on Interaction Quality
      const trustIncrement = crisisDetection.crisisLevel === 'low' ? 0.1 : 0.2;
      await therapeuticRelationship.updateTrustLevel(trustIncrement);

      // 11. Record Interaction for Relationship Tracking
      await therapeuticRelationship.recordInteraction();

      // 12. Update Memory References
      for (const memory of relevantMemories) {
        await conversationMemory.updateMemoryReference(memory.id);
      }

      // 13. Store Session Technique Tracking
      await (supabase as any).from('session_technique_tracking').insert({
        session_id: currentSessionId,
        user_id: user.id,
        technique_name: (responseMetadata as any)?.primaryTechnique || 'active_listening',
        approach_type: 'human_like_integration',
        user_response_score: 0.8,
        effectiveness_metrics: responseMetadata,
        ai_confidence: response.data?.confidence || 0.85
      });

      // 14. Check for Proactive Care Needs
      if (crisisDetection.crisisLevel !== 'low') {
        await proactiveCare.createMoodCheck('situational', `Crisis level detected: ${crisisDetection.crisisLevel}`);
      }

    } catch (error) {
      console.error('Enhanced AI integration error:', error);
      
      // Fallback response with human-like touch
      const fallbackMessage: EnhancedMessage = {
        id: `msg_${Date.now() + 1}`,
        content: "I'm having a moment of technical difficulty, but I'm still here with you. Can you share that again?",
        isUser: false,
        timestamp: new Date(),
        emotion: 'concerned'
      };

      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [user, currentSessionId, messages, conversationMemory, proactiveCare, contextualAwareness, therapeuticRelationship, microInteractions, crisisSupport, therapistId]);

  const generateDailyCheckIn = useCallback(async () => {
    if (!proactiveCare.shouldTriggerDailyCheck()) return;

    const context = contextualAwareness.getCurrentContext();
    const greeting = contextualAwareness.getContextualGreeting(context!);
    
    await proactiveCare.createMoodCheck('daily', 'Automated daily wellness check');
    
    return {
      message: `${greeting} I wanted to check in with you today. How are you feeling?`,
      type: 'proactive_care',
      context
    };
  }, [proactiveCare, contextualAwareness]);

  const getSessionInsights = useCallback(async () => {
    if (!user || !currentSessionId) return null;

    const memories = await conversationMemory.getRelevantMemories('session_analysis');
    const relationship = therapeuticRelationship.relationship;
    
    return {
      conversationMemories: memories.length,
      relationshipStage: relationship?.relationship_stage,
      trustLevel: relationship?.trust_level,
      unlockedFeatures: relationship?.milestone_unlocks || [],
      sessionContinuity: memories.length > 0,
      contextualAdaptations: contextualAwareness.contextualData
    };
  }, [user, currentSessionId, conversationMemory, therapeuticRelationship, contextualAwareness]);

  return {
    messages,
    isLoading,
    currentSessionId,
    startEnhancedSession,
    sendEnhancedMessage,
    generateDailyCheckIn,
    getSessionInsights,
    // Expose individual components for advanced usage
    conversationMemory,
    proactiveCare,
    contextualAwareness,
    therapeuticRelationship,
    microInteractions,
    crisisSupport
  };
};