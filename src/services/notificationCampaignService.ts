import { supabase } from '@/integrations/supabase/client';
import { NotificationEngine } from './notificationEngine';

export interface NotificationCampaign {
  id: string;
  name: string;
  description?: string;
  campaignType: 'onboarding' | 'retention' | 'engagement' | 'educational';
  targetAudience: Record<string, any>;
  notificationSequence: CampaignStep[];
  personalizationRules: Record<string, any>;
  scheduling: Record<string, any>;
  status: 'draft' | 'scheduled' | 'running' | 'completed' | 'paused';
  metrics: Record<string, any>;
  startedAt?: Date;
  completedAt?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CampaignStep {
  id: string;
  stepOrder: number;
  title: string;
  message: string;
  delayHours: number;
  triggerConditions?: Record<string, any>;
  deliveryMethods: string[];
  personalization?: Record<string, any>;
}

export interface CampaignEnrollment {
  id: string;
  campaignId: string;
  userId: string;
  currentStep: number;
  enrollmentData: Record<string, any>;
  completionStatus: 'active' | 'completed' | 'opted_out' | 'failed';
  enrolledAt: Date;
  completedAt?: Date;
}

export class NotificationCampaignService {
  /**
   * Create a new notification campaign
   */
  static async createCampaign(campaign: Partial<NotificationCampaign>): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('notification_campaigns')
        .insert({
          name: campaign.name,
          description: campaign.description,
          campaign_type: campaign.campaignType,
          target_audience: campaign.targetAudience,
          notification_sequence: campaign.notificationSequence as any,
          personalization_rules: campaign.personalizationRules || {},
          scheduling: campaign.scheduling,
          status: campaign.status || 'draft',
          created_by: campaign.createdBy
        })
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating campaign:', error);
      return null;
    }
  }

  /**
   * Get campaign by ID
   */
  static async getCampaign(campaignId: string): Promise<NotificationCampaign | null> {
    try {
      const { data, error } = await supabase
        .from('notification_campaigns')
        .select('*')
        .eq('id', campaignId)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        description: data.description,
        campaignType: data.campaign_type as 'onboarding' | 'retention' | 'engagement' | 'educational',
        targetAudience: data.target_audience as Record<string, any>,
        notificationSequence: (data.notification_sequence as any) || [],
        personalizationRules: data.personalization_rules as Record<string, any>,
        scheduling: data.scheduling as Record<string, any>,
        status: data.status as 'draft' | 'scheduled' | 'running' | 'completed' | 'paused',
        metrics: data.metrics as Record<string, any>,
        startedAt: data.started_at ? new Date(data.started_at) : undefined,
        completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
        createdBy: data.created_by,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      console.error('Error fetching campaign:', error);
      return null;
    }
  }

  /**
   * Start a campaign
   */
  static async startCampaign(campaignId: string): Promise<boolean> {
    try {
      const campaign = await this.getCampaign(campaignId);
      if (!campaign) return false;

      // Update campaign status to running
      await supabase
        .from('notification_campaigns')
        .update({
          status: 'running',
          started_at: new Date().toISOString()
        })
        .eq('id', campaignId);

      // Enroll eligible users
      await this.enrollEligibleUsers(campaign);

      return true;
    } catch (error) {
      console.error('Error starting campaign:', error);
      return false;
    }
  }

  /**
   * Enroll eligible users in a campaign
   */
  private static async enrollEligibleUsers(campaign: NotificationCampaign): Promise<void> {
    try {
      // Get eligible users based on target audience criteria
      const eligibleUsers = await this.getEligibleUsers(campaign.targetAudience);

      // Enroll each user
      for (const userId of eligibleUsers) {
        await this.enrollUser(campaign.id, userId);
      }
    } catch (error) {
      console.error('Error enrolling users:', error);
    }
  }

  /**
   * Get users that match target audience criteria
   */
  private static async getEligibleUsers(targetAudience: Record<string, any>): Promise<string[]> {
    try {
      let query = supabase.from('profiles').select('id');

      // Apply filters based on target audience criteria
      if (targetAudience.subscriptionPlan) {
        query = query.eq('subscription_plan', targetAudience.subscriptionPlan);
      }

      if (targetAudience.joinedAfter) {
        query = query.gte('created_at', targetAudience.joinedAfter);
      }

      if (targetAudience.joinedBefore) {
        query = query.lte('created_at', targetAudience.joinedBefore);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data.map(user => user.id);
    } catch (error) {
      console.error('Error getting eligible users:', error);
      return [];
    }
  }

  /**
   * Enroll a user in a campaign
   */
  static async enrollUser(campaignId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('campaign_enrollments')
        .insert({
          campaign_id: campaignId,
          user_id: userId,
          current_step: 0,
          enrollment_data: {},
          completion_status: 'active'
        });

      if (error) throw error;

      // Schedule first step
      await this.scheduleNextStep(campaignId, userId, 0);

      return true;
    } catch (error) {
      console.error('Error enrolling user:', error);
      return false;
    }
  }

  /**
   * Schedule the next step for a user in a campaign
   */
  static async scheduleNextStep(
    campaignId: string,
    userId: string,
    currentStep: number
  ): Promise<void> {
    try {
      const campaign = await this.getCampaign(campaignId);
      if (!campaign) return;

      const nextStepIndex = currentStep;
      const nextStep = campaign.notificationSequence[nextStepIndex];
      
      if (!nextStep) {
        // Campaign completed for this user
        await this.completeUserCampaign(campaignId, userId);
        return;
      }

      // Calculate when to send the next notification
      const sendAt = new Date(Date.now() + nextStep.delayHours * 60 * 60 * 1000);

      // Schedule the notification
      await NotificationEngine.sendNotification({
        userId,
        type: 'campaign_step',
        title: nextStep.title,
        message: nextStep.message,
        priority: 'medium',
        scheduledFor: sendAt,
        deliveryMethods: nextStep.deliveryMethods,
        data: {
          campaignId,
          stepId: nextStep.id,
          stepOrder: nextStep.stepOrder
        }
      });

      // Update user's current step
      await supabase
        .from('campaign_enrollments')
        .update({ current_step: nextStepIndex + 1 })
        .eq('campaign_id', campaignId)
        .eq('user_id', userId);
    } catch (error) {
      console.error('Error scheduling next step:', error);
    }
  }

  /**
   * Complete a user's campaign enrollment
   */
  private static async completeUserCampaign(campaignId: string, userId: string): Promise<void> {
    try {
      await supabase
        .from('campaign_enrollments')
        .update({
          completion_status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('campaign_id', campaignId)
        .eq('user_id', userId);
    } catch (error) {
      console.error('Error completing user campaign:', error);
    }
  }

  /**
   * Opt user out of a campaign
   */
  static async optOutUser(campaignId: string, userId: string): Promise<boolean> {
    try {
      await supabase
        .from('campaign_enrollments')
        .update({
          completion_status: 'opted_out',
          completed_at: new Date().toISOString()
        })
        .eq('campaign_id', campaignId)
        .eq('user_id', userId);

      return true;
    } catch (error) {
      console.error('Error opting out user:', error);
      return false;
    }
  }

  /**
   * Get campaign metrics
   */
  static async getCampaignMetrics(campaignId: string): Promise<Record<string, any>> {
    try {
      // Get enrollment stats
      const { data: enrollments } = await supabase
        .from('campaign_enrollments')
        .select('completion_status, current_step, enrolled_at, completed_at')
        .eq('campaign_id', campaignId);

      if (!enrollments) return {};

      const totalEnrolled = enrollments.length;
      const completed = enrollments.filter(e => e.completion_status === 'completed').length;
      const optedOut = enrollments.filter(e => e.completion_status === 'opted_out').length;
      const active = enrollments.filter(e => e.completion_status === 'active').length;

      const completionRate = totalEnrolled > 0 ? (completed / totalEnrolled) * 100 : 0;
      const optOutRate = totalEnrolled > 0 ? (optedOut / totalEnrolled) * 100 : 0;

      // Calculate average completion time
      const completedEnrollments = enrollments.filter(e => e.completed_at);
      const averageCompletionTime = completedEnrollments.length > 0
        ? completedEnrollments.reduce((sum, e) => {
            const duration = new Date(e.completed_at!).getTime() - new Date(e.enrolled_at).getTime();
            return sum + duration;
          }, 0) / completedEnrollments.length
        : 0;

      return {
        totalEnrolled,
        completed,
        optedOut,
        active,
        completionRate,
        optOutRate,
        averageCompletionTimeHours: averageCompletionTime / (1000 * 60 * 60),
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting campaign metrics:', error);
      return {};
    }
  }

  /**
   * Process campaign step completion
   */
  static async processCampaignStepCompletion(
    userId: string,
    notificationData: Record<string, any>
  ): Promise<void> {
    try {
      const campaignId = notificationData.campaignId;
      const stepOrder = notificationData.stepOrder;

      if (!campaignId || stepOrder === undefined) return;

      // Schedule next step
      await this.scheduleNextStep(campaignId, userId, stepOrder);

      // Update campaign metrics
      const metrics = await this.getCampaignMetrics(campaignId);
      
      await supabase
        .from('notification_campaigns')
        .update({ metrics })
        .eq('id', campaignId);
    } catch (error) {
      console.error('Error processing campaign step completion:', error);
    }
  }
}