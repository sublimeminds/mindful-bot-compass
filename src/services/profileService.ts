import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  onboarding_complete?: boolean;
  created_at: string;
  updated_at: string;
}

class ProfileService {
  async getProfile(userId: string): Promise<{ data: UserProfile | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      return { data, error };
    } catch (error) {
      console.error('Error fetching profile:', error);
      return { data: null, error };
    }
  }

  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      return { error };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { error };
    }
  }

  async getUserStats(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      return { data, error };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return { data: null, error };
    }
  }

  async getUserSessions(userId: string) {
    try {
      const { data, error } = await supabase
        .from('therapy_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('start_time', { ascending: false })
        .limit(10);

      return { data, error };
    } catch (error) {
      console.error('Error fetching user sessions:', error);
      return { data: [], error };
    }
  }

  async getUserGoals(userId: string) {
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      return { data, error };
    } catch (error) {
      console.error('Error fetching user goals:', error);
      return { data: [], error };
    }
  }
}

export const profileService = new ProfileService();