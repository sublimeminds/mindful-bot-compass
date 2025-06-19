
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';
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
  updateUser: (data: any) => Promise<void>;
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

    // Add timeout to prevent infinite loading
    const authTimeout = setTimeout(() => {
      if (mounted && loading) {
        DebugLogger.warn('AuthProvider: Auth initialization timeout, forcing completion', { component: 'AuthProvider' });
        setLoading(false);
      }
    }, 5000);

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
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
        
        clearTimeout(authTimeout);
        
        // Track security events asynchronously without blocking
        if (event === 'SIGNED_IN' && session?.user) {
          setTimeout(async () => {
            try {
              const { SecurityService } = await import('@/services/securityService');
              await SecurityService.trackSession(session.user.id);
            } catch (error) {
              console.warn('Security tracking failed (non-critical):', error);
            }
          }, 0);
        }
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
          
          if (session?.user) {
            setTimeout(async () => {
              try {
                const { SecurityService } = await import('@/services/securityService');
                await SecurityService.trackSession(session.user.id);
              } catch (error) {
                console.warn('Initial security tracking failed (non-critical):', error);
              }
            }, 0);
          }
        }
      } catch (error) {
        DebugLogger.error('AuthProvider: Exception getting initial session', error as Error, { 
          component: 'AuthProvider' 
        });
      } finally {
        if (mounted) {
          setLoading(false);
          clearTimeout(authTimeout);
          DebugLogger.debug('AuthProvider: Loading complete', { component: 'AuthProvider' });
        }
      }
    };

    getInitialSession();

    return () => {
      DebugLogger.debug('AuthProvider: Cleaning up', { component: 'AuthProvider' });
      mounted = false;
      clearTimeout(authTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(() => {
    const contextValue = {
      user,
      session,
      isAuthenticated: !!user,
      login: useCallback(async (email: string, password: string) => {
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
      }, []),
      signIn: useCallback(async (email: string, password: string) => {
        return await contextValue.login(email, password);
      }, []),
      signup: useCallback(async (email: string, password: string) => {
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
      }, []),
      signUp: useCallback(async (email: string, password: string, name?: string) => {
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
      }, []),
      logout: useCallback(async () => {
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
      }, [user?.id]),
      signOut: useCallback(async () => {
        return await contextValue.logout();
      }, []),
      updateProfile: useCallback(async (data: { name?: string }) => {
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
      }, [user]),
      updateUser: useCallback(async (data: any) => {
        DebugLogger.debug('AuthProvider: Update user attempt', { 
          component: 'AuthProvider', 
          method: 'updateUser',
          userId: user?.id,
          updateData: data
        });
        
        if (!user) {
          const error = new Error('No user logged in');
          DebugLogger.error('AuthProvider: Update user failed - no user', error, { 
            component: 'AuthProvider', 
            method: 'updateUser'
          });
          throw error;
        }
        
        try {
          const { error } = await supabase.auth.updateUser({
            data: data
          });
          
          if (error) {
            DebugLogger.error('AuthProvider: Update user failed', error, { 
              component: 'AuthProvider', 
              method: 'updateUser',
              userId: user.id
            });
            throw error;
          }
          
          DebugLogger.info('AuthProvider: Update user successful', { 
            component: 'AuthProvider', 
            method: 'updateUser',
            userId: user.id
          });
        } catch (error) {
          DebugLogger.error('AuthProvider: Update user exception', error as Error, { 
            component: 'AuthProvider', 
            method: 'updateUser',
            userId: user?.id
          });
          throw error;
        }
      }, [user]),
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
  }, [user, session, loading]);

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
