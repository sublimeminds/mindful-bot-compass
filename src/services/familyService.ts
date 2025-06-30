
import { supabase } from '@/integrations/supabase/client';

export interface Household {
  id: string;
  name: string;
  primary_account_holder_id: string;
  plan_type: string;
  max_members: number;
  current_members: number;
  created_at: string;
  updated_at: string;
}

export interface HouseholdMember {
  id: string;
  household_id: string;
  user_id: string;
  member_type: 'primary' | 'adult' | 'teen' | 'child';
  relationship?: string;
  age?: number;
  permission_level: 'full' | 'limited' | 'basic' | 'view_only';
  can_view_progress: boolean;
  can_view_mood_data: boolean;
  can_receive_alerts: boolean;
  invitation_status: 'pending' | 'active' | 'inactive';
  invited_email?: string;
  invited_at?: string;
  joined_at?: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    name: string;
    email: string;
    avatar_url?: string;
  };
}

export interface FamilyInvitation {
  id: string;
  household_id: string;
  invited_by_id: string;
  invited_email: string;
  member_type: 'adult' | 'teen' | 'child';
  relationship?: string;
  age?: number;
  permission_level: 'full' | 'limited' | 'basic' | 'view_only';
  invitation_token: string;
  expires_at: string;
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface FamilyAlert {
  id: string;
  household_id: string;
  member_user_id: string;
  alert_type: 'mood_decline' | 'crisis_risk' | 'concerning_pattern' | 'missed_sessions';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  alert_data: Record<string, any>;
  is_acknowledged: boolean;
  acknowledged_by?: string;
  acknowledged_at?: string;
  created_at: string;
  member_profile?: {
    name: string;
    email: string;
  };
}

export const familyService = {
  async getUserHousehold(): Promise<Household | null> {
    const { data, error } = await supabase
      .from('households')
      .select('*')
      .single();

    if (error) {
      console.error('Error fetching household:', error);
      return null;
    }

    return data;
  },

  async getHouseholdMembers(householdId: string): Promise<HouseholdMember[]> {
    const { data, error } = await supabase
      .from('household_members')
      .select('*')
      .eq('household_id', householdId)
      .order('created_at');

    if (error) {
      console.error('Error fetching household members:', error);
      return [];
    }

    // Get profile data separately to avoid relation issues
    const memberIds = data?.map(member => member.user_id) || [];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, name, email, avatar_url')
      .in('id', memberIds);

    return (data || []).map(member => ({
      ...member,
      member_type: member.member_type as 'primary' | 'adult' | 'teen' | 'child',
      permission_level: member.permission_level as 'full' | 'limited' | 'basic' | 'view_only',
      invitation_status: member.invitation_status as 'pending' | 'active' | 'inactive',
      profiles: profiles?.find(p => p.id === member.user_id) ? {
        name: profiles.find(p => p.id === member.user_id)!.name,
        email: profiles.find(p => p.id === member.user_id)!.email,
        avatar_url: profiles.find(p => p.id === member.user_id)?.avatar_url
      } : undefined
    }));
  },

  async inviteFamilyMember(invitation: {
    household_id: string;
    invited_email: string;
    member_type: 'adult' | 'teen' | 'child';
    relationship?: string;
    age?: number;
    permission_level: 'full' | 'limited' | 'basic' | 'view_only';
  }): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Generate invitation token
      const { data: tokenData, error: tokenError } = await supabase
        .rpc('generate_invitation_token');

      if (tokenError) throw tokenError;

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days to accept

      const { error } = await supabase
        .from('family_invitations')
        .insert({
          ...invitation,
          invited_by_id: user.id,
          invitation_token: tokenData,
          expires_at: expiresAt.toISOString(),
        });

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error sending invitation:', error);
      return false;
    }
  },

  async getFamilyAlerts(householdId: string): Promise<FamilyAlert[]> {
    const { data, error } = await supabase
      .from('family_alerts')
      .select('*')
      .eq('household_id', householdId)
      .eq('is_acknowledged', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching family alerts:', error);
      return [];
    }

    // Get profile data separately for members
    const memberIds = data?.map(alert => alert.member_user_id) || [];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, name, email')
      .in('id', memberIds);

    return (data || []).map(alert => ({
      ...alert,
      alert_type: alert.alert_type as 'mood_decline' | 'crisis_risk' | 'concerning_pattern' | 'missed_sessions',
      severity: alert.severity as 'low' | 'medium' | 'high' | 'critical',
      alert_data: (alert.alert_data as any) || {},
      member_profile: profiles?.find(p => p.id === alert.member_user_id) ? {
        name: profiles.find(p => p.id === alert.member_user_id)!.name,
        email: profiles.find(p => p.id === alert.member_user_id)!.email
      } : undefined
    }));
  },

  async acknowledgeAlert(alertId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('family_alerts')
        .update({
          is_acknowledged: true,
          acknowledged_by: user.id,
          acknowledged_at: new Date().toISOString()
        })
        .eq('id', alertId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      return false;
    }
  },

  async updateMemberPermissions(memberId: string, permissions: {
    can_view_progress?: boolean;
    can_view_mood_data?: boolean;
    can_receive_alerts?: boolean;
    permission_level?: 'full' | 'limited' | 'basic' | 'view_only';
  }): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('household_members')
        .update(permissions)
        .eq('id', memberId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating member permissions:', error);
      return false;
    }
  },

  async removeFamilyMember(memberId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('household_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error removing family member:', error);
      return false;
    }
  },

  async upgradeToFamilyPlan(planId: string): Promise<boolean> {
    try {
      const household = await this.getUserHousehold();
      if (!household) throw new Error('No household found');

      const { error } = await supabase
        .from('households')
        .update({ plan_type: planId })
        .eq('id', household.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error upgrading to family plan:', error);
      return false;
    }
  }
};
