import { supabase } from '@/integrations/supabase/client';
import { RealNotificationService } from './realNotificationService';

export class ContextualNotificationService {
  // Check user status and generate appropriate warnings
  static async generateUserWarnings(userId: string): Promise<void> {
    try {
      // Check if user has completed onboarding
      await this.checkOnboardingStatus(userId);
      
      // Check if user has therapy plans
      await this.checkTherapyPlanStatus(userId);
      
      // Generate welcome notification for new users
      await this.checkWelcomeStatus(userId);
      
    } catch (error) {
      console.error('Error generating user warnings:', error);
    }
  }

  // Check onboarding completion status
  private static async checkOnboardingStatus(userId: string): Promise<void> {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_complete')
        .eq('id', userId)
        .single();

      if (!profile?.onboarding_complete) {
        // Check if we already sent this notification recently
        const { data: existingNotification } = await supabase
          .from('notifications')
          .select('id')
          .eq('user_id', userId)
          .eq('type', 'progress_update')
          .eq('title', 'Complete Your Setup')
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
          .single();

        if (!existingNotification) {
          await RealNotificationService.createNotification(userId, {
            type: 'progress_update',
            title: 'Complete Your Setup',
            message: 'Complete your onboarding to unlock all TherapySync features and get personalized recommendations.',
            priority: 'medium',
            data: { 
              action: 'complete_onboarding',
              url: '/onboarding' 
            }
          });
        }
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    }
  }

  // Check therapy plan status
  private static async checkTherapyPlanStatus(userId: string): Promise<void> {
    try {
      const { data: therapyPlans } = await supabase
        .from('adaptive_therapy_plans')
        .select('id')
        .eq('user_id', userId)
        .limit(1);

      if (!therapyPlans || therapyPlans.length === 0) {
        // Check if we already sent this notification recently
        const { data: existingNotification } = await supabase
          .from('notifications')
          .select('id')
          .eq('user_id', userId)
          .eq('type', 'progress_update')
          .eq('title', 'Create Your Therapy Plan')
          .gte('created_at', new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString()) // Last 72 hours
          .single();

        if (!existingNotification) {
          await RealNotificationService.createNotification(userId, {
            type: 'progress_update',
            title: 'Create Your Therapy Plan',
            message: 'Get started with a personalized therapy plan tailored to your needs and goals.',
            priority: 'medium',
            data: { 
              action: 'create_therapy_plan',
              url: '/therapy-plans' 
            }
          });
        }
      }
    } catch (error) {
      console.error('Error checking therapy plan status:', error);
    }
  }

  // Check if user needs welcome notification
  private static async checkWelcomeStatus(userId: string): Promise<void> {
    try {
      // Check if user was created recently (within last 24 hours)
      const { data: user } = await supabase.auth.getUser();
      
      if (user.user) {
        const userCreatedAt = new Date(user.user.created_at);
        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        
        if (userCreatedAt > dayAgo) {
          // Check if we already sent welcome notification
          const { data: existingNotification } = await supabase
            .from('notifications')
            .select('id')
            .eq('user_id', userId)
            .eq('type', 'progress_update')
            .eq('title', 'Welcome to TherapySync!')
            .single();

          if (!existingNotification) {
            await RealNotificationService.createNotification(userId, {
              type: 'progress_update',
              title: 'Welcome to TherapySync!',
              message: 'Welcome to your personalized mental health journey. Let\'s start with completing your profile setup.',
              priority: 'high',
              data: { 
                action: 'welcome',
                isWelcome: true 
              }
            });
          }
        }
      }
    } catch (error) {
      console.error('Error checking welcome status:', error);
    }
  }

  // Generate milestone-based notifications
  static async checkMilestones(userId: string): Promise<void> {
    try {
      // Check session count milestones
      const { data: sessions } = await supabase
        .from('therapy_sessions')
        .select('id')
        .eq('user_id', userId);

      const sessionCount = sessions?.length || 0;
      
      // Milestone thresholds
      const milestones = [1, 5, 10, 25, 50, 100];
      
      for (const milestone of milestones) {
        if (sessionCount === milestone) {
          await RealNotificationService.generateMilestoneNotification(
            userId,
            `${milestone} Therapy Sessions`,
            `You've completed ${milestone} therapy sessions. Great progress on your mental health journey!`
          );
        }
      }
    } catch (error) {
      console.error('Error checking milestones:', error);
    }
  }

  // Generate inactivity warnings
  static async checkInactivity(userId: string): Promise<void> {
    try {
      const { data: lastSession } = await supabase
        .from('therapy_sessions')
        .select('end_time')
        .eq('user_id', userId)
        .order('end_time', { ascending: false })
        .limit(1)
        .single();

      if (lastSession) {
        const lastSessionDate = new Date(lastSession.end_time);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        if (lastSessionDate < weekAgo) {
          // Check if we already sent inactivity notification recently
          const { data: existingNotification } = await supabase
            .from('notifications')
            .select('id')
            .eq('user_id', userId)
            .eq('type', 'session_reminder')
            .eq('title', 'We Miss You!')
            .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
            .single();

          if (!existingNotification) {
            await RealNotificationService.createNotification(userId, {
              type: 'session_reminder',
              title: 'We Miss You!',
              message: 'It\'s been a while since your last session. Your mental health journey is important - let\'s continue together.',
              priority: 'medium',
              data: { 
                action: 'schedule_session',
                inactivityDays: Math.floor((Date.now() - lastSessionDate.getTime()) / (1000 * 60 * 60 * 24))
              }
            });
          }
        }
      }
    } catch (error) {
      console.error('Error checking inactivity:', error);
    }
  }

  // Check and generate all contextual notifications
  static async runContextualChecks(userId: string): Promise<void> {
    await Promise.all([
      this.generateUserWarnings(userId),
      this.checkMilestones(userId),
      this.checkInactivity(userId)
    ]);
  }
}