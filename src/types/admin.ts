
import { User } from '@supabase/supabase-js';

export interface AdminContextType {
  isAdmin: boolean;
  adminRole: string | null;
  adminData: User | null;
  permissions: string[];
  hasPermission: (permission: string) => boolean;
}
