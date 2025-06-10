import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { NotificationService } from '@/services/notificationService';

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
  goalProgress?: Record<string, number>; // Track progress on specific goals
  sessionRating?: number; // How helpful was this session (1-5)
  breakthroughs?: string[]; // Key insights or breakthroughs
  // Real-time session integration
  realtimeSessionId?: string;
  isRealtimeActive?: boolean;
}

interface SessionContextType {
  currentSession: SessionData | null;
  sessions: SessionData[];
  startSession: (moodBefore?: number, realtimeSessionId?: string) => Promise<void>;
  endSession: (moodAfter?: number, notes?: string, rating?: number) => Promise<void>;
  addMessage: (content: string, sender: 'user' | 'ai', emotion?: 'positive' | 'negative' | 'neutral') => Promise<void>;
  addTechnique: (technique: string) => void;
  addBreakthrough: (breakthrough: string) => void;
  updateGoalProgress: (goal: string, progress: number) => void;
  getSessions: () => SessionData[];
  loadSessions: () => Promise<void>;
  getSessionInsights: () => {
    totalSessions: number;
    averageRating: number;
    mostUsedTechniques: string[];
    moodTrend: number;
    totalBreakthroughs: number;
  };
  // Real-time session methods
  updateRealtimeStatus: (sessionId: string, isActive: boolean) => void;
  syncWithRealtimeSession: (realtimeSessionId: string, isActive: boolean) => void;
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

  const startSession = async (moodBefore?: number, realtimeSessionId?: string) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('therapy_sessions')
        .insert({
          user_id: user.id,
          start_time: new Date().toISOString(),
          mood_before: moodBefore,
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
        mood: { before: moodBefore },
        techniques: [],
        notes: '',
        goalProgress: {},
        breakthroughs: [],
        realtimeSessionId: realtimeSessionId,
        isRealtimeActive: !!realtimeSessionId
      };
      
      setCurrentSession(newSession);

      // Generate reminder notification for next session
      await NotificationService.generateSessionReminder(user.id);
    } catch (error) {
      console.error('Error starting session:', error);
    }
  };

  const endSession = async (moodAfter?: number, notes?: string, rating?: number) => {
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
        notes: notes || currentSession.notes,
        sessionRating: rating,
        isRealtimeActive: false
      };
      
      setSessions(prev => [...prev, endedSession]);
      setCurrentSession(null);

      // Generate milestone notification if applicable
      const totalSessions = sessions.length + 1;
      if (totalSessions % 5 === 0) {
        await NotificationService.generateMilestoneNotification(
          user.id, 
          `${totalSessions} therapy sessions completed`
        );
      }

      // Generate insight notification for mood improvement
      if (moodAfter && currentSession.mood.before && moodAfter > currentSession.mood.before + 2) {
        await NotificationService.generateInsightNotification(
          user.id,
          'Significant mood improvement detected in your recent session'
        );
      }
      
      console.log('Session ended successfully');
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  const updateRealtimeStatus = (sessionId: string, isActive: boolean) => {
    if (!currentSession || currentSession.realtimeSessionId !== sessionId) return;
    
    setCurrentSession(prev => prev ? {
      ...prev,
      isRealtimeActive: isActive
    } : null);
  };

  const syncWithRealtimeSession = (realtimeSessionId: string, isActive: boolean) => {
    if (!currentSession) return;
    
    setCurrentSession(prev => prev ? {
      ...prev,
      realtimeSessionId,
      isRealtimeActive: isActive
    } : null);
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

  const addBreakthrough = (breakthrough: string) => {
    if (!currentSession) return;
    
    setCurrentSession(prev => prev ? {
      ...prev,
      breakthroughs: [...(prev.breakthroughs || []), breakthrough]
    } : null);
  };

  const updateGoalProgress = (goal: string, progress: number) => {
    if (!currentSession) return;
    
    setCurrentSession(prev => prev ? {
      ...prev,
      goalProgress: {
        ...prev.goalProgress,
        [goal]: progress
      }
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
        notes: session.notes || '',
        goalProgress: {},
        breakthroughs: []
      }));

      setSessions(loadedSessions);
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const getSessions = () => sessions;

  const getSessionInsights = () => {
    const completedSessions = sessions.filter(s => s.endTime);
    
    const totalSessions = completedSessions.length;
    const averageRating = completedSessions
      .filter(s => s.sessionRating)
      .reduce((sum, s) => sum + (s.sessionRating || 0), 0) / 
      completedSessions.filter(s => s.sessionRating).length || 0;

    const allTechniques = completedSessions.flatMap(s => s.techniques);
    const techniqueCount = allTechniques.reduce((acc, tech) => {
      acc[tech] = (acc[tech] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const mostUsedTechniques = Object.entries(techniqueCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([tech]) => tech);

    const moodChanges = completedSessions
      .filter(s => s.mood.before && s.mood.after)
      .map(s => (s.mood.after! - s.mood.before!));
    
    const moodTrend = moodChanges.length > 0 
      ? moodChanges.reduce((sum, change) => sum + change, 0) / moodChanges.length 
      : 0;

    const totalBreakthroughs = completedSessions
      .reduce((sum, s) => sum + (s.breakthroughs?.length || 0), 0);

    return {
      totalSessions,
      averageRating,
      mostUsedTechniques,
      moodTrend,
      totalBreakthroughs
    };
  };

  const value: SessionContextType = {
    currentSession,
    sessions,
    startSession,
    endSession,
    addMessage,
    addTechnique,
    addBreakthrough,
    updateGoalProgress,
    getSessions,
    loadSessions,
    getSessionInsights,
    updateRealtimeStatus,
    syncWithRealtimeSession
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

export default SessionProvider;
