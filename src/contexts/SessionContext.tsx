
import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

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
  startSession: () => Promise<void>;
  endSession: (mood?: number, notes?: string) => Promise<void>;
  addMessage: (content: string, sender: 'user' | 'ai', emotion?: 'positive' | 'negative' | 'neutral') => Promise<void>;
  addTechnique: (technique: string) => void;
  getSessions: () => SessionData[];
  loadSessions: () => Promise<void>;
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

  const startSession = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('therapy_sessions')
        .insert({
          user_id: user.id,
          start_time: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating session:', error);
        return;
      }

      const newSession: SessionData = {
        id: data.id,
        userId: user.id,
        startTime: new Date(data.start_time),
        messages: [],
        mood: {},
        techniques: data.techniques || [],
        notes: data.notes || ''
      };
      
      setCurrentSession(newSession);
    } catch (error) {
      console.error('Error starting session:', error);
    }
  };

  const endSession = async (moodAfter?: number, notes?: string) => {
    if (!currentSession || !user) return;
    
    try {
      const { error } = await supabase
        .from('therapy_sessions')
        .update({
          end_time: new Date().toISOString(),
          mood_after: moodAfter,
          notes: notes || currentSession.notes,
          techniques: currentSession.techniques
        })
        .eq('id', currentSession.id);

      if (error) {
        console.error('Error ending session:', error);
        return;
      }

      const endedSession: SessionData = {
        ...currentSession,
        endTime: new Date(),
        mood: { ...currentSession.mood, after: moodAfter },
        notes: notes || currentSession.notes
      };
      
      setSessions(prev => [...prev, endedSession]);
      setCurrentSession(null);
      
      console.log('Session ended successfully');
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  const addMessage = async (content: string, sender: 'user' | 'ai', emotion?: 'positive' | 'negative' | 'neutral') => {
    if (!currentSession || !user) return;
    
    try {
      const { data, error } = await supabase
        .from('session_messages')
        .insert({
          session_id: currentSession.id,
          content,
          sender,
          emotion,
          timestamp: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding message:', error);
        return;
      }

      const message = {
        id: data.id,
        content,
        sender,
        timestamp: new Date(data.timestamp),
        emotion
      };
      
      setCurrentSession(prev => prev ? {
        ...prev,
        messages: [...prev.messages, message]
      } : null);
    } catch (error) {
      console.error('Error adding message:', error);
    }
  };

  const addTechnique = (technique: string) => {
    if (!currentSession) return;
    
    setCurrentSession(prev => prev ? {
      ...prev,
      techniques: [...prev.techniques, technique]
    } : null);
  };

  const loadSessions = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('therapy_sessions')
        .select(`
          *,
          session_messages (*)
        `)
        .eq('user_id', user.id)
        .order('start_time', { ascending: false });

      if (error) {
        console.error('Error loading sessions:', error);
        return;
      }

      const loadedSessions: SessionData[] = data.map(session => ({
        id: session.id,
        userId: session.user_id,
        startTime: new Date(session.start_time),
        endTime: session.end_time ? new Date(session.end_time) : undefined,
        messages: session.session_messages.map((msg: any) => ({
          id: msg.id,
          content: msg.content,
          sender: msg.sender,
          timestamp: new Date(msg.timestamp),
          emotion: msg.emotion
        })),
        mood: {
          before: session.mood_before,
          after: session.mood_after
        },
        techniques: session.techniques || [],
        notes: session.notes || ''
      }));

      setSessions(loadedSessions);
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const getSessions = () => sessions;

  const value: SessionContextType = {
    currentSession,
    sessions,
    startSession,
    endSession,
    addMessage,
    addTechnique,
    getSessions,
    loadSessions
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};
