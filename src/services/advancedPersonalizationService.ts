
import { supabase } from '@/integrations/supabase/client';
import { EmotionalIntelligenceService } from './emotionalIntelligenceService';

export interface PersonalizationProfile {
  userId: string;
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  therapyPreferences: {
    approach: string[];
    sessionLength: number;
    frequency: string;
    timeOfDay: string;
  };
  communicationStyle: 'direct' | 'gentle' | 'encouraging' | 'analytical';
  motivationFactors: string[];
  avoidanceTriggers: string[];
  progressPatterns: {
    bestResponseTimes: string[];
    effectiveTechniques: string[];
    challengingAreas: string[];
  };
  adaptiveRules: AdaptiveRule[];
}

export interface AdaptiveRule {
  id: string;
  condition: string;
  action: string;
  priority: number;
  effectiveness: number;
  createdAt: Date;
}

export interface PersonalizedRecommendation {
  id: string;
  type: 'session' | 'technique' | 'content' | 'timing' | 'intervention';
  title: string;
  description: string;
  reasoning: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedImpact: number;
  validUntil: Date;
  metadata: any;
}

export class AdvancedPersonalizationService {
  private static profiles = new Map<string, PersonalizationProfile>();
  private static recommendations = new Map<string, PersonalizedRecommendation[]>();

  // Initialize or update personalization profile using existing tables
  static async initializeProfile(userId: string, initialData?: Partial<PersonalizationProfile>): Promise<PersonalizationProfile> {
    try {
      // Check if profile exists in personalization_profiles
      let profile = await this.getProfile(userId);
      
      if (!profile) {
        // Create new profile with defaults
        profile = {
          userId,
          learningStyle: 'visual',
          therapyPreferences: {
            approach: ['CBT'],
            sessionLength: 30,
            frequency: 'weekly',
            timeOfDay: 'evening'
          },
          communicationStyle: 'gentle',
          motivationFactors: [],
          avoidanceTriggers: [],
          progressPatterns: {
            bestResponseTimes: [],
            effectiveTechniques: [],
            challengingAreas: []
          },
          adaptiveRules: [],
          ...initialData
        };

        // Save to personalization_profiles table
        await supabase
          .from('personalization_profiles')
          .insert({
            user_id: userId,
            learning_style: profile.learningStyle,
            therapy_preferences: profile.therapyPreferences,
            communication_style: profile.communicationStyle,
            motivation_factors: profile.motivationFactors,
            avoidance_triggers: profile.avoidanceTriggers,
            progress_patterns: profile.progressPatterns,
            adaptive_rules: profile.adaptiveRules
          });
      }

      this.profiles.set(userId, profile);
      return profile;
    } catch (error) {
      console.error('Error initializing personalization profile:', error);
      throw error;
    }
  }

  // Generate personalized recommendations using ML
  static async generatePersonalizedRecommendations(userId: string): Promise<PersonalizedRecommendation[]> {
    try {
      const profile = await this.getProfile(userId);
      if (!profile) {
        throw new Error('Profile not found');
      }

      // Get user's recent data for analysis
      const [emotionalData, sessionData, progressData] = await Promise.all([
        this.getRecentEmotionalData(userId),
        this.getRecentSessionData(userId),
        this.getProgressData(userId)
      ]);

      // Call ML recommendation service
      const { data, error } = await supabase.functions.invoke('generate-personalized-recommendations', {
        body: {
          userId,
          profile,
          emotionalData,
          sessionData,
          progressData,
          timestamp: new Date().toISOString()
        }
      });

      if (error) throw error;

      const recommendations: PersonalizedRecommendation[] = data.recommendations.map((rec: any) => ({
        id: rec.id || `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: rec.type,
        title: rec.title,
        description: rec.description,
        reasoning: rec.reasoning,
        confidence: rec.confidence,
        priority: rec.priority,
        estimatedImpact: rec.estimatedImpact,
        validUntil: new Date(rec.validUntil),
        metadata: rec.metadata || {}
      }));

      // Cache recommendations
      this.recommendations.set(userId, recommendations);

      // Store in personalized_recommendations table
      await this.storeRecommendations(userId, recommendations);

      return recommendations;
    } catch (error) {
      console.error('Error generating personalized recommendations:', error);
      return this.getFallbackRecommendations(userId);
    }
  }

  // Adaptive learning from user interactions
  static async trackUserInteraction(userId: string, interaction: {
    type: string;
    content: any;
    outcome: 'positive' | 'negative' | 'neutral';
    feedback?: string;
    timestamp: Date;
  }): Promise<void> {
    try {
      // Store interaction
      await supabase
        .from('user_interactions')
        .insert({
          user_id: userId,
          interaction_type: interaction.type,
          data: {
            content: interaction.content,
            outcome: interaction.outcome,
            feedback: interaction.feedback
          },
          timestamp: interaction.timestamp.toISOString()
        });

      // Update adaptive rules based on interaction
      await this.updateAdaptiveRules(userId, interaction);

      // Trigger profile updates if significant pattern detected
      await this.checkForPatternUpdates(userId);
    } catch (error) {
      console.error('Error tracking user interaction:', error);
    }
  }

  // Dynamic therapy approach optimization
  static async optimizeTherapyApproach(userId: string, sessionContext: any): Promise<{
    recommendedApproach: string;
    techniques: string[];
    sessionStructure: any;
    adaptations: string[];
  }> {
    try {
      const profile = await this.getProfile(userId);
      const recentEmotions = await EmotionalIntelligenceService.predictEmotionalTrajectory(userId);

      const { data, error } = await supabase.functions.invoke('optimize-therapy-approach', {
        body: {
          userId,
          profile,
          sessionContext,
          recentEmotions,
          timestamp: new Date().toISOString()
        }
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error optimizing therapy approach:', error);
      return this.getFallbackTherapyApproach();
    }
  }

  // Personalized content curation
  static async getCuratedContent(userId: string, contentType: string): Promise<any[]> {
    try {
      const profile = await this.getProfile(userId);
      
      const { data, error } = await supabase.functions.invoke('curate-personalized-content', {
        body: {
          userId,
          profile,
          contentType,
          timestamp: new Date().toISOString()
        }
      });

      if (error) throw error;
      return data.content || [];
    } catch (error) {
      console.error('Error getting curated content:', error);
      return [];
    }
  }

  // Helper methods
  private static async getProfile(userId: string): Promise<PersonalizationProfile | null> {
    try {
      if (this.profiles.has(userId)) {
        return this.profiles.get(userId)!;
      }

      // Try personalization_profiles table first
      const { data: profileData, error: profileError } = await supabase
        .from('personalization_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileData && !profileError) {
        const profile: PersonalizationProfile = {
          userId,
          learningStyle: (profileData.learning_style as 'visual' | 'auditory' | 'kinesthetic' | 'reading') || 'visual',
          therapyPreferences: (profileData.therapy_preferences as any) || {
            approach: ['CBT'],
            sessionLength: 30,
            frequency: 'weekly',
            timeOfDay: 'evening'
          },
          communicationStyle: (profileData.communication_style as 'direct' | 'gentle' | 'encouraging' | 'analytical') || 'gentle',
          motivationFactors: profileData.motivation_factors || [],
          avoidanceTriggers: profileData.avoidance_triggers || [],
          progressPatterns: (profileData.progress_patterns as any) || {
            bestResponseTimes: [],
            effectiveTechniques: [],
            challengingAreas: []
          },
          adaptiveRules: []
        };

        this.profiles.set(userId, profile);
        return profile;
      }

      // Fallback to user_preferences table
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error || !data) return null;

      // Safe type checking for session_preferences
      const sessionPrefs = data.session_preferences as any;
      
      const profile: PersonalizationProfile = {
        userId,
        learningStyle: 'visual',
        therapyPreferences: {
          approach: data.preferred_approaches || ['CBT'],
          sessionLength: sessionPrefs?.sessionLength || 30,
          frequency: sessionPrefs?.frequency || 'weekly',
          timeOfDay: sessionPrefs?.timeOfDay || 'evening'
        },
        communicationStyle: (data.communication_style as 'direct' | 'gentle' | 'encouraging' | 'analytical') || 'gentle',
        motivationFactors: [],
        avoidanceTriggers: [],
        progressPatterns: {
          bestResponseTimes: [],
          effectiveTechniques: [],
          challengingAreas: []
        },
        adaptiveRules: []
      };

      this.profiles.set(userId, profile);
      return profile;
    } catch (error) {
      console.error('Error getting profile:', error);
      return null;
    }
  }

  private static async getRecentEmotionalData(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(50);

      return data || [];
    } catch (error) {
      console.error('Error getting emotional data:', error);
      return [];
    }
  }

  private static async getRecentSessionData(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('therapy_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      return data || [];
    } catch (error) {
      console.error('Error getting session data:', error);
      return [];
    }
  }

  private static async getProgressData(userId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId);

      return { goals: data || [] };
    } catch (error) {
      console.error('Error getting progress data:', error);
      return {};
    }
  }

  private static async storeRecommendations(userId: string, recommendations: PersonalizedRecommendation[]): Promise<void> {
    try {
      const records = recommendations.map(rec => ({
        user_id: userId,
        recommendation_type: rec.type,
        title: rec.title,
        description: rec.description,
        reasoning: rec.reasoning,
        priority_score: rec.confidence,
        estimated_impact: rec.estimatedImpact
      }));

      await supabase
        .from('personalized_recommendations')
        .insert(records);
    } catch (error) {
      console.error('Error storing recommendations:', error);
    }
  }

  private static async updateAdaptiveRules(userId: string, interaction: any): Promise<void> {
    // This would implement machine learning logic to update adaptive rules
    // based on user interactions and outcomes
    console.log('Updating adaptive rules based on interaction:', interaction);
  }

  private static async checkForPatternUpdates(userId: string): Promise<void> {
    // This would analyze recent interactions to detect new patterns
    // and update the user's profile accordingly
    console.log('Checking for pattern updates for user:', userId);
  }

  private static getFallbackRecommendations(userId: string): PersonalizedRecommendation[] {
    return [
      {
        id: 'fallback_1',
        type: 'session',
        title: 'Mindfulness Session',
        description: 'A guided mindfulness session to help center your thoughts',
        reasoning: 'Mindfulness has been shown to help with general wellness',
        confidence: 0.7,
        priority: 'medium',
        estimatedImpact: 0.6,
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
        metadata: { duration: 15, technique: 'breathing' }
      }
    ];
  }

  private static getFallbackTherapyApproach(): {
    recommendedApproach: string;
    techniques: string[];
    sessionStructure: any;
    adaptations: string[];
  } {
    return {
      recommendedApproach: 'CBT',
      techniques: ['Active Listening', 'Validation'],
      sessionStructure: { warmup: 5, main: 20, closing: 5 },
      adaptations: ['gentle-tone', 'supportive-language']
    };
  }
}
