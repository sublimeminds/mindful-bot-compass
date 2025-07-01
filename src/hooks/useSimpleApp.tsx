
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface SimpleAppContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const SimpleAppContext = createContext<SimpleAppContextType | undefined>(undefined);

export const SimpleAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
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

  return (
    <SimpleAppContext.Provider value={{ user, loading, signOut }}>
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
