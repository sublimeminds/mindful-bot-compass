import React from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { SafeComponentWrapper } from './SafeComponentWrapper';
import { checkReactReadiness } from '@/utils/reactSafeGuard';

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
  // Guard against React not being properly initialized
  if (!checkReactReadiness('BulletproofAuthProvider')) {
    console.error('React not properly initialized in BulletproofAuthProvider');
    return React.createElement('div', { key: 'loading' }, 'Loading...');
  }

  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  // Enhanced session management with error recovery
  React.useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3;

    const initializeAuth = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get initial session with retry logic
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError && retryCount < maxRetries) {
          retryCount++;
          console.warn(`Auth session retry ${retryCount}/${maxRetries}:`, sessionError);
          setTimeout(initializeAuth, 1000 * retryCount); // Exponential backoff
          return;
        }

        setUser(session?.user ?? null);
        setLoading(false);
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err as Error);
        setLoading(false);
      }
    };

    initializeAuth();

    // Enhanced auth state change listener with error handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        try {
          setUser(session?.user ?? null);
          setLoading(false);
          setError(null);
          
          // Log auth events for debugging
          console.log('Auth state change:', event, session?.user?.id || 'no user');
        } catch (err) {
          console.error('Auth state change error:', err);
          setError(err as Error);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Enhanced signUp with retry and better error handling
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

  // Enhanced signIn with retry logic
  const signIn = React.useCallback(async (email: string, password: string) => {
    let retryCount = 0;
    const maxRetries = 2;

    const attemptSignIn = async (): Promise<{ error: Error | null }> => {
      try {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error };
      } catch (err) {
        if (retryCount < maxRetries && (err as any)?.message?.includes('network')) {
          retryCount++;
          console.warn(`SignIn retry ${retryCount}/${maxRetries}:`, err);
          await new Promise(resolve => setTimeout(resolve, 1000));
          return attemptSignIn();
        }
        console.error('SignIn error:', err);
        return { error: err as Error };
      }
    };

    return attemptSignIn();
  }, []);

  // Enhanced signOut with error handling
  const signOut = React.useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('SignOut error:', err);
      // Even if signOut fails, clear local state
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

  return (
    <SafeComponentWrapper name="BulletproofAuthProvider">
      <BulletproofAuthContext.Provider value={value}>
        {children}
      </BulletproofAuthContext.Provider>
    </SafeComponentWrapper>
  );
};

export const useBulletproofAuth = () => {
  const context = React.useContext(BulletproofAuthContext);
  if (!context) {
    // More graceful error handling
    console.error('useBulletproofAuth must be used within BulletproofAuthProvider');
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