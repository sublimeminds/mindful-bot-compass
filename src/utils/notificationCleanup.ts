import { supabase } from '@/integrations/supabase/client';

export class NotificationCleanup {
  // Remove mock/test notifications and replace with real data
  static async cleanupMockData(): Promise<void> {
    try {
      console.log('Starting notification cleanup...');
      
      // Remove test notifications
      const { error: deleteError } = await supabase
        .from('notifications')
        .delete()
        .or('title.ilike.%test%,title.ilike.%mock%,data->test.eq.true');

      if (deleteError) {
        console.error('Error deleting mock notifications:', deleteError);
        return;
      }

      // Remove notifications without proper user context
      await supabase
        .from('notifications')
        .delete()
        .is('data', null);

      console.log('Mock notification cleanup completed');
    } catch (error) {
      console.error('Error in notification cleanup:', error);
    }
  }

  // Activate the notification cron job system
  static async activateNotificationSystem(): Promise<{ success: boolean; message: string }> {
    try {
      console.log('Activating notification system...');

      // Call the setup-cron-job function
      const { data, error } = await supabase.functions.invoke('setup-cron-job');

      if (error) {
        console.error('Error activating cron job:', error);
        return { success: false, message: `Failed to activate: ${error.message}` };
      }

      console.log('Cron job setup response:', data);

      // Also call the notification generation function once to populate initial data
      const { data: notificationData, error: notificationError } = await supabase.functions.invoke('generate-intelligent-notifications');

      if (notificationError) {
        console.warn('Warning: Initial notification generation failed:', notificationError);
      } else {
        console.log('Initial notifications generated:', notificationData);
      }

      return { 
        success: true, 
        message: 'Notification system activated successfully. Cron jobs are now running.' 
      };
    } catch (error) {
      console.error('Error activating notification system:', error);
      return { 
        success: false, 
        message: `System activation failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  // Initialize notification system for the application
  static async initializeNotificationSystem(): Promise<void> {
    try {
      // Clean up any existing mock data
      await this.cleanupMockData();

      // Activate the notification system
      const result = await this.activateNotificationSystem();
      
      if (result.success) {
        console.log('✅ Notification system initialized successfully');
      } else {
        console.error('❌ Failed to initialize notification system:', result.message);
      }
    } catch (error) {
      console.error('Error initializing notification system:', error);
    }
  }

  // Create sample real notifications for demo/testing
  static async createSampleRealNotifications(userId: string): Promise<void> {
    try {
      const sampleNotifications = [
        {
          type: 'session_reminder',
          title: 'Daily Check-in Reminder',
          message: 'Take a few minutes to reflect on your day and log your mood.',
          priority: 'medium' as const,
          data: {
            automated: true,
            trigger: 'daily_reminder',
            timestamp: new Date().toISOString()
          }
        },
        {
          type: 'milestone_achieved',
          title: 'Welcome to Your Mental Health Journey! 🌱',
          message: 'You\'ve taken the first step by joining our platform. We\'re here to support you every step of the way.',
          priority: 'high' as const,
          data: {
            automated: true,
            milestone: 'platform_joined',
            achievement_date: new Date().toISOString()
          }
        },
        {
          type: 'insight_generated',
          title: 'Personalized Insight Available',
          message: 'Based on your recent activities, we\'ve generated a personalized insight to help your wellness journey.',
          priority: 'medium' as const,
          data: {
            automated: true,
            insight_type: 'activity_pattern',
            generated_at: new Date().toISOString()
          }
        }
      ];

      for (const notification of sampleNotifications) {
        await supabase
          .from('notifications')
          .insert({
            user_id: userId,
            ...notification
          });
      }

      console.log('Sample real notifications created for user:', userId);
    } catch (error) {
      console.error('Error creating sample notifications:', error);
    }
  }
}