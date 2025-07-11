import { supabase } from '@/integrations/supabase/client';

export interface TherapistFavorite {
  id: string;
  user_id: string;
  therapist_id: string;
  notes?: string;
  created_at: string;
}

export class TherapistFavoriteService {
  static async addFavorite(userId: string, therapistId: string, notes?: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('therapist_favorites')
        .insert({
          user_id: userId,
          therapist_id: therapistId,
          notes: notes || null
        });

      return !error;
    } catch (error) {
      console.error('Error adding favorite:', error);
      return false;
    }
  }

  static async removeFavorite(userId: string, therapistId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('therapist_favorites')
        .delete()
        .eq('user_id', userId)
        .eq('therapist_id', therapistId);

      return !error;
    } catch (error) {
      console.error('Error removing favorite:', error);
      return false;
    }
  }

  static async isFavorite(userId: string, therapistId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('therapist_favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('therapist_id', therapistId)
        .maybeSingle();

      return !error && !!data;
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  }

  static async getUserFavorites(userId: string): Promise<TherapistFavorite[]> {
    try {
      const { data, error } = await supabase
        .from('therapist_favorites')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      return data || [];
    } catch (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }
  }

  static async toggleFavorite(userId: string, therapistId: string): Promise<boolean> {
    try {
      const isCurrentlyFavorite = await this.isFavorite(userId, therapistId);
      
      if (isCurrentlyFavorite) {
        return await this.removeFavorite(userId, therapistId);
      } else {
        return await this.addFavorite(userId, therapistId);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return false;
    }
  }
}