
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  userId: string;
  communicationStyle: 'supportive' | 'direct' | 'analytical' | 'encouraging';
  preferredApproaches: string[];
  sessionPreferences: {
    preferredTime: string;
    sessionLength: number;
    frequency: string;
  };
  emotionalPatterns: {
    dominantEmotions: string[];
    triggerWords: string[];
    positiveIndicators: string[];
  };
}

interface PersonalizedRecommendation {
  type: 'session' | 'technique' | 'content' | 'timing';
  title: string;
  description: string;
  reasoning: string;
  priority: 'high' | 'medium' | 'low';
  estimatedImpact: number;
}

export class PersonalizationService {
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      if (!data) return null;

      return {
        userId,
        communicationStyle: data.communication_style || 'supportive',
        preferredApproaches: data.preferred_approaches || [],
        sessionPreferences: data.session_preferences || {
          preferredTime: 'evening',
          sessionLength: 30,
          frequency: 'daily'
        },
        emotionalPatterns: data.emotional_patterns || {
          dominantEmotions: [],
          triggerWords: [],
          positiveIndicators: []
        }
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  static async updateUserProfile(profile: Partial<UserProfile>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: profile.userId,
          communication_style: profile.communicationStyle,
          preferred_approaches: profile.preferredApproaches,
          session_preferences: profile.sessionPreferences,
          emotional_patterns: profile.emotionalPatterns,
          updated_at: new Date().toISOString()
        });

      return !error;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return false;
    }
  }

  static async generatePersonalizedRecommendations(
    userId: string,
    recentSessions: any[],
    moodData: any[]
  ): Promise<PersonalizedRecommendation[]> {
    const profile = await this.getUserProfile(userId);
    if (!profile) return [];

    const recommendations: PersonalizedRecommendation[] = [];

    // Analyze session patterns
    if (recentSessions.length > 0) {
      const avgSessionLength = recentSessions.reduce((sum, s) => sum + (s.duration || 0), 0) / recentSessions.length;
      
      if (avgSessionLength < 10) {
        recommendations.push({
          type: 'session',
          title: 'Extend Your Sessions',
          description: 'Consider longer sessions for deeper therapeutic benefit',
          reasoning: 'Your recent sessions have been quite short. Longer sessions often lead to more meaningful insights.',
          priority: 'medium',
          estimatedImpact: 0.7
        });
      }
    }

    // Analyze mood patterns
    if (moodData.length > 0) {
      const recentMoods = moodData.slice(-7);
      const avgMood = recentMoods.reduce((sum, m) => sum + m.rating, 0) / recentMoods.length;
      
      if (avgMood < 3) {
        recommendations.push({
          type: 'technique',
          title: 'Try Mindfulness Meditation',
          description: 'Mindfulness can help improve mood and emotional regulation',
          reasoning: 'Your recent mood scores suggest you might benefit from mindfulness techniques.',
          priority: 'high',
          estimatedImpact: 0.8
        });
      }
    }

    // Time-based recommendations
    const currentHour = new Date().getHours();
    if (profile.sessionPreferences.preferredTime === 'morning' && currentHour >= 6 && currentHour <= 10) {
      recommendations.push({
        type: 'timing',
        title: 'Perfect Time for a Session',
        description: 'Now is your preferred time for therapy sessions',
        reasoning: 'Based on your preferences, morning sessions work best for you.',
        priority: 'medium',
        estimatedImpact: 0.6
      });
    }

    // Content recommendations based on approach preferences
    if (profile.preferredApproaches.includes('CBT')) {
      recommendations.push({
        type: 'content',
        title: 'Cognitive Restructuring Exercise',
        description: 'Practice identifying and challenging negative thought patterns',
        reasoning: 'You prefer CBT techniques, and this exercise aligns with your therapeutic goals.',
        priority: 'medium',
        estimatedImpact: 0.7
      });
    }

    return recommendations.sort((a, b) => b.estimatedImpact - a.estimatedImpact);
  }

  static async trackUserInteraction(
    userId: string,
    interactionType: string,
    data: any
  ): Promise<void> {
    try {
      await supabase
        .from('user_interactions')
        .insert({
          user_id: userId,
          interaction_type: interactionType,
          data: data,
          timestamp: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error tracking interaction:', error);
    }
  }

  static async getOptimalSessionTime(userId: string): Promise<string> {
    try {
      const { data } = await supabase
        .from('user_interactions')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(20);

      if (!data || data.length === 0) return 'Any time';

      // Analyze session start times to find patterns
      const hours = data.map((interaction: any) => new Date(interaction.timestamp).getHours());
      const hourCounts = hours.reduce((acc, hour) => {
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

      const mostFrequentHour = Object.entries(hourCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0];

      if (!mostFrequentHour) return 'Any time';

      const hour = parseInt(mostFrequentHour);
      if (hour >= 6 && hour < 12) return 'Morning';
      if (hour >= 12 && hour < 17) return 'Afternoon';
      if (hour >= 17 && hour < 21) return 'Evening';
      return 'Night';
    } catch (error) {
      console.error('Error analyzing optimal session time:', error);
      return 'Any time';
    }
  }
}
