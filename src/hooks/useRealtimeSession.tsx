
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { DetailedSession } from '@/services/sessionService';

export const useRealtimeSession = (sessionId?: string) => {
  const { user } = useAuth();
  const [session, setSession] = useState<DetailedSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId || !user) return;

    const fetchSession = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('therapy_sessions')
          .select(`
            *,
            session_messages (*),
            session_insights (*),
            session_analytics (*)
          `)
          .eq('id', sessionId)
          .single();

        if (error) {
          setError('Failed to load session');
          return;
        }

        // Transform data to DetailedSession format
        const detailedSession: DetailedSession = {
          id: data.id,
          userId: data.user_id,
          startTime: new Date(data.start_time),
          endTime: data.end_time ? new Date(data.end_time) : undefined,
          moodBefore: data.mood_before,
          moodAfter: data.mood_after,
          techniques: data.techniques || [],
          notes: data.notes || '',
          messages: data.session_messages?.map((msg: any) => ({
            id: msg.id,
            content: msg.content,
            sender: msg.sender,
            timestamp: new Date(msg.timestamp),
            emotion: msg.emotion
          })) || [],
          insights: data.session_insights?.map((insight: any) => ({
            id: insight.id,
            sessionId: insight.session_id,
            insightType: insight.insight_type,
            title: insight.title,
            description: insight.description,
            priority: insight.priority,
            actionableSuggestion: insight.actionable_suggestion,
            confidenceScore: insight.confidence_score,
            createdAt: new Date(insight.created_at)
          })) || [],
          analytics: data.session_analytics?.length > 0 ? {
            id: data.session_analytics[0].id,
            sessionId: data.session_analytics[0].session_id,
            effectivenessScore: data.session_analytics[0].effectiveness_score,
            moodImprovement: data.session_analytics[0].mood_improvement,
            techniquesEffectiveness: (data.session_analytics[0].techniques_effectiveness as Record<string, number>) || {},
            keyBreakthrough: data.session_analytics[0].key_breakthrough,
            sessionRating: data.session_analytics[0].session_rating,
            createdAt: new Date(data.session_analytics[0].created_at)
          } : undefined
        };

        setSession(detailedSession);
      } catch (err) {
        console.error('Error fetching session:', err);
        setError('Failed to load session');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();

    // Set up real-time subscription for session updates
    const channel = supabase
      .channel('session-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'session_messages',
          filter: `session_id=eq.${sessionId}`
        },
        (payload) => {
          console.log('Message update:', payload);
          fetchSession(); // Refetch session data
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'session_insights',
          filter: `session_id=eq.${sessionId}`
        },
        (payload) => {
          console.log('Insight update:', payload);
          fetchSession(); // Refetch session data
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'therapy_sessions',
          filter: `id=eq.${sessionId}`
        },
        (payload) => {
          console.log('Session update:', payload);
          fetchSession(); // Refetch session data
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, user]);

  return { session, isLoading, error };
};
