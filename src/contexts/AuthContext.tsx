
import { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { DebugLogger } from '@/utils/debugLogger';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  signup: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: { name?: string }) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  DebugLogger.debug('AuthProvider: Initializing', { component: 'AuthProvider' });
  
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    DebugLogger.debug('AuthProvider: Setting up auth state listener', { component: 'AuthProvider' });
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) {
          DebugLogger.warn('AuthProvider: Component unmounted, skipping auth state update', { 
            component: 'AuthProvider', 
            event 
          });
          return;
        }
        
        DebugLogger.info('AuthProvider: Auth state changed', { 
          component: 'AuthProvider', 
          event, 
          userId: session?.user?.id,
          userEmail: session?.user?.email
        });
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      try {
        DebugLogger.debug('AuthProvider: Getting initial session', { component: 'AuthProvider' });
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) {
          DebugLogger.warn('AuthProvider: Component unmounted during initial session fetch', { 
            component: 'AuthProvider' 
          });
          return;
        }
        
        if (error) {
          DebugLogger.error('AuthProvider: Error getting initial session', error, { 
            component: 'AuthProvider' 
          });
        } else {
          DebugLogger.info('AuthProvider: Initial session retrieved', { 
            component: 'AuthProvider',
            hasSession: !!session,
            userId: session?.user?.id,
            userEmail: session?.user?.email
          });
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        DebugLogger.error('AuthProvider: Exception getting initial session', error as Error, { 
          component: 'AuthProvider' 
        });
      } finally {
        if (mounted) {
          setLoading(false);
          DebugLogger.debug('AuthProvider: Loading complete', { component: 'AuthProvider' });
        }
      }
    };

    getInitialSession();

    return () => {
      DebugLogger.debug('AuthProvider: Cleaning up', { component: 'AuthProvider' });
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    DebugLogger.debug('AuthProvider: Login attempt', { 
      component: 'AuthProvider', 
      method: 'login',
      email 
    });
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        DebugLogger.error('AuthProvider: Login failed', error, { 
          component: 'AuthProvider', 
          method: 'login',
          email 
        });
      } else {
        DebugLogger.info('AuthProvider: Login successful', { 
          component: 'AuthProvider', 
          method: 'login',
          email 
        });
      }
      
      return { error };
    } catch (error) {
      DebugLogger.error('AuthProvider: Login exception', error as Error, { 
        component: 'AuthProvider', 
        method: 'login',
        email 
      });
      return { error };
    }
  }, []);

  const signIn = login; // Alias for login

  const signup = useCallback(async (email: string, password: string) => {
    DebugLogger.debug('AuthProvider: Signup attempt', { 
      component: 'AuthProvider', 
      method: 'signup',
      email 
    });
    
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });
      
      if (error) {
        DebugLogger.error('AuthProvider: Signup failed', error, { 
          component: 'AuthProvider', 
          method: 'signup',
          email 
        });
      } else {
        DebugLogger.info('AuthProvider: Signup successful', { 
          component: 'AuthProvider', 
          method: 'signup',
          email 
        });
      }
      
      return { error };
    } catch (error) {
      DebugLogger.error('AuthProvider: Signup exception', error as Error, { 
        component: 'AuthProvider', 
        method: 'signup',
        email 
      });
      return { error };
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, name?: string) => {
    DebugLogger.debug('AuthProvider: SignUp attempt', { 
      component: 'AuthProvider', 
      method: 'signUp',
      email,
      hasName: !!name
    });
    
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: name ? { name } : undefined
        }
      });
      
      if (error) {
        DebugLogger.error('AuthProvider: SignUp failed', error, { 
          component: 'AuthProvider', 
          method: 'signUp',
          email 
        });
      } else {
        DebugLogger.info('AuthProvider: SignUp successful', { 
          component: 'AuthProvider', 
          method: 'signUp',
          email 
        });
      }
      
      return { error };
    } catch (error) {
      DebugLogger.error('AuthProvider: SignUp exception', error as Error, { 
        component: 'AuthProvider', 
        method: 'signUp',
        email 
      });
      return { error };
    }
  }, []);

  const logout = useCallback(async () => {
    DebugLogger.debug('AuthProvider: Logout attempt', { 
      component: 'AuthProvider', 
      method: 'logout',
      userId: user?.id
    });
    
    try {
      await supabase.auth.signOut();
      DebugLogger.info('AuthProvider: Logout successful', { 
        component: 'AuthProvider', 
        method: 'logout'
      });
    } catch (error) {
      DebugLogger.error('AuthProvider: Logout exception', error as Error, { 
        component: 'AuthProvider', 
        method: 'logout'
      });
    }
  }, [user?.id]);

  const signOut = logout; // Alias for logout

  const updateProfile = useCallback(async (data: { name?: string }) => {
    DebugLogger.debug('AuthProvider: Update profile attempt', { 
      component: 'AuthProvider', 
      method: 'updateProfile',
      userId: user?.id,
      updateData: data
    });
    
    if (!user) {
      const error = new Error('No user logged in');
      DebugLogger.error('AuthProvider: Update profile failed - no user', error, { 
        component: 'AuthProvider', 
        method: 'updateProfile'
      });
      throw error;
    }
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: data
      });
      
      if (error) {
        DebugLogger.error('AuthProvider: Update profile failed', error, { 
          component: 'AuthProvider', 
          method: 'updateProfile',
          userId: user.id
        });
        throw error;
      }
      
      DebugLogger.info('AuthProvider: Update profile successful', { 
        component: 'AuthProvider', 
        method: 'updateProfile',
        userId: user.id
      });
    } catch (error) {
      DebugLogger.error('AuthProvider: Update profile exception', error as Error, { 
        component: 'AuthProvider', 
        method: 'updateProfile',
        userId: user?.id
      });
      throw error;
    }
  }, [user]);

  const value = useMemo(() => {
    const contextValue = {
      user,
      session,
      isAuthenticated: !!user,
      login,
      signIn,
      signup,
      signUp,
      logout,
      signOut,
      updateProfile,
      loading,
    };
    
    DebugLogger.debug('AuthProvider: Context value updated', { 
      component: 'AuthProvider',
      isAuthenticated: contextValue.isAuthenticated,
      loading: contextValue.loading,
      userId: user?.id,
      userEmail: user?.email
    });
    
    return contextValue;
  }, [user, session, loading, login, signup, signUp, logout, updateProfile]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  DebugLogger.trace('useAuth: Hook called', { component: 'useAuth' });
  
  const context = useContext(AuthContext);
  if (context === undefined) {
    const error = new Error('useAuth must be used within an AuthProvider');
    DebugLogger.error('useAuth: Context undefined', error, { component: 'useAuth' });
    throw error;
  }
  
  return context;
};
