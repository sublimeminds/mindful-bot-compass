import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
  isOnline: boolean;
  retryCount: number;
  // Auth actions
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  // Aliases
  login: (email: string, password: string) => Promise<{ error: any }>;
  register: (email: string, password: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  // Recovery
  retry: () => void;
}

const BulletproofAuthContext = createContext<AuthContextType | null>(null);

interface BulletproofAuthProviderProps {
  children: ReactNode;
}

export const BulletproofAuthProvider: React.FC<BulletproofAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [retryCount, setRetryCount] = useState(0);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initialize auth with progressive fallback
  useEffect(() => {
    let mounted = true;
    let retryTimeout: NodeJS.Timeout;

    const initializeAuth = async () => {
      if (!mounted) return;

      try {
        console.log('BulletproofAuth: Initializing auth...');
        setError(null);

        // Set timeout to prevent hanging
        const timeoutMs = isOnline ? 10000 : 5000;
        const authTimeout = setTimeout(() => {
          if (mounted) {
            console.warn('BulletproofAuth: Initialization timeout, continuing offline');
            setLoading(false);
          }
        }, timeoutMs);

        // Try to get session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        clearTimeout(authTimeout);
        
        if (!mounted) return;

        if (sessionError) {
          console.error('BulletproofAuth: Session error:', sessionError);
          setError(sessionError);
          
          // Schedule retry with exponential backoff
          if (retryCount < 3) {
            const delay = Math.pow(2, retryCount) * 1000;
            retryTimeout = setTimeout(() => {
              setRetryCount(prev => prev + 1);
            }, delay);
          }
        } else {
          console.log('BulletproofAuth: Session loaded successfully');
          setSession(session);
          setUser(session?.user ?? null);
          setRetryCount(0);
        }

        setLoading(false);

      } catch (err) {
        if (!mounted) return;
        
        console.error('BulletproofAuth: Initialization error:', err);
        setError(err instanceof Error ? err : new Error('Auth initialization failed'));
        setLoading(false);

        // Auto-retry for network errors
        if (retryCount < 3 && isOnline) {
          const delay = Math.pow(2, retryCount) * 1000;
          retryTimeout = setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, delay);
        }
      }
    };

    initializeAuth();

    // Set up auth state listener with error handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;

        try {
          console.log('BulletproofAuth: Auth state changed:', event);
          setSession(session);
          setUser(session?.user ?? null);
          setError(null);
          setRetryCount(0);
        } catch (err) {
          console.error('BulletproofAuth: Auth state change error:', err);
          setError(err instanceof Error ? err : new Error('Auth state change failed'));
        }
      }
    );

    return () => {
      mounted = false;
      clearTimeout(retryTimeout);
      subscription.unsubscribe();
    };
  }, [retryCount, isOnline]);

  // Auth actions with error handling
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    } catch (err) {
      console.error('BulletproofAuth: SignIn error:', err);
      return { error: err };
    }
  };

  const signUp = async (email: string, password: string) => {
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
      console.error('BulletproofAuth: SignUp error:', err);
      return { error: err };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('BulletproofAuth: SignOut error:', err);
      // Force local logout even if remote fails
      setSession(null);
      setUser(null);
    }
  };

  const retry = () => {
    setRetryCount(prev => prev + 1);
  };

  // Provide offline fallback data
  const contextValue: AuthContextType = {
    user,
    session,
    loading,
    error,
    isOnline,
    retryCount,
    signIn,
    signUp,
    signOut,
    login: signIn,
    register: signUp,
    logout: signOut,
    retry
  };

  return (
    <BulletproofAuthContext.Provider value={contextValue}>
      {children}
    </BulletproofAuthContext.Provider>
  );
};

export const useBulletproofAuth = () => {
  const context = useContext(BulletproofAuthContext);
  if (!context) {
    // Return safe fallback instead of throwing
    console.warn('useBulletproofAuth: Used outside provider, returning fallback');
    return {
      user: null,
      session: null,
      loading: false,
      error: new Error('Auth context not available'),
      isOnline: navigator.onLine,
      retryCount: 0,
      signIn: async () => ({ error: new Error('Auth not available') }),
      signUp: async () => ({ error: new Error('Auth not available') }),
      signOut: async () => {},
      login: async () => ({ error: new Error('Auth not available') }),
      register: async () => ({ error: new Error('Auth not available') }),
      logout: async () => {},
      retry: () => {}
    } as AuthContextType;
  }
  return context;
};