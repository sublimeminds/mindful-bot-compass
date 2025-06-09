
import { supabase } from '@/integrations/supabase/client';

export interface NotificationAnalytics {
  id: string;
  notificationId: string;
  userId: string;
  event: 'delivered' | 'viewed' | 'clicked' | 'dismissed';
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface NotificationMetrics {
  totalSent: number;
  totalViewed: number;
  totalClicked: number;
  deliveryRate: number;
  viewRate: number;
  clickRate: number;
  avgResponseTime: number;
  byType: Record<string, {
    sent: number;
    viewed: number;
    clicked: number;
    rate: number;
  }>;
  byTimeOfDay: Record<string, number>;
  byDayOfWeek: Record<string, number>;
}

export class NotificationAnalyticsService {
  static async trackEvent(
    notificationId: string,
    userId: string,
    event: 'delivered' | 'viewed' | 'clicked' | 'dismissed',
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      // Store analytics data using the notifications table with a special type
      await supabase
        .from('notifications')
        .insert({
          title: `Analytics: ${event}`,
          message: `User ${event} notification ${notificationId}`,
          type: 'analytics_event',
          user_id: userId,
          data: {
            original_notification_id: notificationId,
            event_type: event,
            metadata: metadata || {},
            timestamp: new Date().toISOString()
          }
        });
    } catch (error) {
      console.error('Error tracking notification event:', error);
    }
  }

  static async getMetrics(userId: string, dateRange?: { start: Date; end: Date }): Promise<NotificationMetrics> {
    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('type', 'analytics_event');

      if (dateRange) {
        query = query
          .gte('created_at', dateRange.start.toISOString())
          .lte('created_at', dateRange.end.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;

      return this.calculateMetrics(data || []);
    } catch (error) {
      console.error('Error fetching notification metrics:', error);
      return this.getEmptyMetrics();
    }
  }

  private static calculateMetrics(data: any[]): NotificationMetrics {
    const metrics = {
      totalSent: 0,
      totalViewed: 0,
      totalClicked: 0,
      deliveryRate: 0,
      viewRate: 0,
      clickRate: 0,
      avgResponseTime: 0,
      byType: {} as Record<string, any>,
      byTimeOfDay: {} as Record<string, number>,
      byDayOfWeek: {} as Record<string, number>
    };

    const events = data.map(item => {
      const eventData = item.data as any;
      return {
        event: eventData?.event_type || 'delivered',
        timestamp: new Date(item.created_at),
        notificationType: eventData?.notification_type || 'general'
      };
    });

    const delivered = events.filter(e => e.event === 'delivered');
    const viewed = events.filter(e => e.event === 'viewed');
    const clicked = events.filter(e => e.event === 'clicked');

    metrics.totalSent = delivered.length;
    metrics.totalViewed = viewed.length;
    metrics.totalClicked = clicked.length;

    metrics.deliveryRate = 100; // Assuming all tracked are delivered
    metrics.viewRate = metrics.totalSent > 0 ? (metrics.totalViewed / metrics.totalSent) * 100 : 0;
    metrics.clickRate = metrics.totalViewed > 0 ? (metrics.totalClicked / metrics.totalViewed) * 100 : 0;

    // Calculate metrics by type
    const typeGroups = events.reduce((acc, item) => {
      const type = item.notificationType || 'unknown';
      if (!acc[type]) acc[type] = { sent: 0, viewed: 0, clicked: 0 };
      
      if (item.event === 'delivered') acc[type].sent++;
      else if (item.event === 'viewed') acc[type].viewed++;
      else if (item.event === 'clicked') acc[type].clicked++;
      
      return acc;
    }, {});

    Object.keys(typeGroups).forEach(type => {
      const group = typeGroups[type];
      metrics.byType[type] = {
        ...group,
        rate: group.sent > 0 ? (group.viewed / group.sent) * 100 : 0
      };
    });

    // Calculate metrics by time of day and day of week
    events.forEach(item => {
      const date = item.timestamp;
      const hour = date.getHours();
      const day = date.toLocaleDateString('en', { weekday: 'long' });
      
      metrics.byTimeOfDay[hour] = (metrics.byTimeOfDay[hour] || 0) + 1;
      metrics.byDayOfWeek[day] = (metrics.byDayOfWeek[day] || 0) + 1;
    });

    return metrics;
  }

  private static getEmptyMetrics(): NotificationMetrics {
    return {
      totalSent: 0,
      totalViewed: 0,
      totalClicked: 0,
      deliveryRate: 0,
      viewRate: 0,
      clickRate: 0,
      avgResponseTime: 0,
      byType: {},
      byTimeOfDay: {},
      byDayOfWeek: {}
    };
  }
}
