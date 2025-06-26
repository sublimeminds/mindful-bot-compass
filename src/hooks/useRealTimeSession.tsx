
import { useState, useEffect, useCallback } from 'react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { chatService } from '@/services/chatService';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export const useRealTimeSession = () => {
  const { user } = useSimpleApp();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionState, setSessionState] = useState<'idle' | 'active' | 'paused' | 'ended'>('idle');
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const startSession = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const session = await chatService.createSession(user.id);
      if (session) {
        setCurrentSessionId(session.id);
        setSessionState('active');
        setMessages([]);
        toast({
          title: "Session Started",
          description: "Your therapy session has begun.",
        });
      }
    } catch (err) {
      setError('Failed to start session');
      toast({
        title: "Error",
        description: "Failed to start session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const endSession = useCallback(async () => {
    if (!currentSessionId) return;
    
    try {
      await chatService.endSession(currentSessionId);
      setSessionState('ended');
      setCurrentSessionId(null);
      toast({
        title: "Session Ended",
        description: "Your therapy session has been completed.",
      });
    } catch (err) {
      setError('Failed to end session');
    }
  }, [currentSessionId, toast]);

  const pauseSession = useCallback(() => {
    setSessionState('paused');
    toast({
      title: "Session Paused",
      description: "Your session has been paused.",
    });
  }, [toast]);

  const resumeSession = useCallback(() => {
    setSessionState('active');
    toast({
      title: "Session Resumed",
      description: "Your session has been resumed.",
    });
  }, [toast]);

  const sendMessage = useCallback(async (content: string) => {
    if (!currentSessionId || !user) return;

    try {
      setLoading(true);
      
      // Add user message immediately
      const userMessage: Message = {
        id: Date.now().toString(),
        content,
        sender: 'user',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);

      // Send to chat service
      await chatService.sendMessage(currentSessionId, content, 'user');

      // Simulate AI response (replace with actual AI service call)
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "Thank you for sharing that with me. How does that make you feel?",
          sender: 'assistant',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      }, 1000);

    } catch (err) {
      setError('Failed to send message');
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [currentSessionId, user, toast]);

  return {
    messages,
    loading,
    error,
    sessionState,
    currentSessionId,
    startSession,
    endSession,
    pauseSession,
    resumeSession,
    sendMessage
  };
};
