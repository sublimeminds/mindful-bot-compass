
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

export interface ChatState {
  currentSession: ChatSession | null;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

export interface ChatActions {
  startSession: () => Promise<void>;
  endSession: () => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}
