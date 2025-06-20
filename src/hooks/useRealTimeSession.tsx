
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { chatService } from '@/services/chatService';
import { useSimpleApp } from '@/hooks/useSimpleApp';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

type SessionState = 'idle' | 'active' | 'paused' | 'ended';

export const useRealTimeSession = () => {
  const { user } = useSimpleApp();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionState, setSessionState] = useState<SessionState>('idle');
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const startSession = useCallback(async () => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    try {
      setLoading(true);
      const session = await chatService.createSession(user.id);
      
      if (session) {
        setCurrentSessionId(session.id);
        setSessionState('active');
        setMessages([]);
        setError(null);
        
        toast({
          title: "Session Started",
          description: "Your therapy session has begun.",
        });
      }
    } catch (err) {
      setError('Failed to start session');
      toast({
        title: "Error",
        description: "Failed to start therapy session.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const endSession = useCallback(async () => {
    if (!currentSessionId) return;

    try {
      setLoading(true);
      await chatService.endSession(currentSessionId);
      
      setSessionState('ended');
      setCurrentSessionId(null);
      
      toast({
        title: "Session Ended",
        description: "Your therapy session has been completed.",
      });
    } catch (err) {
      setError('Failed to end session');
      toast({
        title: "Error",
        description: "Failed to end therapy session.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [currentSessionId, toast]);

  const pauseSession = useCallback(() => {
    setSessionState('paused');
    toast({
      title: "Session Paused",
      description: "Your therapy session has been paused.",
    });
  }, [toast]);

  const resumeSession = useCallback(() => {
    setSessionState('active');
    toast({
      title: "Session Resumed",
      description: "Your therapy session has been resumed.",
    });
  }, [toast]);

  const sendMessage = useCallback(async (content: string) => {
    if (!currentSessionId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);

    try {
      await chatService.sendMessage(currentSessionId, content, 'user');
    } catch (err) {
      setError('Failed to send message');
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      });
    }
  }, [currentSessionId, toast]);

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
