import { supabase } from '@/integrations/supabase/client';

export interface TherapistTeam {
  id: string;
  user_id: string;
  team_name: string;
  primary_therapist_id?: string;
  coordination_level: 'basic' | 'enhanced' | 'full';
  shared_notes?: string;
  team_goals: string[];
  created_at: string;
  updated_at: string;
}

export interface TherapistContextSwitch {
  id: string;
  user_id: string;
  from_therapist_id?: string;
  to_therapist_id: string;
  switch_reason?: string;
  context_data: Record<string, any>;
  session_id?: string;
  created_at: string;
}

export class MultiTherapistService {
  // Get user's therapy team
  static async getUserTherapyTeam(userId: string): Promise<TherapistTeam | null> {
    try {
      const { data, error } = await supabase
        .from('therapist_teams')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching therapy team:', error);
        return null;
      }

      return data as TherapistTeam;
    } catch (error) {
      console.error('Error in getUserTherapyTeam:', error);
      return null;
    }
  }

  // Get active therapists for a user by specialty
  static async getActiveTherapists(userId: string, specialty?: string) {
    try {
      const query = supabase.rpc('get_user_active_therapists', {
        user_id_param: userId,
        specialty_filter: specialty || null
      });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching active therapists:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getActiveTherapists:', error);
      return [];
    }
  }

  // Switch therapist context
  static async switchTherapistContext(
    userId: string,
    toTherapistId: string,
    fromTherapistId?: string,
    reason?: string,
    contextData: Record<string, any> = {}
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('therapist_context_switches')
        .insert({
          user_id: userId,
          from_therapist_id: fromTherapistId,
          to_therapist_id: toTherapistId,
          switch_reason: reason,
          context_data: contextData
        });

      return !error;
    } catch (error) {
      console.error('Error switching therapist context:', error);
      return false;
    }
  }

  // Get therapist combination recommendations
  static async getTherapistRecommendations(userId: string, neededSpecialties: string[]) {
    try {
      const { data, error } = await supabase.rpc('recommend_therapist_combinations', {
        user_id_param: userId,
        needed_specialties: neededSpecialties
      });

      if (error) {
        console.error('Error getting recommendations:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getTherapistRecommendations:', error);
      return null;
    }
  }

  // Update therapy team configuration
  static async updateTherapyTeam(
    userId: string, 
    updates: Partial<TherapistTeam>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('therapist_teams')
        .update(updates)
        .eq('user_id', userId);

      return !error;
    } catch (error) {
      console.error('Error updating therapy team:', error);
      return false;
    }
  }

  // Add therapist to user's team
  static async addTherapistToTeam(
    userId: string,
    therapistId: string,
    specialty: string,
    isPrimary: boolean = false,
    context: string = 'general'
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('therapist_selections')
        .insert({
          user_id: userId,
          therapist_id: therapistId,
          specialty_focus: specialty,
          therapy_context: context,
          is_primary: isPrimary,
          is_active: true
        });

      return !error;
    } catch (error) {
      console.error('Error adding therapist to team:', error);
      return false;
    }
  }

  // Get context switch history
  static async getContextSwitchHistory(userId: string): Promise<TherapistContextSwitch[]> {
    try {
      const { data, error } = await supabase
        .from('therapist_context_switches')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching context switch history:', error);
        return [];
      }

      return data as TherapistContextSwitch[];
    } catch (error) {
      console.error('Error in getContextSwitchHistory:', error);
      return [];
    }
  }
}

// Enhanced therapist selection service with multi-therapist support
export class EnhancedTherapistSelectionService {
  static async selectMultipleTherapists(
    userId: string,
    therapistSelections: Array<{
      therapistId: string;
      specialty: string;
      isPrimary?: boolean;
      context?: string;
      reason?: string;
    }>
  ): Promise<boolean> {
    try {
      // First deactivate all existing selections
      await supabase
        .from('therapist_selections')
        .update({ is_active: false })
        .eq('user_id', userId);

      // Insert new selections
      const selections = therapistSelections.map(selection => ({
        user_id: userId,
        therapist_id: selection.therapistId,
        specialty_focus: selection.specialty,
        therapy_context: selection.context || 'general',
        is_primary: selection.isPrimary || false,
        selection_reason: selection.reason,
        is_active: true
      }));

      const { error } = await supabase
        .from('therapist_selections')
        .insert(selections);

      return !error;
    } catch (error) {
      console.error('Error selecting multiple therapists:', error);
      return false;
    }
  }
}