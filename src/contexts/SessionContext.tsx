
import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

interface SessionData {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  messages: Array<{
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: Date;
    emotion?: 'positive' | 'negative' | 'neutral';
  }>;
  mood: {
    before?: number;
    after?: number;
  };
  techniques: string[];
  notes: string;
}

interface SessionContextType {
  currentSession: SessionData | null;
  sessions: SessionData[];
  startSession: () => void;
  endSession: (mood?: number, notes?: string) => void;
  addMessage: (content: string, sender: 'user' | 'ai', emotion?: 'positive' | 'negative' | 'neutral') => void;
  addTechnique: (technique: string) => void;
  getSessions: () => SessionData[];
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [currentSession, setCurrentSession] = useState<SessionData | null>(null);
  const [sessions, setSessions] = useState<SessionData[]>([]);

  const startSession = () => {
    if (!user) return;
    
    const newSession: SessionData = {
      id: Date.now().toString(),
      userId: user.id,
      startTime: new Date(),
      messages: [],
      mood: {},
      techniques: [],
      notes: ''
    };
    
    setCurrentSession(newSession);
  };

  const endSession = (moodAfter?: number, notes?: string) => {
    if (!currentSession) return;
    
    const endedSession: SessionData = {
      ...currentSession,
      endTime: new Date(),
      mood: { ...currentSession.mood, after: moodAfter },
      notes: notes || currentSession.notes
    };
    
    setSessions(prev => [...prev, endedSession]);
    setCurrentSession(null);
    
    // In production, save to Supabase
    console.log('Session ended:', endedSession);
  };

  const addMessage = (content: string, sender: 'user' | 'ai', emotion?: 'positive' | 'negative' | 'neutral') => {
    if (!currentSession) return;
    
    const message = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date(),
      emotion
    };
    
    setCurrentSession(prev => prev ? {
      ...prev,
      messages: [...prev.messages, message]
    } : null);
  };

  const addTechnique = (technique: string) => {
    if (!currentSession) return;
    
    setCurrentSession(prev => prev ? {
      ...prev,
      techniques: [...prev.techniques, technique]
    } : null);
  };

  const getSessions = () => sessions;

  const value: SessionContextType = {
    currentSession,
    sessions,
    startSession,
    endSession,
    addMessage,
    addTechnique,
    getSessions
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};
