import { useState, useRef, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AvatarPersonalityService } from '@/services/avatarPersonalityService';

export interface SessionMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  emotion?: string;
  confidence?: number;
  voiceData?: ArrayBuffer;
  metadata?: {
    responseTime: number;
    emotionalContext: any[];
    therapeuticTechnique?: string;
    personalityAdaptation?: any;
  };
}

export interface SessionMetrics {
  sessionId: string;
  duration: number;
  messageCount: number;
  userEngagement: number;
  emotionalRange: string[];
  stressLevelChange: number;
  therapeuticProgress: number;
  avatarInteractionQuality: number;
  voiceInteractionTime: number;
  crisisIndicators: any[];
  positiveIndicators: any[];
  therapistEffectiveness: number;
}

export interface SessionState {
  sessionId: string | null;
  isActive: boolean;
  startTime: Date | null;
  endTime: Date | null;
  therapistId: string | null;
  currentEmotion: string;
  stressLevel: number;
  engagementLevel: number;
}

export const useTherapySession = (therapistId?: string) => {
  const { toast } = useToast();
  
  // Session state
  const [sessionState, setSessionState] = useState<SessionState>({
    sessionId: null,
    isActive: false,
    startTime: null,
    endTime: null,
    therapistId: therapistId || null,
    currentEmotion: 'neutral',
    stressLevel: 0.5,
    engagementLevel: 0.8
  });

  // Message and interaction state
  const [messages, setMessages] = useState<SessionMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [sessionMetrics, setSessionMetrics] = useState<SessionMetrics | null>(null);

  // Refs for session management
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const emotionHistoryRef = useRef<{ emotion: string; timestamp: Date; intensity: number }[]>([]);
  const interactionHistoryRef = useRef<any[]>([]);

  // Start a new therapy session
  const startSession = useCallback(async (selectedTherapistId?: string) => {
    try {
      const targetTherapistId = selectedTherapistId || therapistId;
      if (!targetTherapistId) {
        throw new Error('No therapist selected');
      }

      const { data, error } = await supabase.functions.invoke('ai-therapy-chat-enhanced', {
        body: {
          action: 'startSession',
          therapistId: targetTherapistId,
          includePersonality: true,
          enableAdvancedFeatures: true
        }
      });

      if (error) throw error;

      const newSessionId = data.sessionId;
      const startTime = new Date();

      setSessionState({
        sessionId: newSessionId,
        isActive: true,
        startTime,
        endTime: null,
        therapistId: targetTherapistId,
        currentEmotion: 'neutral',
        stressLevel: 0.5,
        engagementLevel: 0.8
      });

      setSessionMetrics({
        sessionId: newSessionId,
        duration: 0,
        messageCount: 0,
        userEngagement: 0.8,
        emotionalRange: [],
        stressLevelChange: 0,
        therapeuticProgress: 0,
        avatarInteractionQuality: 0.9,
        voiceInteractionTime: 0,
        crisisIndicators: [],
        positiveIndicators: [],
        therapistEffectiveness: 0.8
      });

      // Clear previous session data
      setMessages([]);
      emotionHistoryRef.current = [];
      interactionHistoryRef.current = [];

      // Start session timer
      sessionTimerRef.current = setInterval(() => {
        setSessionMetrics(prev => prev ? {
          ...prev,
          duration: Math.floor((Date.now() - startTime.getTime()) / 1000)
        } : null);
      }, 1000);

      // Generate welcome message
      const welcomeMessage = await generateTherapistWelcome(targetTherapistId);
      setMessages([welcomeMessage]);

      toast({
        title: "Session Started",
        description: `3D therapy session with ${data.therapistName} has begun.`,
      });

      return newSessionId;
    } catch (error) {
      console.error('Failed to start session:', error);
      toast({
        title: "Session Error",
        description: "Failed to start therapy session. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  }, [therapistId, toast]);

  // End the current session
  const endSession = useCallback(async () => {
    if (!sessionState.sessionId || !sessionState.isActive) return;

    try {
      const endTime = new Date();
      const finalMetrics = {
        ...sessionMetrics!,
        duration: Math.floor((endTime.getTime() - sessionState.startTime!.getTime()) / 1000)
      };

      // Save session data
      const { error } = await supabase.functions.invoke('ai-therapy-chat-enhanced', {
        body: {
          action: 'endSession',
          sessionId: sessionState.sessionId,
          finalMetrics,
          messages: messages.slice(-50), // Save last 50 messages
          emotionHistory: emotionHistoryRef.current,
          interactionHistory: interactionHistoryRef.current
        }
      });

      if (error) throw error;

      setSessionState(prev => ({
        ...prev,
        isActive: false,
        endTime
      }));

      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
        sessionTimerRef.current = null;
      }

      toast({
        title: "Session Ended",
        description: "Your therapy session has been saved successfully.",
      });

    } catch (error) {
      console.error('Failed to end session:', error);
      toast({
        title: "Session Save Error",
        description: "Failed to save session data.",
        variant: "destructive",
      });
    }
  }, [sessionState, sessionMetrics, messages, toast]);

  // Send a message in the session
  const sendMessage = useCallback(async (
    content: string, 
    isVoice = false, 
    voiceData?: ArrayBuffer,
    emotionalContext?: any[]
  ) => {
    if (!sessionState.isActive || !sessionState.therapistId) {
      throw new Error('No active session');
    }

    try {
      setIsLoading(true);
      const messageStartTime = Date.now();

      // Create user message
      const userMessage: SessionMessage = {
        id: `user-${Date.now()}`,
        content,
        isUser: true,
        timestamp: new Date(),
        emotion: sessionState.currentEmotion,
        voiceData,
        metadata: {
          responseTime: 0,
          emotionalContext: emotionalContext || []
        }
      };

      setMessages(prev => [...prev, userMessage]);

      // Update session metrics
      setSessionMetrics(prev => prev ? {
        ...prev,
        messageCount: prev.messageCount + 1,
        voiceInteractionTime: isVoice ? prev.voiceInteractionTime + 5 : prev.voiceInteractionTime
      } : null);

      // Generate AI response with personality
      const aiResponse = await generatePersonalizedTherapistResponse(
        sessionState.therapistId,
        content,
        emotionalContext || [],
        messages.slice(-5) // Last 5 messages for context
      );

      const responseTime = Date.now() - messageStartTime;
      
      const therapistMessage: SessionMessage = {
        id: `therapist-${Date.now()}`,
        content: aiResponse.content,
        isUser: false,
        timestamp: new Date(),
        emotion: aiResponse.emotion || 'empathetic',
        confidence: aiResponse.confidence || 0.9,
        metadata: {
          responseTime,
          emotionalContext: emotionalContext || [],
          therapeuticTechnique: aiResponse.technique,
          personalityAdaptation: aiResponse.personalityAdaptation
        }
      };

      setMessages(prev => [...prev, therapistMessage]);

      // Track interaction
      interactionHistoryRef.current.push({
        timestamp: new Date(),
        userMessage: content,
        aiResponse: aiResponse.content,
        emotionalContext,
        technique: aiResponse.technique,
        responseTime
      });

      return therapistMessage;

    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: "Message Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [sessionState, messages, toast]);

  // Update emotional state
  const updateEmotionalState = useCallback((
    emotions: any[],
    stressLevel: number,
    engagementLevel?: number
  ) => {
    if (emotions.length === 0) return;

    const primaryEmotion = emotions[0].name;
    const intensity = emotions[0].score;

    // Update session state
    setSessionState(prev => ({
      ...prev,
      currentEmotion: primaryEmotion,
      stressLevel,
      engagementLevel: engagementLevel || prev.engagementLevel
    }));

    // Track emotion history
    emotionHistoryRef.current.push({
      emotion: primaryEmotion,
      timestamp: new Date(),
      intensity
    });

    // Update session metrics
    setSessionMetrics(prev => {
      if (!prev) return null;

      const newEmotions = emotions.map(e => e.name);
      const uniqueEmotions = [...new Set([...prev.emotionalRange, ...newEmotions])];
      
      // Calculate stress level change
      const initialStressLevel = 0.5; // Default starting stress level
      const stressLevelChange = initialStressLevel - stressLevel;

      // Update therapeutic progress based on emotional improvement
      const progressIncrease = stressLevel < 0.4 ? 0.02 : stressLevel > 0.7 ? -0.01 : 0;

      return {
        ...prev,
        emotionalRange: uniqueEmotions,
        stressLevelChange,
        therapeuticProgress: Math.min(1, Math.max(0, prev.therapeuticProgress + progressIncrease)),
        userEngagement: engagementLevel || prev.userEngagement
      };
    });
  }, []);

  // Process voice input with emotion analysis
  const processVoiceInput = useCallback(async (audioData: ArrayBuffer) => {
    if (!sessionState.isActive) return;

    try {
      setIsProcessingVoice(true);

      // Analyze voice for emotion and transcription
      const { data, error } = await supabase.functions.invoke('hume-emotion', {
        body: {
          action: 'analyzeVoice',
          audioData: Array.from(new Uint8Array(audioData)),
          format: 'wav',
          includeTranscription: true
        }
      });

      if (error) throw error;

      const { transcript, emotions, stressLevel } = data;
      
      if (transcript && transcript.trim()) {
        // Update emotional state
        updateEmotionalState(emotions, stressLevel);
        
        // Send the transcribed message
        await sendMessage(transcript, true, audioData, emotions);
      }

      return { transcript, emotions, stressLevel };

    } catch (error) {
      console.error('Voice processing failed:', error);
      throw error;
    } finally {
      setIsProcessingVoice(false);
    }
  }, [sessionState.isActive, updateEmotionalState, sendMessage]);

  // Generate welcome message
  const generateTherapistWelcome = async (therapistId: string): Promise<SessionMessage> => {
    try {
      const response = await AvatarPersonalityService.generatePersonalizedResponse(
        therapistId,
        'WELCOME_MESSAGE',
        [],
        []
      );

      return {
        id: `welcome-${Date.now()}`,
        content: response,
        isUser: false,
        timestamp: new Date(),
        emotion: 'welcoming',
        confidence: 1.0,
        metadata: {
          responseTime: 0,
          emotionalContext: [],
          therapeuticTechnique: 'Welcome and rapport building'
        }
      };
    } catch (error) {
      console.error('Failed to generate welcome message:', error);
      return {
        id: `welcome-${Date.now()}`,
        content: "Hello! I'm glad you're here today. How are you feeling, and what would you like to talk about?",
        isUser: false,
        timestamp: new Date(),
        emotion: 'welcoming',
        confidence: 0.8
      };
    }
  };

  // Generate personalized therapist response
  const generatePersonalizedTherapistResponse = async (
    therapistId: string,
    userMessage: string,
    emotionalContext: any[],
    conversationHistory: SessionMessage[]
  ) => {
    try {
      const response = await AvatarPersonalityService.generatePersonalizedResponse(
        therapistId,
        userMessage,
        emotionalContext,
        conversationHistory
      );

      return {
        content: response,
        emotion: 'empathetic',
        confidence: 0.9,
        technique: 'Active listening',
        personalityAdaptation: 'Matched to therapist personality'
      };
    } catch (error) {
      console.error('Failed to generate personalized response:', error);
      return {
        content: "I understand what you're sharing with me. Can you tell me more about how this situation is affecting you?",
        emotion: 'empathetic',
        confidence: 0.7,
        technique: 'Reflective listening'
      };
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
      }
    };
  }, []);

  return {
    // Session state
    sessionState,
    messages,
    sessionMetrics,
    isLoading,
    isProcessingVoice,

    // Session management
    startSession,
    endSession,
    sendMessage,
    processVoiceInput,
    updateEmotionalState,

    // Utility functions
    setMessages,
    
    // Session status
    isActive: sessionState.isActive,
    sessionId: sessionState.sessionId,
    duration: sessionMetrics?.duration || 0
  };
};

export default useTherapySession;