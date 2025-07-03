import React, { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthStateHook } from '@/types/auth';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
}

// Bulletproof auth state manager with comprehensive error handling
export const useBulletproofAuthState = (): AuthStateHook & { session: Session | null; error: string | null } => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: false, // Start false for immediate render
    initialized: false,
    error: null
  });

  const [isElectron, setIsElectron] = useState(false);
  const [debugMode] = useState(() => {
    try {
      return localStorage.getItem('auth_debug') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    let mounted = true;
    let authSubscription: any = null;
    let timeoutId: NodeJS.Timeout | null = null;

    const initializeAuth = async () => {
      try {
        // Detect environment
        const electronCheck = typeof window !== 'undefined' && (
          window.navigator.userAgent.toLowerCase().includes('electron') ||
          typeof (window as any).electronAPI !== 'undefined' ||
          window.location.protocol === 'file:'
        );
        
        if (mounted) {
          setIsElectron(electronCheck);
          console.log('BulletproofAuth: Environment -', { 
            electron: electronCheck, 
            debug: debugMode,
            userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown'
          });
        }

        // Skip auth in debug mode
        if (debugMode) {
          console.log('BulletproofAuth: Debug mode - auth disabled');
          if (mounted) {
            setAuthState(prev => ({ 
              ...prev, 
              initialized: true,
              loading: false
            }));
          }
          return;
        }

        // Validate Supabase client
        if (!supabase || typeof supabase.auth?.onAuthStateChange !== 'function') {
          throw new Error('Supabase client not properly initialized');
        }

        // Set up auth state listener with error handling
        authSubscription = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (!mounted) return;

            try {
              console.log('BulletproofAuth: Auth event:', event, session ? 'Session active' : 'No session');
              
              setAuthState(prev => ({
                ...prev,
                user: session?.user ?? null,
                session: session,
                loading: false,
                initialized: true,
                error: null
              }));
            } catch (error) {
              console.error('BulletproofAuth: Auth state change error:', error);
              if (mounted) {
                setAuthState(prev => ({
                  ...prev,
                  loading: false,
                  error: error instanceof Error ? error.message : 'Auth state update failed'
                }));
              }
            }
          }
        );

        // Check existing session with timeout protection
        timeoutId = setTimeout(() => {
          console.warn('BulletproofAuth: Session check timed out');
          if (mounted) {
            setAuthState(prev => ({
              ...prev,
              loading: false,
              initialized: true,
              error: 'Session check timed out'
            }));
          }
        }, electronCheck ? 5000 : 8000);

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }

        if (!mounted) return;

        if (sessionError) {
          console.error('BulletproofAuth: Session error:', sessionError);
          setAuthState(prev => ({
            ...prev,
            loading: false,
            initialized: true,
            error: sessionError.message
          }));
        } else {
          console.log('BulletproofAuth: Session check complete:', session ? 'User authenticated' : 'No session');
          setAuthState(prev => ({
            ...prev,
            user: session?.user ?? null,
            session: session,
            loading: false,
            initialized: true,
            error: null
          }));
        }

      } catch (error) {
        console.error('BulletproofAuth: Initialization failed:', error);
        if (mounted) {
          setAuthState(prev => ({
            ...prev,
            loading: false,
            initialized: true,
            error: error instanceof Error ? error.message : 'Auth initialization failed'
          }));
        }
      }
    };

    // Start initialization with small delay for React to settle
    const initTimeout = setTimeout(() => {
      if (mounted) {
        initializeAuth();
      }
    }, 50);

    // Cleanup function
    return () => {
      mounted = false;
      clearTimeout(initTimeout);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (authSubscription?.data?.subscription) {
        authSubscription.data.subscription.unsubscribe();
      }
      console.log('BulletproofAuth: Cleanup completed');
    };
  }, [debugMode]);

  const setUser = (user: User | null) => {
    setAuthState(prev => ({ ...prev, user }));
  };

  const skipAuth = () => {
    try {
      console.log('BulletproofAuth: Enabling debug mode');
      localStorage.setItem('auth_debug', 'true');
      window.location.reload();
    } catch (error) {
      console.error('BulletproofAuth: Failed to enable debug mode:', error);
    }
  };

  const enableAuth = () => {
    try {
      console.log('BulletproofAuth: Disabling debug mode');
      localStorage.removeItem('auth_debug');
      window.location.reload();
    } catch (error) {
      console.error('BulletproofAuth: Failed to disable debug mode:', error);
    }
  };

  return {
    user: authState.user,
    session: authState.session,
    loading: authState.loading,
    error: authState.error,
    setUser,
    skipAuth,
    enableAuth
  };
};