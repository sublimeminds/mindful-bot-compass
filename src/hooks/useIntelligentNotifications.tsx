
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSession } from '@/contexts/SessionContext';
import { IntelligentNotificationService } from '@/services/intelligentNotificationService';
import { SessionService } from '@/services/sessionService';
import { useToast } from '@/hooks/use-toast';

export const useIntelligentNotifications = () => {
  const { user } = useAuth();
  const { currentSession } = useSession();
  const { toast } = useToast();

  useEffect(() => {
    // Listen for session completion to trigger intelligent notifications
    const handleSessionCompletion = async (sessionId: string) => {
      if (!user) return;

      try {
        console.log('Session completed, generating intelligent notifications...', sessionId);
        
        // Get detailed session data
        const sessionDetails = await SessionService.getSessionDetails(sessionId);
        
        if (sessionDetails) {
          // Process the session for intelligent notifications
          await IntelligentNotificationService.processSessionCompletion(user.id, sessionDetails);
          
          // Show toast notification for successful processing
          toast({
            title: "📊 Session Analysis Complete",
            description: "Your session has been analyzed for personalized insights.",
          });
        }
      } catch (error) {
        console.error('Error processing session completion for notifications:', error);
      }
    };

    // Check if a session just ended (when currentSession becomes null after being active)
    if (!currentSession && typeof window !== 'undefined') {
      const lastSessionId = localStorage.getItem('lastCompletedSessionId');
      const lastProcessedId = localStorage.getItem('lastProcessedNotificationSessionId');
      
      if (lastSessionId && lastSessionId !== lastProcessedId) {
        handleSessionCompletion(lastSessionId);
        localStorage.setItem('lastProcessedNotificationSessionId', lastSessionId);
      }
    }
  }, [currentSession, user, toast]);

  const triggerCustomNotification = async (
    type: 'session_reminder' | 'milestone_achieved' | 'insight_generated' | 'mood_check' | 'progress_update',
    title: string,
    message: string,
    priority: 'low' | 'medium' | 'high' = 'medium',
    data?: Record<string, any>
  ) => {
    if (!user) return false;
    
    const success = await IntelligentNotificationService.createCustomNotification(
      user.id, type, title, message, priority, data
    );

    if (success) {
      // Show immediate toast feedback
      toast({
        title: title,
        description: message,
        variant: priority === 'high' ? 'default' : 'default',
      });
    }
    
    return success;
  };

  return {
    triggerCustomNotification
  };
};
