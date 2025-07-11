
import { supabase } from '@/integrations/supabase/client';

export interface SupportGroup {
  id: string;
  name: string;
  description: string | null;
  category: string;
  group_type: string;
  max_members: number | null;
  current_members: number | null;
  moderator_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CommunityPost {
  id: string;
  author_id: string;
  title: string;
  content: string;
  post_type: string;
  category: string;
  is_anonymous: boolean;
  is_pinned: boolean;
  tags: string[];
  like_count: number;
  comment_count: number;
  view_count: number;
  created_at: string;
  updated_at: string;
  author_name?: string;
  author_avatar?: string;
  user_has_liked?: boolean;
}

export interface PostInteraction {
  id: string;
  post_id: string;
  user_id: string;
  interaction_type: string;
  comment_text?: string;
  created_at: string;
  author_name?: string;
}

export interface CommunityEvent {
  id: string;
  organizer_id: string;
  title: string;
  description: string;
  event_type: string;
  category: string;
  start_time: string;
  end_time: string;
  max_participants?: number;
  is_virtual: boolean;
  meeting_link?: string;
  location?: string;
  tags: string[];
  participant_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  organizer_name?: string;
  user_is_registered?: boolean;
}

export interface PeerConnection {
  id: string;
  requester_id: string;
  requested_id: string;
  connection_type: string;
  status: string;
  compatibility_score?: number;
  shared_goals?: string[];
  communication_frequency?: string;
  connection_notes?: string;
  created_at: string;
  updated_at: string;
  peer_name?: string;
  peer_avatar?: string;
}

export interface CommunityMilestone {
  id: string;
  user_id: string;
  milestone_type: string;
  title: string;
  description: string;
  achievement_date: string;
  points_earned: number;
  is_shared: boolean;
  celebration_count: number;
  support_count: number;
  milestone_data: any;
  created_at: string;
  user_name?: string;
  user_avatar?: string;
}

export interface WellnessChallenge {
  id: string;
  title: string;
  description: string;
  challenge_type: string;
  category: string;
  start_date: string;
  end_date: string;
  target_participants?: number;
  reward_points: number;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  participant_count?: number;
  user_participation?: any;
}

export interface GroupMembership {
  id: string;
  user_id: string;
  group_id: string;
  role: string;
  joined_at: string;
  is_active: boolean;
}

export interface GroupDiscussion {
  id: string;
  group_id: string;
  author_id: string;
  title: string;
  content: string;
  is_anonymous: boolean;
  is_pinned: boolean;
  reply_count: number | null;
  like_count: number | null;
  created_at: string;
  updated_at: string;
}

export interface DiscussionReply {
  id: string;
  discussion_id: string;
  author_id: string;
  content: string;
  is_anonymous: boolean;
  like_count: number | null;
  created_at: string;
  updated_at: string;
}

// Duplicate interface removed - using the one defined above

export interface SharedMilestone {
  id: string;
  user_id: string;
  milestone_type: string;
  title: string;
  description: string | null;
  is_public: boolean;
  celebration_count: number | null;
  support_count: number | null;
  created_at: string;
}

export class CommunityService {
  // Support Groups
  static async getSupportGroups(): Promise<SupportGroup[]> {
    try {
      const { data, error } = await supabase
        .from('support_groups')
        .select('*')
        .eq('is_active', true)
        .order('current_members', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching support groups:', error);
      return [];
    }
  }

  static async createSupportGroup(groupData: Partial<SupportGroup>): Promise<SupportGroup | null> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return null;

      // Create the group
      const { data: group, error: groupError } = await supabase
        .from('support_groups')
        .insert({
          name: groupData.name || '',
          description: groupData.description,
          category: groupData.category || '',
          group_type: groupData.group_type || 'open',
          max_members: groupData.max_members || 50,
          moderator_id: user.user.id,
          current_members: 1 // Creator is the first member
        })
        .select()
        .single();

      if (groupError) throw groupError;

      // Automatically add the creator as a member with moderator role
      const { error: membershipError } = await supabase
        .from('group_memberships')
        .insert({
          user_id: user.user.id,
          group_id: group.id,
          role: 'moderator'
        });

      if (membershipError) {
        console.error('Error adding creator as member:', membershipError);
        // Don't fail the whole operation, just log the error
      }

      return group;
    } catch (error) {
      console.error('Error creating support group:', error);
      return null;
    }
  }

  static async joinGroup(groupId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return { success: false, error: 'User not authenticated' };

      // Check if user is already a member
      const { data: existingMembership } = await supabase
        .from('group_memberships')
        .select('id')
        .eq('user_id', user.user.id)
        .eq('group_id', groupId)
        .eq('is_active', true)
        .single();

      if (existingMembership) {
        return { success: false, error: 'You are already a member of this group' };
      }

      // Check group capacity
      const { data: group } = await supabase
        .from('support_groups')
        .select('current_members, max_members')
        .eq('id', groupId)
        .single();

      if (group?.max_members && group.current_members >= group.max_members) {
        return { success: false, error: 'This group has reached its maximum capacity' };
      }

      // Add user to group
      const { error: membershipError } = await supabase
        .from('group_memberships')
        .insert({
          user_id: user.user.id,
          group_id: groupId,
          role: 'member'
        });

      if (membershipError) throw membershipError;

      // Update group member count
      const { error: updateError } = await supabase
        .from('support_groups')
        .update({ 
          current_members: (group?.current_members || 0) + 1 
        })
        .eq('id', groupId);

      if (updateError) {
        console.error('Error updating member count:', updateError);
        // Don't fail the operation for this
      }

      return { success: true };
    } catch (error) {
      console.error('Error joining group:', error);
      return { success: false, error: 'Failed to join group. Please try again.' };
    }
  }

  static async getUserGroups(userId: string): Promise<SupportGroup[]> {
    try {
      const { data, error } = await supabase
        .from('group_memberships')
        .select(`
          support_groups (*)
        `)
        .eq('user_id', userId)
        .eq('is_active', true);

      if (error) throw error;
      return data?.map((item: any) => item.support_groups).filter(Boolean) || [];
    } catch (error) {
      console.error('Error fetching user groups:', error);
      return [];
    }
  }

  // Discussions
  static async getGroupDiscussions(groupId: string): Promise<GroupDiscussion[]> {
    try {
      const { data, error } = await supabase
        .from('group_discussions')
        .select('*')
        .eq('group_id', groupId)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching group discussions:', error);
      return [];
    }
  }

  static async createDiscussion(discussionData: Partial<GroupDiscussion>): Promise<GroupDiscussion | null> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return null;

      const { data, error } = await supabase
        .from('group_discussions')
        .insert({
          group_id: discussionData.group_id || '',
          title: discussionData.title || '',
          content: discussionData.content || '',
          author_id: user.user.id,
          is_anonymous: discussionData.is_anonymous || false
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating discussion:', error);
      return null;
    }
  }

  static async getDiscussionReplies(discussionId: string): Promise<DiscussionReply[]> {
    try {
      const { data, error } = await supabase
        .from('discussion_replies')
        .select('*')
        .eq('discussion_id', discussionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching discussion replies:', error);
      return [];
    }
  }

  static async createReply(replyData: Partial<DiscussionReply>): Promise<DiscussionReply | null> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return null;

      const { data, error } = await supabase
        .from('discussion_replies')
        .insert({
          discussion_id: replyData.discussion_id || '',
          content: replyData.content || '',
          author_id: user.user.id,
          is_anonymous: replyData.is_anonymous || false
        })
        .select()
        .single();

      if (error) throw error;

      // Update reply count manually
      const { data: discussion } = await supabase
        .from('group_discussions')
        .select('reply_count')
        .eq('id', replyData.discussion_id)
        .single();

      if (discussion) {
        await supabase
          .from('group_discussions')
          .update({ reply_count: (discussion.reply_count || 0) + 1 })
          .eq('id', replyData.discussion_id);
      }

      return data;
    } catch (error) {
      console.error('Error creating reply:', error);
      return null;
    }
  }

  // Peer Connections
  static async sendConnectionRequest(userId: string, connectionType: string): Promise<boolean> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return false;

      const { error } = await supabase
        .from('peer_connections')
        .insert({
          requester_id: user.user.id,
          requested_id: userId,
          connection_type: connectionType,
          status: 'pending'
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error sending connection request:', error);
      return false;
    }
  }

  static async respondToConnectionRequest(connectionId: string, response: 'accepted' | 'declined'): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('peer_connections')
        .update({ status: response })
        .eq('id', connectionId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error responding to connection request:', error);
      return false;
    }
  }

  static async getUserConnections(userId: string): Promise<PeerConnection[]> {
    try {
      const { data, error } = await supabase
        .from('peer_connections')
        .select('*')
        .or(`requester_id.eq.${userId},requested_id.eq.${userId}`)
        .eq('status', 'accepted');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user connections:', error);
      return [];
    }
  }

  // Shared Milestones
  static async getPublicMilestones(): Promise<SharedMilestone[]> {
    try {
      const { data, error } = await supabase
        .from('shared_milestones')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching public milestones:', error);
      return [];
    }
  }

  static async shareMilestone(milestoneData: Partial<SharedMilestone>): Promise<SharedMilestone | null> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return null;

      const { data, error } = await supabase
        .from('shared_milestones')
        .insert({
          user_id: user.user.id,
          milestone_type: milestoneData.milestone_type || 'goal_completed',
          title: milestoneData.title || '',
          description: milestoneData.description,
          is_public: milestoneData.is_public !== false
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error sharing milestone:', error);
      return null;
    }
  }

  static async celebrateMilestone(milestoneId: string): Promise<boolean> {
    try {
      // Update celebration count manually
      const { data: milestone } = await supabase
        .from('shared_milestones')
        .select('celebration_count')
        .eq('id', milestoneId)
        .single();

      if (milestone) {
        const { error } = await supabase
          .from('shared_milestones')
          .update({ celebration_count: (milestone.celebration_count || 0) + 1 })
          .eq('id', milestoneId);

        if (error) throw error;
      }

      return true;
    } catch (error) {
      console.error('Error celebrating milestone:', error);
      return false;
    }
  }
}
