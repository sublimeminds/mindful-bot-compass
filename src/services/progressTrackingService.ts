import { supabase } from '@/integrations/supabase/client';

export interface ProgressMilestone {
  id: string;
  user_id: string;
  milestone_type: string;
  title: string;
  description?: string;
  target_value?: number;
  current_value?: number;
  achieved_at?: string;
  points_earned: number;
  celebration_shown: boolean;
  created_at: string;
}

export interface ProgressSummary {
  totalPoints: number;
  achievedMilestones: number;
  currentStreak: number;
  totalSessions: number;
  averageMood: number;
  recentAchievements: ProgressMilestone[];
  nextMilestones: {
    type: string;
    title: string;
    progress: number;
    target: number;
  }[];
}

class ProgressTrackingService {
  async getUserProgress(userId: string): Promise<ProgressSummary> {
    try {
      // Get user milestones
      const { data: milestones } = await supabase
        .from('progress_milestones')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // Get user stats
      const { data: userStats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      const achievedMilestones = milestones?.filter(m => m.achieved_at) || [];
      const totalPoints = achievedMilestones.reduce((sum, m) => sum + m.points_earned, 0);

      // Get recent achievements (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const recentAchievements = achievedMilestones.filter(m => 
        m.achieved_at && new Date(m.achieved_at) > sevenDaysAgo
      );

      // Calculate next milestones
      const nextMilestones = this.calculateNextMilestones(userStats);

      return {
        totalPoints,
        achievedMilestones: achievedMilestones.length,
        currentStreak: userStats?.current_streak || 0,
        totalSessions: userStats?.total_sessions || 0,
        averageMood: userStats?.average_mood || 0,
        recentAchievements,
        nextMilestones
      };
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return {
        totalPoints: 0,
        achievedMilestones: 0,
        currentStreak: 0,
        totalSessions: 0,
        averageMood: 0,
        recentAchievements: [],
        nextMilestones: []
      };
    }
  }

  async getMilestones(userId: string): Promise<ProgressMilestone[]> {
    try {
      const { data, error } = await supabase
        .from('progress_milestones')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching milestones:', error);
      return [];
    }
  }

  async markCelebrationShown(milestoneId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('progress_milestones')
        .update({ celebration_shown: true })
        .eq('id', milestoneId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking celebration shown:', error);
    }
  }

  async checkForNewMilestones(userId: string): Promise<ProgressMilestone[]> {
    try {
      // Get achievements that haven't been celebrated yet
      const { data: newMilestones, error } = await supabase
        .from('progress_milestones')
        .select('*')
        .eq('user_id', userId)
        .eq('celebration_shown', false)
        .not('achieved_at', 'is', null)
        .order('achieved_at', { ascending: false });

      if (error) throw error;
      return newMilestones || [];
    } catch (error) {
      console.error('Error checking for new milestones:', error);
      return [];
    }
  }

  async createCustomMilestone(
    userId: string,
    title: string,
    description: string,
    targetValue: number,
    milestoneType: string
  ): Promise<ProgressMilestone> {
    try {
      const milestoneData = {
        user_id: userId,
        milestone_type: `custom_${milestoneType}`,
        title,
        description,
        target_value: targetValue,
        current_value: 0,
        points_earned: Math.floor(targetValue * 10), // 10 points per unit
        celebration_shown: false
      };

      const { data, error } = await supabase
        .from('progress_milestones')
        .insert(milestoneData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating custom milestone:', error);
      throw error;
    }
  }

  async updateMilestoneProgress(
    userId: string,
    milestoneType: string,
    currentValue: number
  ): Promise<void> {
    try {
      // Find incomplete milestone of this type
      const { data: milestone, error: fetchError } = await supabase
        .from('progress_milestones')
        .select('*')
        .eq('user_id', userId)
        .eq('milestone_type', milestoneType)
        .is('achieved_at', null)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      if (milestone && milestone.target_value && currentValue >= milestone.target_value) {
        // Mark as achieved
        const { error: updateError } = await supabase
          .from('progress_milestones')
          .update({
            current_value: currentValue,
            achieved_at: new Date().toISOString()
          })
          .eq('id', milestone.id);

        if (updateError) throw updateError;

        // Create celebration notification
        await this.createCelebrationNotification(userId, milestone);
      } else if (milestone) {
        // Update progress
        const { error: updateError } = await supabase
          .from('progress_milestones')
          .update({ current_value: currentValue })
          .eq('id', milestone.id);

        if (updateError) throw updateError;
      }
    } catch (error) {
      console.error('Error updating milestone progress:', error);
    }
  }

  private calculateNextMilestones(userStats: any): any[] {
    if (!userStats) return [];

    const nextMilestones = [];
    const currentSessions = userStats.total_sessions || 0;
    const currentStreak = userStats.current_streak || 0;
    const currentMood = userStats.average_mood || 0;

    // Session milestones
    const sessionTargets = [5, 10, 25, 50, 100];
    const nextSessionTarget = sessionTargets.find(target => target > currentSessions);
    if (nextSessionTarget) {
      nextMilestones.push({
        type: 'sessions',
        title: `${nextSessionTarget} Sessions`,
        progress: currentSessions,
        target: nextSessionTarget
      });
    }

    // Streak milestones
    const streakTargets = [3, 7, 14, 30, 60];
    const nextStreakTarget = streakTargets.find(target => target > currentStreak);
    if (nextStreakTarget) {
      nextMilestones.push({
        type: 'streak',
        title: `${nextStreakTarget}-Day Streak`,
        progress: currentStreak,
        target: nextStreakTarget
      });
    }

    // Mood milestones
    if (currentMood < 7.0) {
      nextMilestones.push({
        type: 'mood',
        title: 'Positive Mindset',
        progress: currentMood,
        target: 7.5
      });
    }

    return nextMilestones.slice(0, 3); // Return top 3
  }

  private async createCelebrationNotification(
    userId: string,
    milestone: ProgressMilestone
  ): Promise<void> {
    try {
      await supabase
        .from('intelligent_notifications')
        .insert({
          user_id: userId,
          notification_type: 'milestone_achieved',
          title: `🎉 ${milestone.title}`,
          message: `Congratulations! You've achieved a new milestone: ${milestone.title}. You earned ${milestone.points_earned} points!`,
          priority: 'medium',
          data: {
            milestone_id: milestone.id,
            points_earned: milestone.points_earned,
            celebration: true
          }
        });
    } catch (error) {
      console.error('Error creating celebration notification:', error);
    }
  }

  async getProgressAnalytics(userId: string, days: number = 30): Promise<any> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Get mood entries for the period
      const { data: moodEntries } = await supabase
        .from('mood_entries')
        .select('overall, created_at')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      // Get session data
      const { data: sessions } = await supabase
        .from('therapy_sessions')
        .select('start_time, end_time')
        .eq('user_id', userId)
        .gte('start_time', startDate.toISOString())
        .order('start_time', { ascending: true });

      // Get milestones achieved in period
      const { data: milestones } = await supabase
        .from('progress_milestones')
        .select('*')
        .eq('user_id', userId)
        .gte('achieved_at', startDate.toISOString())
        .not('achieved_at', 'is', null);

      return {
        moodTrend: this.calculateMoodTrend(moodEntries || []),
        sessionFrequency: this.calculateSessionFrequency(sessions || [], days),
        milestonesAchieved: milestones?.length || 0,
        totalPoints: milestones?.reduce((sum, m) => sum + m.points_earned, 0) || 0
      };
    } catch (error) {
      console.error('Error fetching progress analytics:', error);
      return {
        moodTrend: 'stable',
        sessionFrequency: 0,
        milestonesAchieved: 0,
        totalPoints: 0
      };
    }
  }

  private calculateMoodTrend(moodEntries: any[]): string {
    if (moodEntries.length < 2) return 'stable';

    const firstHalf = moodEntries.slice(0, Math.floor(moodEntries.length / 2));
    const secondHalf = moodEntries.slice(Math.floor(moodEntries.length / 2));

    const firstAvg = firstHalf.reduce((sum, entry) => sum + entry.overall, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, entry) => sum + entry.overall, 0) / secondHalf.length;

    const difference = secondAvg - firstAvg;

    if (difference > 0.5) return 'improving';
    if (difference < -0.5) return 'declining';
    return 'stable';
  }

  private calculateSessionFrequency(sessions: any[], days: number): number {
    return sessions.length / days * 7; // Sessions per week
  }
}

export const progressTrackingService = new ProgressTrackingService();