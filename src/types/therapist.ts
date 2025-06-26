
import { User } from '@supabase/supabase-js';

export interface TherapistContextType {
  isTherapist: boolean;
  therapistData: User | null;
  specializations: string[];
  isVerified: boolean;
}
