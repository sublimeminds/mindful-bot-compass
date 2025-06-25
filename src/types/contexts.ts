
import { User } from '@supabase/supabase-js';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export interface AdminContextType {
  isAdmin: boolean;
  adminData: any;
}

export interface TherapistContextType {
  therapist: any;
  loading: boolean;
  updateTherapist: (data: any) => Promise<void>;
}
