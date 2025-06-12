
import * as React from 'react';

interface SessionContextType {
  currentSession: any;
  sessionHistory: any[];
  sessions: any[];
  startSession: (moodBefore?: number) => void;
  endSession: (moodAfter?: number, feedback?: string, rating?: number) => void;
  addMessage: (content: string, type: string) => Promise<void>;
  addBreakthrough: (breakthrough: any) => void;
  syncWithRealtimeSession: (sessionId?: string, isActive?: boolean) => void;
  updateRealtimeStatus: (sessionId: string, isActive: boolean) => void;
  canEndSession: () => boolean;
  getSessionDuration: () => number;
  getContentQuality: () => { messageCount: number; userMessages: number };
  loadSessions: () => Promise<void>;
}

const SessionContext = React.createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSession, setCurrentSession] = React.useState(null);
  const [sessionHistory, setSessionHistory] = React.useState([]);
  const [sessions, setSessions] = React.useState([]);

  const startSession = React.useCallback((moodBefore?: number) => {
    const newSession = {
      id: Date.now(),
      startTime: new Date(),
      status: 'active',
      type: 'therapy',
      messages: [],
      moodBefore: moodBefore || 5
    };
    setCurrentSession(newSession);
  }, []);

  const endSession = React.useCallback((moodAfter?: number, feedback?: string, rating?: number) => {
    if (currentSession) {
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
    }
  }, [currentSession]);

  const addMessage = React.useCallback(async (content: string, type: string) => {
    if (currentSession) {
      const message = {
        id: Date.now(),
        content,
        type,
        sender: type === 'user' ? 'user' : 'ai',
        timestamp: new Date()
      };
      setCurrentSession(prev => prev ? {
        ...prev,
        messages: [...(prev.messages || []), message]
      } : null);
    }
  }, [currentSession]);

  const addBreakthrough = React.useCallback((breakthrough: any) => {
    if (currentSession) {
      setCurrentSession(prev => prev ? {
        ...prev,
        breakthroughs: [...(prev.breakthroughs || []), breakthrough]
      } : null);
    }
  }, [currentSession]);

  const syncWithRealtimeSession = React.useCallback((sessionId?: string, isActive?: boolean) => {
    if (currentSession && sessionId) {
      setCurrentSession(prev => prev ? {
        ...prev,
        realtimeSessionId: sessionId,
        isRealtimeActive: isActive || false
      } : null);
    }
    console.log('Syncing with real-time session', { sessionId, isActive });
  }, [currentSession]);

  const updateRealtimeStatus = React.useCallback((sessionId: string, isActive: boolean) => {
    if (currentSession) {
      setCurrentSession(prev => prev ? {
        ...prev,
        realtimeSessionId: sessionId,
        isRealtimeActive: isActive
      } : null);
    }
  }, [currentSession]);

  const loadSessions = React.useCallback(async () => {
    try {
      console.log('Loading sessions...');
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  }, []);

  const getSessionDuration = React.useCallback(() => {
    if (currentSession?.startTime) {
      return Math.floor((new Date().getTime() - new Date(currentSession.startTime).getTime()) / 60000);
    }
    return 0;
  }, [currentSession]);

  const getContentQuality = React.useCallback(() => {
    if (currentSession?.messages) {
      const messageCount = currentSession.messages.length;
      const userMessages = currentSession.messages.filter((msg: any) => msg.sender === 'user').length;
      return { messageCount, userMessages };
    }
    return { messageCount: 0, userMessages: 0 };
  }, [currentSession]);

  const canEndSession = React.useCallback(() => {
    if (!currentSession) return false;
    const duration = getSessionDuration();
    const quality = getContentQuality();
    return duration >= 5 && quality.messageCount >= 6 && quality.userMessages >= 3;
  }, [currentSession, getSessionDuration, getContentQuality]);

  const value = React.useMemo(() => ({
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
  }), [
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
  const context = React.useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
