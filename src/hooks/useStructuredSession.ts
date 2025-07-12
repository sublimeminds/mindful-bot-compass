import { useState, useEffect, useRef } from 'react';
import { AISessionConductor, SessionState, SessionMessage } from '@/services/aiSessionConductor';
import { ComponentUpdateChecker } from '@/services/componentUpdateChecker';
import { toast } from 'sonner';

interface UseStructuredSessionProps {
  therapyApproach: string;
  userId: string;
  initialMood?: number;
  onSessionComplete?: (summary: any) => void;
  onHealthAlert?: (health: any) => void;
}

export const useStructuredSession = ({
  therapyApproach,
  userId,
  initialMood,
  onSessionComplete,
  onHealthAlert
}: UseStructuredSessionProps) => {
  const [conductor] = useState(() => new AISessionConductor());
  const [sessionState, setSessionState] = useState<SessionState | null>(null);
  const [messages, setMessages] = useState<SessionMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [phaseTransitionAlert, setPhaseTransitionAlert] = useState<string | null>(null);
  const [systemHealth, setSystemHealth] = useState<any>(null);

  // Using sonner toast
  const intervalRef = useRef<NodeJS.Timeout>();
  const healthCheckRef = useRef<NodeJS.Timeout>();

  // Initialize session and start health monitoring
  useEffect(() => {
    initializeSession();
    startHealthMonitoring();
    
    return () => {
      cleanup();
    };
  }, []);

  // Update session timing
  useEffect(() => {
    if (sessionState && sessionStarted && !isPaused) {
      intervalRef.current = setInterval(updateSessionTiming, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [sessionState, sessionStarted, isPaused]);

  const initializeSession = async () => {
    try {
      setIsLoading(true);
      
      // Initialize component registry if not already done
      await ComponentUpdateChecker.initializeRegistry();
      
      // Start session
      const newSessionState = await conductor.startSession(
        userId,
        therapyApproach,
        initialMood
      );
      
      setSessionState(newSessionState);
      setSessionStarted(true);
      
      // Send initial welcome message
      const welcomeResponse = await conductor.sendMessage(
        `Hello, I'm ready to begin my ${therapyApproach} therapy session. I'd like to work on my mental health today.`
      );
      
      updateMessagesFromConductor();
      
      toast.success(`Your structured ${therapyApproach} therapy session has begun.`);
      
    } catch (error) {
      console.error('Error initializing session:', error);
      toast.error("Failed to start your therapy session. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const startHealthMonitoring = () => {
    // Check system health every 5 minutes
    healthCheckRef.current = setInterval(async () => {
      try {
        const health = await ComponentUpdateChecker.monitorTherapySystemHealth();
        setSystemHealth(health);
        
        // Alert if health is critical
        if (health.overallHealth < 70 || health.criticalIssues.length > 0) {
          onHealthAlert?.(health);
          
          if (health.overallHealth < 50) {
            toast.error(`Therapy system health: ${Math.round(health.overallHealth)}%`);
          } else {
            toast.warning(`Therapy system health: ${Math.round(health.overallHealth)}%`);
          }
        }
        
      } catch (error) {
        console.error('Error checking system health:', error);
      }
    }, 5 * 60 * 1000); // 5 minutes
  };

  const updateSessionTiming = () => {
    if (!sessionState) return;
    
    const currentSession = conductor.getCurrentSession();
    if (currentSession) {
      const remainingMinutes = Math.max(0, 
        currentSession.playbook.totalDuration - currentSession.elapsedMinutes
      );
      
      const hours = Math.floor(remainingMinutes / 60);
      const mins = remainingMinutes % 60;
      setTimeRemaining(hours > 0 ? `${hours}h ${mins}m` : `${mins}m`);
      
      // Update session state
      setSessionState({ ...currentSession });
      
      // Check for automatic phase transitions
      checkPhaseTransition(currentSession);
    }
  };

  const checkPhaseTransition = (session: SessionState) => {
    const conductor_session = conductor.getCurrentSession();
    if (conductor_session && conductor_session.currentPhase.id !== session.currentPhase.id) {
      setPhaseTransitionAlert(`Transitioning to: ${conductor_session.currentPhase.name}`);
      setTimeout(() => setPhaseTransitionAlert(null), 5000);
      
      toast.info(`Now in: ${conductor_session.currentPhase.name}`);
    }
  };

  const updateMessagesFromConductor = () => {
    const updatedMessages = conductor.getMessages();
    const updatedSession = conductor.getCurrentSession();
    
    setMessages([...updatedMessages]);
    if (updatedSession) {
      setSessionState({ ...updatedSession });
    }
  };

  const sendMessage = async (content: string): Promise<boolean> => {
    if (!content.trim() || isLoading || !sessionStarted || isPaused) {
      return false;
    }

    try {
      setIsLoading(true);
      
      // Add user message optimistically
      const tempMessage: SessionMessage = {
        id: 'temp-' + Date.now(),
        content,
        sender: 'user',
        timestamp: new Date(),
        phaseId: sessionState?.currentPhase.id || ''
      };
      setMessages(prev => [...prev, tempMessage]);

      const response = await conductor.sendMessage(content);
      updateMessagesFromConductor();

      // Handle phase transitions
      if (response.nextAction === 'transition') {
        setPhaseTransitionAlert(`Moving to: ${sessionState?.currentPhase.name}`);
        setTimeout(() => setPhaseTransitionAlert(null), 5000);
      }

      return true;
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Failed to send your message. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const pauseSession = () => {
    setIsPaused(true);
    toast.info("Your therapy session has been paused.");
  };

  const resumeSession = () => {
    setIsPaused(false);
    toast.info("Your therapy session has resumed.");
  };

  const endSession = async (): Promise<any> => {
    try {
      setIsLoading(true);
      
      const summary = await conductor.endSession();
      setSessionStarted(false);
      
      onSessionComplete?.(summary);
      
      toast.success("Your therapy session has ended successfully.");
      
      return summary;
      
    } catch (error) {
      console.error('Error ending session:', error);
      toast.error("Failed to properly end the session.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getSessionProgress = (): number => {
    return conductor.getSessionProgress();
  };

  const getPhaseProgress = (): number => {
    return conductor.getPhaseProgress();
  };

  const getCurrentPhaseInfo = () => {
    if (!sessionState) return null;
    
    return {
      name: sessionState.currentPhase.name,
      description: sessionState.currentPhase.description,
      objectives: sessionState.currentPhase.objectives,
      techniques: sessionState.currentPhase.techniques,
      duration: sessionState.currentPhase.duration,
      progress: getPhaseProgress()
    };
  };

  const getSessionStats = () => {
    if (!sessionState) return null;
    
    return {
      messageCount: sessionState.messageCount,
      engagement: sessionState.userEngagement,
      currentMood: sessionState.mood.current,
      moodProgression: sessionState.mood.progression,
      criteriaMet: sessionState.criteriaMet.length,
      totalCriteria: sessionState.currentPhase.transitionCriteria.length,
      elapsedMinutes: sessionState.elapsedMinutes,
      remainingTime: timeRemaining
    };
  };

  const cleanup = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (healthCheckRef.current) {
      clearInterval(healthCheckRef.current);
    }
  };

  return {
    // Session state
    sessionState,
    messages,
    isLoading,
    isPaused,
    sessionStarted,
    timeRemaining,
    phaseTransitionAlert,
    systemHealth,
    
    // Session controls
    sendMessage,
    pauseSession,
    resumeSession,
    endSession,
    
    // Session information
    getSessionProgress,
    getPhaseProgress,
    getCurrentPhaseInfo,
    getSessionStats,
    
    // Health monitoring
    startHealthMonitoring
  };
};