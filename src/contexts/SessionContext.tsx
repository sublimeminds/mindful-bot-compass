
import * as React from 'react';

interface SessionContextType {
  currentSession: any;
  sessionHistory: any[];
  startSession: () => void;
  endSession: () => void;
}

const SessionContext = React.createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSession, setCurrentSession] = React.useState(null);
  const [sessionHistory, setSessionHistory] = React.useState([]);

  const startSession = React.useCallback(() => {
    const newSession = {
      id: Date.now(),
      startTime: new Date(),
      status: 'active'
    };
    setCurrentSession(newSession);
  }, []);

  const endSession = React.useCallback(() => {
    if (currentSession) {
      setSessionHistory(prev => [...prev, { ...currentSession, endTime: new Date() }]);
      setCurrentSession(null);
    }
  }, [currentSession]);

  const value = React.useMemo(() => ({
    currentSession,
    sessionHistory,
    startSession,
    endSession,
  }), [currentSession, sessionHistory, startSession, endSession]);

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
