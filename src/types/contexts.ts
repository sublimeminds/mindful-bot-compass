
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
  adminRole: string | null;
  adminData: any;
  permissions: string[];
  hasPermission: (permission: string) => boolean;
}

export interface TherapistContextType {
  selectedTherapist: string | null;
  setSelectedTherapist: (id: string) => void;
}
