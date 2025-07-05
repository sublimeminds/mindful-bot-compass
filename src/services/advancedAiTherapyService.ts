import { supabase } from '@/integrations/supabase/client';
import { personalizedTherapistVoiceService } from './personalizedTherapistVoiceService';

export interface AdvancedAIContext {
  userId: string;
  sessionId?: string;
  therapistId: string;
  userMessage: string;
  emotionalState: {
    primary: string;
    intensity: number;
    context: string[];
    crisisLevel: number; // 0-1 scale
  };
  sessionHistory: {
    totalSessions: number;
    recentTopics: string[];
    therapeuticProgress: number; // 0-1 scale
    preferredApproaches: string[];
  };
  culturalContext: {
    language: string;
    culturalBackground?: string;
    communicationStyle: string;
    religiousConsiderations: boolean;
  };
  realTimeMetrics: {
    responseTime: number;
    engagementLevel: number;
    comprehensionScore: number;
  };
}

export interface AITherapyResponse {
  textResponse: string;
  emotionalTone: {
    supportLevel: 'low' | 'medium' | 'high' | 'crisis';
    approach: string;
    voiceModulation: {
      stability: number;
      warmth: number;
      pace: number;
      emphasis: string[];
    };
  };
  therapeuticActions: {
    techniques: string[];
    interventions: string[];
    followUpRecommendations: string[];
  };
  personalizationUpdates: {
    learnedPreferences: Record<string, any>;
    adaptedCommunicationStyle: Record<string, any>;
    progressInsights: string[];
  };
  audioConfiguration: {
    voiceSettings: any;
    emotionalAdaptation: any;
    culturalTone: any;
  };
}

class AdvancedAiTherapyService {
  private modelEndpoint = 'gpt-4.1-2025-04-14';
  private conversationMemory: Map<string, any[]> = new Map();
  private userAdaptationProfiles: Map<string, any> = new Map();

  async generateAdvancedTherapyResponse(context: AdvancedAIContext): Promise<AITherapyResponse> {
    try {
      // Load user's adaptation profile
      const adaptationProfile = await this.loadUserAdaptationProfile(context.userId);
      
      // Generate culturally-aware, personalized response
      const aiResponse = await this.callAdvancedTherapyAI(context, adaptationProfile);
      
      // Update user adaptation profile based on interaction
      await this.updateUserAdaptationProfile(context.userId, context, aiResponse);
      
      // Generate personalized voice configuration
      const audioConfig = await this.generatePersonalizedAudioConfig(context, aiResponse);
      
      return {
        ...aiResponse,
        audioConfiguration: audioConfig
      };
    } catch (error) {
      console.error('Error in advanced AI therapy service:', error);
      return this.generateFallbackResponse(context);
    }
  }

  private async callAdvancedTherapyAI(
    context: AdvancedAIContext, 
    adaptationProfile: any
  ): Promise<Omit<AITherapyResponse, 'audioConfiguration'>> {
    const systemPrompt = this.buildAdvancedSystemPrompt(context, adaptationProfile);
    
    const { data, error } = await supabase.functions.invoke('enhanced-api', {
      body: {
        model: this.modelEndpoint,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: this.buildUserPrompt(context) }
        ],
        temperature: this.calculateOptimalTemperature(context),
        max_tokens: 1000,
        functions: [
          {
            name: 'analyze_therapeutic_response',
            description: 'Generate structured therapeutic response with emotional analysis',
            parameters: {
              type: 'object',
              properties: {
                textResponse: { type: 'string', description: 'The therapeutic response text' },
                emotionalTone: {
                  type: 'object',
                  properties: {
                    supportLevel: { type: 'string', enum: ['low', 'medium', 'high', 'crisis'] },
                    approach: { type: 'string' },
                    voiceModulation: {
                      type: 'object',
                      properties: {
                        stability: { type: 'number', minimum: 0, maximum: 1 },
                        warmth: { type: 'number', minimum: 0, maximum: 1 },
                        pace: { type: 'number', minimum: 0.5, maximum: 2.0 },
                        emphasis: { type: 'array', items: { type: 'string' } }
                      }
                    }
                  }
                },
                therapeuticActions: {
                  type: 'object',
                  properties: {
                    techniques: { type: 'array', items: { type: 'string' } },
                    interventions: { type: 'array', items: { type: 'string' } },
                    followUpRecommendations: { type: 'array', items: { type: 'string' } }
                  }
                },
                personalizationUpdates: {
                  type: 'object',
                  properties: {
                    learnedPreferences: { type: 'object' },
                    adaptedCommunicationStyle: { type: 'object' },
                    progressInsights: { type: 'array', items: { type: 'string' } }
                  }
                }
              },
              required: ['textResponse', 'emotionalTone', 'therapeuticActions', 'personalizationUpdates']
            }
          }
        ],
        function_call: { name: 'analyze_therapeutic_response' }
      }
    });

    if (error) throw error;

    const functionCall = data.choices[0].message.function_call;
    return JSON.parse(functionCall.arguments);
  }

  private buildAdvancedSystemPrompt(context: AdvancedAIContext, adaptationProfile: any): string {
    const basePrompt = `You are an advanced AI therapist with deep cultural awareness and personalization capabilities.

THERAPIST CONTEXT:
- Therapist ID: ${context.therapistId}
- Specialization: ${this.getTherapistSpecialization(context.therapistId)}
- Communication Style: Adapted to user's ${context.culturalContext.communicationStyle} preference

USER PROFILE:
- Cultural Background: ${context.culturalContext.culturalBackground || 'Not specified'}
- Language: ${context.culturalContext.language}
- Religious Considerations: ${context.culturalContext.religiousConsiderations ? 'Yes' : 'No'}
- Therapeutic Progress: ${Math.round(context.sessionHistory.therapeuticProgress * 100)}%
- Total Sessions: ${context.sessionHistory.totalSessions}

EMOTIONAL STATE:
- Primary Emotion: ${context.emotionalState.primary}
- Intensity: ${Math.round(context.emotionalState.intensity * 100)}%
- Crisis Level: ${Math.round(context.emotionalState.crisisLevel * 100)}%
- Context: ${context.emotionalState.context.join(', ')}

ADAPTATION PROFILE:
${JSON.stringify(adaptationProfile, null, 2)}

REAL-TIME METRICS:
- Response Time Sensitivity: ${context.realTimeMetrics.responseTime}ms
- Current Engagement: ${Math.round(context.realTimeMetrics.engagementLevel * 100)}%
- Comprehension Score: ${Math.round(context.realTimeMetrics.comprehensionScore * 100)}%

INSTRUCTIONS:
1. Provide culturally sensitive, personalized therapeutic responses
2. Adapt communication style based on user's background and preferences
3. Consider crisis level and adjust intervention intensity accordingly
4. Learn from user interactions to improve future responses
5. Suggest specific therapeutic techniques relevant to the user's needs
6. Provide voice modulation parameters for optimal emotional delivery
7. Generate insights about user's therapeutic journey and progress

CRITICAL SAFETY PROTOCOLS:
- If crisis level > 0.8, prioritize safety and suggest immediate professional help
- Respect cultural and religious boundaries
- Maintain therapeutic boundaries while being empathetic
- Never provide medical advice or diagnoses

Respond using the analyze_therapeutic_response function with all required parameters.`;

    return basePrompt;
  }

  private buildUserPrompt(context: AdvancedAIContext): string {
    return `Current user message: "${context.userMessage}"

Recent conversation topics: ${context.sessionHistory.recentTopics.join(', ')}
Preferred therapeutic approaches: ${context.sessionHistory.preferredApproaches.join(', ')}

Please provide a comprehensive therapeutic response that addresses:
1. The immediate emotional needs expressed in the message
2. Long-term therapeutic goals and progress
3. Cultural sensitivity and appropriate communication style
4. Voice modulation parameters for optimal emotional delivery
5. Specific techniques and interventions to suggest
6. Personalization updates based on this interaction`;
  }

  private calculateOptimalTemperature(context: AdvancedAIContext): number {
    // Lower temperature for crisis situations, higher for creative therapeutic approaches
    const baseTemp = 0.7;
    const crisisAdjustment = context.emotionalState.crisisLevel * -0.3; // Reduce randomness in crisis
    const engagementAdjustment = (context.realTimeMetrics.engagementLevel - 0.5) * 0.2;
    
    return Math.max(0.1, Math.min(1.0, baseTemp + crisisAdjustment + engagementAdjustment));
  }

  private async generatePersonalizedAudioConfig(
    context: AdvancedAIContext, 
    aiResponse: Omit<AITherapyResponse, 'audioConfiguration'>
  ): Promise<AITherapyResponse['audioConfiguration']> {
    const emotionalContext = {
      primaryEmotion: context.emotionalState.primary,
      intensity: context.emotionalState.intensity,
      supportLevel: aiResponse.emotionalTone.supportLevel,
      crisisLevel: context.emotionalState.crisisLevel > 0.8,
      userMood: context.emotionalState.primary
    };

    // Get base voice settings for therapist
    const baseVoiceConfig = personalizedTherapistVoiceService.getTherapistVoiceConfig(context.therapistId);
    
    // Apply AI-determined modulations
    const voiceSettings = {
      stability: aiResponse.emotionalTone.voiceModulation.stability,
      similarityBoost: baseVoiceConfig?.personalityModifiers.similarityBoost || 0.85,
      style: aiResponse.emotionalTone.voiceModulation.warmth,
      speakerBoost: true,
      speed: aiResponse.emotionalTone.voiceModulation.pace
    };

    // Cultural tone adaptations
    const culturalTone = this.getCulturalVoiceAdaptations(context.culturalContext);

    return {
      voiceSettings,
      emotionalAdaptation: emotionalContext,
      culturalTone
    };
  }

  private getCulturalVoiceAdaptations(culturalContext: AdvancedAIContext['culturalContext']): any {
    const adaptations: any = {};

    // Communication style adaptations
    switch (culturalContext.communicationStyle) {
      case 'direct':
        adaptations.pace = 1.0;
        adaptations.pause_duration = 0.5;
        break;
      case 'high-context':
        adaptations.pace = 0.8;
        adaptations.pause_duration = 0.8;
        adaptations.emphasis_reduction = 0.2;
        break;
      case 'formal':
        adaptations.stability = 0.9;
        adaptations.professional_tone = true;
        break;
    }

    // Language-specific adaptations
    const languageAdaptations = {
      'es': { warmth: 1.1, pace: 0.9 },
      'fr': { sophistication: 1.1, pace: 0.95 },
      'de': { clarity: 1.1, formality: 1.1 },
      'ja': { respect: 1.2, pace: 0.8 },
      'ar': { warmth: 1.2, formality: 1.1 }
    };

    if (languageAdaptations[culturalContext.language as keyof typeof languageAdaptations]) {
      Object.assign(adaptations, languageAdaptations[culturalContext.language as keyof typeof languageAdaptations]);
    }

    return adaptations;
  }

  private async loadUserAdaptationProfile(userId: string): Promise<any> {
    // Check cache first
    if (this.userAdaptationProfiles.has(userId)) {
      return this.userAdaptationProfiles.get(userId);
    }

    try {
      const { data: profile } = await supabase
        .from('ai_therapy_analysis')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      const adaptationProfile = profile ? {
        communicationPreferences: profile.communication_adaptations,
        therapeuticProgress: profile.predicted_outcomes,
        personalityInsights: profile.personality_profile,
        effectiveTechniques: profile.treatment_recommendations,
        voicePreferences: (profile.communication_adaptations as any)?.voice_preferences || {}
      } : this.getDefaultAdaptationProfile();

      this.userAdaptationProfiles.set(userId, adaptationProfile);
      return adaptationProfile;
    } catch (error) {
      console.error('Error loading user adaptation profile:', error);
      return this.getDefaultAdaptationProfile();
    }
  }

  private getDefaultAdaptationProfile(): any {
    return {
      communicationPreferences: {
        style: 'balanced',
        formality: 'moderate',
        directness: 'moderate'
      },
      therapeuticProgress: {
        engagement: 0.5,
        openness: 0.5,
        progress_rate: 0.5
      },
      personalityInsights: {
        primary_traits: [],
        communication_style: 'adaptive'
      },
      effectiveTechniques: [],
      voicePreferences: {
        preferred_pace: 1.0,
        warmth_level: 0.7,
        formality_level: 0.5
      }
    };
  }

  private async updateUserAdaptationProfile(
    userId: string, 
    context: AdvancedAIContext, 
    response: Omit<AITherapyResponse, 'audioConfiguration'>
  ): Promise<void> {
    try {
      const existingProfile = this.userAdaptationProfiles.get(userId) || this.getDefaultAdaptationProfile();
      
      // Update profile with new learnings
      const updatedProfile = {
        ...existingProfile,
        ...response.personalizationUpdates.learnedPreferences,
        communicationPreferences: {
          ...existingProfile.communicationPreferences,
          ...response.personalizationUpdates.adaptedCommunicationStyle
        },
        lastInteractionAnalysis: {
          timestamp: new Date().toISOString(),
          emotionalState: context.emotionalState,
          responseEffectiveness: context.realTimeMetrics.engagementLevel,
          techniquesUsed: response.therapeuticActions.techniques
        }
      };

      // Cache updated profile
      this.userAdaptationProfiles.set(userId, updatedProfile);

      // Persist to database
      await supabase
        .from('ai_therapy_analysis')
        .upsert({
          user_id: userId,
          communication_adaptations: updatedProfile.communicationPreferences,
          predicted_outcomes: updatedProfile.therapeuticProgress,
          personality_profile: updatedProfile.personalityInsights,
          treatment_recommendations: updatedProfile.effectiveTechniques,
          updated_at: new Date().toISOString()
        });

    } catch (error) {
      console.error('Error updating user adaptation profile:', error);
    }
  }

  private generateFallbackResponse(context: AdvancedAIContext): AITherapyResponse {
    return {
      textResponse: "I understand you're sharing something important with me. Can you tell me more about how you're feeling right now?",
      emotionalTone: {
        supportLevel: 'medium',
        approach: 'supportive',
        voiceModulation: {
          stability: 0.8,
          warmth: 0.7,
          pace: 0.9,
          emphasis: ['important', 'feeling']
        }
      },
      therapeuticActions: {
        techniques: ['active_listening', 'reflection'],
        interventions: ['emotional_validation'],
        followUpRecommendations: ['continue_exploration']
      },
      personalizationUpdates: {
        learnedPreferences: {},
        adaptedCommunicationStyle: {},
        progressInsights: []
      },
      audioConfiguration: {
        voiceSettings: {
          stability: 0.8,
          similarityBoost: 0.85,
          style: 0.7,
          speakerBoost: true,
          speed: 0.9
        },
        emotionalAdaptation: {
          primaryEmotion: context.emotionalState.primary,
          intensity: context.emotionalState.intensity,
          supportLevel: 'medium',
          crisisLevel: false
        },
        culturalTone: {}
      }
    };
  }

  private getTherapistSpecialization(therapistId: string): string {
    const specializations = {
      'dr-sarah-chen': 'Cognitive Behavioral Therapy',
      'dr-maya-patel': 'Mindfulness-Based Therapy',
      'dr-alex-rodriguez': 'Solution-Focused Therapy',
      'dr-jordan-kim': 'Trauma-Informed Therapy',
      'dr-taylor-morgan': 'Relationship Counseling'
    };
    return specializations[therapistId as keyof typeof specializations] || 'General Therapy';
  }

  // Memory management for conversation context
  storeConversationMemory(userId: string, sessionId: string, interaction: any): void {
    const key = `${userId}-${sessionId}`;
    if (!this.conversationMemory.has(key)) {
      this.conversationMemory.set(key, []);
    }
    
    const memory = this.conversationMemory.get(key)!;
    memory.push({
      timestamp: new Date().toISOString(),
      ...interaction
    });
    
    // Keep only last 50 interactions in memory
    if (memory.length > 50) {
      memory.shift();
    }
  }

  getConversationMemory(userId: string, sessionId: string): any[] {
    const key = `${userId}-${sessionId}`;
    return this.conversationMemory.get(key) || [];
  }

  clearConversationMemory(userId: string, sessionId?: string): void {
    if (sessionId) {
      this.conversationMemory.delete(`${userId}-${sessionId}`);
    } else {
      // Clear all memories for user
      for (const key of this.conversationMemory.keys()) {
        if (key.startsWith(`${userId}-`)) {
          this.conversationMemory.delete(key);
        }
      }
    }
  }
}

export const advancedAiTherapyService = new AdvancedAiTherapyService();
