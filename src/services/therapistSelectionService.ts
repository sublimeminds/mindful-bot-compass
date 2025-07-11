import { supabase } from '@/integrations/supabase/client';

export interface TherapistSelection {
  id: string;
  user_id: string;
  therapist_id: string;
  assessment_id?: string;
  selection_reason?: string;
  is_active: boolean;
  selected_at: string;
  created_at: string;
}

export class TherapistSelectionService {
  static async selectTherapist(
    userId: string, 
    therapistId: string, 
    assessmentId?: string,
    selectionReason?: string
  ): Promise<string | null> {
    try {
      // First, mark any previous selections as inactive
      await (supabase as any)
        .from('therapist_selections')
        .update({ is_active: false })
        .eq('user_id', userId);

      // Create new active selection
      const { data, error } = await (supabase as any)
        .from('therapist_selections')
        .insert({
          user_id: userId,
          therapist_id: therapistId,
          assessment_id: assessmentId || null,
          selection_reason: selectionReason || null,
          is_active: true
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error selecting therapist:', error);
        return null;
      }

      return data?.id || null;
    } catch (error) {
      console.error('Error in selectTherapist:', error);
      return null;
    }
  }

  static async getCurrentSelection(userId: string): Promise<TherapistSelection | null> {
    try {
      const { data, error } = await (supabase as any)
        .from('therapist_selections')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('selected_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching current selection:', error);
        return null;
      }

      return data as TherapistSelection;
    } catch (error) {
      console.error('Error in getCurrentSelection:', error);
      return null;
    }
  }

  static async getSelectionHistory(userId: string): Promise<TherapistSelection[]> {
    try {
      const { data, error } = await (supabase as any)
        .from('therapist_selections')
        .select('*')
        .eq('user_id', userId)
        .order('selected_at', { ascending: false });

      if (error) {
        console.error('Error fetching selection history:', error);
        return [];
      }

      return (data as TherapistSelection[]) || [];
    } catch (error) {
      console.error('Error in getSelectionHistory:', error);
      return [];
    }
  }

  static async updateSelectionReason(selectionId: string, reason: string): Promise<boolean> {
    try {
      const { error } = await (supabase as any)
        .from('therapist_selections')
        .update({ selection_reason: reason })
        .eq('id', selectionId);

      return !error;
    } catch (error) {
      console.error('Error updating selection reason:', error);
      return false;
    }
  }

  static async deactivateSelection(userId: string, therapistId: string): Promise<boolean> {
    try {
      const { error } = await (supabase as any)
        .from('therapist_selections')
        .update({ is_active: false })
        .eq('user_id', userId)
        .eq('therapist_id', therapistId);

      return !error;
    } catch (error) {
      console.error('Error deactivating selection:', error);
      return false;
    }
  }
}