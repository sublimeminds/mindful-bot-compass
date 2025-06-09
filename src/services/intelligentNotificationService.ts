
import { NotificationService } from './notificationService';
import { SessionService, DetailedSession } from './sessionService';
import { supabase } from '@/integrations/supabase/client';

interface NotificationRule {
  id: string;
  name: string;
  condition: (data: any) => boolean;
  generateNotification: (data: any) => {
    type: 'session_reminder' | 'milestone_achieved' | 'insight_generated' | 'mood_check' | 'progress_update';
    title: string;
    message: string;
    priority: 'low' | 'medium' | 'high';
    data?: Record<string, any>;
  };
}

export class IntelligentNotificationService {
  private static rules: NotificationRule[] = [
    {
      id: 'session_streak',
      name: 'Session Streak Achievement',
      condition: (data) => data.consecutiveDays >= 3,
      generateNotification: (data) => ({
        type: 'milestone_achieved',
        title: `${data.consecutiveDays} Day Streak! 🔥`,
        message: `Amazing! You've completed therapy sessions for ${data.consecutiveDays} consecutive days. Keep up the fantastic work!`,
        priority: 'high',
        data: { streak: data.consecutiveDays }
      })
    },
    {
      id: 'mood_improvement',
      name: 'Significant Mood Improvement',
      condition: (data) => data.moodImprovement >= 3,
      generateNotification: (data) => ({
        type: 'insight_generated',
        title: 'Great Progress! 📈',
        message: `Your mood improved by ${data.moodImprovement} points in your last session. The techniques you used are really working!`,
        priority: 'medium',
        data: { improvement: data.moodImprovement, techniques: data.techniques }
      })
    },
    {
      id: 'inactive_reminder',
      name: 'Gentle Check-in Reminder',
      condition: (data) => data.daysSinceLastSession >= 3,
      generateNotification: (data) => ({
        type: 'session_reminder',
        title: 'We miss you! 💙',
        message: `It's been ${data.daysSinceLastSession} days since your last session. Even a few minutes of self-care can make a difference.`,
        priority: 'medium',
        data: { daysSinceLastSession: data.daysSinceLastSession }
      })
    },
    {
      id: 'weekly_progress',
      name: 'Weekly Progress Summary',
      condition: (data) => data.isWeeklyReport && data.sessionsThisWeek > 0,
      generateNotification: (data) => ({
        type: 'progress_update',
        title: 'Weekly Progress Report 📊',
        message: `This week you completed ${data.sessionsThisWeek} sessions with an average mood improvement of ${data.avgMoodImprovement}. ${data.encouragement}`,
        priority: 'low',
        data: { 
          sessionsThisWeek: data.sessionsThisWeek,
          avgMoodImprovement: data.avgMoodImprovement,
          topTechniques: data.topTechniques
        }
      })
    },
    {
      id: 'technique_mastery',
      name: 'Technique Mastery Achievement',
      condition: (data) => data.techniqueUsageCount >= 10,
      generateNotification: (data) => ({
        type: 'milestone_achieved',
        title: `${data.techniqueName} Master! 🎯`,
        message: `You've successfully used ${data.techniqueName} in ${data.techniqueUsageCount} sessions. You're becoming quite skilled at this technique!`,
        priority: 'medium',
        data: { technique: data.techniqueName, usageCount: data.techniqueUsageCount }
      })
    }
  ];

  static async processSessionCompletion(userId: string, session: DetailedSession): Promise<void> {
    console.log('Processing session completion for notifications:', session.id);

    // Check for mood improvement notifications
    if (session.moodBefore && session.moodAfter) {
      const moodImprovement = session.moodAfter - session.moodBefore;
      
      const moodRule = this.rules.find(rule => rule.id === 'mood_improvement');
      if (moodRule && moodRule.condition({ moodImprovement })) {
        const notification = moodRule.generateNotification({
          moodImprovement,
          techniques: session.techniques
        });
        await NotificationService.createNotification(userId, notification);
      }
    }

    // Check for technique mastery
    for (const technique of session.techniques) {
      const techniqueUsage = await this.getTechniqueUsageCount(userId, technique);
      
      const masteryRule = this.rules.find(rule => rule.id === 'technique_mastery');
      if (masteryRule && masteryRule.condition({ techniqueUsageCount: techniqueUsage })) {
        const notification = masteryRule.generateNotification({
          techniqueName: technique,
          techniqueUsageCount: techniqueUsage
        });
        await NotificationService.createNotification(userId, notification);
      }
    }

    // Check for session streaks
    const consecutiveDays = await this.getConsecutiveSessionDays(userId);
    const streakRule = this.rules.find(rule => rule.id === 'session_streak');
    if (streakRule && streakRule.condition({ consecutiveDays })) {
      const notification = streakRule.generateNotification({ consecutiveDays });
      await NotificationService.createNotification(userId, notification);
    }
  }

  static async checkInactiveUsers(): Promise<void> {
    console.log('Checking for inactive users...');
    
    try {
      // Get users who haven't had a session in the last 3+ days
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      const { data: inactiveUsers, error } = await supabase
        .from('profiles')
        .select(`
          id,
          name,
          therapy_sessions!left(
            start_time
          )
        `)
        .or(`therapy_sessions.start_time.is.null,therapy_sessions.start_time.lt.${threeDaysAgo.toISOString()}`);

      if (error) {
        console.error('Error checking inactive users:', error);
        return;
      }

      const inactiveRule = this.rules.find(rule => rule.id === 'inactive_reminder');
      if (!inactiveRule) return;

      for (const user of inactiveUsers || []) {
        const lastSession = user.therapy_sessions?.[0];
        const daysSinceLastSession = lastSession 
          ? Math.floor((Date.now() - new Date(lastSession.start_time).getTime()) / (1000 * 60 * 60 * 24))
          : 30; // Assume 30 days for new users

        if (inactiveRule.condition({ daysSinceLastSession })) {
          const notification = inactiveRule.generateNotification({ daysSinceLastSession });
          await NotificationService.createNotification(user.id, notification);
        }
      }
    } catch (error) {
      console.error('Error in checkInactiveUsers:', error);
    }
  }

  static async generateWeeklyReports(): Promise<void> {
    console.log('Generating weekly progress reports...');
    
    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const { data: users, error } = await supabase
        .from('profiles')
        .select(`
          id,
          name,
          therapy_sessions!inner(
            start_time,
            mood_before,
            mood_after,
            techniques
          )
        `)
        .gte('therapy_sessions.start_time', oneWeekAgo.toISOString());

      if (error) {
        console.error('Error generating weekly reports:', error);
        return;
      }

      const weeklyRule = this.rules.find(rule => rule.id === 'weekly_progress');
      if (!weeklyRule) return;

      for (const user of users || []) {
        const sessions = user.therapy_sessions || [];
        const sessionsThisWeek = sessions.length;

        if (sessionsThisWeek === 0) continue;

        const moodImprovements = sessions
          .filter(s => s.mood_before && s.mood_after)
          .map(s => s.mood_after - s.mood_before);

        const avgMoodImprovement = moodImprovements.length > 0
          ? Math.round((moodImprovements.reduce((sum, imp) => sum + imp, 0) / moodImprovements.length) * 10) / 10
          : 0;

        // Get most used techniques
        const techniqueCount: Record<string, number> = {};
        sessions.forEach(session => {
          session.techniques?.forEach((technique: string) => {
            techniqueCount[technique] = (techniqueCount[technique] || 0) + 1;
          });
        });

        const topTechniques = Object.entries(techniqueCount)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 3)
          .map(([technique]) => technique);

        const encouragement = avgMoodImprovement >= 2 
          ? "You're making excellent progress!" 
          : avgMoodImprovement >= 1 
          ? "You're on the right track, keep going!" 
          : "Every step forward matters. Keep practicing!";

        const reportData = {
          isWeeklyReport: true,
          sessionsThisWeek,
          avgMoodImprovement,
          topTechniques,
          encouragement
        };

        if (weeklyRule.condition(reportData)) {
          const notification = weeklyRule.generateNotification(reportData);
          await NotificationService.createNotification(user.id, notification);
        }
      }
    } catch (error) {
      console.error('Error in generateWeeklyReports:', error);
    }
  }

  private static async getTechniqueUsageCount(userId: string, technique: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('therapy_sessions')
        .select('id')
        .eq('user_id', userId)
        .contains('techniques', [technique]);

      if (error) {
        console.error('Error getting technique usage count:', error);
        return 0;
      }

      return data?.length || 0;
    } catch (error) {
      console.error('Error in getTechniqueUsageCount:', error);
      return 0;
    }
  }

  private static async getConsecutiveSessionDays(userId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('therapy_sessions')
        .select('start_time')
        .eq('user_id', userId)
        .order('start_time', { ascending: false })
        .limit(30); // Check last 30 days

      if (error || !data || data.length === 0) {
        return 0;
      }

      // Group sessions by date
      const sessionDates = new Set(
        data.map(session => new Date(session.start_time).toDateString())
      );

      // Count consecutive days from today backwards
      let consecutiveDays = 0;
      const today = new Date();
      
      for (let i = 0; i < 30; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);
        
        if (sessionDates.has(checkDate.toDateString())) {
          consecutiveDays++;
        } else if (consecutiveDays > 0) {
          // Break on first missing day after we've started counting
          break;
        }
      }

      return consecutiveDays;
    } catch (error) {
      console.error('Error in getConsecutiveSessionDays:', error);
      return 0;
    }
  }

  static async createCustomNotification(
    userId: string,
    type: 'session_reminder' | 'milestone_achieved' | 'insight_generated' | 'mood_check' | 'progress_update',
    title: string,
    message: string,
    priority: 'low' | 'medium' | 'high' = 'medium',
    data?: Record<string, any>
  ): Promise<boolean> {
    return await NotificationService.createNotification(userId, {
      type,
      title,
      message,
      priority,
      data
    });
  }
}
