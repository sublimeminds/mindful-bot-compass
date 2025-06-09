
import { supabase } from "@/integrations/supabase/client";
import { notificationService } from "./notificationService";

export interface TriggerCondition {
  type: 'session_gap' | 'mood_decline' | 'goal_progress' | 'streak_break' | 'milestone_reached';
  threshold: number;
  timeframe?: string; // e.g., '7d', '1d', '1h'
}

export interface NotificationTrigger {
  id: string;
  name: string;
  description: string;
  condition: TriggerCondition;
  template: string;
  isActive: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  cooldownHours: number; // Prevent spam
}

class SmartNotificationTriggerService {
  private defaultTriggers: NotificationTrigger[] = [
    {
      id: 'session-gap-3d',
      name: 'Session Gap Reminder',
      description: 'Remind users who haven\'t had a therapy session in 3+ days',
      condition: { type: 'session_gap', threshold: 3, timeframe: '3d' },
      template: 'session_reminder',
      isActive: true,
      priority: 'medium',
      cooldownHours: 24
    },
    {
      id: 'mood-decline',
      name: 'Mood Decline Alert',
      description: 'Alert when mood ratings show declining trend',
      condition: { type: 'mood_decline', threshold: 2 },
      template: 'mood_support',
      isActive: true,
      priority: 'high',
      cooldownHours: 12
    },
    {
      id: 'goal-stagnant',
      name: 'Goal Progress Nudge',
      description: 'Encourage users with stagnant goal progress',
      condition: { type: 'goal_progress', threshold: 7, timeframe: '7d' },
      template: 'goal_motivation',
      isActive: true,
      priority: 'medium',
      cooldownHours: 48
    },
    {
      id: 'streak-break',
      name: 'Streak Recovery',
      description: 'Help users get back on track after breaking a streak',
      condition: { type: 'streak_break', threshold: 1 },
      template: 'streak_recovery',
      isActive: true,
      priority: 'medium',
      cooldownHours: 6
    },
    {
      id: 'milestone-celebration',
      name: 'Milestone Achievement',
      description: 'Celebrate when users reach important milestones',
      condition: { type: 'milestone_reached', threshold: 1 },
      template: 'milestone_celebration',
      isActive: true,
      priority: 'low',
      cooldownHours: 0
    }
  ];

  async checkAndTriggerNotifications(userId: string): Promise<void> {
    console.log('Running smart notification checks for user:', userId);
    
    const activeTriggers = await this.getActiveTriggers();
    
    for (const trigger of activeTriggers) {
      try {
        const shouldTrigger = await this.evaluateCondition(userId, trigger.condition);
        
        if (shouldTrigger && await this.canSendNotification(userId, trigger)) {
          await this.sendTriggeredNotification(userId, trigger);
          await this.recordTriggerExecution(userId, trigger.id);
        }
      } catch (error) {
        console.error(`Error processing trigger ${trigger.id}:`, error);
      }
    }
  }

  private async evaluateCondition(userId: string, condition: TriggerCondition): Promise<boolean> {
    switch (condition.type) {
      case 'session_gap':
        return await this.checkSessionGap(userId, condition.threshold);
      
      case 'mood_decline':
        return await this.checkMoodDecline(userId, condition.threshold);
      
      case 'goal_progress':
        return await this.checkGoalStagnation(userId, condition.threshold);
      
      case 'streak_break':
        return await this.checkStreakBreak(userId);
      
      case 'milestone_reached':
        return await this.checkMilestoneReached(userId);
      
      default:
        return false;
    }
  }

  private async checkSessionGap(userId: string, thresholdDays: number): Promise<boolean> {
    const { data: lastSession } = await supabase
      .from('therapy_sessions')
      .select('created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!lastSession) return true; // No sessions yet

    const daysSinceLastSession = Math.floor(
      (Date.now() - new Date(lastSession.created_at).getTime()) / (1000 * 60 * 60 * 24)
    );

    return daysSinceLastSession >= thresholdDays;
  }

  private async checkMoodDecline(userId: string, threshold: number): Promise<boolean> {
    const { data: recentMoods } = await supabase
      .from('mood_entries')
      .select('mood_score, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (!recentMoods || recentMoods.length < 3) return false;

    // Check for declining trend
    let declineCount = 0;
    for (let i = 1; i < recentMoods.length; i++) {
      if (recentMoods[i].mood_score > recentMoods[i - 1].mood_score) {
        declineCount++;
      }
    }

    return declineCount >= threshold;
  }

  private async checkGoalStagnation(userId: string, thresholdDays: number): Promise<boolean> {
    const { data: goals } = await supabase
      .from('goals')
      .select('id, updated_at, progress')
      .eq('user_id', userId)
      .eq('status', 'active');

    if (!goals || goals.length === 0) return false;

    const stagnantGoals = goals.filter(goal => {
      const daysSinceUpdate = Math.floor(
        (Date.now() - new Date(goal.updated_at).getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysSinceUpdate >= thresholdDays && goal.progress < 100;
    });

    return stagnantGoals.length > 0;
  }

  private async checkStreakBreak(userId: string): Promise<boolean> {
    // Check if user had an active streak that was recently broken
    const { data: streaks } = await supabase
      .from('user_streaks')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(1);

    if (!streaks || streaks.length === 0) return false;

    const latestStreak = streaks[0];
    const hoursSinceBreak = Math.floor(
      (Date.now() - new Date(latestStreak.updated_at).getTime()) / (1000 * 60 * 60)
    );

    return latestStreak.current_count === 0 && latestStreak.longest_streak > 0 && hoursSinceBreak <= 24;
  }

  private async checkMilestoneReached(userId: string): Promise<boolean> {
    // Check for recent achievements or milestones
    const { data: recentAchievements } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId)
      .eq('notified', false)
      .limit(1);

    return recentAchievements && recentAchievements.length > 0;
  }

  private async canSendNotification(userId: string, trigger: NotificationTrigger): Promise<boolean> {
    if (trigger.cooldownHours === 0) return true;

    const { data: lastExecution } = await supabase
      .from('notification_trigger_log')
      .select('executed_at')
      .eq('user_id', userId)
      .eq('trigger_id', trigger.id)
      .order('executed_at', { ascending: false })
      .limit(1)
      .single();

    if (!lastExecution) return true;

    const hoursSinceLastExecution = Math.floor(
      (Date.now() - new Date(lastExecution.executed_at).getTime()) / (1000 * 60 * 60)
    );

    return hoursSinceLastExecution >= trigger.cooldownHours;
  }

  private async sendTriggeredNotification(userId: string, trigger: NotificationTrigger): Promise<void> {
    const notificationData = {
      userId,
      type: trigger.condition.type,
      priority: trigger.priority,
      title: this.getNotificationTitle(trigger),
      message: this.getNotificationMessage(trigger),
      metadata: {
        triggerId: trigger.id,
        triggerName: trigger.name,
        automated: true
      }
    };

    await notificationService.createNotification(notificationData);
    console.log(`Triggered notification: ${trigger.name} for user: ${userId}`);
  }

  private getNotificationTitle(trigger: NotificationTrigger): string {
    switch (trigger.condition.type) {
      case 'session_gap':
        return 'Time for a Check-in';
      case 'mood_decline':
        return 'We\'re Here to Support You';
      case 'goal_progress':
        return 'Let\'s Keep Moving Forward';
      case 'streak_break':
        return 'Getting Back on Track';
      case 'milestone_reached':
        return 'Congratulations!';
      default:
        return 'MindfulAI Update';
    }
  }

  private getNotificationMessage(trigger: NotificationTrigger): string {
    switch (trigger.condition.type) {
      case 'session_gap':
        return 'It\'s been a few days since your last therapy session. How are you feeling today?';
      case 'mood_decline':
        return 'I noticed your mood has been challenging lately. Would you like to talk or try a mindfulness exercise?';
      case 'goal_progress':
        return 'Your wellness goals are waiting for you. Even small steps count toward big changes.';
      case 'streak_break':
        return 'Every journey has ups and downs. You can start your wellness streak again today.';
      case 'milestone_reached':
        return 'You\'ve reached an important milestone in your wellness journey. Take a moment to celebrate this achievement!';
      default:
        return 'Your wellness journey continues with MindfulAI.';
    }
  }

  private async recordTriggerExecution(userId: string, triggerId: string): Promise<void> {
    await supabase
      .from('notification_trigger_log')
      .insert({
        user_id: userId,
        trigger_id: triggerId,
        executed_at: new Date().toISOString()
      });
  }

  private async getActiveTriggers(): Promise<NotificationTrigger[]> {
    // For now, return default triggers. In the future, this could come from database
    return this.defaultTriggers.filter(trigger => trigger.isActive);
  }

  async runDailyTriggerCheck(): Promise<void> {
    console.log('Running daily smart notification trigger check...');
    
    // Get all active users (users who have logged in within last 30 days)
    const { data: activeUsers } = await supabase
      .from('profiles')
      .select('id')
      .gte('last_sign_in_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (!activeUsers) return;

    for (const user of activeUsers) {
      try {
        await this.checkAndTriggerNotifications(user.id);
        // Add small delay to prevent overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error processing user ${user.id}:`, error);
      }
    }

    console.log(`Completed trigger check for ${activeUsers.length} users`);
  }

  async getTriggerAnalytics(userId?: string): Promise<any> {
    let query = supabase
      .from('notification_trigger_log')
      .select(`
        trigger_id,
        executed_at,
        profiles(email)
      `)
      .order('executed_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data } = await query.limit(100);
    return data || [];
  }
}

export const smartNotificationTriggerService = new SmartNotificationTriggerService();
