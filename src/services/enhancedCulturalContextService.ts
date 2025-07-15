import { supabase } from '@/integrations/supabase/client';
import { CulturalContext } from './culturallyAwareAiService';

type FamilyStructureType = 'individual' | 'family-centered' | 'community-based' | 'collective';
type CommunicationStyleType = 'direct' | 'indirect' | 'high-context' | 'low-context';

export interface UserCulturalProfile {
  userId: string;
  primaryLanguage: string;
  culturalBackground: string;
  familyStructure: FamilyStructureType;
  communicationStyle: CommunicationStyleType;
  religiousConsiderations: boolean;
  religiousDetails?: string;
  therapyApproachPreferences: string[];
  culturalSensitivities: string[];
  createdAt?: string;
  updatedAt?: string;
}

export class EnhancedCulturalContextService {
  static async saveCulturalProfile(profile: UserCulturalProfile): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('user_cultural_profiles')
        .upsert({
          user_id: profile.userId,
          primary_language: profile.primaryLanguage,
          cultural_background: profile.culturalBackground,
          family_structure: profile.familyStructure,
          communication_style: profile.communicationStyle,
          religious_considerations: profile.religiousConsiderations,
          religious_details: profile.religiousDetails,
          therapy_approach_preferences: profile.therapyApproachPreferences,
          cultural_sensitivities: profile.culturalSensitivities,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id',
          ignoreDuplicates: false
        });

      if (error) {
        console.error('Error saving cultural profile:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in saveCulturalProfile:', error);
      return { success: false, error: 'Failed to save cultural profile' };
    }
  }

  static async getCulturalProfile(userId: string): Promise<UserCulturalProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_cultural_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        return null;
      }

      return {
        userId: data.user_id,
        primaryLanguage: data.primary_language || 'en',
        culturalBackground: data.cultural_background || '',
        familyStructure: data.family_structure as FamilyStructureType || 'individual',
        communicationStyle: data.communication_style as CommunicationStyleType || 'direct',
        religiousConsiderations: data.religious_considerations || false,
        religiousDetails: data.religious_details,
        therapyApproachPreferences: data.therapy_approach_preferences || [],
        culturalSensitivities: data.cultural_sensitivities || [],
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error('Error fetching cultural profile:', error);
      return null;
    }
  }

  static async getCulturalContextForAI(userId: string): Promise<CulturalContext> {
    const profile = await this.getCulturalProfile(userId);
    
    if (!profile) {
      // Default context for users without cultural profile
      return {
        language: 'en',
        region: 'US',
        familyStructure: 'individual',
        communicationStyle: 'direct'
      };
    }

    return {
      language: profile.primaryLanguage,
      region: this.inferRegionFromCulture(profile.culturalBackground),
      culturalBackground: profile.culturalBackground,
      religiousBeliefs: profile.religiousDetails,
      familyStructure: profile.familyStructure === 'family-centered' || profile.familyStructure === 'community-based' 
        ? 'collective' 
        : profile.familyStructure,
      communicationStyle: profile.communicationStyle
    };
  }

  static async updateTherapyPreferences(
    userId: string, 
    preferences: string[]
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('user_cultural_profiles')
        .update({
          therapy_approach_preferences: preferences,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating therapy preferences:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in updateTherapyPreferences:', error);
      return { success: false, error: 'Failed to update therapy preferences' };
    }
  }

  static async getCulturalRecommendations(userId: string): Promise<any[]> {
    const profile = await this.getCulturalProfile(userId);
    
    if (!profile) return [];

    const recommendations = [];

    // Language-based recommendations
    if (profile.primaryLanguage !== 'en') {
      recommendations.push({
        type: 'language',
        title: 'Multi-language Support',
        description: `Experience therapy in your native language: ${this.getLanguageName(profile.primaryLanguage)}`,
        action: 'Enable multi-language AI responses',
        priority: 'high'
      });
    }

    // Family structure recommendations
    if (profile.familyStructure === 'family-centered' || profile.familyStructure === 'collective') {
      recommendations.push({
        type: 'therapy-approach',
        title: 'Family-Inclusive Therapy',
        description: 'Therapy approaches that consider family and community support systems',
        action: 'Explore family-centered therapy techniques',
        priority: 'medium'
      });
    }

    // Communication style recommendations
    if (profile.communicationStyle === 'indirect' || profile.communicationStyle === 'high-context') {
      recommendations.push({
        type: 'communication',
        title: 'Culturally-Adapted Communication',
        description: 'AI responses adapted for indirect and context-sensitive communication',
        action: 'Enable cultural communication adaptation',
        priority: 'medium'
      });
    }

    // Religious considerations
    if (profile.religiousConsiderations && profile.religiousDetails) {
      recommendations.push({
        type: 'spiritual',
        title: 'Spiritually-Integrated Therapy',
        description: `Therapy approaches that respect and incorporate ${profile.religiousDetails} values`,
        action: 'Enable spiritual therapy integration',
        priority: 'medium'
      });
    }

    return recommendations;
  }

  private static inferRegionFromCulture(culturalBackground: string): string {
    const regionMap: Record<string, string> = {
      'western': 'US',
      'east-asian': 'CN',
      'south-asian': 'IN',
      'middle-eastern': 'SA',
      'african': 'NG',
      'latin-american': 'MX',
      'indigenous': 'US'
    };

    return regionMap[culturalBackground] || 'US';
  }

  private static getLanguageName(code: string): string {
    const languageNames: Record<string, string> = {
      'en': 'English',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'ar': 'Arabic',
      'zh': 'Chinese',
      'ja': 'Japanese',
      'ko': 'Korean',
      'hi': 'Hindi',
      'pt': 'Portuguese',
      'it': 'Italian',
      'nl': 'Dutch',
      'ru': 'Russian',
      'sv': 'Swedish',
      'no': 'Norwegian',
      'da': 'Danish',
      'pl': 'Polish'
    };

    return languageNames[code] || code.toUpperCase();
  }

  static async trackCulturalInteraction(
    userId: string,
    interactionType: string,
    culturalContext: any
  ): Promise<void> {
    try {
      await supabase
        .from('cultural_interactions')
        .insert({
          user_id: userId,
          interaction_type: interactionType,
          cultural_context: culturalContext,
          timestamp: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error tracking cultural interaction:', error);
    }
  }
}
