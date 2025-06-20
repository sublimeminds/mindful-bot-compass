
import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface AppContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<{ error: any }>;
  updateUser?: (updates: any) => Promise<void>;
}

export const SimpleAppContext = createContext<AppContextType | undefined>(undefined);

interface SimpleAppProviderProps {
  children: ReactNode;
}

export const SimpleAppProvider: React.FC<SimpleAppProviderProps> = ({ children }) => {
  // Safety check for React availability
  if (typeof React === 'undefined' || !React.useState) {
    console.error('React hooks are not available in SimpleAppProvider');
    return React.createElement('div', { 
      style: { 
        padding: '20px', 
        textAlign: 'center', 
        color: 'red' 
      } 
    }, 'React initialization error. Please reload the page.');
  }

  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const register = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    return { error };
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Failed to sign out:", error);
    }
  };

  const updateUser = async (updates: any) => {
    try {
      const { error } = await supabase.auth.updateUser(updates);
      if (error) throw error;
      console.log("Profile updated successfully");
    } catch (error: any) {
      console.error("Failed to update profile:", error.message);
    }
  };

  const value: AppContextType = {
    user,
    session,
    loading,
    login,
    logout,
    register,
    updateUser,
  };

  return React.createElement(SimpleAppContext.Provider, { value }, children);
};
