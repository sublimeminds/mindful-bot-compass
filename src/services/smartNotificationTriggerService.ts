
import { supabase } from "@/integrations/supabase/client";
import { NotificationService } from "./notificationService";

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
      .maybeSingle();

    if (!lastSession) return true; // No sessions yet

    const daysSinceLastSession = Math.floor(
      (Date.now() - new Date(lastSession.created_at).getTime()) / (1000 * 60 * 60 * 24)
    );

    return daysSinceLastSession >= thresholdDays;
  }

  private async checkMoodDecline(userId: string, threshold: number): Promise<boolean> {
    const { data: recentMoods } = await supabase
      .from('mood_entries')
      .select('overall, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (!recentMoods || recentMoods.length < 3) return false;

    // Check for declining trend
    let declineCount = 0;
    for (let i = 1; i < recentMoods.length; i++) {
      if (recentMoods[i].overall > recentMoods[i - 1].overall) {
        declineCount++;
      }
    }

    return declineCount >= threshold;
  }

  private async checkGoalStagnation(userId: string, thresholdDays: number): Promise<boolean> {
    const { data: goals } = await supabase
      .from('goals')
      .select('id, updated_at, current_progress')
      .eq('user_id', userId)
      .eq('is_completed', false);

    if (!goals || goals.length === 0) return false;

    const stagnantGoals = goals.filter(goal => {
      const daysSinceUpdate = Math.floor(
        (Date.now() - new Date(goal.updated_at).getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysSinceUpdate >= thresholdDays && goal.current_progress < 100;
    });

    return stagnantGoals.length > 0;
  }

  private async canSendNotification(userId: string, trigger: NotificationTrigger): Promise<boolean> {
    if (trigger.cooldownHours === 0) return true;

    // Check notifications table for last trigger execution
    const { data: lastExecution } = await supabase
      .from('notifications')
      .select('created_at')
      .eq('user_id', userId)
      .eq('type', 'trigger_execution')
      .like('data->trigger_id', `"${trigger.id}"`)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!lastExecution) return true;

    const hoursSinceLastExecution = Math.floor(
      (Date.now() - new Date(lastExecution.created_at).getTime()) / (1000 * 60 * 60)
    );

    return hoursSinceLastExecution >= trigger.cooldownHours;
  }

  private async sendTriggeredNotification(userId: string, trigger: NotificationTrigger): Promise<void> {
    const notificationData = {
      type: trigger.condition.type as any,
      title: this.getNotificationTitle(trigger),
      message: this.getNotificationMessage(trigger),
      priority: trigger.priority as any,
      data: {
        triggerId: trigger.id,
        triggerName: trigger.name,
        automated: true
      }
    };

    await NotificationService.createNotification(userId, notificationData);
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
      default:
        return 'Your wellness journey continues with MindfulAI.';
    }
  }

  private async recordTriggerExecution(userId: string, triggerId: string): Promise<void> {
    await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title: 'Trigger Execution Log',
        message: `Executed trigger: ${triggerId}`,
        type: 'trigger_execution',
        priority: 'low',
        data: {
          trigger_id: triggerId,
          executed_at: new Date().toISOString(),
          is_log_entry: true
        }
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
      .gte('updated_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

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
      .from('notifications')
      .select(`
        data,
        created_at,
        user_id
      `)
      .eq('type', 'trigger_execution')
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data } = await query.limit(100);
    
    return (data || []).map(item => {
      const triggerData = item.data as any;
      return {
        trigger_id: triggerData?.trigger_id || 'unknown',
        executed_at: item.created_at,
        profiles: { email: 'user@example.com' } // Simplified for now
      };
    });
  }
}

export const smartNotificationTriggerService = new SmartNotificationTriggerService();
