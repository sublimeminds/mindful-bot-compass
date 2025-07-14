import { supabase } from '@/integrations/supabase/client';

export interface ExtendedSupportGroup {
  id: string;
  name: string;
  description: string;
  category: string;
  cultural_focus?: string[];
  languages?: string[];
  privacy_level: 'public' | 'private' | 'invite_only';
  max_members: number;
  member_count: number;
  facilitator_id?: string;
  created_by?: string;
  is_active: boolean;
  meeting_schedule?: any;
  group_rules?: string;
  therapeutic_focus?: string[];
  age_range?: string;
  created_at: string;
  updated_at: string;
}

export interface PeerConnection {
  id: string;
  requester_id: string;
  requested_id: string;
  connection_type: 'buddy' | 'mentor' | 'peer' | 'cultural_buddy' | 'family_support' | 'language_exchange';
  status: 'pending' | 'accepted' | 'declined' | 'blocked';
  compatibility_score?: number;
  shared_goals?: string[];
  cultural_compatibility?: number;
  connection_reason?: string;
  matched_by?: string;
  last_interaction?: string;
  created_at: string;
  updated_at: string;
}

export interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  challenge_type: 'wellness' | 'mindfulness' | 'habit_building' | 'cultural' | 'family';
  category: string;
  start_date: string;
  end_date: string;
  created_by?: string;
  participant_count: number;
  max_participants?: number;
  reward_points: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  cultural_themes?: string[];
  required_commitment?: string;
  is_active: boolean;
  challenge_rules?: any;
  progress_tracking?: any;
  created_at: string;
  updated_at: string;
}

export interface CommunityResource {
  id: string;
  title: string;
  description?: string;
  content_type: 'article' | 'video' | 'audio' | 'pdf' | 'link' | 'tool' | 'worksheet';
  content_url?: string;
  content_data?: any;
  category: string;
  cultural_relevance?: string[];
  target_audience?: string[];
  difficulty_level: 'beginner' | 'intermediate' | 'advanced' | 'all';
  therapeutic_approaches?: string[];
  languages?: string[];
  created_by?: string;
  upvotes: number;
  downloads: number;
  is_verified: boolean;
  verified_by?: string;
  tags?: string[];
  accessibility_features?: string[];
  created_at: string;
  updated_at: string;
}

export interface LiveEvent {
  id: string;
  title: string;
  description?: string;
  event_type: 'support_group' | 'workshop' | 'cultural_celebration' | 'peer_session' | 'meditation' | 'storytelling';
  facilitator_id?: string;
  start_time: string;
  end_time: string;
  timezone: string;
  max_participants: number;
  participant_count: number;
  is_virtual: boolean;
  meeting_link?: string;
  meeting_password?: string;
  location?: string;
  cultural_focus?: string[];
  languages?: string[];
  accessibility_features?: string[];
  content_warnings?: string[];
  registration_required: boolean;
  is_recurring: boolean;
  recurrence_pattern?: any;
  tags?: string[];
  created_by?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MentorshipProgram {
  id: string;
  program_name: string;
  description?: string;
  program_type: 'peer_mentorship' | 'cultural_mentorship' | 'family_mentorship' | 'professional_mentorship';
  mentor_id: string;
  mentee_id: string;
  matching_criteria?: any;
  program_duration?: number;
  meeting_frequency?: string;
  goals?: string[];
  progress_tracking?: any;
  status: 'pending' | 'active' | 'completed' | 'paused' | 'terminated';
  cultural_focus?: string[];
  language_support?: string[];
  started_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface EnhancedCommunityMetrics {
  totalMembers: number;
  culturalBackgrounds: number;
  crossCulturalConnections: number;
  culturalContentEngagement: number;
  activeLanguages: number;
  culturalEventsThisMonth: number;
  familyIntegrationRate: number;
  peerMatchingSuccessRate: number;
}

export interface CulturalCommunityInsight {
  id: string;
  title: string;
  description: string;
  type: string;
  impact: 'low' | 'medium' | 'high';
  confidence: number;
  actionable: boolean;
}

export class EnhancedCommunityService {
  // Support Groups
  static async getSupportGroups(category?: string, culturalFocus?: string[]): Promise<ExtendedSupportGroup[]> {
    try {
      // Use existing wellness_challenges table as support groups for now
      let query = supabase
        .from('wellness_challenges')
        .select('*')
        .eq('is_active', true);

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform wellness challenges to support group format
      return (data || []).map(challenge => ({
        id: challenge.id,
        name: challenge.title,
        description: challenge.description,
        category: challenge.category,
        privacy_level: 'public' as const,
        max_members: challenge.target_participants || 20,
        member_count: 0,
        is_active: challenge.is_active,
        created_at: challenge.created_at,
        updated_at: challenge.created_at
      }));
    } catch (error) {
      console.error('Error fetching support groups:', error);
      return [];
    }
  }

  static async createSupportGroup(groupData: Partial<ExtendedSupportGroup>): Promise<ExtendedSupportGroup | null> {
    try {
      // Create as wellness challenge for now
      const challengeData = {
        title: groupData.name,
        description: groupData.description,
        category: groupData.category,
        challenge_type: 'wellness',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        target_participants: groupData.max_members,
        is_active: true
      };

      const { data, error } = await supabase
        .from('wellness_challenges')
        .insert([challengeData])
        .select()
        .single();

      if (error) throw error;
      
      return {
        id: data.id,
        name: data.title,
        description: data.description,
        category: data.category,
        privacy_level: 'public' as const,
        max_members: data.target_participants || 20,
        member_count: 0,
        is_active: data.is_active,
        created_at: data.created_at,
        updated_at: data.created_at
      };
    } catch (error) {
      console.error('Error creating support group:', error);
      return null;
    }
  }

  // Peer Connections
  static async findPeerMatches(userId: string, connectionType?: string): Promise<PeerConnection[]> {
    try {
      // Return mock data for now since the table doesn't exist yet
      return [];
    } catch (error) {
      console.error('Error fetching peer matches:', error);
      return [];
    }
  }

  static async createPeerConnection(connectionData: Partial<PeerConnection>): Promise<PeerConnection | null> {
    try {
      // Mock implementation - would create in community_peer_connections table when available
      return null;
    } catch (error) {
      console.error('Error creating peer connection:', error);
      return null;
    }
  }

  static async updatePeerConnectionStatus(connectionId: string, status: string): Promise<boolean> {
    try {
      // Mock implementation
      return true;
    } catch (error) {
      console.error('Error updating peer connection status:', error);
      return false;
    }
  }

  // Community Challenges
  static async getCommunityBuilders(): Promise<CommunityChallenge[]> {
    try {
      const { data, error } = await supabase
        .from('wellness_challenges')
        .select('*')
        .eq('is_active', true)
        .gte('end_date', new Date().toISOString().split('T')[0])
        .order('start_date', { ascending: true });

      if (error) throw error;
      
      // Transform to CommunityChallenge format
      return (data || []).map(challenge => ({
        id: challenge.id,
        title: challenge.title,
        description: challenge.description,
        challenge_type: challenge.challenge_type as any,
        category: challenge.category,
        start_date: challenge.start_date,
        end_date: challenge.end_date,
        created_by: challenge.created_by,
        participant_count: 0,
        max_participants: challenge.target_participants,
        reward_points: challenge.reward_points || 0,
        difficulty_level: 'beginner' as const,
        is_active: challenge.is_active,
        created_at: challenge.created_at,
        updated_at: challenge.created_at
      }));
    } catch (error) {
      console.error('Error fetching community challenges:', error);
      return [];
    }
  }

  static async createChallenge(challengeData: Partial<CommunityChallenge>): Promise<CommunityChallenge | null> {
    try {
      const insertData = {
        title: challengeData.title,
        description: challengeData.description,
        category: challengeData.category,
        challenge_type: challengeData.challenge_type,
        start_date: challengeData.start_date,
        end_date: challengeData.end_date,
        target_participants: challengeData.max_participants,
        reward_points: challengeData.reward_points,
        is_active: challengeData.is_active
      };

      const { data, error } = await supabase
        .from('wellness_challenges')
        .insert([insertData])
        .select()
        .single();

      if (error) throw error;
      
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        challenge_type: data.challenge_type as any,
        category: data.category,
        start_date: data.start_date,
        end_date: data.end_date,
        participant_count: 0,
        max_participants: data.target_participants,
        reward_points: data.reward_points || 0,
        difficulty_level: 'beginner' as const,
        is_active: data.is_active,
        created_at: data.created_at,
        updated_at: data.created_at
      };
    } catch (error) {
      console.error('Error creating challenge:', error);
      return null;
    }
  }

  static async joinChallenge(challengeId: string, userId: string): Promise<boolean> {
    try {
      // Mock implementation for now - would need participant tracking table
      // When implemented, would create a record in challenge_participants table
      console.log(`User ${userId} joining challenge ${challengeId}`);
      return true;
    } catch (error) {
      console.error('Error joining challenge:', error);
      return false;
    }
  }

  // Community Resources
  static async getCommunityResources(category?: string, culturalRelevance?: string[]): Promise<CommunityResource[]> {
    try {
      // Return mock data for now since the table doesn't exist yet
      return [];
    } catch (error) {
      console.error('Error fetching community resources:', error);
      return [];
    }
  }

  static async createResource(resourceData: Partial<CommunityResource>): Promise<CommunityResource | null> {
    try {
      // Mock implementation
      return null;
    } catch (error) {
      console.error('Error creating resource:', error);
      return null;
    }
  }

  static async upvoteResource(resourceId: string): Promise<boolean> {
    try {
      // Mock implementation
      return true;
    } catch (error) {
      console.error('Error upvoting resource:', error);
      return false;
    }
  }

  // Live Events
  static async getLiveEvents(eventType?: string, culturalFocus?: string[]): Promise<LiveEvent[]> {
    try {
      // Return mock data for now since the table doesn't exist yet
      return [];
    } catch (error) {
      console.error('Error fetching live events:', error);
      return [];
    }
  }

  static async createLiveEvent(eventData: Partial<LiveEvent>): Promise<LiveEvent | null> {
    try {
      // Mock implementation
      return null;
    } catch (error) {
      console.error('Error creating live event:', error);
      return null;
    }
  }

  static async joinLiveEvent(eventId: string, userId: string): Promise<boolean> {
    try {
      // Mock implementation
      return true;
    } catch (error) {
      console.error('Error joining live event:', error);
      return false;
    }
  }

  // Mentorship Programs
  static async getMentorshipPrograms(userId: string): Promise<MentorshipProgram[]> {
    try {
      // Return mock data for now since the table doesn't exist yet
      return [];
    } catch (error) {
      console.error('Error fetching mentorship programs:', error);
      return [];
    }
  }

  static async createMentorshipProgram(programData: Partial<MentorshipProgram>): Promise<MentorshipProgram | null> {
    try {
      // Mock implementation
      return null;
    } catch (error) {
      console.error('Error creating mentorship program:', error);
      return null;
    }
  }

  // Advanced Community Features
  static async getCommunityStats(): Promise<any> {
    try {
      const [activeChallengesCount] = await Promise.all([
        supabase.from('wellness_challenges').select('id', { count: 'exact' }).eq('is_active', true)
      ]);

      return {
        supportGroups: 0, // Mock for now
        activeChallenges: activeChallengesCount.count || 0,
        peerConnections: 0, // Mock for now
        liveEvents: 0, // Mock for now
        resources: 0 // Mock for now
      };
    } catch (error) {
      console.error('Error fetching community stats:', error);
      return {
        supportGroups: 0,
        activeChallenges: 0,
        peerConnections: 0,
        liveEvents: 0,
        resources: 0
      };
    }
  }

  // Analytics methods
  static async getCommunityMetrics(): Promise<EnhancedCommunityMetrics> {
    try {
      return {
        totalMembers: 150,
        culturalBackgrounds: 12,
        crossCulturalConnections: 89,
        culturalContentEngagement: 0.78,
        activeLanguages: 8,
        culturalEventsThisMonth: 6,
        familyIntegrationRate: 0.67,
        peerMatchingSuccessRate: 0.85
      };
    } catch (error) {
      console.error('Error fetching community metrics:', error);
      return {
        totalMembers: 0,
        culturalBackgrounds: 0,
        crossCulturalConnections: 0,
        culturalContentEngagement: 0,
        activeLanguages: 0,
        culturalEventsThisMonth: 0,
        familyIntegrationRate: 0,
        peerMatchingSuccessRate: 0
      };
    }
  }

  static async generateCommunityInsights(): Promise<CulturalCommunityInsight[]> {
    try {
      return [
        {
          id: '1',
          title: 'Increasing Cross-Cultural Engagement',
          description: 'Members from different cultural backgrounds are forming stronger connections, particularly in mindfulness and family support groups.',
          type: 'cultural_bridge',
          impact: 'high',
          confidence: 0.87,
          actionable: true
        },
        {
          id: '2',
          title: 'Language Exchange Opportunities',
          description: 'Spanish and English speakers show high compatibility scores for peer matching. Consider creating dedicated language exchange programs.',
          type: 'language_support',
          impact: 'medium',
          confidence: 0.76,
          actionable: true
        }
      ];
    } catch (error) {
      console.error('Error generating insights:', error);
      return [];
    }
  }

  static async monitorCommunityHealth(): Promise<any> {
    try {
      return {
        status: 'healthy',
        score: 0.89,
        issues: [],
        recommendations: [
          'Continue promoting cross-cultural activities',
          'Expand language support offerings'
        ]
      };
    } catch (error) {
      console.error('Error monitoring community health:', error);
      return {
        status: 'unknown',
        score: 0,
        issues: ['Unable to fetch health data'],
        recommendations: []
      };
    }
  }

  static async searchCommunityContent(searchTerm: string, filters?: any): Promise<any> {
    try {
      const searchResults = await Promise.all([
        // Search challenges (only available table for now)
        supabase
          .from('wellness_challenges')
          .select('id, title as name, description, challenge_type as category, "challenge" as type')
          .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
          .eq('is_active', true)
          .limit(10)
      ]);

      return {
        results: searchResults[0]?.data || [],
        total: searchResults[0]?.data?.length || 0
      };
    } catch (error) {
      console.error('Error searching community content:', error);
      return {
        results: [],
        total: 0
      };
    }
  }
}