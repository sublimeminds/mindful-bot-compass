
import { supabase } from '@/integrations/supabase/client';

export interface SupportGroup {
  id: string;
  name: string;
  description: string;
  category: string;
  group_type: 'open' | 'closed' | 'moderated';
  max_members: number;
  current_members: number;
  moderator_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GroupMembership {
  id: string;
  user_id: string;
  group_id: string;
  role: 'member' | 'moderator' | 'admin';
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
  reply_count: number;
  like_count: number;
  created_at: string;
  updated_at: string;
}

export interface DiscussionReply {
  id: string;
  discussion_id: string;
  author_id: string;
  content: string;
  is_anonymous: boolean;
  like_count: number;
  created_at: string;
  updated_at: string;
}

export interface PeerConnection {
  id: string;
  requester_id: string;
  requested_id: string;
  status: 'pending' | 'accepted' | 'declined' | 'blocked';
  connection_type: 'support' | 'accountability' | 'friendship';
  created_at: string;
  updated_at: string;
}

export interface SharedMilestone {
  id: string;
  user_id: string;
  milestone_type: 'goal_completed' | 'streak_achieved' | 'therapy_milestone';
  title: string;
  description: string;
  is_public: boolean;
  celebration_count: number;
  support_count: number;
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
      const { data, error } = await supabase
        .from('support_groups')
        .insert({
          ...groupData,
          moderator_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating support group:', error);
      return null;
    }
  }

  static async joinGroup(groupId: string): Promise<boolean> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return false;

      const { error } = await supabase
        .from('group_memberships')
        .insert({
          user_id: user.user.id,
          group_id: groupId,
          role: 'member'
        });

      if (error) throw error;

      // Update group member count
      await supabase.rpc('increment_group_members', { group_id: groupId });

      return true;
    } catch (error) {
      console.error('Error joining group:', error);
      return false;
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
      return data?.map(item => item.support_groups).filter(Boolean) || [];
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
          ...discussionData,
          author_id: user.user.id
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
          ...replyData,
          author_id: user.user.id
        })
        .select()
        .single();

      if (error) throw error;

      // Update reply count
      await supabase.rpc('increment_discussion_replies', { 
        discussion_id: replyData.discussion_id 
      });

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
          ...milestoneData,
          user_id: user.user.id
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
      const { error } = await supabase.rpc('increment_milestone_celebration', { 
        milestone_id: milestoneId 
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error celebrating milestone:', error);
      return false;
    }
  }
}
