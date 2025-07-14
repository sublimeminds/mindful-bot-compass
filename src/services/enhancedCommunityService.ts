import { supabase } from '@/integrations/supabase/client';
import { CommunityService } from './communityService';
import { culturalAIService } from './culturalAiService';
import { 
  CulturalContentLibraryService, 
  CulturalSupportGroupService, 
  CulturalPeerMatchingService 
} from './culturalEnhancedServices';

export interface EnhancedCommunityMetrics {
  totalMembers: number;
  culturalBackgrounds: number;
  activeLanguages: number;
  crossCulturalConnections: number;
  culturalContentEngagement: number;
  familyIntegrationRate: number;
  culturalEventsThisMonth: number;
  peerMatchingSuccessRate: number;
}

export interface CulturalCommunityInsight {
  type: 'cultural_trend' | 'engagement_pattern' | 'community_health' | 'optimization';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  actionable: boolean;
  metadata: any;
}

export interface SmartCommunityRecommendation {
  id: string;
  userId: string;
  type: 'peer_match' | 'cultural_event' | 'support_group' | 'content' | 'celebration';
  title: string;
  description: string;
  reason: string;
  culturalRelevance: number;
  priority: number;
  expiresAt?: Date;
}

export class EnhancedCommunityService extends CommunityService {
  // Enhanced Community Analytics
  static async getCommunityMetrics(): Promise<EnhancedCommunityMetrics> {
    try {
      // Get basic community metrics
      const [
        totalMembers,
        culturalProfiles,
        connections,
        contentEngagement
      ] = await Promise.all([
        this.getTotalMembers(),
        this.getCulturalDiversity(),
        this.getCrossCulturalConnections(),
        this.getCulturalContentEngagement()
      ]);

      return {
        totalMembers,
        culturalBackgrounds: culturalProfiles.uniqueBackgrounds,
        activeLanguages: culturalProfiles.activeLanguages,
        crossCulturalConnections: connections,
        culturalContentEngagement: contentEngagement,
        familyIntegrationRate: 0.68, // Mock data
        culturalEventsThisMonth: 12, // Mock data
        peerMatchingSuccessRate: 0.84 // Mock data
      };
    } catch (error) {
      console.error('Error getting community metrics:', error);
      throw error;
    }
  }

  private static async getTotalMembers(): Promise<number> {
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    return count || 0;
  }

  private static async getCulturalDiversity(): Promise<{
    uniqueBackgrounds: number;
    activeLanguages: number;
  }> {
    const { data, error } = await supabase
      .from('user_cultural_profiles')
      .select('cultural_background, primary_language');

    if (error) throw error;

    const backgrounds = new Set(data?.map(p => p.cultural_background).filter(Boolean));
    const languages = new Set(data?.map(p => p.primary_language).filter(Boolean));

    return {
      uniqueBackgrounds: backgrounds.size,
      activeLanguages: languages.size
    };
  }

  private static async getCrossCulturalConnections(): Promise<number> {
    // Mock implementation - in real app, analyze peer connections across different cultures
    return 234;
  }

  private static async getCulturalContentEngagement(): Promise<number> {
    const { data, error } = await supabase
      .from('cultural_effectiveness_tracking')
      .select('user_satisfaction')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (error) throw error;

    if (!data || data.length === 0) return 0;
    
    const avgSatisfaction = data.reduce((sum, item) => sum + (item.user_satisfaction || 0), 0) / data.length;
    return avgSatisfaction;
  }

  // AI-Powered Community Intelligence
  static async generateCommunityInsights(): Promise<CulturalCommunityInsight[]> {
    try {
      const metrics = await this.getCommunityMetrics();
      const insights: CulturalCommunityInsight[] = [];

      // Analyze community health patterns
      if (metrics.crossCulturalConnections > 200) {
        insights.push({
          type: 'community_health',
          title: 'Strong Cross-Cultural Bonding',
          description: `${metrics.crossCulturalConnections} cross-cultural connections indicate excellent community diversity and integration.`,
          impact: 'high',
          confidence: 0.92,
          actionable: true,
          metadata: { connections: metrics.crossCulturalConnections }
        });
      }

      // Cultural engagement patterns
      if (metrics.culturalContentEngagement > 0.8) {
        insights.push({
          type: 'engagement_pattern',
          title: 'High Cultural Content Engagement',
          description: 'Users are highly engaged with culturally adapted content, showing strong cultural relevance.',
          impact: 'high',
          confidence: 0.89,
          actionable: true,
          metadata: { engagement: metrics.culturalContentEngagement }
        });
      }

      // Family integration opportunities
      if (metrics.familyIntegrationRate < 0.7) {
        insights.push({
          type: 'optimization',
          title: 'Family Integration Opportunity',
          description: 'Family integration rate could be improved with targeted outreach to family-oriented cultures.',
          impact: 'medium',
          confidence: 0.76,
          actionable: true,
          metadata: { currentRate: metrics.familyIntegrationRate }
        });
      }

      return insights;
    } catch (error) {
      console.error('Error generating community insights:', error);
      return [];
    }
  }

  // Smart Community Recommendations
  static async getPersonalizedCommunityRecommendations(userId: string): Promise<SmartCommunityRecommendation[]> {
    try {
      const culturalContext = await culturalAIService.getEnhancedCulturalContext(userId);
      if (!culturalContext) return [];

      const recommendations: SmartCommunityRecommendation[] = [];

      // Recommend cultural peers
      const culturalPeers = await CulturalPeerMatchingService.findCulturalPeers(userId);
      if (culturalPeers.length > 0) {
        recommendations.push({
          id: `peer-rec-${userId}`,
          userId,
          type: 'peer_match',
          title: 'Cultural Peer Connection Available',
          description: `Found ${culturalPeers.length} highly compatible cultural peers to connect with.`,
          reason: `Based on your ${culturalContext.culturalBackground} background and shared interests`,
          culturalRelevance: 0.95,
          priority: 9
        });
      }

      // Recommend cultural support groups
      const supportGroups = await CulturalSupportGroupService.getCulturalSupportGroups(userId);
      if (supportGroups.length > 0) {
        recommendations.push({
          id: `group-rec-${userId}`,
          userId,
          type: 'support_group',
          title: 'Cultural Support Group Match',
          description: `Join a support group specifically designed for ${culturalContext.culturalBackground} community members.`,
          reason: 'Culturally adapted group therapy shows 34% better outcomes',
          culturalRelevance: 0.88,
          priority: 8
        });
      }

      // Recommend cultural content
      const culturalContent = await CulturalContentLibraryService.getRecommendedContent(userId);
      if (culturalContent.length > 0) {
        recommendations.push({
          id: `content-rec-${userId}`,
          userId,
          type: 'content',
          title: 'Personalized Cultural Content',
          description: `New therapeutic content adapted for your cultural background and language preferences.`,
          reason: `Content matches your ${culturalContext.primaryLanguage} language preference`,
          culturalRelevance: 0.82,
          priority: 7
        });
      }

      return recommendations.sort((a, b) => b.priority - a.priority);
    } catch (error) {
      console.error('Error getting personalized recommendations:', error);
      return [];
    }
  }

  // Advanced Community Matching
  static async findCulturallyCompatibleCommunities(userId: string): Promise<any[]> {
    try {
      const culturalContext = await culturalAIService.getEnhancedCulturalContext(userId);
      if (!culturalContext) return [];

      // Find communities with high cultural compatibility
      const { data: communities, error } = await supabase
        .from('support_groups')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;

      return (communities || [])
        .map(community => ({
          ...community,
          culturalCompatibility: this.calculateCommunityCompatibility(culturalContext, community),
          reasons: this.getCommunityMatchReasons(culturalContext, community)
        }))
        .filter(community => community.culturalCompatibility > 0.6)
        .sort((a, b) => b.culturalCompatibility - a.culturalCompatibility);
    } catch (error) {
      console.error('Error finding culturally compatible communities:', error);
      return [];
    }
  }

  private static calculateCommunityCompatibility(userContext: any, community: any): number {
    let score = 0.5; // Base score

    // Cultural background match (if community has cultural focus)
    if (community.category?.toLowerCase().includes(userContext.culturalBackground?.toLowerCase())) {
      score += 0.3;
    }

    // Communication style compatibility
    if (community.description?.toLowerCase().includes('family') && 
        userContext.communicationStyle?.familyInvolvement === 'high') {
      score += 0.2;
    }

    return Math.min(1.0, score);
  }

  private static getCommunityMatchReasons(userContext: any, community: any): string[] {
    const reasons: string[] = [];

    if (community.category?.toLowerCase().includes(userContext.culturalBackground?.toLowerCase())) {
      reasons.push(`Matches your ${userContext.culturalBackground} cultural background`);
    }

    if (community.description?.toLowerCase().includes('family')) {
      reasons.push('Supports family-centered approach to healing');
    }

    if (community.description?.toLowerCase().includes('language')) {
      reasons.push(`Offers support in your native language`);
    }

    return reasons;
  }

  // Community Gamification & Recognition
  static async updateCommunityPoints(userId: string, action: string, points: number): Promise<void> {
    try {
      // Update user's community points based on cultural engagement
      const pointsMultiplier = await this.getCulturalEngagementMultiplier(userId, action);
      const adjustedPoints = Math.round(points * pointsMultiplier);

      // In a real implementation, this would update a community_points table
      console.log(`Awarding ${adjustedPoints} points to user ${userId} for ${action}`);
    } catch (error) {
      console.error('Error updating community points:', error);
    }
  }

  private static async getCulturalEngagementMultiplier(userId: string, action: string): Promise<number> {
    // Give bonus points for cross-cultural interactions
    if (action.includes('cross_cultural')) {
      return 1.5;
    }

    // Give bonus points for family integration activities
    if (action.includes('family')) {
      return 1.3;
    }

    // Standard multiplier
    return 1.0;
  }

  // Real-time Community Health Monitoring
  static async monitorCommunityHealth(): Promise<{
    status: 'healthy' | 'warning' | 'critical';
    issues: string[];
    recommendations: string[];
  }> {
    try {
      const metrics = await this.getCommunityMetrics();
      const issues: string[] = [];
      const recommendations: string[] = [];

      // Check cultural diversity
      if (metrics.culturalBackgrounds < 5) {
        issues.push('Low cultural diversity in community');
        recommendations.push('Implement targeted outreach to diverse cultural communities');
      }

      // Check engagement levels
      if (metrics.culturalContentEngagement < 0.6) {
        issues.push('Low cultural content engagement');
        recommendations.push('Review and improve cultural content quality and relevance');
      }

      // Check cross-cultural connections
      if (metrics.crossCulturalConnections < 50) {
        issues.push('Limited cross-cultural interactions');
        recommendations.push('Create more cross-cultural events and matching opportunities');
      }

      const status = issues.length === 0 ? 'healthy' : 
                    issues.length <= 2 ? 'warning' : 'critical';

      return { status, issues, recommendations };
    } catch (error) {
      console.error('Error monitoring community health:', error);
      return {
        status: 'critical',
        issues: ['Unable to assess community health'],
        recommendations: ['Check system connectivity and database access']
      };
    }
  }
}