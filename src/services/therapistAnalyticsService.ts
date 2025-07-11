import { supabase } from '@/integrations/supabase/client';

export interface TherapistMetrics {
  therapist_id: string;
  total_sessions: number;
  average_rating: number;
  success_rate: number;
  user_satisfaction: number;
  mood_improvement_avg: number;
  recommendation_rate: number;
  total_reviews: number;
  effectiveness_areas: string[];
  response_time_avg: number;
}

export interface TherapistReview {
  id: string;
  therapist_id: string;
  user_id: string;
  overall_rating: number;
  communication_rating: number;
  expertise_rating: number;
  empathy_rating: number;
  effectiveness_rating: number;
  review_title?: string;
  review_text?: string;
  would_recommend: boolean;
  therapy_duration_weeks?: number;
  improvement_percentage?: number;
  specific_areas_helped: string[];
  is_anonymous: boolean;
  is_verified: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
}

export interface SessionFeedback {
  id: string;
  session_id: string;
  user_id: string;
  therapist_id?: string;
  overall_rating: number;
  effectiveness_rating: number;
  comfort_rating: number;
  communication_rating: number;
  mood_before?: number;
  mood_after?: number;
  session_helpful: boolean;
  would_recommend: boolean;
  feedback_text?: string;
  improvement_suggestions?: string;
  session_date: string;
  created_at: string;
}

export class TherapistAnalyticsService {
  // Get real therapist metrics from database
  static async getTherapistMetrics(therapistId: string): Promise<TherapistMetrics | null> {
    try {
      // Get session feedback metrics
      const { data: sessionMetrics } = await supabase
        .rpc('get_therapist_session_metrics', { therapist_id: therapistId });

      // Get review metrics
      const { data: reviewMetrics } = await supabase
        .rpc('get_therapist_review_metrics', { therapist_id: therapistId });

      // Get therapy sessions count
      const { count: sessionCount } = await supabase
        .from('therapy_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('therapist_id', therapistId);

      if (!sessionMetrics && !reviewMetrics) return null;

      return {
        therapist_id: therapistId,
        total_sessions: sessionCount || 0,
        average_rating: reviewMetrics?.average_rating || 0,
        success_rate: sessionMetrics?.success_rate || 0,
        user_satisfaction: reviewMetrics?.user_satisfaction || 0,
        mood_improvement_avg: sessionMetrics?.mood_improvement_avg || 0,
        recommendation_rate: reviewMetrics?.recommendation_rate || 0,
        total_reviews: reviewMetrics?.total_reviews || 0,
        effectiveness_areas: reviewMetrics?.effectiveness_areas || [],
        response_time_avg: 1.5 // AI response time in seconds
      };
    } catch (error) {
      console.error('Error fetching therapist metrics:', error);
      return null;
    }
  }

  // Get all therapist metrics for discovery page
  static async getAllTherapistMetrics(): Promise<Record<string, TherapistMetrics>> {
    try {
      const { data: therapists } = await supabase
        .from('therapist_personalities')
        .select('id')
        .eq('is_active', true);

      if (!therapists) return {};

      const metrics: Record<string, TherapistMetrics> = {};
      
      // Get metrics for all therapists in parallel
      const promises = therapists.map(async (therapist) => {
        const metric = await this.getTherapistMetrics(therapist.id);
        if (metric) {
          metrics[therapist.id] = metric;
        }
      });

      await Promise.all(promises);
      return metrics;
    } catch (error) {
      console.error('Error fetching all therapist metrics:', error);
      return {};
    }
  }

  // Get therapist reviews
  static async getTherapistReviews(therapistId: string, limit = 10): Promise<TherapistReview[]> {
    const { data, error } = await supabase
      .from('therapist_reviews')
      .select('*')
      .eq('therapist_id', therapistId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching therapist reviews:', error);
      return [];
    }

    return data || [];
  }

  // Create session feedback
  static async createSessionFeedback(feedback: Omit<SessionFeedback, 'id' | 'created_at'>): Promise<void> {
    const { error } = await supabase
      .from('session_feedback')
      .insert([feedback]);

    if (error) {
      console.error('Error creating session feedback:', error);
      throw error;
    }
  }

  // Create therapist review
  static async createTherapistReview(review: Omit<TherapistReview, 'id' | 'created_at' | 'updated_at' | 'helpful_count'>): Promise<void> {
    const { error } = await supabase
      .from('therapist_reviews')
      .insert([review]);

    if (error) {
      console.error('Error creating therapist review:', error);
      throw error;
    }
  }

  // Mark review as helpful
  static async markReviewHelpful(reviewId: string): Promise<void> {
    const { error } = await supabase
      .rpc('increment_review_helpful_count', { review_id: reviewId });

    if (error) {
      console.error('Error marking review as helpful:', error);
      throw error;
    }
  }

  // Get user's session feedback for a therapist
  static async getUserTherapistFeedback(userId: string, therapistId: string): Promise<SessionFeedback[]> {
    const { data, error } = await supabase
      .from('session_feedback')
      .select('*')
      .eq('user_id', userId)
      .eq('therapist_id', therapistId)
      .order('session_date', { ascending: false });

    if (error) {
      console.error('Error fetching user therapist feedback:', error);
      return [];
    }

    return data || [];
  }

  // Calculate compatibility score based on user data and therapist effectiveness
  static async calculateCompatibilityScore(
    userId: string, 
    therapistId: string, 
    userPreferences?: any
  ): Promise<number> {
    try {
      // Get therapist metrics
      const metrics = await this.getTherapistMetrics(therapistId);
      if (!metrics) return 0.75; // Default score

      // Get user's therapy history and preferences
      const { data: userHistory } = await supabase
        .from('therapy_sessions')
        .select('*')
        .eq('user_id', userId)
        .limit(10);

      // Calculate base compatibility from therapist effectiveness
      let compatibilityScore = metrics.success_rate * 0.4 + 
                              (metrics.average_rating / 5) * 0.3 + 
                              (metrics.user_satisfaction / 100) * 0.3;

      // Adjust based on user history and preferences
      if (userHistory && userHistory.length > 0) {
        // Consider user's past session ratings
        const avgUserRating = userHistory.reduce((sum, session) => 
          sum + (session.user_satisfaction || 3), 0) / userHistory.length;
        
        // Adjust score based on user's typical satisfaction
        if (avgUserRating > 4) {
          compatibilityScore *= 1.1; // Boost for users who are generally satisfied
        }
      }

      // Adjust for user preferences if available
      if (userPreferences) {
        // Match communication style, specialties, etc.
        // This would be expanded based on actual preference matching logic
        compatibilityScore *= 1.05;
      }

      return Math.min(1.0, compatibilityScore);
    } catch (error) {
      console.error('Error calculating compatibility score:', error);
      return 0.75; // Default fallback score
    }
  }
}

// SQL functions to be created via migration
export const createAnalyticsFunctions = `
-- Function to get therapist session metrics
CREATE OR REPLACE FUNCTION get_therapist_session_metrics(therapist_id UUID)
RETURNS TABLE(
  success_rate NUMERIC,
  mood_improvement_avg NUMERIC,
  total_sessions BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(AVG(
      CASE 
        WHEN sf.mood_after > sf.mood_before THEN 1.0 
        ELSE 0.0 
      END
    ), 0.0) as success_rate,
    COALESCE(AVG(sf.mood_after - sf.mood_before), 0.0) as mood_improvement_avg,
    COUNT(*) as total_sessions
  FROM session_feedback sf
  WHERE sf.therapist_id = get_therapist_session_metrics.therapist_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get therapist review metrics
CREATE OR REPLACE FUNCTION get_therapist_review_metrics(therapist_id UUID)
RETURNS TABLE(
  average_rating NUMERIC,
  user_satisfaction NUMERIC,
  recommendation_rate NUMERIC,
  total_reviews BIGINT,
  effectiveness_areas TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(AVG(tr.overall_rating), 0.0) as average_rating,
    COALESCE(AVG((tr.overall_rating + tr.communication_rating + tr.expertise_rating + tr.empathy_rating + tr.effectiveness_rating) / 5.0), 0.0) as user_satisfaction,
    COALESCE(AVG(CASE WHEN tr.would_recommend THEN 1.0 ELSE 0.0 END), 0.0) as recommendation_rate,
    COUNT(*) as total_reviews,
    ARRAY_AGG(DISTINCT unnest(tr.specific_areas_helped)) as effectiveness_areas
  FROM therapist_reviews tr
  WHERE tr.therapist_id = get_therapist_review_metrics.therapist_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment review helpful count
CREATE OR REPLACE FUNCTION increment_review_helpful_count(review_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE therapist_reviews SET helpful_count = helpful_count + 1 WHERE id = review_id;
END;
$$ LANGUAGE plpgsql;
`;