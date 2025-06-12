
import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { DebugLogger } from '@/utils/debugLogger';

interface SessionContextType {
  currentSession: any;
  sessionHistory: any[];
  sessions: any[];
  startSession: (moodBefore?: number) => Promise<void>;
  endSession: (moodAfter?: number, feedback?: string, rating?: number) => Promise<void>;
  addMessage: (content: string, type: string) => Promise<void>;
  addBreakthrough: (breakthrough: any) => void;
  syncWithRealtimeSession: (sessionId?: string, isActive?: boolean) => void;
  updateRealtimeStatus: (sessionId: string, isActive: boolean) => void;
  canEndSession: () => boolean;
  getSessionDuration: () => number;
  getContentQuality: () => { messageCount: number; userMessages: number };
  loadSessions: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  DebugLogger.debug('SessionProvider: Initializing', { component: 'SessionProvider' });
  
  const [currentSession, setCurrentSession] = useState(null);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [sessions, setSessions] = useState([]);

  const startSession = useCallback(async (moodBefore?: number) => {
    DebugLogger.debug('SessionProvider: Starting session', { 
      component: 'SessionProvider', 
      method: 'startSession',
      moodBefore 
    });
    
    try {
      const newSession = {
        id: Date.now(),
        startTime: new Date(),
        status: 'active',
        type: 'therapy',
        messages: [],
        moodBefore: moodBefore || 5
      };
      
      setCurrentSession(newSession);
      
      DebugLogger.info('SessionProvider: Session started successfully', { 
        component: 'SessionProvider', 
        method: 'startSession',
        sessionId: newSession.id,
        moodBefore: newSession.moodBefore
      });
    } catch (error) {
      DebugLogger.error('SessionProvider: Failed to start session', error as Error, { 
        component: 'SessionProvider', 
        method: 'startSession',
        moodBefore 
      });
      throw error;
    }
  }, []);

  const endSession = useCallback(async (moodAfter?: number, feedback?: string, rating?: number) => {
    DebugLogger.debug('SessionProvider: Ending session', { 
      component: 'SessionProvider', 
      method: 'endSession',
      sessionId: currentSession?.id,
      moodAfter,
      hasNotes: !!feedback,
      rating
    });
    
    if (!currentSession) {
      DebugLogger.warn('SessionProvider: No current session to end', { 
        component: 'SessionProvider', 
        method: 'endSession'
      });
      return;
    }

    try {
      const endedSession = {
        ...currentSession,
        endTime: new Date(),
        moodAfter,
        feedback,
        rating
      };
      
      setSessionHistory(prev => {
        const updated = [...prev, endedSession];
        DebugLogger.debug('SessionProvider: Updated session history', { 
          component: 'SessionProvider', 
          method: 'endSession',
          historyCount: updated.length
        });
        return updated;
      });
      
      setSessions(prev => {
        const updated = [...prev, endedSession];
        DebugLogger.debug('SessionProvider: Updated sessions list', { 
          component: 'SessionProvider', 
          method: 'endSession',
          sessionsCount: updated.length
        });
        return updated;
      });
      
      setCurrentSession(null);
      
      DebugLogger.info('SessionProvider: Session ended successfully', { 
        component: 'SessionProvider', 
        method: 'endSession',
        sessionId: endedSession.id,
        duration: endedSession.endTime.getTime() - new Date(endedSession.startTime).getTime(),
        moodAfter,
        rating
      });
    } catch (error) {
      DebugLogger.error('SessionProvider: Failed to end session', error as Error, { 
        component: 'SessionProvider', 
        method: 'endSession',
        sessionId: currentSession?.id
      });
      throw error;
    }
  }, [currentSession]);

  const addMessage = useCallback(async (content: string, type: string) => {
    DebugLogger.debug('SessionProvider: Adding message', { 
      component: 'SessionProvider', 
      method: 'addMessage',
      sessionId: currentSession?.id,
      messageType: type,
      contentLength: content?.length
    });
    
    if (!currentSession) {
      DebugLogger.warn('SessionProvider: No current session for message', { 
        component: 'SessionProvider', 
        method: 'addMessage',
        messageType: type
      });
      return;
    }

    try {
      const message = {
        id: Date.now(),
        content,
        type,
        sender: type === 'user' ? 'user' : 'ai',
        timestamp: new Date()
      };
      
      setCurrentSession(prev => {
        if (!prev) return null;
        
        const updated = {
          ...prev,
          messages: [...(prev.messages || []), message]
        };
        
        DebugLogger.debug('SessionProvider: Message added to session', { 
          component: 'SessionProvider', 
          method: 'addMessage',
          sessionId: prev.id,
          messageId: message.id,
          totalMessages: updated.messages.length
        });
        
        return updated;
      });
    } catch (error) {
      DebugLogger.error('SessionProvider: Failed to add message', error as Error, { 
        component: 'SessionProvider', 
        method: 'addMessage',
        sessionId: currentSession?.id,
        messageType: type
      });
    }
  }, [currentSession]);

  const addBreakthrough = useCallback((breakthrough: any) => {
    DebugLogger.debug('SessionProvider: Adding breakthrough', { 
      component: 'SessionProvider', 
      method: 'addBreakthrough',
      sessionId: currentSession?.id,
      breakthrough
    });
    
    if (!currentSession) {
      DebugLogger.warn('SessionProvider: No current session for breakthrough', { 
        component: 'SessionProvider', 
        method: 'addBreakthrough'
      });
      return;
    }

    setCurrentSession(prev => {
      if (!prev) return null;
      
      const updated = {
        ...prev,
        breakthroughs: [...(prev.breakthroughs || []), breakthrough]
      };
      
      DebugLogger.info('SessionProvider: Breakthrough added', { 
        component: 'SessionProvider', 
        method: 'addBreakthrough',
        sessionId: prev.id,
        totalBreakthroughs: updated.breakthroughs.length
      });
      
      return updated;
    });
  }, [currentSession]);

  const syncWithRealtimeSession = useCallback((sessionId?: string, isActive?: boolean) => {
    DebugLogger.debug('SessionProvider: Syncing with realtime session', { 
      component: 'SessionProvider', 
      method: 'syncWithRealtimeSession',
      realtimeSessionId: sessionId,
      isActive,
      currentSessionId: currentSession?.id
    });
    
    if (currentSession && sessionId) {
      setCurrentSession(prev => {
        if (!prev) return null;
        
        const updated = {
          ...prev,
          realtimeSessionId: sessionId,
          isRealtimeActive: isActive || false
        };
        
        DebugLogger.info('SessionProvider: Realtime session synced', { 
          component: 'SessionProvider', 
          method: 'syncWithRealtimeSession',
          sessionId: prev.id,
          realtimeSessionId: sessionId,
          isActive: updated.isRealtimeActive
        });
        
        return updated;
      });
    }
  }, [currentSession]);

  const updateRealtimeStatus = useCallback((sessionId: string, isActive: boolean) => {
    DebugLogger.debug('SessionProvider: Updating realtime status', { 
      component: 'SessionProvider', 
      method: 'updateRealtimeStatus',
      realtimeSessionId: sessionId,
      isActive,
      currentSessionId: currentSession?.id
    });
    
    if (currentSession) {
      setCurrentSession(prev => {
        if (!prev) return null;
        
        const updated = {
          ...prev,
          realtimeSessionId: sessionId,
          isRealtimeActive: isActive
        };
        
        DebugLogger.info('SessionProvider: Realtime status updated', { 
          component: 'SessionProvider', 
          method: 'updateRealtimeStatus',
          sessionId: prev.id,
          realtimeSessionId: sessionId,
          isActive
        });
        
        return updated;
      });
    }
  }, [currentSession]);

  const loadSessions = useCallback(async () => {
    DebugLogger.debug('SessionProvider: Loading sessions', { 
      component: 'SessionProvider', 
      method: 'loadSessions'
    });
    
    try {
      // TODO: Implement actual session loading from backend
      DebugLogger.info('SessionProvider: Sessions loaded (placeholder)', { 
        component: 'SessionProvider', 
        method: 'loadSessions'
      });
    } catch (error) {
      DebugLogger.error('SessionProvider: Error loading sessions', error as Error, { 
        component: 'SessionProvider', 
        method: 'loadSessions'
      });
    }
  }, []);

  const getSessionDuration = useCallback(() => {
    if (!currentSession?.startTime) {
      DebugLogger.debug('SessionProvider: No session for duration calculation', { 
        component: 'SessionProvider', 
        method: 'getSessionDuration'
      });
      return 0;
    }
    
    const duration = Math.floor((new Date().getTime() - new Date(currentSession.startTime).getTime()) / 60000);
    
    DebugLogger.trace('SessionProvider: Calculated session duration', { 
      component: 'SessionProvider', 
      method: 'getSessionDuration',
      sessionId: currentSession.id,
      duration
    });
    
    return duration;
  }, [currentSession]);

  const getContentQuality = useCallback(() => {
    if (!currentSession?.messages) {
      DebugLogger.debug('SessionProvider: No session messages for quality calculation', { 
        component: 'SessionProvider', 
        method: 'getContentQuality'
      });
      return { messageCount: 0, userMessages: 0 };
    }
    
    const messageCount = currentSession.messages.length;
    const userMessages = currentSession.messages.filter((msg: any) => msg.sender === 'user').length;
    
    DebugLogger.trace('SessionProvider: Calculated content quality', { 
      component: 'SessionProvider', 
      method: 'getContentQuality',
      sessionId: currentSession.id,
      messageCount,
      userMessages
    });
    
    return { messageCount, userMessages };
  }, [currentSession]);

  const canEndSession = useCallback(() => {
    if (!currentSession) {
      DebugLogger.debug('SessionProvider: No session to check end conditions', { 
        component: 'SessionProvider', 
        method: 'canEndSession'
      });
      return false;
    }
    
    const duration = getSessionDuration();
    const quality = getContentQuality();
    const canEnd = duration >= 5 && quality.messageCount >= 6 && quality.userMessages >= 3;
    
    DebugLogger.debug('SessionProvider: Session end conditions checked', { 
      component: 'SessionProvider', 
      method: 'canEndSession',
      sessionId: currentSession.id,
      duration,
      messageCount: quality.messageCount,
      userMessages: quality.userMessages,
      canEnd
    });
    
    return canEnd;
  }, [currentSession, getSessionDuration, getContentQuality]);

  const value = useMemo(() => {
    const contextValue = {
      currentSession,
      sessionHistory,
      sessions,
      startSession,
      endSession,
      addMessage,
      addBreakthrough,
      syncWithRealtimeSession,
      updateRealtimeStatus,
      canEndSession,
      getSessionDuration,
      getContentQuality,
      loadSessions,
    };
    
    DebugLogger.trace('SessionProvider: Context value updated', { 
      component: 'SessionProvider',
      hasCurrentSession: !!currentSession,
      sessionHistoryCount: sessionHistory.length,
      sessionsCount: sessions.length
    });
    
    return contextValue;
  }, [
    currentSession,
    sessionHistory,
    sessions,
    startSession,
    endSession,
    addMessage,
    addBreakthrough,
    syncWithRealtimeSession,
    updateRealtimeStatus,
    canEndSession,
    getSessionDuration,
    getContentQuality,
    loadSessions,
  ]);

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  DebugLogger.trace('useSession: Hook called', { component: 'useSession' });
  
  const context = useContext(SessionContext);
  if (context === undefined) {
    const error = new Error('useSession must be used within a SessionProvider');
    DebugLogger.error('useSession: Context undefined', error, { component: 'useSession' });
    throw error;
  }
  
  return context;
};
