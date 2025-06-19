
import { User } from '@supabase/supabase-js';

export const isAdminUser = (user: User | null): boolean => {
  if (!user) return false;
  
  // Check if user is admin by email or role
  return user.email === 'hi@fbeeg.io' || user.user_metadata?.role === 'admin';
};

export const requireAdmin = (user: User | null): boolean => {
  return isAdminUser(user);
};
