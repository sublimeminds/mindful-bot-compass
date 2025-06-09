
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SessionService, DetailedSession } from '@/services/sessionService';
import { SessionHistoryService, SessionSummary } from '@/services/sessionHistoryService';

export const useSessionHistory = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<DetailedSession[]>([]);
  const [sessionSummaries, setSessionSummaries] = useState<SessionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSessions = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const detailedSessions = await SessionService.getUserSessions(user.id, 50);
      setSessions(detailedSessions);
      
      // Convert to session summaries for compatibility with existing components
      const summaries = SessionHistoryService.generateSessionSummaries(
        detailedSessions.map(session => ({
          id: session.id,
          userId: session.userId,
          startTime: session.startTime,
          endTime: session.endTime,
          messages: session.messages,
          techniques: session.techniques,
          notes: session.notes
        }))
      );
      
      setSessionSummaries(summaries);
    } catch (err) {
      console.error('Error loading sessions:', err);
      setError('Failed to load session history');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, [user]);

  const getSessionStats = () => {
    return SessionHistoryService.getSessionStats(sessionSummaries);
  };

  const filterSessions = (filter: any) => {
    return SessionHistoryService.filterSessions(sessionSummaries, filter);
  };

  const exportSessions = () => {
    return SessionHistoryService.exportSessionData(sessionSummaries);
  };

  return {
    sessions,
    sessionSummaries,
    isLoading,
    error,
    loadSessions,
    getSessionStats,
    filterSessions,
    exportSessions
  };
};
