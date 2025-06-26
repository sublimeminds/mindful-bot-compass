
import React from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAuthActions = () => {
  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    signUp,
    signIn,
    signOut,
    // Aliases for compatibility
    register: signUp,
    login: signIn,
    logout: signOut,
  };
};
