
import React from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface BulletproofAuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  register: (email: string, password: string) => Promise<{ error: Error | null }>;
  login: (email: string, password: string) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
}

const BulletproofAuthContext = React.createContext<BulletproofAuthContextType | null>(null);

interface BulletproofAuthProviderProps {
  children: React.ReactNode;
}

export const BulletproofAuthProvider: React.FC<BulletproofAuthProviderProps> = ({ children }) => {
  console.log('🔍 BulletproofAuthProvider: Starting initialization');
  
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Simple session management
  React.useEffect(() => {
    console.log('🔍 BulletproofAuthProvider: Setting up auth state listener');
    
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('🔍 BulletproofAuthProvider: Initial session:', session?.user?.id || 'no user');
        setUser(session?.user ?? null);
        setLoading(false);
      } catch (err) {
        console.error('🔍 BulletproofAuthProvider: Session init error:', err);
        setUser(null);
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔍 BulletproofAuthProvider: Auth state change:', event, session?.user?.id || 'no user');
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = React.useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });
      return { error };
    } catch (err) {
      console.error('SignUp error:', err);
      return { error: err as Error };
    }
  }, []);

  const signIn = React.useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    } catch (err) {
      console.error('SignIn error:', err);
      return { error: err as Error };
    }
  }, []);

  const signOut = React.useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('SignOut error:', err);
      setUser(null);
    }
  }, []);

  // Provide aliases for compatibility
  const register = signUp;
  const login = signIn;
  const logout = signOut;

  const value: BulletproofAuthContextType = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    register,
    login,
    logout,
  };

  console.log('🔍 BulletproofAuthProvider: Rendering with user:', user?.id || 'none', 'loading:', loading);

  return (
    <BulletproofAuthContext.Provider value={value}>
      {children}
    </BulletproofAuthContext.Provider>
  );
};

export const useBulletproofAuth = () => {
  const context = React.useContext(BulletproofAuthContext);
  if (!context) {
    console.warn('useBulletproofAuth used outside provider, returning fallback');
    return {
      user: null,
      loading: false,
      signIn: async () => ({ error: new Error('Auth not available') }),
      signUp: async () => ({ error: new Error('Auth not available') }),
      signOut: async () => {},
      register: async () => ({ error: new Error('Auth not available') }),
      login: async () => ({ error: new Error('Auth not available') }),
      logout: async () => {}
    };
  }
  return context;
};
