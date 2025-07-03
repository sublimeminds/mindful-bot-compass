
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSession } from '@/contexts/SessionContext';
import { useIntelligentNotifications } from '@/hooks/useIntelligentNotifications';
import { useSmartNotificationTriggers } from '@/hooks/useSmartNotificationTriggers';
import { NotificationService } from '@/services/notificationService';
import { PersonalizationService } from '@/services/personalizationService';

export const useComprehensiveNotifications = () => {
  const { user } = useAuth();
  const { currentSession } = useSession();
  const { triggerCustomNotification } = useIntelligentNotifications();
  const { runTriggerCheck } = useSmartNotificationTriggers();

  // Run comprehensive notification checks
  useEffect(() => {
    if (!user) return;

    const runNotificationChecks = async () => {
      // Run smart trigger checks
      runTriggerCheck();

      // Check for session reminders based on user preferences
      const preferences = await PersonalizationService.getUserProfile(user.id);
      const optimalTime = await PersonalizationService.getOptimalSessionTime(user.id);
      
      if (preferences && optimalTime !== 'Any time') {
        const currentHour = new Date().getHours();
        const isOptimalTime = 
          (optimalTime === 'Morning' && currentHour >= 6 && currentHour < 12) ||
          (optimalTime === 'Afternoon' && currentHour >= 12 && currentHour < 17) ||
          (optimalTime === 'Evening' && currentHour >= 17 && currentHour < 21);

        if (isOptimalTime && !currentSession) {
          await triggerCustomNotification(
            'session_reminder',
            'Perfect Time for Therapy',
            `It's your optimal time for a therapy session. How are you feeling today?`,
            'medium',
            { optimalTime, currentHour }
          );
        }
      }
    };

    // Run checks every hour
    const interval = setInterval(runNotificationChecks, 60 * 60 * 1000);
    
    // Run initial check
    runNotificationChecks();

    return () => clearInterval(interval);
  }, [user, currentSession, triggerCustomNotification, runTriggerCheck]);

  return {
    triggerCustomNotification
  };
};
