
import { User } from '@supabase/supabase-js';

export const isAdminUser = (user: User | null): boolean => {
  if (!user) return false;
  return user.email === 'admin@therapysync.com';
};
