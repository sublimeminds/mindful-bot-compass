import { supabase } from '@/integrations/supabase/client';
import { NotificationEngine } from './notificationEngine';

export interface NotificationIntelligence {
  userId: string;
  optimalSendTimes: Record<string, string[]>; // day of week -> optimal hours
  engagementPatterns: Record<string, number>; // notification type -> engagement rate
  deliveryPreferences: Record<string, string[]>; // notification type -> preferred methods
  confidenceScore: number;
  lastCalculatedAt?: Date;
}

export interface TherapySessionContext {
  sessionId?: string;
  isSessionActive: boolean;
  nextSessionTime?: Date;
  sessionType?: string;
  therapistId?: string;
  mood?: string;
}

export interface CrisisEscalation {
  id: string;
  userId: string;
  triggerNotificationId?: string;
  escalationLevel: 1 | 2 | 3 | 4; // mild, moderate, severe, crisis
  escalationData: Record<string, any>;
  professionalNotified: boolean;
  emergencyContactsNotified: boolean;
  resolvedAt?: Date;
}

export class IntelligentNotificationService {
  /**
   * Calculate optimal send times using user engagement data
   */
  static async calculateOptimalTiming(userId: string): Promise<NotificationIntelligence | null> {
    try {
      // Get user's notification analytics from past 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: analytics, error } = await supabase
        .from('notification_analytics')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', thirtyDaysAgo.toISOString());

      if (error || !analytics?.length) {
        console.log('Insufficient data for timing optimization');
        return null;
      }

      // Analyze engagement patterns by time of day and day of week
      const timeEngagement: Record<string, { clicks: number; total: number }> = {};
      const typeEngagement: Record<string, { clicks: number; total: number }> = {};
      const methodPreferences: Record<string, Record<string, number>> = {};

      analytics.forEach(event => {
        const date = new Date(event.created_at);
        const hour = date.getHours();
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
        const timeSlot = `${dayOfWeek}-${Math.floor(hour / 2) * 2}`; // 2-hour slots

        // Track time-based engagement
        if (!timeEngagement[timeSlot]) {
          timeEngagement[timeSlot] = { clicks: 0, total: 0 };
        }
        timeEngagement[timeSlot].total++;
        if (event.event_type === 'clicked') {
          timeEngagement[timeSlot].clicks++;
        }

        // Track notification type engagement
        const metadata = event.metadata as Record<string, any> | null;
        const notificationType = metadata?.notification_type || 'unknown';
        if (!typeEngagement[notificationType]) {
          typeEngagement[notificationType] = { clicks: 0, total: 0 };
        }
        typeEngagement[notificationType].total++;
        if (event.event_type === 'clicked') {
          typeEngagement[notificationType].clicks++;
        }

        // Track delivery method preferences
        if (!methodPreferences[notificationType]) {
          methodPreferences[notificationType] = {};
        }
        if (!methodPreferences[notificationType][event.delivery_method]) {
          methodPreferences[notificationType][event.delivery_method] = 0;
        }
        if (event.event_type === 'clicked') {
          methodPreferences[notificationType][event.delivery_method]++;
        }
      });

      // Calculate optimal send times (times with >50% engagement rate)
      const optimalSendTimes: Record<string, string[]> = {};
      Object.entries(timeEngagement).forEach(([timeSlot, data]) => {
        const engagementRate = data.total > 0 ? data.clicks / data.total : 0;
        if (engagementRate > 0.5) {
          const [dayOfWeek, hourSlot] = timeSlot.split('-');
          if (!optimalSendTimes[dayOfWeek]) {
            optimalSendTimes[dayOfWeek] = [];
          }
          optimalSendTimes[dayOfWeek].push(hourSlot);
        }
      });

      // Calculate engagement patterns by type
      const engagementPatterns: Record<string, number> = {};
      Object.entries(typeEngagement).forEach(([type, data]) => {
        engagementPatterns[type] = data.total > 0 ? data.clicks / data.total : 0;
      });

      // Calculate delivery preferences
      const deliveryPreferences: Record<string, string[]> = {};
      Object.entries(methodPreferences).forEach(([type, methods]) => {
        const sortedMethods = Object.entries(methods)
          .sort(([,a], [,b]) => b - a)
          .map(([method]) => method);
        deliveryPreferences[type] = sortedMethods.slice(0, 3); // Top 3 methods
      });

      // Calculate confidence score based on data volume
      const confidenceScore = Math.min(analytics.length / 100, 1); // Max confidence at 100+ events

      const intelligence: NotificationIntelligence = {
        userId,
        optimalSendTimes,
        engagementPatterns,
        deliveryPreferences,
        confidenceScore,
        lastCalculatedAt: new Date()
      };

      // Save to database
      await this.saveIntelligence(intelligence);

      return intelligence;
    } catch (error) {
      console.error('Error calculating optimal timing:', error);
      return null;
    }
  }

  /**
   * Save intelligence data to database
   */
  private static async saveIntelligence(intelligence: NotificationIntelligence): Promise<void> {
    try {
      const { error } = await supabase
        .from('notification_intelligence')
        .upsert({
          user_id: intelligence.userId,
          optimal_send_times: intelligence.optimalSendTimes,
          engagement_patterns: intelligence.engagementPatterns,
          delivery_preferences: intelligence.deliveryPreferences,
          confidence_score: intelligence.confidenceScore,
          last_calculated_at: intelligence.lastCalculatedAt?.toISOString()
        });

      if (error) {
        console.error('Error saving notification intelligence:', error);
      }
    } catch (error) {
      console.error('Error in saveIntelligence:', error);
    }
  }

  /**
   * Get optimal send time for current moment
   */
  static async getOptimalSendTime(userId: string, notificationType: string): Promise<Date> {
    try {
      const { data: intelligence, error } = await supabase
        .from('notification_intelligence')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error || !intelligence) {
        // No intelligence data, send now
        return new Date();
      }

      const now = new Date();
      const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });
      const currentHour = now.getHours();

      const optimalTimes = (intelligence.optimal_send_times as any)?.[dayOfWeek];
      
      if (!optimalTimes?.length) {
        // No optimal times for today, send now
        return now;
      }

      // Find next optimal time
      const nextOptimalHour = optimalTimes
        .map((timeSlot: string) => parseInt(timeSlot))
        .find((hour: number) => hour > currentHour);

      if (nextOptimalHour) {
        // Send at next optimal time today
        const optimalTime = new Date(now);
        optimalTime.setHours(nextOptimalHour, 0, 0, 0);
        return optimalTime;
      } else {
        // Send at first optimal time tomorrow
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(parseInt(optimalTimes[0]), 0, 0, 0);
        return tomorrow;
      }
    } catch (error) {
      console.error('Error getting optimal send time:', error);
      return new Date(); // Fallback to now
    }
  }

  /**
   * Check if user is in an active therapy session
   */
  static async isInActiveSession(userId: string): Promise<boolean> {
    try {
      const { data: context, error } = await supabase
        .from('notification_context')
        .select('*')
        .eq('user_id', userId)
        .eq('context_type', 'session_active')
        .eq('is_active', true)
        .single();

      return !error && context !== null;
    } catch (error) {
      console.error('Error checking session status:', error);
      return false;
    }
  }

  /**
   * Set therapy session context
   */
  static async setSessionContext(
    userId: string, 
    isActive: boolean, 
    sessionData?: Record<string, any>
  ): Promise<void> {
    try {
      if (isActive) {
        // Mark session as active
        await supabase
          .from('notification_context')
          .upsert({
            user_id: userId,
            context_type: 'session_active',
            context_data: sessionData || {},
            is_active: true,
            expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() // 2 hours
          });
      } else {
        // Mark session as inactive
        await supabase
          .from('notification_context')
          .update({ is_active: false })
          .eq('user_id', userId)
          .eq('context_type', 'session_active');
      }
    } catch (error) {
      console.error('Error setting session context:', error);
    }
  }

  /**
   * Schedule therapy session notifications
   */
  static async scheduleSessionNotifications(
    userId: string,
    sessionTime: Date,
    sessionId?: string,
    therapistName?: string
  ): Promise<void> {
    try {
      const sessionContext = {
        session_id: sessionId,
        therapist_name: therapistName,
        session_time: sessionTime.toISOString()
      };

      // Pre-session reminder (15 minutes before)
      const preSessionTime = new Date(sessionTime.getTime() - 15 * 60 * 1000);
      await this.scheduleSessionNotification(
        userId,
        'pre_session',
        preSessionTime,
        sessionContext,
        sessionId
      );

      // Session starting reminder (at session time)
      await this.scheduleSessionNotification(
        userId,
        'reminder',
        sessionTime,
        sessionContext,
        sessionId
      );

      // Post-session assessment (30 minutes after)
      const postSessionTime = new Date(sessionTime.getTime() + 30 * 60 * 1000);
      await this.scheduleSessionNotification(
        userId,
        'post_session',
        postSessionTime,
        sessionContext,
        sessionId
      );
    } catch (error) {
      console.error('Error scheduling session notifications:', error);
    }
  }

  private static async scheduleSessionNotification(
    userId: string,
    type: string,
    scheduledFor: Date,
    sessionContext: Record<string, any>,
    sessionId?: string
  ): Promise<void> {
    try {
      await supabase
        .from('therapy_session_notifications')
        .insert({
          user_id: userId,
          session_id: sessionId,
          notification_type: type,
          scheduled_for: scheduledFor.toISOString(),
          session_context: sessionContext
        });
    } catch (error) {
      console.error('Error scheduling session notification:', error);
    }
  }

  /**
   * Detect and handle crisis situations
   */
  static async detectCrisisFromNotification(
    userId: string,
    notificationData: Record<string, any>
  ): Promise<CrisisEscalation | null> {
    try {
      // Crisis detection logic based on notification content and user data
      let escalationLevel: 1 | 2 | 3 | 4 = 1;
      const escalationData: Record<string, any> = { ...notificationData };

      // Check for crisis keywords in mood data or assessments
      const crisisKeywords = ['suicide', 'harm', 'hopeless', 'crisis', 'emergency'];
      const content = JSON.stringify(notificationData).toLowerCase();
      
      if (crisisKeywords.some(keyword => content.includes(keyword))) {
        escalationLevel = 4; // Crisis level
      } else if (notificationData.mood_score && notificationData.mood_score < 2) {
        escalationLevel = 3; // Severe
      } else if (notificationData.assessment_score && notificationData.assessment_score > 15) {
        escalationLevel = 2; // Moderate
      }

      if (escalationLevel > 2) {
        // Create crisis escalation record
        const { data: escalation, error } = await supabase
          .from('crisis_notification_escalation')
          .insert({
            user_id: userId,
            escalation_level: escalationLevel,
            escalation_data: escalationData
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating crisis escalation:', error);
          return null;
        }

        // Send crisis notifications
        await this.handleCrisisEscalation(escalation);

        return {
          id: escalation.id,
          userId: escalation.user_id,
          escalationLevel: escalation.escalation_level as 1 | 2 | 3 | 4,
          escalationData: escalation.escalation_data as Record<string, any>,
          professionalNotified: escalation.professional_notified,
          emergencyContactsNotified: escalation.emergency_contacts_notified
        };
      }

      return null;
    } catch (error) {
      console.error('Error detecting crisis:', error);
      return null;
    }
  }

  private static async handleCrisisEscalation(escalation: any): Promise<void> {
    try {
      const escalationLevel = escalation.escalation_level;

      if (escalationLevel === 4) {
        // Crisis level - immediate professional notification
        await NotificationEngine.sendNotification({
          userId: escalation.user_id,
          type: 'crisis_alert',
          title: 'CRISIS ALERT - Immediate Attention Required',
          message: 'A user is experiencing a mental health crisis and requires immediate professional intervention.',
          priority: 'high',
          deliveryMethods: ['email', 'discord', 'slack'],
          data: { escalationId: escalation.id, level: 'crisis' }
        });

        // Notify emergency contacts
        await this.notifyEmergencyContacts(escalation.user_id, escalation);
      } else if (escalationLevel === 3) {
        // Severe - professional oversight needed
        await NotificationEngine.sendNotification({
          userId: escalation.user_id,
          type: 'professional_oversight',
          title: 'Professional Oversight Required',
          message: 'A user is showing signs of severe distress and may need professional support.',
          priority: 'high',
          deliveryMethods: ['email', 'slack'],
          data: { escalationId: escalation.id, level: 'severe' }
        });
      }
    } catch (error) {
      console.error('Error handling crisis escalation:', error);
    }
  }

  private static async notifyEmergencyContacts(userId: string, escalation: any): Promise<void> {
    try {
      const { data: contacts, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (error || !contacts?.length) {
        console.log('No emergency contacts found');
        return;
      }

      for (const contact of contacts) {
        // Send notification to emergency contact
        if (contact.email) {
          await NotificationEngine.sendNotification({
            userId: contact.user_id,
            type: 'emergency_contact_alert',
            title: 'Emergency Contact Alert',
            message: `This is an automated alert: Someone you care about may need immediate support. Please check on them or contact emergency services if necessary.`,
            priority: 'high',
            deliveryMethods: ['email'],
            data: { contactId: contact.id, escalationId: escalation.id }
          });
        }
      }

      // Mark emergency contacts as notified
      await supabase
        .from('crisis_notification_escalation')
        .update({ emergency_contacts_notified: true })
        .eq('id', escalation.id);
    } catch (error) {
      console.error('Error notifying emergency contacts:', error);
    }
  }

  /**
   * Create a custom notification through the notification engine
   */
  static async createCustomNotification(
    userId: string,
    type: string,
    title: string,
    message: string,
    priority: 'low' | 'medium' | 'high' = 'medium',
    data?: Record<string, any>
  ): Promise<boolean> {
    try {
      // Check for crisis indicators in the notification content
      await this.detectCrisisFromNotification(userId, { 
        type, 
        title, 
        message, 
        priority, 
        ...data 
      });

      // Send through notification engine with intelligent timing
      const optimalTime = await this.getOptimalSendTime(userId, type);
      
      await NotificationEngine.sendNotification({
        userId,
        type,
        title,
        message,
        priority,
        scheduledFor: optimalTime,
        data: {
          automated: false,
          custom: true,
          ...data
        }
      });

      return true;
    } catch (error) {
      console.error('Error creating custom notification:', error);
      return false;
    }
  }

  /**
   * Process session completion for intelligent notifications
   */
  static async processSessionCompletion(
    userId: string,
    sessionDetails: Record<string, any>
  ): Promise<void> {
    try {
      // Mark session as inactive
      await this.setSessionContext(userId, false);

      // Analyze session for insights and potential notifications
      const sessionInsights = await this.analyzeSessionForInsights(sessionDetails);
      
      if (sessionInsights.length > 0) {
        // Schedule follow-up notifications based on session insights
        for (const insight of sessionInsights) {
          await this.createCustomNotification(
            userId,
            insight.type,
            insight.title,
            insight.message,
            insight.priority,
            { sessionId: sessionDetails.id, insight: insight.data }
          );
        }
      }

      // Update notification intelligence with session completion data
      await this.calculateOptimalTiming(userId);
    } catch (error) {
      console.error('Error processing session completion:', error);
    }
  }

  /**
   * Analyze session for potential insights and notifications
   */
  private static async analyzeSessionForInsights(
    sessionDetails: Record<string, any>
  ): Promise<Array<{
    type: string;
    title: string;
    message: string;
    priority: 'low' | 'medium' | 'high';
    data: Record<string, any>;
  }>> {
    const insights = [];

    try {
      // Check session duration for engagement insight
      if (sessionDetails.duration && sessionDetails.duration > 45) {
        insights.push({
          type: 'engagement_insight',
          title: 'Great Session Engagement! 🌟',
          message: 'You had a really engaged session today. Consider scheduling your next session soon to maintain momentum.',
          priority: 'medium' as const,
          data: { sessionDuration: sessionDetails.duration }
        });
      }

      // Check for mood improvements
      if (sessionDetails.pre_mood && sessionDetails.post_mood) {
        const moodImprovement = sessionDetails.post_mood - sessionDetails.pre_mood;
        if (moodImprovement >= 2) {
          insights.push({
            type: 'mood_improvement',
            title: 'Mood Boost Detected! 💚',
            message: `Your mood improved significantly during this session. Great progress!`,
            priority: 'medium' as const,
            data: { moodImprovement, preMood: sessionDetails.pre_mood, postMood: sessionDetails.post_mood }
          });
        }
      }

      // Check for breakthrough moments or insights
      if (sessionDetails.insights && sessionDetails.insights.length > 0) {
        insights.push({
          type: 'insight_generated',
          title: 'New Insights Available 💡',
          message: 'You discovered some valuable insights in your last session. Take a moment to review them.',
          priority: 'medium' as const,
          data: { insightCount: sessionDetails.insights.length }
        });
      }

    } catch (error) {
      console.error('Error analyzing session insights:', error);
    }

    return insights;
  }
}