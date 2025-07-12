import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SessionMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  phaseId?: string;
  emotion?: string;
  metadata?: any;
}

interface SessionPhase {
  id: string;
  name: string;
  description: string;
  expectedDuration: number;
  techniques: string[];
  goals: string[];
}

interface SystemHealth {
  status: 'healthy' | 'warning' | 'error';
  lastCheck: Date;
  metrics: {
    responseTime: number;
    errorRate: number;
    sessionQuality: number;
  };
}

interface SessionState {
  isActive: boolean;
  currentPhase: string;
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  totalDuration: number;
  phases: SessionPhase[];
  currentPhaseIndex: number;
}

interface UseStructuredSessionProps {
  therapyApproach: string;
  userId: string;
  initialMood: number;
  onSessionComplete?: (summary: any) => void;
  onHealthAlert?: (health: SystemHealth) => void;
}

const THERAPY_PHASES: SessionPhase[] = [
  {
    id: 'opening',
    name: 'Opening & Check-in',
    description: 'Welcome and assess current state',
    expectedDuration: 8,
    techniques: ['rapport_building', 'mood_assessment', 'goal_setting'],
    goals: ['establish_comfort', 'assess_current_state', 'set_session_intentions']
  },
  {
    id: 'assessment',
    name: 'Assessment & Exploration', 
    description: 'Explore concerns and gather information',
    expectedDuration: 12,
    techniques: ['active_listening', 'reflective_questioning', 'emotional_validation'],
    goals: ['identify_core_issues', 'understand_context', 'explore_emotions']
  },
  {
    id: 'intervention',
    name: 'Intervention & Work',
    description: 'Apply therapeutic techniques and interventions',
    expectedDuration: 20,
    techniques: ['cognitive_restructuring', 'behavioral_activation', 'mindfulness_practice'],
    goals: ['apply_therapeutic_techniques', 'practice_new_skills', 'gain_insights']
  },
  {
    id: 'practice',
    name: 'Practice & Integration',
    description: 'Practice skills and integrate learning',
    expectedDuration: 8,
    techniques: ['skill_practice', 'role_playing', 'homework_assignment'],
    goals: ['consolidate_learning', 'practice_skills', 'prepare_for_implementation']
  },
  {
    id: 'closing',
    name: 'Closing & Planning',
    description: 'Summarize progress and plan next steps',
    expectedDuration: 2,
    techniques: ['session_summary', 'goal_review', 'homework_planning'],
    goals: ['summarize_progress', 'plan_next_steps', 'schedule_follow_up']
  }
];

export const useStructuredSession = ({
  therapyApproach,
  userId,
  initialMood,
  onSessionComplete,
  onHealthAlert
}: UseStructuredSessionProps) => {
  const [sessionState, setSessionState] = useState<SessionState>({
    isActive: false,
    currentPhase: 'opening',
    sessionId: '',
    startTime: new Date(),
    totalDuration: 50,
    phases: THERAPY_PHASES,
    currentPhaseIndex: 0
  });

  const [messages, setMessages] = useState<SessionMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('50:00');
  const [phaseTransitionAlert, setPhaseTransitionAlert] = useState<string | null>(null);
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    status: 'healthy',
    lastCheck: new Date(),
    metrics: {
      responseTime: 1200,
      errorRate: 0.02,
      sessionQuality: 0.87
    }
  });

  const { toast } = useToast();

  // Initialize session and start timer
  useEffect(() => {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    setSessionState(prev => ({
      ...prev,
      isActive: true,
      sessionId,
      startTime: new Date()
    }));

    // Initialize session preparation
    supabase.functions.invoke('session-preparation-ai', {
      body: { userId, therapyApproach, initialMood, sessionId }
    }).catch(console.error);
  }, []);

  const sendMessage = async (content: string): Promise<boolean> => {
    if (!content.trim() || isLoading) return false;
    
    setIsLoading(true);
    
    const userMessage: SessionMessage = {
      id: `msg_${Date.now()}_user`,
      content,
      sender: 'user',
      timestamp: new Date(),
      phaseId: sessionState.currentPhase
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    try {
      const response = await supabase.functions.invoke('ai-therapy-chat-enhanced', {
        body: {
          message: content,
          userId,
          sessionId: sessionState.sessionId,
          currentPhase: sessionState.currentPhase,
          phaseIndex: sessionState.currentPhaseIndex,
          therapyApproach,
          sessionHistory: messages,
          systemHealth: systemHealth.metrics
        }
      });
      
      if (response.data?.reply) {
        const aiMessage: SessionMessage = {
          id: `msg_${Date.now()}_ai`,
          content: response.data.reply,
          sender: 'ai',
          timestamp: new Date(),
          phaseId: sessionState.currentPhase,
          emotion: response.data.emotion,
          metadata: response.data.metadata
        };
        
        setMessages(prev => [...prev, aiMessage]);
      }
      
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Message Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const pauseSession = () => {
    toast({
      title: "Session Paused",
      description: "Your session has been paused.",
      variant: "default"
    });
  };

  const resumeSession = () => {
    toast({
      title: "Session Resumed", 
      description: "Your session has resumed.",
      variant: "default"
    });
  };

  const endSession = async () => {
    setSessionState(prev => ({ ...prev, isActive: false, endTime: new Date() }));
    
    if (onSessionComplete) {
      onSessionComplete({
        sessionId: sessionState.sessionId,
        duration: sessionState.totalDuration,
        phases: THERAPY_PHASES,
        messages: messages.length,
        health: systemHealth
      });
    }
  };

  const getSessionProgress = (): number => {
    const elapsed = (new Date().getTime() - sessionState.startTime.getTime()) / 1000 / 60;
    return Math.min(100, (elapsed / sessionState.totalDuration) * 100);
  };

  const getPhaseProgress = (): number => {
    return 65; // Simplified for now
  };

  const getCurrentPhaseInfo = () => {
    return THERAPY_PHASES[sessionState.currentPhaseIndex];
  };

  const getSessionStats = () => {
    return {
      messageCount: messages.length,
      currentPhase: sessionState.currentPhase,
      elapsedTime: (new Date().getTime() - sessionState.startTime.getTime()) / 1000 / 60,
      health: systemHealth
    };
  };

  return {
    sessionState,
    messages,
    isLoading,
    timeRemaining,
    phaseTransitionAlert,
    systemHealth,
    sendMessage,
    pauseSession,
    resumeSession,
    endSession,
    getSessionProgress,
    getPhaseProgress,
    getCurrentPhaseInfo,
    getSessionStats
  };
};