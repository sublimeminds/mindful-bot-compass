
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSimpleApp } from '@/hooks/useSimpleApp';

export const useRealTimeSession = (sessionId?: string) => {
  const { user } = useSimpleApp();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionState, setSessionState] = useState<'idle' | 'active' | 'paused' | 'ended'>('idle');
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(sessionId || null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    if (currentSessionId) {
      fetchInitialMessages();
      setupRealtimeSubscription();
    } else {
      setLoading(false);
    }
  }, [currentSessionId, user]);

  const fetchInitialMessages = async () => {
    if (!currentSessionId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('session_messages')
        .select('*')
        .eq('session_id', currentSessionId)
        .order('created_at', { ascending: true });

      if (error) {
        setError(error.message);
      } else {
        setMessages(data || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    if (!currentSessionId) return;

    const channel = supabase
      .channel(`session_${currentSessionId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'session_messages', filter: `session_id=eq.${currentSessionId}` },
        (payload) => {
          if (payload.new) {
            setMessages((prevMessages) => [...prevMessages, payload.new]);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  };

  const startSession = async () => {
    try {
      // Create new session
      const { data: sessionData, error: sessionError } = await supabase
        .from('therapy_sessions')
        .insert({
          user_id: user?.id,
          status: 'active',
          start_time: new Date().toISOString()
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      setCurrentSessionId(sessionData.id);
      setSessionState('active');
      return sessionData.id;
    } catch (error) {
      console.error('Error starting session:', error);
      setError('Failed to start session');
      return null;
    }
  };

  const endSession = async () => {
    if (!currentSessionId) return;

    try {
      const { error } = await supabase
        .from('therapy_sessions')
        .update({
          status: 'completed',
          end_time: new Date().toISOString()
        })
        .eq('id', currentSessionId);

      if (error) throw error;

      setSessionState('ended');
      setCurrentSessionId(null);
    } catch (error) {
      console.error('Error ending session:', error);
      setError('Failed to end session');
    }
  };

  const pauseSession = async () => {
    setSessionState('paused');
  };

  const resumeSession = async () => {
    setSessionState('active');
  };

  const sendMessage = async (content: string) => {
    if (!currentSessionId || !user) return;

    try {
      const { error } = await supabase
        .from('session_messages')
        .insert({
          session_id: currentSessionId,
          sender: 'user',
          content: content,
          timestamp: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    }
  };

  return {
    messages,
    loading,
    error,
    sessionState,
    startSession,
    endSession,
    pauseSession,
    resumeSession,
    sendMessage
  };
};
