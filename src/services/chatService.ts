
import { supabase } from '@/integrations/supabase/client';

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  emotion?: string;
  sessionId?: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'completed' | 'paused';
}

export const chatService = {
  async createSession(userId: string): Promise<ChatSession | null> {
    try {
      const { data, error } = await supabase
        .from('therapy_sessions')
        .insert({
          user_id: userId,
          status: 'active',
          start_time: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        userId: data.user_id,
        startTime: new Date(data.start_time),
        endTime: data.end_time ? new Date(data.end_time) : undefined,
        status: data.status
      };
    } catch (error) {
      console.error('Error creating chat session:', error);
      return null;
    }
  },

  async sendMessage(sessionId: string, content: string, sender: 'user' | 'ai'): Promise<ChatMessage | null> {
    try {
      const { data, error } = await supabase
        .from('session_messages')
        .insert({
          session_id: sessionId,
          content,
          sender,
          timestamp: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        content: data.content,
        sender: data.sender,
        timestamp: new Date(data.timestamp),
        emotion: data.emotion,
        sessionId: data.session_id
      };
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  },

  async getSessionMessages(sessionId: string): Promise<ChatMessage[]> {
    try {
      const { data, error } = await supabase
        .from('session_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('timestamp', { ascending: true });

      if (error) throw error;

      return data.map(msg => ({
        id: msg.id,
        content: msg.content,
        sender: msg.sender,
        timestamp: new Date(msg.timestamp),
        emotion: msg.emotion,
        sessionId: msg.session_id
      }));
    } catch (error) {
      console.error('Error fetching session messages:', error);
      return [];
    }
  },

  async endSession(sessionId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('therapy_sessions')
        .update({
          status: 'completed',
          end_time: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error ending session:', error);
      return false;
    }
  }
};
