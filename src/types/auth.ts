
import { User } from '@supabase/supabase-js';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

export interface AuthError {
  message: string;
  code?: string;
  status?: number;
}

export interface SecurityEvent {
  type: string;
  description: string;
  timestamp: string;
  ip_address?: string;
  user_agent?: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
}

export interface SecurityEventDetails {
  ip_address?: string;
  user_agent?: string;
  location?: string;
  device_info?: string;
  additional_context?: Record<string, any>;
}
