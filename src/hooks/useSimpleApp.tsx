
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface SimpleAppContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  logout: () => Promise<void>; // Added logout alias
  register: (email: string, password: string) => Promise<{ error: any }>;
  login: (email: string, password: string) => Promise<{ error: any }>;
}

const SimpleAppContext = createContext<SimpleAppContextType | undefined>(undefined);

export const SimpleAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const register = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    });
    return { error };
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  return (
    <SimpleAppContext.Provider value={{ 
      user, 
      loading, 
      signOut, 
      logout: signOut, // Alias for compatibility
      register,
      login
    }}>
      {children}
    </SimpleAppContext.Provider>
  );
};

export const useSimpleApp = () => {
  const context = useContext(SimpleAppContext);
  if (context === undefined) {
    throw new Error('useSimpleApp must be used within a SimpleAppProvider');
  }
  return context;
};
