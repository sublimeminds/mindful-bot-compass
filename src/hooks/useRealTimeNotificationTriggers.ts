import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealTimeNotificationTriggers } from '@/services/realTimeNotificationTriggers';
import { useSimpleApp } from './useSimpleApp';

export const useRealTimeNotificationTriggers = () => {
  const { user } = useSimpleApp();

  useEffect(() => {
    if (!user) return;

    // Set up real-time subscriptions for notification triggers
    const setupRealtimeSubscriptions = () => {
      // Listen for new therapy sessions
      const therapySessionsChannel = supabase
        .channel('therapy-sessions-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'therapy_sessions',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('New therapy session detected:', payload);
            RealTimeNotificationTriggers.onSessionComplete(user.id, payload.new);
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'therapy_sessions',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            // Trigger notification when session is marked as complete
            if (payload.new.end_time && !payload.old.end_time) {
              console.log('Therapy session completed:', payload);
              RealTimeNotificationTriggers.onSessionComplete(user.id, payload.new);
            }
          }
        )
        .subscribe();

      // Listen for new mood entries
      const moodEntriesChannel = supabase
        .channel('mood-entries-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'mood_entries',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('New mood entry detected:', payload);
            RealTimeNotificationTriggers.onMoodLogged(user.id, payload.new);
          }
        )
        .subscribe();

      // Listen for goal updates
      const goalsChannel = supabase
        .channel('goals-changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'goals',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            // Check if progress was updated
            if (payload.new.current_progress !== payload.old.current_progress) {
              console.log('Goal progress updated:', payload);
              RealTimeNotificationTriggers.onGoalProgress(user.id, payload.new);
            }
          }
        )
        .subscribe();

      // Listen for WhatsApp messages for crisis detection
      const whatsappChannel = supabase
        .channel('whatsapp-messages-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'whatsapp_messages',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            if (payload.new.sender_type === 'user') {
              console.log('New user message for crisis detection:', payload);
              RealTimeNotificationTriggers.detectCrisisSignals(user.id, payload.new.content);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(therapySessionsChannel);
        supabase.removeChannel(moodEntriesChannel);
        supabase.removeChannel(goalsChannel);
        supabase.removeChannel(whatsappChannel);
      };
    };

    const cleanup = setupRealtimeSubscriptions();

    return cleanup;
  }, [user]);

  // Manual trigger functions for testing
  const triggerTestNotifications = {
    sessionComplete: () => {
      if (user) {
        RealTimeNotificationTriggers.onSessionComplete(user.id, {
          id: 'test-session',
          type: 'therapy',
          duration: 45
        });
      }
    },
    moodLogged: (moodScore: number) => {
      if (user) {
        RealTimeNotificationTriggers.onMoodLogged(user.id, {
          overall: moodScore,
          anxiety: moodScore,
          depression: moodScore
        });
      }
    },
    goalProgress: (progress: number) => {
      if (user) {
        RealTimeNotificationTriggers.onGoalProgress(user.id, {
          id: 'test-goal',
          title: 'Daily Meditation',
          current_progress: progress
        });
      }
    },
    breathingReminder: () => {
      if (user) {
        RealTimeNotificationTriggers.triggerBreathingReminder(user.id, {
          trigger: 'manual_test'
        });
      }
    },
    crisisDetection: (message: string) => {
      if (user) {
        RealTimeNotificationTriggers.detectCrisisSignals(user.id, message);
      }
    }
  };

  return {
    triggerTestNotifications
  };
};