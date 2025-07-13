import { useState, useEffect } from 'react';
import { SessionTranscriptionService, SessionSummary, SessionInsight, SessionTranscript } from '@/services/sessionTranscriptionService';
import { useAuth } from './useAuth';

export const useSessionTranscription = (sessionId?: string) => {
  const { user } = useAuth();
  const [transcript, setTranscript] = useState<SessionTranscript | null>(null);
  const [summary, setSummary] = useState<SessionSummary | null>(null);
  const [insights, setInsights] = useState<SessionInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSessionData = async (id: string) => {
    if (!user || !id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const data = await SessionTranscriptionService.getAllSessionData(id);
      setTranscript(data.transcript);
      setSummary(data.summary);
      setInsights(data.insights);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load session data');
      console.error('Error loading session transcription data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadUserSummaries = async (limit = 10) => {
    if (!user) return [];
    
    try {
      setLoading(true);
      const summaries = await SessionTranscriptionService.getUserSummaries(user.id, limit);
      return summaries;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load summaries');
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      loadSessionData(sessionId);
    }
  }, [sessionId, user]);

  return {
    transcript,
    summary,
    insights,
    loading,
    error,
    loadSessionData,
    loadUserSummaries,
    hasTranscription: !!transcript || !!summary || !!insights
  };
};

export default useSessionTranscription;