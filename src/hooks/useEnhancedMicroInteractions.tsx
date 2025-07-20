import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TypingPattern {
  baseDelay: number;
  characterVariation: number;
  pauseOnPunctuation: number;
  thinkingPauses: boolean;
}

interface PersonalityInteraction {
  therapist_id: string;
  interaction_type: 'typing_pattern' | 'pause_timing' | 'reaction_style' | 'validation_approach';
  interaction_data: any;
  user_adaptation: any;
}

export const useEnhancedMicroInteractions = (therapistId: string) => {
  const [typingPattern, setTypingPattern] = useState<TypingPattern | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [reactions, setReactions] = useState<string[]>([]);

  const loadPersonalityInteractions = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('personality_interactions')
        .select('*')
        .eq('therapist_id', therapistId);

      if (error) throw error;

      data?.forEach(interaction => {
        switch (interaction.interaction_type) {
          case 'typing_pattern':
            setTypingPattern(interaction.interaction_data);
            break;
          case 'reaction_style':
            setReactions(interaction.interaction_data.reactions || []);
            break;
        }
      });
    } catch (error) {
      console.error('Error loading personality interactions:', error);
    }
  };

  const simulateTyping = async (text: string, onProgress?: (partial: string) => void) => {
    if (!typingPattern) return;

    setIsTyping(true);
    let displayedText = '';

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      displayedText += char;
      
      if (onProgress) {
        onProgress(displayedText);
      }

      // Calculate delay based on personality
      let delay = typingPattern.baseDelay;
      
      // Add variation
      delay += (Math.random() - 0.5) * typingPattern.characterVariation;
      
      // Pause on punctuation
      if (/[.!?]/.test(char)) {
        delay += typingPattern.pauseOnPunctuation;
      }
      
      // Add thinking pauses
      if (typingPattern.thinkingPauses && Math.random() < 0.1) {
        delay += 800;
      }

      await new Promise(resolve => setTimeout(resolve, delay));
    }

    setIsTyping(false);
  };

  const getContextualReaction = (userMessage: string, emotionalTone: string) => {
    const reactionsByTone = {
      sad: ["I can hear the pain in your words...", "That sounds really difficult.", "I'm here with you in this."],
      angry: ["I can feel your frustration.", "That anger makes complete sense.", "It's okay to feel this way."],
      anxious: ["I notice some worry in what you're sharing.", "Anxiety can feel overwhelming.", "Let's take this one step at a time."],
      happy: ["I can hear the joy in your voice!", "That's wonderful to hear.", "I'm so glad you're feeling this way."],
      confused: ["It sounds like you're processing a lot.", "Sometimes confusion is part of the journey.", "Let's explore this together."],
      neutral: ["I'm listening carefully.", "Tell me more about that.", "I'm here to understand."]
    };

    const toneReactions = reactionsByTone[emotionalTone as keyof typeof reactionsByTone] || reactionsByTone.neutral;
    return toneReactions[Math.floor(Math.random() * toneReactions.length)];
  };

  const addTherapistPause = async (pauseType: 'thinking' | 'empathetic' | 'processing' = 'thinking') => {
    const pauseDurations = {
      thinking: 2000,
      empathetic: 1500,
      processing: 3000
    };

    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, pauseDurations[pauseType]));
    setIsTyping(false);
  };

  const getValidationResponse = (validationType: 'understanding' | 'feeling' | 'experience') => {
    const validations = {
      understanding: [
        "I want to make sure I understand...",
        "Let me reflect back what I'm hearing...",
        "It sounds like you're saying..."
      ],
      feeling: [
        "It makes complete sense that you'd feel that way.",
        "Your feelings are completely valid.",
        "Anyone in your situation would feel this way."
      ],
      experience: [
        "Your experience matters.",
        "Thank you for trusting me with this.",
        "I can only imagine how that felt."
      ]
    };

    const validationResponses = validations[validationType];
    return validationResponses[Math.floor(Math.random() * validationResponses.length)];
  };

  const createPersonalizedTypingPattern = (therapistPersonality: any) => {
    // Create typing patterns based on therapist personality
    const basePatterns = {
      warm_empathetic: { baseDelay: 80, characterVariation: 40, pauseOnPunctuation: 200, thinkingPauses: true },
      analytical_direct: { baseDelay: 60, characterVariation: 20, pauseOnPunctuation: 150, thinkingPauses: false },
      gentle_supportive: { baseDelay: 100, characterVariation: 50, pauseOnPunctuation: 300, thinkingPauses: true },
      energetic_motivational: { baseDelay: 50, characterVariation: 30, pauseOnPunctuation: 100, thinkingPauses: false }
    };

    const personalityType = therapistPersonality?.communication_style || 'warm_empathetic';
    return basePatterns[personalityType as keyof typeof basePatterns] || basePatterns.warm_empathetic;
  };

  useEffect(() => {
    if (therapistId) {
      loadPersonalityInteractions();
    }
  }, [therapistId]);

  return {
    isTyping,
    typingPattern,
    simulateTyping,
    getContextualReaction,
    addTherapistPause,
    getValidationResponse,
    createPersonalizedTypingPattern
  };
};