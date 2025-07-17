
import { useState, useCallback } from 'react';
import { chatService } from '@/services/chatService';
import { OpenAIService } from '@/services/openAiService';
import { useSimpleApp } from './useSimpleApp';
import { enhancedSessionOrchestrator } from '@/services/enhancedSessionOrchestrator';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface RealTimeSessionHook {
  messages: Message[];
  loading: boolean;
  error: string | null;
  sessionState: 'idle' | 'active' | 'paused' | 'completed';
  startSession: () => Promise<void>;
  endSession: () => Promise<void>;
  pauseSession: () => void;
  resumeSession: () => void;
  sendMessage: (content: string) => Promise<void>;
}

export const useRealTimeSession = (): RealTimeSessionHook => {
  const { user } = useSimpleApp();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionState, setSessionState] = useState<'idle' | 'active' | 'paused' | 'completed'>('idle');
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const startSession = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const session = await chatService.createSession(user.id);
      setCurrentSessionId(session.id);
      setSessionState('active');
      setMessages([]);
      setError(null);
    } catch (err) {
      setError('Failed to start session');
      console.error('Error starting session:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const endSession = useCallback(async () => {
    if (!currentSessionId) return;
    
    try {
      await chatService.endSession(currentSessionId);
      setSessionState('completed');
      setCurrentSessionId(null);
    } catch (err) {
      setError('Failed to end session');
      console.error('Error ending session:', err);
    }
  }, [currentSessionId]);

  const pauseSession = useCallback(() => {
    setSessionState('paused');
  }, []);

  const resumeSession = useCallback(() => {
    setSessionState('active');
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!currentSessionId || !user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Add user message
      const userMessage: Message = {
        id: `msg_${Date.now()}`,
        content,
        sender: 'user',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Save user message
      await chatService.sendMessage(currentSessionId, content, 'user');
      
      // Use enhanced AI orchestrator for better responses
      const response = await supabase.functions.invoke('advanced-ai-therapy-orchestrator', {
        body: {
          message: content,
          userId: user.id,
          sessionId: currentSessionId,
          currentPhase: 'intervention',
          sessionHistory: messages,
          culturalContext: {},
          emotionalState: { primary: 'neutral', intensity: 5 },
          therapistId: 'dr-sarah-chen'
        }
      });
      
      let aiResponseText = '';
      
      if (response.data?.response) {
        aiResponseText = response.data.response;
      } else {
        // Fallback to original OpenAI service
        const fallbackResponse = await OpenAIService.sendTherapyMessage(
          content,
          messages.map(msg => ({ role: msg.sender === 'user' ? 'user' : 'assistant', content: msg.content }))
        );
        aiResponseText = fallbackResponse.message;
      }
      
      // Add AI message
      const aiMessage: Message = {
        id: `msg_${Date.now() + 1}`,
        content: aiResponseText,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Save AI message
      await chatService.sendMessage(currentSessionId, aiResponseText, 'ai');
      
    } catch (err) {
      setError('Failed to send message');
      console.error('Error sending message:', err);
    } finally {
      setLoading(false);
    }
  }, [currentSessionId, user, messages]);

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
