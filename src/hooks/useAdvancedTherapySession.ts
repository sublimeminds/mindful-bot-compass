import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { enhancedSessionOrchestrator } from '@/services/enhancedSessionOrchestrator';
import { therapyContextManager } from '@/services/therapyContextManager';

interface AdvancedSessionMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  phaseId?: string;
  emotion?: string;
  technique?: string;
  crisisLevel?: string;
  metadata?: any;
}

interface SessionPhase {
  id: string;
  name: string;
  description: string;
  expectedDuration: number;
  techniques: string[];
  goals: string[];
  status: 'pending' | 'active' | 'completed';
  progress: number;
}

interface AdvancedSessionState {
  isActive: boolean;
  sessionId: string;
  currentPhase: string;
  currentPhaseIndex: number;
  startTime: Date;
  endTime?: Date;
  phases: SessionPhase[];
  engagementLevel: number;
  therapeuticAlliance: number;
  crisisLevel: string;
  breakthroughProbability: number;
  culturalAdaptations: any;
  qualityAlerts: any[];
  optimalTiming: any;
  techniqueEffectiveness: any;
}

interface UseAdvancedTherapySessionProps {
  userId: string;
  therapistId: string;
  therapyApproach: string;
  initialMood: number;
  culturalContext?: any;
  onSessionComplete?: (summary: any) => void;
  onCrisisDetected?: (crisis: any) => void;
  onBreakthroughDetected?: (breakthrough: any) => void;
}

const ENHANCED_THERAPY_PHASES: SessionPhase[] = [
  {
    id: 'opening',
    name: 'Opening & Check-in',
    description: 'Establish rapport and assess current state',
    expectedDuration: 480, // 8 minutes
    techniques: ['rapport_building', 'mood_assessment', 'goal_setting'],
    goals: ['establish_comfort', 'assess_current_state', 'set_intentions'],
    status: 'pending',
    progress: 0
  },
  {
    id: 'assessment',
    name: 'Assessment & Exploration',
    description: 'Deep exploration of concerns and context',
    expectedDuration: 720, // 12 minutes
    techniques: ['reflective_questioning', 'emotional_validation', 'active_listening'],
    goals: ['identify_issues', 'understand_context', 'explore_emotions'],
    status: 'pending',
    progress: 0
  },
  {
    id: 'intervention',
    name: 'Intervention & Therapeutic Work',
    description: 'Apply therapeutic techniques and interventions',
    expectedDuration: 1200, // 20 minutes
    techniques: ['cognitive_restructuring', 'behavioral_activation', 'mindfulness'],
    goals: ['apply_techniques', 'practice_skills', 'gain_insights'],
    status: 'pending',
    progress: 0
  },
  {
    id: 'practice',
    name: 'Practice & Integration',
    description: 'Practice skills and integrate learning',
    expectedDuration: 480, // 8 minutes
    techniques: ['skill_practice', 'role_playing', 'homework_planning'],
    goals: ['consolidate_learning', 'practice_skills', 'prepare_implementation'],
    status: 'pending',
    progress: 0
  },
  {
    id: 'closing',
    name: 'Closing & Planning',
    description: 'Summarize progress and plan next steps',
    expectedDuration: 120, // 2 minutes
    techniques: ['session_summary', 'goal_review', 'next_steps'],
    goals: ['summarize_progress', 'plan_actions', 'schedule_follow_up'],
    status: 'pending',
    progress: 0
  }
];

export const useAdvancedTherapySession = ({
  userId,
  therapistId,
  therapyApproach,
  initialMood,
  culturalContext,
  onSessionComplete,
  onCrisisDetected,
  onBreakthroughDetected
}: UseAdvancedTherapySessionProps) => {
  const [sessionState, setSessionState] = useState<AdvancedSessionState>({
    isActive: false,
    sessionId: '',
    currentPhase: 'opening',
    currentPhaseIndex: 0,
    startTime: new Date(),
    phases: ENHANCED_THERAPY_PHASES,
    engagementLevel: 0.5,
    therapeuticAlliance: 0.5,
    crisisLevel: 'none',
    breakthroughProbability: 0.0,
    culturalAdaptations: {},
    qualityAlerts: [],
    optimalTiming: {},
    techniqueEffectiveness: {}
  });

  const [messages, setMessages] = useState<AdvancedSessionMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('45:00');
  const [currentTechnique, setCurrentTechnique] = useState<string>('');
  const [sessionExtensions, setSessionExtensions] = useState<any[]>([]);
  const [realTimeAnalysis, setRealTimeAnalysis] = useState<any>({});

  const { toast } = useToast();
  const sessionStatusRef = useRef<any>(null);
  const monitoringIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize advanced session
  useEffect(() => {
    const initializeSession = async () => {
      const sessionId = `adv_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      console.log('Initializing advanced therapy session:', sessionId);

      // Create therapy context
      const contextId = await therapyContextManager.createContext({
        userId,
        sessionId,
        currentAiModel: 'claude-sonnet-4-20250514',
        culturalProfile: culturalContext || {},
        emotionalState: { initialMood, timestamp: new Date() },
        contextData: { therapyApproach, phase: 'opening' }
      });

      // Initialize session orchestration
      const initialized = await enhancedSessionOrchestrator.initializeSession(
        sessionId,
        userId,
        therapyApproach
      );

      if (initialized && contextId) {
        setSessionState(prev => ({
          ...prev,
          isActive: true,
          sessionId,
          startTime: new Date()
        }));

        // Start real-time monitoring
        startRealTimeMonitoring(sessionId);

        // Set up session timer
        startSessionTimer();
      } else {
        toast({
          title: "Session Error",
          description: "Failed to initialize therapy session. Please try again.",
          variant: "destructive"
        });
      }
    };

    initializeSession();

    return () => {
      if (monitoringIntervalRef.current) {
        clearInterval(monitoringIntervalRef.current);
      }
    };
  }, [userId, therapyApproach, culturalContext]);

  // Real-time session monitoring
  const startRealTimeMonitoring = useCallback((sessionId: string) => {
    monitoringIntervalRef.current = setInterval(async () => {
      try {
        const sessionStatus = await enhancedSessionOrchestrator.getSessionStatus(sessionId);
        if (sessionStatus) {
          setSessionState(prev => ({
            ...prev,
            engagementLevel: sessionStatus.engagement_level || 0.5,
            therapeuticAlliance: sessionStatus.therapeutic_alliance_score || 0.5,
            crisisLevel: sessionStatus.crisis_level || 'none',
            breakthroughProbability: sessionStatus.breakthrough_probability || 0.0
          }));

          // Check for crisis situations
          if (sessionStatus.crisis_level !== 'none' && sessionStatus.crisis_level !== sessionState.crisisLevel) {
            onCrisisDetected?.(sessionStatus);
            
            toast({
              title: "Crisis Support Activated",
              description: "Additional support resources have been activated for your safety.",
              variant: "default"
            });
          }

          // Check for breakthrough moments
          if (sessionStatus.breakthrough_probability > 0.7) {
            onBreakthroughDetected?.(sessionStatus);
          }

          // Update real-time analysis
          setRealTimeAnalysis(sessionStatus);
        }
      } catch (error) {
        console.error('Error in real-time monitoring:', error);
      }
    }, 15000); // Every 15 seconds
  }, [sessionState.crisisLevel, onCrisisDetected, onBreakthroughDetected]);

  // Session timer
  const startSessionTimer = useCallback(() => {
    const startTime = Date.now();
    const baseDuration = 45 * 60 * 1000; // 45 minutes

    const updateTimer = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, baseDuration - elapsed);
      
      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      
      setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      
      if (remaining > 0) {
        setTimeout(updateTimer, 1000);
      } else {
        // Session time is up - check for extensions
        handleSessionTimeUp();
      }
    };

    updateTimer();
  }, []);

  const handleSessionTimeUp = useCallback(async () => {
    if (!sessionState.sessionId) return;

    try {
      // Get optimal timing recommendations
      const { data: timingData } = await supabase
        .rpc('calculate_optimal_session_timing', {
          p_session_id: sessionState.sessionId,
          p_current_phase: sessionState.currentPhase,
          p_engagement_level: sessionState.engagementLevel,
          p_breakthrough_probability: sessionState.breakthroughProbability
        });

      if (timingData?.recommended_extension > 0) {
        const extensionMinutes = Math.floor(timingData.recommended_extension / 60);
        
        toast({
          title: "Session Extension Recommended",
          description: `Based on your progress, extending the session by ${extensionMinutes} minutes could be beneficial.`,
          variant: "default"
        });

        setSessionExtensions(prev => [...prev, timingData]);
      } else {
        // Natural session end
        handleSessionCompletion();
      }
    } catch (error) {
      console.error('Error handling session time up:', error);
      handleSessionCompletion();
    }
  }, [sessionState]);

  // Enhanced message sending with AI orchestration
  const sendMessage = useCallback(async (content: string): Promise<boolean> => {
    if (!content.trim() || isLoading || !sessionState.sessionId) return false;
    
    setIsLoading(true);
    
    const userMessage: AdvancedSessionMessage = {
      id: `msg_${Date.now()}_user`,
      content,
      sender: 'user',
      timestamp: new Date(),
      phaseId: sessionState.currentPhase
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    try {
      // Get optimal technique recommendation
      const optimalTechnique = await enhancedSessionOrchestrator.getOptimalTechnique(
        userId,
        sessionState.sessionId,
        sessionState.currentPhase,
        { content, timestamp: new Date() },
        culturalContext
      );

      if (optimalTechnique) {
        setCurrentTechnique(optimalTechnique.technique);
      }

      // Call advanced AI orchestrator
      const response = await supabase.functions.invoke('advanced-ai-therapy-orchestrator', {
        body: {
          message: content,
          userId,
          sessionId: sessionState.sessionId,
          currentPhase: sessionState.currentPhase,
          sessionHistory: messages,
          culturalContext,
          emotionalState: { primary: 'neutral', intensity: 5 },
          therapistId
        }
      });

      if (response.data?.response) {
        const aiMessage: AdvancedSessionMessage = {
          id: `msg_${Date.now()}_ai`,
          content: response.data.response,
          sender: 'ai',
          timestamp: new Date(),
          phaseId: sessionState.currentPhase,
          technique: response.data.metadata?.technique,
          crisisLevel: response.data.metadata?.crisisLevel,
          metadata: response.data.metadata
        };
        
        setMessages(prev => [...prev, aiMessage]);

        // Update session state based on AI response
        if (response.data.metadata?.crisisLevel && response.data.metadata.crisisLevel !== 'none') {
          setSessionState(prev => ({
            ...prev,
            crisisLevel: response.data.metadata.crisisLevel
          }));
        }

        // Update technique effectiveness
        if (response.data.metadata?.technique) {
          setSessionState(prev => ({
            ...prev,
            techniqueEffectiveness: {
              ...prev.techniqueEffectiveness,
              [response.data.metadata.technique]: response.data.metadata.effectiveness || 0.7
            }
          }));
        }
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
  }, [isLoading, sessionState.sessionId, sessionState.currentPhase, messages, userId, culturalContext, therapistId]);

  // Phase transition management
  const transitionToNextPhase = useCallback(async () => {
    if (sessionState.currentPhaseIndex >= ENHANCED_THERAPY_PHASES.length - 1) {
      return handleSessionCompletion();
    }

    const nextPhaseIndex = sessionState.currentPhaseIndex + 1;
    const nextPhase = ENHANCED_THERAPY_PHASES[nextPhaseIndex];

    setSessionState(prev => ({
      ...prev,
      currentPhase: nextPhase.id,
      currentPhaseIndex: nextPhaseIndex,
      phases: prev.phases.map((phase, index) => ({
        ...phase,
        status: index === nextPhaseIndex ? 'active' : 
                index < nextPhaseIndex ? 'completed' : 'pending'
      }))
    }));

    // Update orchestration
    await enhancedSessionOrchestrator.updateQualityMetrics(sessionState.sessionId, {
      interventionTriggers: { phase_transition: nextPhase.id, timestamp: new Date() }
    } as any);

    toast({
      title: "Phase Transition",
      description: `Moving to ${nextPhase.name}`,
      variant: "default"
    });
  }, [sessionState.currentPhaseIndex, sessionState.sessionId]);

  // Session completion
  const handleSessionCompletion = useCallback(async () => {
    if (!sessionState.sessionId) return;

    try {
      // Complete orchestration
      await enhancedSessionOrchestrator.completeSession(sessionState.sessionId);

      // Update session state
      setSessionState(prev => ({
        ...prev,
        isActive: false,
        endTime: new Date(),
        phases: prev.phases.map(phase => ({ ...phase, status: 'completed' }))
      }));

      // Stop monitoring
      if (monitoringIntervalRef.current) {
        clearInterval(monitoringIntervalRef.current);
      }

      // Session summary
      const sessionSummary = {
        sessionId: sessionState.sessionId,
        duration: Date.now() - sessionState.startTime.getTime(),
        phasesCompleted: sessionState.phases.filter(p => p.status === 'completed').length,
        messagesExchanged: messages.length,
        engagementLevel: sessionState.engagementLevel,
        therapeuticAlliance: sessionState.therapeuticAlliance,
        crisisLevel: sessionState.crisisLevel,
        breakthroughMoments: sessionState.breakthroughProbability,
        techniqueEffectiveness: sessionState.techniqueEffectiveness,
        qualityAlerts: sessionState.qualityAlerts,
        extensions: sessionExtensions
      };

      onSessionComplete?.(sessionSummary);

      toast({
        title: "Session Complete",
        description: "Your therapy session has been completed successfully.",
        variant: "default"
      });

    } catch (error) {
      console.error('Error completing session:', error);
      toast({
        title: "Session Error",
        description: "Error completing session. Please try again.",
        variant: "destructive"
      });
    }
  }, [sessionState, messages, sessionExtensions, onSessionComplete]);

  // Extended session handling
  const extendSession = useCallback(async (extensionMinutes: number) => {
    try {
      const extensionData = {
        timestamp: new Date(),
        duration: extensionMinutes * 60,
        reason: 'user_requested',
        engagement_level: sessionState.engagementLevel,
        breakthrough_probability: sessionState.breakthroughProbability
      };

      await enhancedSessionOrchestrator.updateQualityMetrics(sessionState.sessionId, {
        interventionTriggers: { session_extension: extensionData }
      } as any);

      setSessionExtensions(prev => [...prev, extensionData]);
      
      // Update timer
      const currentTime = timeRemaining.split(':');
      const currentMinutes = parseInt(currentTime[0]);
      const currentSeconds = parseInt(currentTime[1]);
      const totalSeconds = (currentMinutes + extensionMinutes) * 60 + currentSeconds;
      
      const newMinutes = Math.floor(totalSeconds / 60);
      const newSeconds = totalSeconds % 60;
      setTimeRemaining(`${newMinutes}:${newSeconds.toString().padStart(2, '0')}`);

      toast({
        title: "Session Extended",
        description: `Session extended by ${extensionMinutes} minutes.`,
        variant: "default"
      });

    } catch (error) {
      console.error('Error extending session:', error);
    }
  }, [sessionState.sessionId, sessionState.engagementLevel, sessionState.breakthroughProbability, timeRemaining]);

  // Session progress calculations
  const getSessionProgress = useCallback((): number => {
    if (!sessionState.startTime) return 0;
    
    const elapsed = (Date.now() - sessionState.startTime.getTime()) / 1000 / 60;
    const totalDuration = 45 + sessionExtensions.reduce((sum, ext) => sum + (ext.duration / 60), 0);
    
    return Math.min(100, (elapsed / totalDuration) * 100);
  }, [sessionState.startTime, sessionExtensions]);

  const getPhaseProgress = useCallback((): number => {
    const currentPhase = sessionState.phases[sessionState.currentPhaseIndex];
    if (!currentPhase) return 0;
    
    const phaseMessages = messages.filter(msg => msg.phaseId === currentPhase.id);
    const expectedMessages = Math.floor(currentPhase.expectedDuration / 60); // Rough estimate
    
    return Math.min(100, (phaseMessages.length / expectedMessages) * 100);
  }, [sessionState.phases, sessionState.currentPhaseIndex, messages]);

  const getCurrentPhaseInfo = useCallback(() => {
    return sessionState.phases[sessionState.currentPhaseIndex];
  }, [sessionState.phases, sessionState.currentPhaseIndex]);

  const getAdvancedSessionStats = useCallback(() => {
    return {
      messageCount: messages.length,
      currentPhase: sessionState.currentPhase,
      elapsedTime: sessionState.startTime ? (Date.now() - sessionState.startTime.getTime()) / 1000 / 60 : 0,
      engagementLevel: sessionState.engagementLevel,
      therapeuticAlliance: sessionState.therapeuticAlliance,
      crisisLevel: sessionState.crisisLevel,
      breakthroughProbability: sessionState.breakthroughProbability,
      currentTechnique,
      techniqueEffectiveness: sessionState.techniqueEffectiveness,
      qualityAlerts: sessionState.qualityAlerts,
      extensions: sessionExtensions,
      realTimeAnalysis
    };
  }, [sessionState, messages, currentTechnique, sessionExtensions, realTimeAnalysis]);

  return {
    sessionState,
    messages,
    isLoading,
    timeRemaining,
    currentTechnique,
    sessionExtensions,
    realTimeAnalysis,
    sendMessage,
    transitionToNextPhase,
    extendSession,
    endSession: handleSessionCompletion,
    getSessionProgress,
    getPhaseProgress,
    getCurrentPhaseInfo,
    getAdvancedSessionStats
  };
};