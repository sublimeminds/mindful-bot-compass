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

export class EnhancedCommunityService {
  // Support Groups
  static async getSupportGroups(category?: string, culturalFocus?: string[]): Promise<ExtendedSupportGroup[]> {
    try {
      let query = supabase
        .from('wellness_challenges')
        .select('*')
        .eq('is_active', true);

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching support groups:', error);
      return [];
    }
  }

  static async createSupportGroup(groupData: Partial<ExtendedSupportGroup>): Promise<ExtendedSupportGroup | null> {
    try {
      const { data, error } = await supabase
        .from('community_support_groups')
        .insert([groupData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating support group:', error);
      return null;
    }
  }

  // Peer Connections
  static async findPeerMatches(userId: string, connectionType?: string): Promise<PeerConnection[]> {
    try {
      let query = supabase
        .from('community_peer_connections')
        .select('*')
        .or(`requester_id.eq.${userId},requested_id.eq.${userId}`)
        .eq('status', 'accepted');

      if (connectionType) {
        query = query.eq('connection_type', connectionType);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching peer matches:', error);
      return [];
    }
  }

  static async createPeerConnection(connectionData: Partial<PeerConnection>): Promise<PeerConnection | null> {
    try {
      const { data, error } = await supabase
        .from('community_peer_connections')
        .insert([connectionData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating peer connection:', error);
      return null;
    }
  }

  static async updatePeerConnectionStatus(connectionId: string, status: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('community_peer_connections')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', connectionId);

      if (error) throw error;
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
      return data || [];
    } catch (error) {
      console.error('Error fetching community challenges:', error);
      return [];
    }
  }

  static async createChallenge(challengeData: Partial<CommunityChallenge>): Promise<CommunityChallenge | null> {
    try {
      const { data, error } = await supabase
        .from('wellness_challenges')
        .insert([challengeData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating challenge:', error);
      return null;
    }
  }

  static async joinChallenge(challengeId: string, userId: string): Promise<boolean> {
    try {
      // First increment participant count
      const { error: updateError } = await supabase
        .from('wellness_challenges')
        .update({ 
          participant_count: supabase.rpc('increment_participant_count', { challenge_id: challengeId })
        })
        .eq('id', challengeId);

      if (updateError) throw updateError;

      // Add participation record (would need a separate table for this)
      return true;
    } catch (error) {
      console.error('Error joining challenge:', error);
      return false;
    }
  }

  // Community Resources
  static async getCommunityResources(category?: string, culturalRelevance?: string[]): Promise<CommunityResource[]> {
    try {
      let query = supabase
        .from('community_resource_library')
        .select('*')
        .eq('is_verified', true);

      if (category) {
        query = query.eq('category', category);
      }

      if (culturalRelevance && culturalRelevance.length > 0) {
        query = query.overlaps('cultural_relevance', culturalRelevance);
      }

      const { data, error } = await query.order('upvotes', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching community resources:', error);
      return [];
    }
  }

  static async createResource(resourceData: Partial<CommunityResource>): Promise<CommunityResource | null> {
    try {
      const { data, error } = await supabase
        .from('community_resource_library')
        .insert([resourceData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating resource:', error);
      return null;
    }
  }

  static async upvoteResource(resourceId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('community_resource_library')
        .update({ 
          upvotes: supabase.rpc('increment_upvotes', { resource_id: resourceId })
        })
        .eq('id', resourceId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error upvoting resource:', error);
      return false;
    }
  }

  // Live Events
  static async getLiveEvents(eventType?: string, culturalFocus?: string[]): Promise<LiveEvent[]> {
    try {
      let query = supabase
        .from('community_live_events')
        .select('*')
        .eq('is_active', true)
        .gte('start_time', new Date().toISOString());

      if (eventType) {
        query = query.eq('event_type', eventType);
      }

      if (culturalFocus && culturalFocus.length > 0) {
        query = query.overlaps('cultural_focus', culturalFocus);
      }

      const { data, error } = await query.order('start_time', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching live events:', error);
      return [];
    }
  }

  static async createLiveEvent(eventData: Partial<LiveEvent>): Promise<LiveEvent | null> {
    try {
      const { data, error } = await supabase
        .from('community_live_events')
        .insert([eventData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating live event:', error);
      return null;
    }
  }

  static async joinLiveEvent(eventId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('community_live_events')
        .update({ 
          participant_count: supabase.rpc('increment_participant_count', { event_id: eventId })
        })
        .eq('id', eventId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error joining live event:', error);
      return false;
    }
  }

  // Mentorship Programs
  static async getMentorshipPrograms(userId: string): Promise<MentorshipProgram[]> {
    try {
      const { data, error } = await supabase
        .from('community_mentorship_programs')
        .select('*')
        .or(`mentor_id.eq.${userId},mentee_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching mentorship programs:', error);
      return [];
    }
  }

  static async createMentorshipProgram(programData: Partial<MentorshipProgram>): Promise<MentorshipProgram | null> {
    try {
      const { data, error } = await supabase
        .from('community_mentorship_programs')
        .insert([programData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating mentorship program:', error);
      return null;
    }
  }

  // Advanced Community Features
  static async getCommunityStats(): Promise<any> {
    try {
      const [
        supportGroupsCount,
        activeChallengesCount,
        totalPeerConnections,
        liveEventsCount,
        resourcesCount
      ] = await Promise.all([
        supabase.from('community_support_groups').select('id', { count: 'exact' }).eq('is_active', true),
        supabase.from('wellness_challenges').select('id', { count: 'exact' }).eq('is_active', true),
        supabase.from('community_peer_connections').select('id', { count: 'exact' }).eq('status', 'accepted'),
        supabase.from('community_live_events').select('id', { count: 'exact' }).eq('is_active', true),
        supabase.from('community_resource_library').select('id', { count: 'exact' }).eq('is_verified', true)
      ]);

      return {
        supportGroups: supportGroupsCount.count || 0,
        activeChallenges: activeChallengesCount.count || 0,
        peerConnections: totalPeerConnections.count || 0,
        liveEvents: liveEventsCount.count || 0,
        resources: resourcesCount.count || 0
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

  static async searchCommunityContent(searchTerm: string, filters?: any): Promise<any> {
    try {
      const searchResults = await Promise.all([
        // Search support groups
        supabase
          .from('community_support_groups')
          .select('id, name, description, category, "support_group" as type')
          .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
          .eq('is_active', true)
          .limit(5),
        
        // Search challenges
        supabase
          .from('wellness_challenges')
          .select('id, title as name, description, challenge_type as category, "challenge" as type')
          .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
          .eq('is_active', true)
          .limit(5),
        
        // Search resources
        supabase
          .from('community_resource_library')
          .select('id, title as name, description, category, "resource" as type')
          .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
          .eq('is_verified', true)
          .limit(5),
        
        // Search events
        supabase
          .from('community_live_events')
          .select('id, title as name, description, event_type as category, "event" as type')
          .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
          .eq('is_active', true)
          .limit(5)
      ]);

      const allResults = searchResults.reduce((acc, result) => {
        if (result.data) {
          acc.push(...result.data);
        }
        return acc;
      }, []);

      return allResults;
    } catch (error) {
      console.error('Error searching community content:', error);
      return [];
    }
  }
}