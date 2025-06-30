
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

interface Therapist {
  id: string;
  name: string;
  title: string;
  description: string;
  approach: string;
  specialties: string[];
  communicationStyle: string;
  icon: string;
  colorScheme: string;
}

export interface TherapistContextType {
  therapist: any;
  isLoading: boolean;
  selectedTherapist: Therapist | null;
  therapists: Therapist[];
}
