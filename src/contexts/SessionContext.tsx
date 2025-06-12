
import * as React from 'react';

interface SessionContextType {
  currentSession: any;
  sessionHistory: any[];
  sessions: any[];
  startSession: (sessionType?: string) => void;
  endSession: (sessionData?: any, feedback?: string, rating?: number) => void;
  addMessage: (content: string, type: string) => Promise<void>;
  addBreakthrough: (breakthrough: any) => void;
  syncWithRealtimeSession: () => void;
  updateRealtimeStatus: (status: any) => void;
  canEndSession: boolean;
  getSessionDuration: () => number;
  getContentQuality: () => number;
  loadSessions: () => Promise<void>;
}

const SessionContext = React.createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSession, setCurrentSession] = React.useState(null);
  const [sessionHistory, setSessionHistory] = React.useState([]);
  const [sessions, setSessions] = React.useState([]);

  const startSession = React.useCallback((sessionType?: string) => {
    const newSession = {
      id: Date.now(),
      startTime: new Date(),
      status: 'active',
      type: sessionType || 'general',
      messages: []
    };
    setCurrentSession(newSession);
  }, []);

  const endSession = React.useCallback((sessionData?: any, feedback?: string, rating?: number) => {
    if (currentSession) {
      const endedSession = {
        ...currentSession,
        endTime: new Date(),
        feedback,
        rating,
        ...sessionData
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

  const syncWithRealtimeSession = React.useCallback(() => {
    // Implementation for real-time session sync
    console.log('Syncing with real-time session');
  }, []);

  const updateRealtimeStatus = React.useCallback((status: any) => {
    if (currentSession) {
      setCurrentSession(prev => prev ? {
        ...prev,
        realtimeStatus: status
      } : null);
    }
  }, [currentSession]);

  const loadSessions = React.useCallback(async () => {
    // Load sessions from storage or API
    try {
      // This would typically load from a database or API
      console.log('Loading sessions...');
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  }, []);

  const getSessionDuration = React.useCallback(() => {
    if (currentSession?.startTime) {
      return Math.floor((new Date().getTime() - new Date(currentSession.startTime).getTime()) / 1000);
    }
    return 0;
  }, [currentSession]);

  const getContentQuality = React.useCallback(() => {
    // Simple content quality calculation based on session data
    if (currentSession?.messages) {
      const messageCount = currentSession.messages.length;
      return Math.min(100, messageCount * 10); // Simple scoring
    }
    return 0;
  }, [currentSession]);

  const canEndSession = React.useMemo(() => {
    return currentSession !== null;
  }, [currentSession]);

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
