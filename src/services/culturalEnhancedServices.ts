import { supabase } from '@/integrations/supabase/client';
import { culturalAIService } from './culturalAiService';

export interface CulturalContent {
  id: string;
  title: string;
  contentType: 'exercise' | 'technique' | 'story' | 'metaphor' | 'meditation';
  culturalBackgrounds: string[];
  languages: string[];
  content: {
    description: string;
    instructions?: string[];
    duration?: number;
    materials?: string[];
    adaptations?: { [culture: string]: string[] };
    examples?: string[];
    audioUrl?: string;
    videoUrl?: string;
  };
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  targetAudience: string[];
  therapyApproaches: string[];
  effectivenessScore: number;
  usageCount: number;
  isActive: boolean;
}

export interface CulturalSupportGroup {
  id: string;
  name: string;
  description: string;
  culturalBackgrounds: string[];
  languages: string[];
  groupType: 'peer_support' | 'family_therapy' | 'cultural_celebration';
  maxMembers: number;
  currentMembers: number;
  facilitatorId: string;
  meetingSchedule: {
    frequency: string;
    day: string;
    time: string;
    timezone: string;
    platform: string;
  };
  isActive: boolean;
}

export interface FamilyIntegrationProfile {
  id: string;
  userId: string;
  familyInvolvementLevel: 'minimal' | 'moderate' | 'high';
  familyMembers: {
    name: string;
    relationship: string;
    age?: number;
    culturalRole: string;
    contactInfo?: string;
    involvementLevel: 'observer' | 'participant' | 'decision_maker';
  }[];
  culturalFamilyRoles: {
    decisionMaker: string[];
    caregivers: string[];
    elders: string[];
    supporters: string[];
  };
  familyTherapyConsent: boolean;
  emergencyFamilyContact: string;
  culturalDecisionMaking: 'individual' | 'consultative' | 'collective';
}

export interface CulturalPeerMatch {
  id: string;
  userId: string;
  matchedUserId: string;
  matchScore: number;
  matchCriteria: {
    culturalBackground: boolean;
    language: boolean;
    therapyGoals: boolean;
    communicationStyle: boolean;
    location: boolean;
  };
  matchType: 'cultural_support' | 'language_exchange' | 'therapy_buddy';
  status: 'pending' | 'accepted' | 'declined' | 'active';
}

export class CulturalContentLibraryService {
  // Cultural Content Management
  static async getCulturalContent(filters: {
    culturalBackground?: string;
    language?: string;
    contentType?: string;
    difficultyLevel?: string;
    therapyApproach?: string;
  } = {}): Promise<CulturalContent[]> {
    let query = supabase
      .from('cultural_content_library')
      .select('*')
      .eq('is_active', true);

    if (filters.culturalBackground) {
      query = query.contains('cultural_backgrounds', [filters.culturalBackground]);
    }
    if (filters.language) {
      query = query.contains('languages', [filters.language]);
    }
    if (filters.contentType) {
      query = query.eq('content_type', filters.contentType);
    }
    if (filters.difficultyLevel) {
      query = query.eq('difficulty_level', filters.difficultyLevel);
    }
    if (filters.therapyApproach) {
      query = query.contains('therapy_approaches', [filters.therapyApproach]);
    }

    const { data, error } = await query.order('effectiveness_score', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(item => ({
      id: item.id,
      title: item.title,
      contentType: item.content_type as CulturalContent['contentType'],
      culturalBackgrounds: item.cultural_backgrounds,
      languages: item.languages,
      content: item.content as CulturalContent['content'],
      difficultyLevel: item.difficulty_level as CulturalContent['difficultyLevel'],
      targetAudience: item.target_audience,
      therapyApproaches: item.therapy_approaches,
      effectivenessScore: item.effectiveness_score,
      usageCount: item.usage_count,
      isActive: item.is_active
    }));
  }

  static async getRecommendedContent(userId: string): Promise<CulturalContent[]> {
    try {
      // Get user's cultural context
      const culturalContext = await culturalAIService.getEnhancedCulturalContext(userId);
      
      if (!culturalContext) {
        return this.getCulturalContent({ difficultyLevel: 'beginner' });
      }

      // Get culturally relevant content
      const content = await this.getCulturalContent({
        culturalBackground: culturalContext.culturalBackground,
        language: culturalContext.primaryLanguage
      });

      // Sort by cultural relevance and effectiveness
      return content.sort((a, b) => {
        const aScore = this.calculateRelevanceScore(a, culturalContext);
        const bScore = this.calculateRelevanceScore(b, culturalContext);
        return bScore - aScore;
      }).slice(0, 10);
    } catch (error) {
      console.error('Error getting recommended content:', error);
      return [];
    }
  }

  private static calculateRelevanceScore(content: CulturalContent, culturalContext: any): number {
    let score = content.effectivenessScore;
    
    // Boost for exact cultural match
    if (content.culturalBackgrounds.includes(culturalContext.culturalBackground)) {
      score += 2;
    }
    
    // Boost for language match
    if (content.languages.includes(culturalContext.primaryLanguage)) {
      score += 1;
    }
    
    // Boost for therapy approach match
    if (culturalContext.recommendedTechniques?.some((tech: any) => 
      content.therapyApproaches.includes(tech.name))) {
      score += 1.5;
    }
    
    return score;
  }

  static async trackContentUsage(contentId: string, userId: string, effectiveness: number): Promise<void> {
    try {
      // Update usage count - simple approach for now
      const { data: currentContent } = await supabase
        .from('cultural_content_library')
        .select('usage_count')
        .eq('id', contentId)
        .single();
      
      if (currentContent) {
        await supabase
          .from('cultural_content_library')
          .update({ usage_count: currentContent.usage_count + 1 })
          .eq('id', contentId);
      }
      
      // Track effectiveness
      await supabase
        .from('cultural_effectiveness_tracking')
        .insert([{
          user_id: userId,
          content_id: contentId,
          cultural_sensitivity_score: effectiveness,
          user_satisfaction: effectiveness,
          cultural_relevance: effectiveness,
          adaptation_success: effectiveness
        }]);
    } catch (error) {
      console.error('Error tracking content usage:', error);
    }
  }
}

export class CulturalSupportGroupService {
  // Support Group Management
  static async getCulturalSupportGroups(userId: string): Promise<CulturalSupportGroup[]> {
    try {
      // Get user's cultural profile to find relevant groups
      const culturalContext = await culturalAIService.getEnhancedCulturalContext(userId);
      
      let query = supabase
        .from('cultural_support_groups')
        .select('*')
        .eq('is_active', true);

      if (culturalContext?.culturalBackground) {
        query = query.contains('cultural_backgrounds', [culturalContext.culturalBackground]);
      }

      const { data, error } = await query.order('current_members', { ascending: false });
      
      if (error) throw error;
      return (data || []).map(group => ({
        id: group.id,
        name: group.name,
        description: group.description,
        culturalBackgrounds: group.cultural_backgrounds,
        languages: group.languages,
        groupType: group.group_type as CulturalSupportGroup['groupType'],
        maxMembers: group.max_members,
        currentMembers: group.current_members,
        facilitatorId: group.facilitator_id,
        meetingSchedule: group.meeting_schedule as CulturalSupportGroup['meetingSchedule'],
        isActive: group.is_active
      }));
    } catch (error) {
      console.error('Error getting cultural support groups:', error);
      return [];
    }
  }

  static async joinSupportGroup(groupId: string, userId: string): Promise<boolean> {
    try {
      // Calculate cultural compatibility
      const culturalContext = await culturalAIService.getEnhancedCulturalContext(userId);
      const compatibilityScore = await this.calculateGroupCompatibility(groupId, culturalContext);

      const { error } = await supabase
        .from('cultural_group_memberships')
        .insert([{
          group_id: groupId,
          user_id: userId,
          cultural_compatibility_score: compatibilityScore
        }]);

      if (error) throw error;
      
      // Update group member count - simple approach
      const { data: currentGroup } = await supabase
        .from('cultural_support_groups')
        .select('current_members')
        .eq('id', groupId)
        .single();
      
      if (currentGroup) {
        await supabase
          .from('cultural_support_groups')
          .update({ current_members: currentGroup.current_members + 1 })
          .eq('id', groupId);
      }

      return true;
    } catch (error) {
      console.error('Error joining support group:', error);
      return false;
    }
  }

  private static async calculateGroupCompatibility(groupId: string, culturalContext: any): Promise<number> {
    if (!culturalContext) return 0.5;
    
    const { data: group } = await supabase
      .from('cultural_support_groups')
      .select('*')
      .eq('id', groupId)
      .single();

    if (!group) return 0;

    let score = 0.5; // Base score
    
    // Cultural background match
    if (group.cultural_backgrounds.includes(culturalContext.culturalBackground)) {
      score += 0.3;
    }
    
    // Language match
    if (group.languages.includes(culturalContext.primaryLanguage)) {
      score += 0.2;
    }
    
    return Math.min(1.0, score);
  }
}

export class FamilyIntegrationService {
  // Family Integration Management
  static async getFamilyProfile(userId: string): Promise<FamilyIntegrationProfile | null> {
    try {
      const { data, error } = await supabase
        .from('family_integration_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return {
        id: data.id,
        userId: data.user_id,
        familyInvolvementLevel: data.family_involvement_level as FamilyIntegrationProfile['familyInvolvementLevel'],
        familyMembers: data.family_members as FamilyIntegrationProfile['familyMembers'],
        culturalFamilyRoles: data.cultural_family_roles as FamilyIntegrationProfile['culturalFamilyRoles'],
        familyTherapyConsent: data.family_therapy_consent,
        emergencyFamilyContact: data.emergency_family_contact,
        culturalDecisionMaking: data.cultural_decision_making as FamilyIntegrationProfile['culturalDecisionMaking']
      };
    } catch (error) {
      console.error('Error getting family profile:', error);
      return null;
    }
  }

  static async createFamilyProfile(profile: Omit<FamilyIntegrationProfile, 'id'>): Promise<FamilyIntegrationProfile | null> {
    try {
      const { data, error } = await supabase
        .from('family_integration_profiles')
        .insert([{
          user_id: profile.userId,
          family_involvement_level: profile.familyInvolvementLevel,
          family_members: profile.familyMembers,
          cultural_family_roles: profile.culturalFamilyRoles,
          family_therapy_consent: profile.familyTherapyConsent,
          emergency_family_contact: profile.emergencyFamilyContact,
          cultural_decision_making: profile.culturalDecisionMaking
        }])
        .select()
        .single();

      if (error) throw error;
      
      return {
        id: data.id,
        userId: data.user_id,
        familyInvolvementLevel: data.family_involvement_level as FamilyIntegrationProfile['familyInvolvementLevel'],
        familyMembers: data.family_members as FamilyIntegrationProfile['familyMembers'],
        culturalFamilyRoles: data.cultural_family_roles as FamilyIntegrationProfile['culturalFamilyRoles'],
        familyTherapyConsent: data.family_therapy_consent,
        emergencyFamilyContact: data.emergency_family_contact,
        culturalDecisionMaking: data.cultural_decision_making as FamilyIntegrationProfile['culturalDecisionMaking']
      };
    } catch (error) {
      console.error('Error creating family profile:', error);
      return null;
    }
  }

  static async getFamilyTherapyRecommendations(userId: string): Promise<any[]> {
    const familyProfile = await this.getFamilyProfile(userId);
    const culturalContext = await culturalAIService.getEnhancedCulturalContext(userId);
    
    if (!familyProfile || !culturalContext) return [];

    const recommendations = [];

    // Family involvement recommendations
    if (familyProfile.familyInvolvementLevel === 'high' && culturalContext.communicationStyle.familyInvolvement === 'collective') {
      recommendations.push({
        type: 'family_session',
        title: 'Family Therapy Session',
        description: 'Include family members in your next therapy session',
        priority: 'high',
        culturalRationale: 'Your cultural background emphasizes family involvement in healing'
      });
    }

    // Cultural decision-making support
    if (familyProfile.culturalDecisionMaking === 'collective') {
      recommendations.push({
        type: 'family_consultation',
        title: 'Family Decision-Making Support',
        description: 'Tools to help your family make therapy decisions together',
        priority: 'medium',
        culturalRationale: 'Supports your cultural approach to collective decision-making'
      });
    }

    return recommendations;
  }
}

export class CulturalPeerMatchingService {
  // Peer Matching for Cultural Support
  static async findCulturalPeers(userId: string): Promise<CulturalPeerMatch[]> {
    try {
      const culturalContext = await culturalAIService.getEnhancedCulturalContext(userId);
      if (!culturalContext) return [];

      // Find users with similar cultural backgrounds
      const { data: potentialMatches, error } = await supabase
        .from('user_cultural_profiles')
        .select('user_id, cultural_background, primary_language, communication_style')
        .neq('user_id', userId);

      if (error) throw error;

      const matches: CulturalPeerMatch[] = [];
      
      for (const match of potentialMatches || []) {
        const score = this.calculateMatchScore(culturalContext, match);
        
        if (score >= 0.6) { // Minimum match threshold
          matches.push({
            id: `match-${userId}-${match.user_id}`,
            userId,
            matchedUserId: match.user_id,
            matchScore: score,
            matchCriteria: {
              culturalBackground: culturalContext.culturalBackground === match.cultural_background,
              language: culturalContext.primaryLanguage === match.primary_language,
              therapyGoals: true, // Would need to compare actual goals
              communicationStyle: culturalContext.communicationStyle === match.communication_style,
              location: false // Would need location data
            },
            matchType: 'cultural_support',
            status: 'pending'
          });
        }
      }

      return matches.sort((a, b) => b.matchScore - a.matchScore).slice(0, 5);
    } catch (error) {
      console.error('Error finding cultural peers:', error);
      return [];
    }
  }

  private static calculateMatchScore(userContext: any, potentialMatch: any): number {
    let score = 0;
    
    // Cultural background (40% weight)
    if (userContext.culturalBackground === potentialMatch.cultural_background) {
      score += 0.4;
    }
    
    // Language (30% weight)
    if (userContext.primaryLanguage === potentialMatch.primary_language) {
      score += 0.3;
    }
    
    // Communication style (20% weight)
    if (userContext.communicationStyle === potentialMatch.communication_style) {
      score += 0.2;
    }
    
    // Base compatibility (10% weight)
    score += 0.1;
    
    return score;
  }

  static async createPeerMatch(userId: string, matchedUserId: string, matchType: CulturalPeerMatch['matchType']): Promise<boolean> {
    try {
      const culturalContext = await culturalAIService.getEnhancedCulturalContext(userId);
      const { data: matchContext } = await supabase
        .from('user_cultural_profiles')
        .select('*')
        .eq('user_id', matchedUserId)
        .single();

      const matchScore = this.calculateMatchScore(culturalContext, matchContext);

      const { error } = await supabase
        .from('cultural_peer_matches')
        .insert([{
          user_id: userId,
          matched_user_id: matchedUserId,
          match_score: matchScore,
          match_criteria: {
            culturalBackground: culturalContext?.culturalBackground === matchContext?.cultural_background,
            language: culturalContext?.primaryLanguage === matchContext?.primary_language,
            therapyGoals: true,
            communicationStyle: culturalContext?.communicationStyle === matchContext?.communication_style,
            location: false
          },
          match_type: matchType
        }]);

      return !error;
    } catch (error) {
      console.error('Error creating peer match:', error);
      return false;
    }
  }
}

// Cultural Bias Detection Service
export class CulturalBiasDetectionService {
  static async detectBias(content: string, culturalContext: any): Promise<{
    biasScore: number;
    indicators: string[];
    suggestions: string[];
  }> {
    const biasScore = culturalAIService.validateCulturalSensitivity(content, culturalContext);
    
    const indicators = this.identifyBiasIndicators(content, culturalContext);
    const suggestions = this.generateImprovementSuggestions(content, indicators, culturalContext);

    // Log for review if bias score is concerning
    if (biasScore < 60) {
      await this.logBiasDetection(content, culturalContext, biasScore, indicators);
    }

    return {
      biasScore,
      indicators,
      suggestions
    };
  }

  private static identifyBiasIndicators(content: string, culturalContext: any): string[] {
    const indicators: string[] = [];
    
    // Check for cultural stereotypes
    const stereotypes = this.getCulturalStereotypes(culturalContext?.culturalBackground);
    stereotypes.forEach(stereotype => {
      if (content.toLowerCase().includes(stereotype.toLowerCase())) {
        indicators.push(`Potential stereotype: "${stereotype}"`);
      }
    });

    // Check for insensitive language
    const insensitiveTerms = this.getInsensitiveTerms(culturalContext?.culturalBackground);
    insensitiveTerms.forEach(term => {
      if (content.toLowerCase().includes(term.toLowerCase())) {
        indicators.push(`Insensitive language: "${term}"`);
      }
    });

    return indicators;
  }

  private static generateImprovementSuggestions(content: string, indicators: string[], culturalContext: any): string[] {
    const suggestions: string[] = [];
    
    if (indicators.length > 0) {
      suggestions.push('Consider using more culturally sensitive language');
      suggestions.push(`Incorporate ${culturalContext?.culturalBackground || 'cultural'} perspectives`);
      suggestions.push('Avoid generalizations about cultural groups');
    }
    
    return suggestions;
  }

  private static async logBiasDetection(content: string, culturalContext: any, biasScore: number, indicators: string[]): Promise<void> {
    try {
      await supabase
        .from('cultural_bias_detection')
        .insert([{
          content_type: 'ai_response',
          content_text: content,
          cultural_context: culturalContext,
          bias_score: biasScore,
          bias_indicators: indicators,
          flagged_phrases: indicators.map(i => i.split(': ')[1]).filter(Boolean),
          corrective_actions: this.generateImprovementSuggestions(content, indicators, culturalContext)
        }]);
    } catch (error) {
      console.error('Error logging bias detection:', error);
    }
  }

  private static getCulturalStereotypes(culturalBackground: string): string[] {
    const stereotypes: { [key: string]: string[] } = {
      'asian': ['model minority', 'tiger parent', 'martial arts', 'math genius'],
      'hispanic': ['lazy', 'illegal', 'hot-tempered', 'large family'],
      'african': ['aggressive', 'athletic', 'musical', 'single parent'],
      'middle_eastern': ['terrorist', 'oppressive', 'violent', 'strict religion']
    };
    
    return stereotypes[culturalBackground] || [];
  }

  private static getInsensitiveTerms(culturalBackground: string): string[] {
    const terms: { [key: string]: string[] } = {
      'asian': ['oriental', 'yellow', 'chinaman', 'exotic'],
      'hispanic': ['illegal alien', 'wetback', 'spic', 'beaner'],
      'african': ['colored', 'negro', 'primitive', 'ghetto'],
      'middle_eastern': ['terrorist', 'sand person', 'raghead', 'camel jockey']
    };
    
    return terms[culturalBackground] || [];
  }
}