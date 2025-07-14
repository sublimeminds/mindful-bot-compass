
export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  emotion?: string;
  riskLevel?: 'low' | 'medium' | 'high' | 'crisis';
  techniques?: string[];
  insights?: string[];
}

export interface Session {
  id: string;
  startTime: string;
  endTime?: string;
  messages: SessionMessage[];
  mood?: number;
  techniques?: string[];
  notes?: string;
}

export interface SessionMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
}
