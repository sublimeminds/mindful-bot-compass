
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface RealTimeSessionState {
  isActive: boolean;
  startTime: Date | null;
  duration: number;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'reconnecting';
  connectionQuality: 'excellent' | 'good' | 'poor';
  participantCount: number;
  sessionId: string | null;
}

export const useRealTimeSession = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [sessionState, setSessionState] = useState<RealTimeSessionState>({
    isActive: false,
    startTime: null,
    duration: 0,
    connectionStatus: 'disconnected',
    connectionQuality: 'excellent',
    participantCount: 0,
    sessionId: null
  });

  // Update duration timer
  useEffect(() => {
    if (!sessionState.isActive || !sessionState.startTime) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const duration = Math.floor((now - sessionState.startTime!.getTime()) / 1000);
      setSessionState(prev => ({ ...prev, duration }));
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionState.isActive, sessionState.startTime]);

  const startSession = useCallback(async () => {
    try {
      setSessionState(prev => ({
        ...prev,
        connectionStatus: 'connecting'
      }));

      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const sessionId = `session_${Date.now()}`;
      const startTime = new Date();
      
      setSessionState({
        isActive: true,
        startTime,
        duration: 0,
        connectionStatus: 'connected',
        connectionQuality: 'excellent',
        participantCount: 2, // User + AI
        sessionId
      });

      toast({
        title: "Session Started",
        description: "Your therapy session is now active.",
      });

    } catch (error) {
      setSessionState(prev => ({
        ...prev,
        connectionStatus: 'disconnected'
      }));
      
      toast({
        title: "Connection Failed",
        description: "Unable to start session. Please try again.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const endSession = useCallback(async () => {
    try {
      setSessionState({
        isActive: false,
        startTime: null,
        duration: 0,
        connectionStatus: 'disconnected',
        connectionQuality: 'excellent',
        participantCount: 0,
        sessionId: null
      });

      toast({
        title: "Session Ended",
        description: "Your therapy session has been completed.",
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to end session properly.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const pauseSession = useCallback(() => {
    setSessionState(prev => ({
      ...prev,
      isActive: false
    }));
    
    toast({
      title: "Session Paused",
      description: "Your session has been paused.",
    });
  }, [toast]);

  const resumeSession = useCallback(() => {
    setSessionState(prev => ({
      ...prev,
      isActive: true
    }));
    
    toast({
      title: "Session Resumed",
      description: "Your session has been resumed.",
    });
  }, [toast]);

  return {
    sessionState,
    startSession,
    endSession,
    pauseSession,
    resumeSession
  };
};
