import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { DebugLogger } from '@/utils/debugLogger';
import { EnhancedMemoryAiService, MemoryEnhancedContext } from '@/services/enhancedMemoryAiService';

interface SessionContextType {
  currentSession: any;
  sessionHistory: any[];
  sessions: any[];
  memoryContext: MemoryEnhancedContext | null;
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
  prepareEnhancedContext: (userId: string) => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  DebugLogger.debug('SessionProvider: Initializing with enhanced memory', { component: 'SessionProvider' });
  
  // Validate React hooks availability before using them
  if (!React.useState || !React.useCallback || !React.useMemo || !React.useContext) {
    DebugLogger.error('SessionProvider: React hooks not available', new Error('React hooks not found'), { component: 'SessionProvider' });
    
    // Return a simple error component instead of throwing
    return React.createElement('div', {
      style: {
        padding: '20px',
        backgroundColor: '#fee2e2',
        border: '1px solid #fecaca',
        borderRadius: '6px',
        color: '#991b1b',
        textAlign: 'center'
      }
    }, 'React Error: Hooks not available. Please refresh the page.');
  }
  
  const [currentSession, setCurrentSession] = useState(null);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [memoryContext, setMemoryContext] = useState<MemoryEnhancedContext | null>(null);

  const prepareEnhancedContext = useCallback(async (userId: string) => {
    DebugLogger.debug('SessionProvider: Preparing enhanced memory context', { 
      component: 'SessionProvider', 
      method: 'prepareEnhancedContext',
      userId 
    });
    
    try {
      const context = await EnhancedMemoryAiService.prepareSessionContext(userId);
      setMemoryContext(context);
      
      DebugLogger.info('SessionProvider: Enhanced memory context prepared', { 
        component: 'SessionProvider', 
        method: 'prepareEnhancedContext',
        memoriesCount: context.recentMemories.length,
        patternsCount: context.emotionalPatterns.length
      });
    } catch (error) {
      DebugLogger.error('SessionProvider: Failed to prepare enhanced context', error as Error, { 
        component: 'SessionProvider', 
        method: 'prepareEnhancedContext'
      });
    }
  }, []);

  const startSession = useCallback(async (moodBefore?: number) => {
    DebugLogger.debug('SessionProvider: Starting enhanced session', { 
      component: 'SessionProvider', 
      method: 'startSession',
      moodBefore 
    });
    
    try {
      const newSession = {
        id: Date.now().toString(),
        startTime: new Date(),
        status: 'active',
        type: 'therapy',
        messages: [],
        moodBefore: moodBefore || 5,
        isMemoryEnhanced: true
      };
      
      setCurrentSession(newSession);
      
      DebugLogger.info('SessionProvider: Enhanced session started successfully', { 
        component: 'SessionProvider', 
        method: 'startSession',
        sessionId: newSession.id,
        moodBefore: newSession.moodBefore,
        isMemoryEnhanced: true
      });
    } catch (error) {
      DebugLogger.error('SessionProvider: Failed to start enhanced session', error as Error, { 
        component: 'SessionProvider', 
        method: 'startSession',
        moodBefore 
      });
      throw error;
    }
  }, []);

  const addMessage = useCallback(async (content: string, type: string) => {
    DebugLogger.debug('SessionProvider: Adding message with memory integration', { 
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
        id: Date.now().toString(),
        content,
        type,
        sender: type === 'user' ? 'user' : 'ai',
        timestamp: new Date(),
        hasMemoryContext: !!memoryContext
      };
      
      setCurrentSession(prev => {
        if (!prev) return null;
        
        const updated = {
          ...prev,
          messages: [...(prev.messages || []), message]
        };
        
        DebugLogger.debug('SessionProvider: Message added to enhanced session', { 
          component: 'SessionProvider', 
          method: 'addMessage',
          sessionId: prev.id,
          messageId: message.id,
          totalMessages: updated.messages.length,
          hasMemoryContext: message.hasMemoryContext
        });
        
        return updated;
      });
      
      // If this is an AI response, analyze and store in memory
      if (type === 'ai' && currentSession.messages.length > 0) {
        const lastUserMessage = currentSession.messages
          .slice()
          .reverse()
          .find(msg => msg.sender === 'user');
        
        if (lastUserMessage && memoryContext) {
          DebugLogger.info('SessionProvider: Would analyze conversation for memory storage', {
            component: 'SessionProvider',
            method: 'addMessage',
            sessionId: currentSession.id
          });
        }
      }
    } catch (error) {
      DebugLogger.error('SessionProvider: Failed to add message to enhanced session', error as Error, { 
        component: 'SessionProvider', 
        method: 'addMessage',
        sessionId: currentSession?.id,
        messageType: type
      });
    }
  }, [currentSession, memoryContext]);

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
      
      setSessionHistory(prev => [...prev, endedSession]);
      setSessions(prev => [...prev, endedSession]);
      setCurrentSession(null);
      setMemoryContext(null);
      
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

  const addBreakthrough = useCallback((breakthrough: any) => {
    if (!currentSession) return;

    setCurrentSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        breakthroughs: [...(prev.breakthroughs || []), breakthrough]
      };
    });
  }, [currentSession]);

  const syncWithRealtimeSession = useCallback((sessionId?: string, isActive?: boolean) => {
    if (currentSession && sessionId) {
      setCurrentSession(prev => {
        if (!prev) return null;
        return {
          ...prev,
          realtimeSessionId: sessionId,
          isRealtimeActive: isActive || false
        };
      });
    }
  }, [currentSession]);

  const updateRealtimeStatus = useCallback((sessionId: string, isActive: boolean) => {
    if (currentSession) {
      setCurrentSession(prev => {
        if (!prev) return null;
        return {
          ...prev,
          realtimeSessionId: sessionId,
          isRealtimeActive: isActive
        };
      });
    }
  }, [currentSession]);

  const loadSessions = useCallback(async () => {
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
    if (!currentSession?.startTime) return 0;
    return Math.floor((new Date().getTime() - new Date(currentSession.startTime).getTime()) / 60000);
  }, [currentSession]);

  const getContentQuality = useCallback(() => {
    if (!currentSession?.messages) {
      return { messageCount: 0, userMessages: 0 };
    }
    
    const messageCount = currentSession.messages.length;
    const userMessages = currentSession.messages.filter((msg: any) => msg.sender === 'user').length;
    
    return { messageCount, userMessages };
  }, [currentSession]);

  const canEndSession = useCallback(() => {
    if (!currentSession) return false;
    
    const duration = getSessionDuration();
    const quality = getContentQuality();
    return duration >= 5 && quality.messageCount >= 6 && quality.userMessages >= 3;
  }, [currentSession, getSessionDuration, getContentQuality]);

  const value = useMemo(() => ({
    currentSession,
    sessionHistory,
    sessions,
    memoryContext,
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
    prepareEnhancedContext,
  }), [
    currentSession,
    sessionHistory,
    sessions,
    memoryContext,
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
    prepareEnhancedContext,
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
    throw new Error('useSession must be used within a SessionProvider');
  }
  
  return context;
};
