import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TherapistCharacterService } from '@/services/therapistCharacterService';
import { 
  TherapistCharacterProfile, 
  TherapistClientRelationship, 
  PersonalizedResponse 
} from '@/types/therapist-character';

export const useTherapistCharacter = (therapistId: string, userId?: string) => {
  const queryClient = useQueryClient();

  // Get therapist character profile
  const { 
    data: characterProfile, 
    isLoading: isLoadingProfile 
  } = useQuery({
    queryKey: ['therapist-character', therapistId],
    queryFn: () => TherapistCharacterService.getCharacterProfile(therapistId),
    enabled: !!therapistId,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  // Get therapist-client relationship
  const { 
    data: relationship, 
    isLoading: isLoadingRelationship 
  } = useQuery({
    queryKey: ['therapist-relationship', therapistId, userId],
    queryFn: () => userId ? TherapistCharacterService.getTherapistClientRelationship(userId, therapistId) : null,
    enabled: !!therapistId && !!userId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  // Update relationship after session
  const updateRelationshipMutation = useMutation({
    mutationFn: (sessionData: {
      newMemories?: Array<any>;
      progressUpdates?: Record<string, any>;
      rapportChange?: number;
    }) => {
      if (!userId) throw new Error('User ID required');
      return TherapistCharacterService.updateRelationshipAfterSession(userId, therapistId, sessionData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['therapist-relationship', therapistId, userId] });
    },
  });

  // Generate personalized response
  const generateResponseMutation = useMutation({
    mutationFn: (context: {
      sessionPhase: string;
      userMessage: string;
      emotionalState: string;
      sessionHistory?: Array<any>;
    }) => {
      if (!userId) throw new Error('User ID required');
      return TherapistCharacterService.generatePersonalizedResponse(therapistId, userId, context);
    },
  });

  return {
    characterProfile,
    relationship,
    isLoadingProfile,
    isLoadingRelationship,
    updateRelationship: updateRelationshipMutation.mutate,
    generatePersonalizedResponse: generateResponseMutation.mutateAsync,
    isGeneratingResponse: generateResponseMutation.isPending,
  };
};

// Hook for therapist expressions in specific contexts
export const useTherapistExpressions = (
  therapistId: string, 
  contextType: string, 
  emotionalContext?: string
) => {
  const { data: expressions, isLoading } = useQuery({
    queryKey: ['therapist-expressions', therapistId, contextType, emotionalContext],
    queryFn: () => TherapistCharacterService.getTherapistExpressions(therapistId, contextType, emotionalContext),
    enabled: !!therapistId && !!contextType,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });

  return {
    expressions: expressions || [],
    isLoading,
  };
};

// Hook for dynamic personality adaptation during sessions
export const useTherapistPersonality = (therapistId: string, userId?: string) => {
  const [currentContext, setCurrentContext] = useState<{
    sessionPhase: string;
    emotionalState: string;
  }>({
    sessionPhase: 'opening',
    emotionalState: 'neutral'
  });

  const { characterProfile, relationship } = useTherapistCharacter(therapistId, userId);
  const { expressions } = useTherapistExpressions(
    therapistId, 
    currentContext.sessionPhase, 
    currentContext.emotionalState
  );

  // Get current signature phrase based on context
  const getCurrentSignaturePhrase = (): string => {
    if (!characterProfile?.signature_phrases?.length) {
      return "I'm here to support you.";
    }

    // Select phrase based on context and relationship stage
    const phrases = characterProfile.signature_phrases;
    if (relationship?.relationship_stage === 'initial') {
      return phrases[0] || phrases[Math.floor(Math.random() * phrases.length)];
    }
    
    return phrases[Math.floor(Math.random() * phrases.length)];
  };

  // Get communication style for current context
  const getCommunicationStyle = () => {
    if (!characterProfile?.speech_patterns) {
      return { tone: 'supportive', pace: 'moderate' };
    }

    return {
      tone: characterProfile.speech_patterns.tone || 'supportive',
      pace: characterProfile.speech_patterns.speaking_pace || 'moderate',
      usesMetaphors: characterProfile.speech_patterns.uses_metaphors || false,
      usesHumor: characterProfile.speech_patterns.uses_humor || false,
    };
  };

  // Update context based on session progress
  const updateContext = (newContext: Partial<typeof currentContext>) => {
    setCurrentContext(prev => ({ ...prev, ...newContext }));
  };

  // Get therapist's likely response to a situation
  const getPredictedResponse = (userMessage: string, emotion: string): string => {
    const style = getCommunicationStyle();
    const phrase = getCurrentSignaturePhrase();
    
    // Simple response generation based on character traits
    if (characterProfile?.therapy_philosophy?.includes('mindfulness')) {
      return `${phrase} Let's take a moment to notice what you're experiencing right now.`;
    }
    
    if (characterProfile?.therapy_philosophy?.includes('strength')) {
      return `${phrase} I can hear the resilience in what you're sharing.`;
    }

    return phrase;
  };

  return {
    characterProfile,
    relationship,
    expressions,
    currentContext,
    updateContext,
    getCurrentSignaturePhrase,
    getCommunicationStyle,
    getPredictedResponse,
    generatePersonalizedResponse: generateResponseMutation.mutateAsync,
    rapportLevel: relationship?.rapport_level || 0,
    relationshipStage: relationship?.relationship_stage || 'initial',
    totalSessions: relationship?.total_sessions || 0,
  };
};