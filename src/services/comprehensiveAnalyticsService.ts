import { supabase } from '@/integrations/supabase/client';

export interface UserAnalytics {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  userGrowthRate: number;
  userRetention: number[];
  engagementMetrics: {
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
    averageSessionDuration: number;
    sessionsPerUser: number;
  };
}

export interface TherapyAnalytics {
  totalSessions: number;
  completedSessions: number;
  averageSessionDuration: number;
  moodImprovement: number;
  sessionsByTherapist: Array<{
    therapistId: string;
    therapistName: string;
    sessionCount: number;
    averageRating: number;
    moodImprovement: number;
  }>;
  sessionDistribution: Array<{
    date: string;
    sessions: number;
    completionRate: number;
  }>;
}

export interface CommunityAnalytics {
  totalGroups: number;
  activeGroups: number;
  totalMembers: number;
  averageGroupSize: number;
  postEngagement: {
    totalPosts: number;
    totalComments: number;
    totalLikes: number;
    engagementRate: number;
  };
  groupActivity: Array<{
    groupId: string;
    groupName: string;
    memberCount: number;
    activityScore: number;
    recentPosts: number;
  }>;
}

export interface PlatformHealth {
  uptime: number;
  responseTime: number;
  errorRate: number;
  alertsCount: number;
  systemMetrics: {
    cpuUsage: number;
    memoryUsage: number;
    storageUsage: number;
    databaseConnections: number;
  };
}

export interface BusinessMetrics {
  revenue: number;
  subscriptions: {
    total: number;
    active: number;
    churned: number;
    new: number;
  };
  conversionRates: {
    trialToSubscription: number;
    freeToTrial: number;
    visitorToSignup: number;
  };
  customerLifetimeValue: number;
  averageRevenuePerUser: number;
}

export class ComprehensiveAnalyticsService {
  static async getUserAnalytics(timeRange: { from: Date; to: Date }): Promise<UserAnalytics> {
    try {
      // Get total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get active users in the time range
      const { data: activeSessions } = await supabase
        .from('therapy_sessions')
        .select('user_id')
        .gte('start_time', timeRange.from.toISOString())
        .lte('start_time', timeRange.to.toISOString());

      const activeUsers = new Set(activeSessions?.map(s => s.user_id) || []).size;

      // Get new users in the time range
      const { count: newUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', timeRange.from.toISOString())
        .lte('created_at', timeRange.to.toISOString());

      // Calculate user growth rate
      const previousPeriodStart = new Date(timeRange.from);
      previousPeriodStart.setDate(previousPeriodStart.getDate() - (timeRange.to.getTime() - timeRange.from.getTime()) / (1000 * 60 * 60 * 24));

      const { count: previousUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', previousPeriodStart.toISOString())
        .lt('created_at', timeRange.from.toISOString());

      const userGrowthRate = previousUsers ? ((newUsers || 0) - (previousUsers || 0)) / (previousUsers || 1) * 100 : 0;

      // Get session data for engagement metrics
      const { data: sessions } = await supabase
        .from('therapy_sessions')
        .select('user_id, start_time, end_time')
        .gte('start_time', timeRange.from.toISOString())
        .lte('start_time', timeRange.to.toISOString());

      const completedSessions = sessions?.filter(s => s.end_time) || [];
      const averageSessionDuration = completedSessions.length > 0
        ? completedSessions.reduce((sum, session) => {
            const duration = (new Date(session.end_time).getTime() - new Date(session.start_time).getTime()) / (1000 * 60);
            return sum + duration;
          }, 0) / completedSessions.length
        : 0;

      const uniqueUsers = new Set(sessions?.map(s => s.user_id) || []).size;
      const sessionsPerUser = uniqueUsers > 0 ? (sessions?.length || 0) / uniqueUsers : 0;

      // Mock retention data (in real app, calculate from actual user behavior)
      const userRetention = [100, 75, 60, 45, 35, 30, 25, 22];

      return {
        totalUsers: totalUsers || 0,
        activeUsers,
        newUsers: newUsers || 0,
        userGrowthRate: Math.round(userGrowthRate * 10) / 10,
        userRetention,
        engagementMetrics: {
          dailyActiveUsers: activeUsers,
          weeklyActiveUsers: Math.round(activeUsers * 1.2),
          monthlyActiveUsers: Math.round(activeUsers * 1.5),
          averageSessionDuration: Math.round(averageSessionDuration),
          sessionsPerUser: Math.round(sessionsPerUser * 10) / 10
        }
      };
    } catch (error) {
      console.error('Error fetching user analytics:', error);
      throw error;
    }
  }

  static async getTherapyAnalytics(timeRange: { from: Date; to: Date }): Promise<TherapyAnalytics> {
    try {
      const { data: sessions } = await supabase
        .from('therapy_sessions')
        .select('*')
        .gte('start_time', timeRange.from.toISOString())
        .lte('start_time', timeRange.to.toISOString());

      const totalSessions = sessions?.length || 0;
      const completedSessions = sessions?.filter(s => s.end_time).length || 0;

      const completedSessionsData = sessions?.filter(s => s.end_time) || [];
      const averageSessionDuration = completedSessionsData.length > 0
        ? completedSessionsData.reduce((sum, session) => {
            const duration = (new Date(session.end_time).getTime() - new Date(session.start_time).getTime()) / (1000 * 60);
            return sum + duration;
          }, 0) / completedSessionsData.length
        : 0;

      // Calculate mood improvement
      const sessionsWithMood = sessions?.filter(s => s.mood_before != null && s.mood_after != null) || [];
      const moodImprovement = sessionsWithMood.length > 0
        ? sessionsWithMood.reduce((sum, session) => sum + (session.mood_after - session.mood_before), 0) / sessionsWithMood.length
        : 0;

      // Get therapist data
      const { data: therapists } = await supabase
        .from('therapist_personalities')
        .select('*')
        .eq('is_active', true);

      const sessionsByTherapist = (therapists || []).map(therapist => ({
        therapistId: therapist.id,
        therapistName: therapist.name,
        sessionCount: Math.floor(Math.random() * 50) + 10, // Mock data
        averageRating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
        moodImprovement: Math.round((Math.random() * 2 + 1) * 10) / 10
      }));

      // Generate session distribution data
      const sessionDistribution = [];
      const daysDiff = Math.ceil((timeRange.to.getTime() - timeRange.from.getTime()) / (1000 * 60 * 60 * 24));
      
      for (let i = 0; i < Math.min(daysDiff, 30); i++) {
        const date = new Date(timeRange.from);
        date.setDate(date.getDate() + i);
        
        const daySessions = sessions?.filter(s => {
          const sessionDate = new Date(s.start_time);
          return sessionDate.toDateString() === date.toDateString();
        }) || [];

        const dayCompleted = daySessions.filter(s => s.end_time).length;
        const completionRate = daySessions.length > 0 ? (dayCompleted / daySessions.length) * 100 : 0;

        sessionDistribution.push({
          date: date.toISOString().split('T')[0],
          sessions: daySessions.length,
          completionRate: Math.round(completionRate)
        });
      }

      return {
        totalSessions,
        completedSessions,
        averageSessionDuration: Math.round(averageSessionDuration),
        moodImprovement: Math.round(moodImprovement * 10) / 10,
        sessionsByTherapist,
        sessionDistribution
      };
    } catch (error) {
      console.error('Error fetching therapy analytics:', error);
      throw error;
    }
  }

  static async getCommunityAnalytics(): Promise<CommunityAnalytics> {
    try {
      const { count: totalGroups } = await supabase
        .from('support_groups')
        .select('*', { count: 'exact', head: true });

      const { count: activeGroups } = await supabase
        .from('support_groups')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      const { count: totalMembers } = await supabase
        .from('group_memberships')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      const averageGroupSize = totalGroups && totalMembers 
        ? Math.round((totalMembers / totalGroups) * 10) / 10
        : 0;

      // Get post engagement data
      const { count: totalPosts } = await supabase
        .from('community_posts')
        .select('*', { count: 'exact', head: true });

      const { data: posts } = await supabase
        .from('community_posts')
        .select('like_count, comment_count');

      const totalLikes = posts?.reduce((sum, post) => sum + (post.like_count || 0), 0) || 0;
      const totalComments = posts?.reduce((sum, post) => sum + (post.comment_count || 0), 0) || 0;
      const engagementRate = totalPosts ? ((totalLikes + totalComments) / totalPosts) * 100 : 0;

      // Get group activity data
      const { data: groups } = await supabase
        .from('support_groups')
        .select('id, name, current_members')
        .eq('is_active', true)
        .limit(10);

      const groupActivity = (groups || []).map(group => ({
        groupId: group.id,
        groupName: group.name,
        memberCount: group.current_members || 0,
        activityScore: Math.floor(Math.random() * 100) + 1, // Mock activity score
        recentPosts: Math.floor(Math.random() * 20) + 1
      }));

      return {
        totalGroups: totalGroups || 0,
        activeGroups: activeGroups || 0,
        totalMembers: totalMembers || 0,
        averageGroupSize,
        postEngagement: {
          totalPosts: totalPosts || 0,
          totalComments,
          totalLikes,
          engagementRate: Math.round(engagementRate * 10) / 10
        },
        groupActivity
      };
    } catch (error) {
      console.error('Error fetching community analytics:', error);
      throw error;
    }
  }

  static async getPlatformHealth(): Promise<PlatformHealth> {
    // Mock platform health data (in real app, this would come from monitoring services)
    return {
      uptime: 99.9,
      responseTime: 145,
      errorRate: 0.1,
      alertsCount: 2,
      systemMetrics: {
        cpuUsage: 23.5,
        memoryUsage: 67.2,
        storageUsage: 45.8,
        databaseConnections: 12
      }
    };
  }

  static async getBusinessMetrics(): Promise<BusinessMetrics> {
    try {
      const { count: totalSubscriptions } = await supabase
        .from('user_subscriptions')
        .select('*', { count: 'exact', head: true });

      const { count: activeSubscriptions } = await supabase
        .from('user_subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      const { count: canceledSubscriptions } = await supabase
        .from('user_subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'canceled');

      // Get recent subscriptions (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { count: newSubscriptions } = await supabase
        .from('user_subscriptions')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString());

      // Mock revenue and conversion data
      const revenue = (activeSubscriptions || 0) * 29.99; // Assuming $29.99/month average
      const customerLifetimeValue = revenue * 12; // Assuming 12 month average
      const averageRevenuePerUser = (totalSubscriptions || 0) > 0 ? revenue / (totalSubscriptions || 1) : 0;

      return {
        revenue,
        subscriptions: {
          total: totalSubscriptions || 0,
          active: activeSubscriptions || 0,
          churned: canceledSubscriptions || 0,
          new: newSubscriptions || 0
        },
        conversionRates: {
          trialToSubscription: 15.5,
          freeToTrial: 8.2,
          visitorToSignup: 3.1
        },
        customerLifetimeValue,
        averageRevenuePerUser
      };
    } catch (error) {
      console.error('Error fetching business metrics:', error);
      throw error;
    }
  }

  static async generateInsights(timeRange: { from: Date; to: Date }): Promise<Array<{
    title: string;
    description: string;
    type: 'positive' | 'negative' | 'neutral';
    priority: 'high' | 'medium' | 'low';
    actionable: boolean;
  }>> {
    try {
      const [userAnalytics, therapyAnalytics, communityAnalytics] = await Promise.all([
        this.getUserAnalytics(timeRange),
        this.getTherapyAnalytics(timeRange),
        this.getCommunityAnalytics()
      ]);

      const insights = [];

      // User growth insights
      if (userAnalytics.userGrowthRate > 10) {
        insights.push({
          title: 'Strong User Growth',
          description: `User base grew by ${userAnalytics.userGrowthRate}% this period, indicating strong market demand.`,
          type: 'positive' as const,
          priority: 'high' as const,
          actionable: false
        });
      } else if (userAnalytics.userGrowthRate < 0) {
        insights.push({
          title: 'User Growth Concern',
          description: `User growth declined by ${Math.abs(userAnalytics.userGrowthRate)}%. Consider reviewing acquisition strategies.`,
          type: 'negative' as const,
          priority: 'high' as const,
          actionable: true
        });
      }

      // Engagement insights
      if (userAnalytics.engagementMetrics.sessionsPerUser > 5) {
        insights.push({
          title: 'High User Engagement',
          description: `Users are highly engaged with an average of ${userAnalytics.engagementMetrics.sessionsPerUser} sessions each.`,
          type: 'positive' as const,
          priority: 'medium' as const,
          actionable: false
        });
      }

      // Mood improvement insights
      if (therapyAnalytics.moodImprovement > 2) {
        insights.push({
          title: 'Excellent Therapy Outcomes',
          description: `Average mood improvement of ${therapyAnalytics.moodImprovement} points shows strong therapeutic value.`,
          type: 'positive' as const,
          priority: 'high' as const,
          actionable: false
        });
      }

      // Community engagement insights
      if (communityAnalytics.postEngagement.engagementRate > 50) {
        insights.push({
          title: 'Active Community',
          description: `Community engagement rate of ${communityAnalytics.postEngagement.engagementRate}% shows strong member participation.`,
          type: 'positive' as const,
          priority: 'medium' as const,
          actionable: false
        });
      }

      return insights;
    } catch (error) {
      console.error('Error generating insights:', error);
      return [];
    }
  }
}

export default ComprehensiveAnalyticsService;