
import { supabase } from '@/integrations/supabase/client';

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  emotion?: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'completed' | 'paused';
}

class ChatService {
  async createSession(userId: string): Promise<ChatSession> {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // For now, create a local session object since we don't have the table yet
    const session: ChatSession = {
      id: sessionId,
      userId,
      startTime: new Date(),
      status: 'active'
    };
    
    // Store in localStorage temporarily
    localStorage.setItem(`chat_session_${sessionId}`, JSON.stringify(session));
    
    console.log('Created new chat session:', sessionId);
    return session;
  }

  async endSession(sessionId: string): Promise<void> {
    const sessionData = localStorage.getItem(`chat_session_${sessionId}`);
    if (sessionData) {
      const session = JSON.parse(sessionData);
      session.endTime = new Date();
      session.status = 'completed';
      localStorage.setItem(`chat_session_${sessionId}`, JSON.stringify(session));
    }
    console.log('Ended chat session:', sessionId);
  }

  async sendMessage(sessionId: string, content: string, sender: 'user' | 'ai'): Promise<void> {
    const message: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content,
      sender,
      timestamp: new Date()
    };

    // Store message in localStorage temporarily
    const messagesKey = `chat_messages_${sessionId}`;
    const existingMessages = JSON.parse(localStorage.getItem(messagesKey) || '[]');
    existingMessages.push(message);
    localStorage.setItem(messagesKey, JSON.stringify(existingMessages));
    
    console.log('Stored message for session:', sessionId);
  }

  async getSessionMessages(sessionId: string): Promise<ChatMessage[]> {
    const messagesKey = `chat_messages_${sessionId}`;
    const messages = JSON.parse(localStorage.getItem(messagesKey) || '[]');
    return messages.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }));
  }
}

export const chatService = new ChatService();
