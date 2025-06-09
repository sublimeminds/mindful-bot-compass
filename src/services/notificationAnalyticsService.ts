
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
      await supabase
        .from('notification_analytics')
        .insert({
          notification_id: notificationId,
          user_id: userId,
          event,
          metadata: metadata || {}
        });
    } catch (error) {
      console.error('Error tracking notification event:', error);
    }
  }

  static async getMetrics(userId: string, dateRange?: { start: Date; end: Date }): Promise<NotificationMetrics> {
    try {
      let query = supabase
        .from('notification_analytics')
        .select(`
          *,
          notifications!inner(type, priority, created_at)
        `)
        .eq('user_id', userId);

      if (dateRange) {
        query = query
          .gte('timestamp', dateRange.start.toISOString())
          .lte('timestamp', dateRange.end.toISOString());
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

    const delivered = data.filter(d => d.event === 'delivered');
    const viewed = data.filter(d => d.event === 'viewed');
    const clicked = data.filter(d => d.event === 'clicked');

    metrics.totalSent = delivered.length;
    metrics.totalViewed = viewed.length;
    metrics.totalClicked = clicked.length;

    metrics.deliveryRate = 100; // Assuming all tracked are delivered
    metrics.viewRate = metrics.totalSent > 0 ? (metrics.totalViewed / metrics.totalSent) * 100 : 0;
    metrics.clickRate = metrics.totalViewed > 0 ? (metrics.totalClicked / metrics.totalViewed) * 100 : 0;

    // Calculate metrics by type
    const typeGroups = data.reduce((acc, item) => {
      const type = item.notifications?.type || 'unknown';
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
    data.forEach(item => {
      const date = new Date(item.timestamp);
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
