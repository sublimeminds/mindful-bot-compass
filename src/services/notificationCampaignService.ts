import { supabase } from '@/integrations/supabase/client';
import { EnhancedNotificationService } from './enhancedNotificationService';

const enhancedNotificationService = new EnhancedNotificationService();

export interface CampaignStep {
  id: string;
  stepNumber: number;
  title: string;
  message: string;
  delayHours: number;
  condition?: {
    type: 'engagement' | 'mood_check' | 'session_completion' | 'goal_progress';
    threshold?: number;
  };
  channels: string[];
  priority: 'low' | 'medium' | 'high';
}

export interface NotificationCampaign {
  id: string;
  name: string;
  description: string;
  triggerType: 'onboarding' | 'engagement' | 'retention' | 'wellness_check';
  isActive: boolean;
  steps: CampaignStep[];
  targetAudience: {
    planTypes?: string[];
    activityLevel?: 'low' | 'medium' | 'high';
    riskLevel?: 'low' | 'moderate' | 'high';
  };
  abTestConfig?: {
    enabled: boolean;
    variants: Array<{
      name: string;
      percentage: number;
      stepOverrides: Partial<CampaignStep>[];
    }>;
  };
  stats: {
    sent: number;
    delivered: number;
    engaged: number;
    completed: number;
  };
}

export interface UserCampaignProgress {
  userId: string;
  campaignId: string;
  currentStep: number;
  startedAt: Date;
  lastStepAt?: Date;
  completedAt?: Date;
  abTestVariant?: string;
  engagementEvents: Array<{
    stepId: string;
    event: 'sent' | 'delivered' | 'opened' | 'clicked' | 'completed';
    timestamp: Date;
  }>;
}

class NotificationCampaignService {
  private campaigns: Map<string, NotificationCampaign> = new Map();
  private userProgress: Map<string, UserCampaignProgress[]> = new Map();

  constructor() {
    this.initializeDefaultCampaigns();
  }

  private initializeDefaultCampaigns() {
    const onboardingCampaign: NotificationCampaign = {
      id: 'onboarding-sequence',
      name: 'Welcome & Onboarding',
      description: 'Guide new users through their first week',
      triggerType: 'onboarding',
      isActive: true,
      steps: [
        {
          id: 'welcome',
          stepNumber: 1,
          title: 'Welcome to TherapySync! 🌟',
          message: "Welcome to your personal wellness journey! Let's start with a quick mood check-in.",
          delayHours: 0,
          channels: ['push', 'email'],
          priority: 'high'
        },
        {
          id: 'first-session',
          stepNumber: 2,
          title: 'Ready for your first session?',
          message: "You've been with us for 24 hours! Ready to have your first AI therapy conversation?",
          delayHours: 24,
          channels: ['push', 'whatsapp'],
          priority: 'medium'
        },
        {
          id: 'goal-setting',
          stepNumber: 3,
          title: 'Set your wellness goals',
          message: "Great progress! Let's set some personal wellness goals to keep you motivated.",
          delayHours: 72,
          condition: { type: 'session_completion', threshold: 1 },
          channels: ['push', 'email'],
          priority: 'medium'
        },
        {
          id: 'week-one-checkin',
          stepNumber: 4,
          title: 'Your first week reflection',
          message: "It's been a week! How are you feeling about your wellness journey so far?",
          delayHours: 168,
          channels: ['push', 'whatsapp', 'email'],
          priority: 'high'
        }
      ],
      targetAudience: {},
      abTestConfig: {
        enabled: true,
        variants: [
          { name: 'friendly', percentage: 50, stepOverrides: [] },
          { name: 'professional', percentage: 50, stepOverrides: [
            { title: 'Welcome to TherapySync', message: 'Begin your evidence-based wellness journey with personalized AI support.' }
          ] }
        ]
      },
      stats: { sent: 0, delivered: 0, engaged: 0, completed: 0 }
    };

    const retentionCampaign: NotificationCampaign = {
      id: 'retention-sequence',
      name: 'Re-engagement Campaign',
      description: 'Win back inactive users',
      triggerType: 'retention',
      isActive: true,
      steps: [
        {
          id: 'we-miss-you',
          stepNumber: 1,
          title: 'We miss you! 💙',
          message: "It's been a while since your last session. Your wellness journey is waiting for you.",
          delayHours: 0,
          channels: ['push', 'email'],
          priority: 'medium'
        },
        {
          id: 'special-offer',
          stepNumber: 2,
          title: 'Come back with a free session',
          message: "We've unlocked a complimentary premium session just for you. No commitments, just care.",
          delayHours: 72,
          channels: ['email', 'whatsapp'],
          priority: 'high'
        },
        {
          id: 'final-check',
          stepNumber: 3,
          title: 'Your wellness matters',
          message: "This is our final check-in. Remember, taking care of your mental health is always worth it.",
          delayHours: 168,
          channels: ['email'],
          priority: 'low'
        }
      ],
      targetAudience: { activityLevel: 'low' },
      stats: { sent: 0, delivered: 0, engaged: 0, completed: 0 }
    };

    this.campaigns.set(onboardingCampaign.id, onboardingCampaign);
    this.campaigns.set(retentionCampaign.id, retentionCampaign);
  }

  async startCampaign(userId: string, campaignId: string): Promise<void> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign || !campaign.isActive) {
      console.log(`Campaign ${campaignId} not found or inactive`);
      return;
    }

    // Check if user already has this campaign running
    const existingProgress = await this.getUserCampaignProgress(userId, campaignId);
    if (existingProgress) {
      console.log(`User ${userId} already has campaign ${campaignId} in progress`);
      return;
    }

    // Determine A/B test variant
    let abTestVariant = 'default';
    if (campaign.abTestConfig?.enabled) {
      const random = Math.random() * 100;
      let cumulative = 0;
      for (const variant of campaign.abTestConfig.variants) {
        cumulative += variant.percentage;
        if (random <= cumulative) {
          abTestVariant = variant.name;
          break;
        }
      }
    }

    // Create user progress record
    const progress: UserCampaignProgress = {
      userId,
      campaignId,
      currentStep: 1,
      startedAt: new Date(),
      abTestVariant,
      engagementEvents: []
    };

    // Store progress
    await this.saveUserProgress(progress);

    // Send first step immediately
    await this.sendCampaignStep(campaign, campaign.steps[0], userId, abTestVariant);

    // Schedule subsequent steps
    this.scheduleRemainingSteps(campaign, userId, abTestVariant);

    console.log(`Started campaign ${campaignId} for user ${userId} with variant ${abTestVariant}`);
  }

  private async sendCampaignStep(
    campaign: NotificationCampaign, 
    step: CampaignStep, 
    userId: string, 
    variant: string
  ): Promise<void> {
    // Apply A/B test overrides
    let finalStep = { ...step };
    if (campaign.abTestConfig?.enabled) {
      const variantConfig = campaign.abTestConfig.variants.find(v => v.name === variant);
      if (variantConfig) {
        const override = variantConfig.stepOverrides.find(o => o.id === step.id);
        if (override) {
          finalStep = { ...finalStep, ...override };
        }
      }
    }

    // Check condition if specified
    if (step.condition && !await this.checkCondition(userId, step.condition)) {
      console.log(`Skipping step ${step.id} for user ${userId} - condition not met`);
      return;
    }

    // Send notification through selected channels
    for (const channel of finalStep.channels) {
      try {
        // Send notification through selected channels (demo mode)
        console.log(`Sending ${channel} notification to user ${userId}:`, {
          title: finalStep.title,
          message: finalStep.message,
          campaignId: campaign.id,
          stepId: step.id,
          variant
        });

        // Track engagement
        await this.trackEngagement(userId, campaign.id, step.id, 'sent');
      } catch (error) {
        console.error(`Error sending ${channel} notification:`, error);
      }
    }
  }

  private async checkCondition(userId: string, condition: CampaignStep['condition']): Promise<boolean> {
    if (!condition) return true;

    switch (condition.type) {
      case 'session_completion':
        const { data: sessions } = await supabase
          .from('therapy_sessions')
          .select('id')
          .eq('user_id', userId)
          .not('end_time', 'is', null);
        return (sessions?.length || 0) >= (condition.threshold || 1);

      case 'mood_check':
        const { data: moods } = await supabase
          .from('mood_entries')
          .select('overall')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        return moods ? moods.overall >= (condition.threshold || 3) : false;

      case 'goal_progress':
        const { data: goals } = await supabase
          .from('goals')
          .select('current_progress')
          .eq('user_id', userId)
          .gte('current_progress', condition.threshold || 25);
        return (goals?.length || 0) > 0;

      default:
        return true;
    }
  }

  private scheduleRemainingSteps(campaign: NotificationCampaign, userId: string, variant: string): void {
    const remainingSteps = campaign.steps.slice(1);
    
    remainingSteps.forEach(step => {
      setTimeout(async () => {
        await this.sendCampaignStep(campaign, step, userId, variant);
      }, step.delayHours * 60 * 60 * 1000);
    });
  }

  async trackEngagement(userId: string, campaignId: string, stepId: string, event: string): Promise<void> {
    const progress = await this.getUserCampaignProgress(userId, campaignId);
    if (!progress) return;

    progress.engagementEvents.push({
      stepId,
      event: event as any,
      timestamp: new Date()
    });

    await this.saveUserProgress(progress);

    // Update campaign stats
    const campaign = this.campaigns.get(campaignId);
    if (campaign) {
      switch (event) {
        case 'sent': campaign.stats.sent++; break;
        case 'delivered': campaign.stats.delivered++; break;
        case 'opened': campaign.stats.engaged++; break;
        case 'completed': campaign.stats.completed++; break;
      }
    }
  }

  async getCampaignAnalytics(campaignId: string) {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) return null;

    // Calculate step-by-step conversion rates
    const stepAnalytics = campaign.steps.map(step => {
      const stepEvents = this.getAllEngagementEvents()
        .filter(e => e.campaignId === campaignId && e.stepId === step.id);
      
      const sent = stepEvents.filter(e => e.event === 'sent').length;
      const delivered = stepEvents.filter(e => e.event === 'delivered').length;
      const opened = stepEvents.filter(e => e.event === 'opened').length;
      
      return {
        stepId: step.id,
        title: step.title,
        sent,
        delivered,
        opened,
        deliveryRate: sent > 0 ? (delivered / sent) * 100 : 0,
        openRate: delivered > 0 ? (opened / delivered) * 100 : 0
      };
    });

    // A/B test results
    const abTestResults = campaign.abTestConfig?.enabled ? 
      this.calculateABTestResults(campaignId) : null;

    return {
      campaign: {
        id: campaign.id,
        name: campaign.name,
        stats: campaign.stats
      },
      stepAnalytics,
      abTestResults,
      overallConversionRate: campaign.stats.sent > 0 ? 
        (campaign.stats.completed / campaign.stats.sent) * 100 : 0
    };
  }

  private calculateABTestResults(campaignId: string) {
    const allProgress = this.getAllUserProgress()
      .filter(p => p.campaignId === campaignId && p.abTestVariant);

    const variants = [...new Set(allProgress.map(p => p.abTestVariant!))];
    
    return variants.map(variant => {
      const variantProgress = allProgress.filter(p => p.abTestVariant === variant);
      const completed = variantProgress.filter(p => p.completedAt).length;
      
      return {
        variant,
        users: variantProgress.length,
        completed,
        completionRate: variantProgress.length > 0 ? 
          (completed / variantProgress.length) * 100 : 0
      };
    });
  }

  // Storage methods (in production, these would use Supabase)
  private async saveUserProgress(progress: UserCampaignProgress): Promise<void> {
    const userProgressList = this.userProgress.get(progress.userId) || [];
    const existingIndex = userProgressList.findIndex(p => p.campaignId === progress.campaignId);
    
    if (existingIndex >= 0) {
      userProgressList[existingIndex] = progress;
    } else {
      userProgressList.push(progress);
    }
    
    this.userProgress.set(progress.userId, userProgressList);
  }

  private async getUserCampaignProgress(userId: string, campaignId: string): Promise<UserCampaignProgress | null> {
    const userProgressList = this.userProgress.get(userId) || [];
    return userProgressList.find(p => p.campaignId === campaignId) || null;
  }

  private getAllUserProgress(): UserCampaignProgress[] {
    const allProgress: UserCampaignProgress[] = [];
    for (const progressList of this.userProgress.values()) {
      allProgress.push(...progressList);
    }
    return allProgress;
  }

  private getAllEngagementEvents(): Array<{
    campaignId: string;
    stepId: string;
    event: string;
    timestamp: Date;
  }> {
    const events: any[] = [];
    for (const progressList of this.userProgress.values()) {
      for (const progress of progressList) {
        for (const event of progress.engagementEvents) {
          events.push({
            campaignId: progress.campaignId,
            stepId: event.stepId,
            event: event.event,
            timestamp: event.timestamp
          });
        }
      }
    }
    return events;
  }

  getAllCampaigns(): NotificationCampaign[] {
    return Array.from(this.campaigns.values());
  }

  getCampaign(id: string): NotificationCampaign | undefined {
    return this.campaigns.get(id);
  }

  async updateCampaign(campaign: NotificationCampaign): Promise<void> {
    this.campaigns.set(campaign.id, campaign);
  }
}

export const notificationCampaignService = new NotificationCampaignService();