import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { AuthContext } from '@/contexts/AuthContext';
import { AuthContextType } from '@/types/auth';
import AppRouter from './AppRouter';
import BulletproofErrorBoundary from './BulletproofErrorBoundary';
import { AuthProviderWrapper, QueryProviderWrapper, RouterWrapper } from './ProviderWrappers';
import ProgressiveAppLoader from './ProgressiveAppLoader';
import MinimalSafeApp from './MinimalSafeApp';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const AppInitializer: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [initializationComplete, setInitializationComplete] = useState(false);
  const [criticalFailure, setCriticalFailure] = useState(false);

  useEffect(() => {
    let mounted = true;
    let authSubscription: any = null;

    const initializeApp = async () => {
      try {
        console.log('AppInitializer: Starting minimal initialization...');

        // Much shorter timeout for faster failure detection
        const timeoutId = setTimeout(() => {
          if (mounted) {
            console.log('AppInitializer: Quick timeout, falling back to minimal mode');
            setCriticalFailure(true);
            setAuthLoading(false);
            setInitializationComplete(true);
          }
        }, 5000); // Reduced from 8000ms

        // Set up auth listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (mounted) {
              console.log('AppInitializer: Auth state changed:', event);
              setUser(session?.user ?? null);
              setSession(session);
              setAuthLoading(false);
            }
          }
        );
        authSubscription = subscription;

        // Then get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        clearTimeout(timeoutId);

        if (mounted) {
          if (error) {
            console.error('AppInitializer: Session error:', error);
          }
          
          setUser(session?.user ?? null);
          setSession(session);
          setAuthLoading(false);
          setInitializationComplete(true);
          
          console.log('AppInitializer: Initialization complete');
        }
      } catch (error) {
        console.error('AppInitializer: Critical initialization error:', error);
        if (mounted) {
          setCriticalFailure(true);
          setAuthLoading(false);
          setInitializationComplete(true);
        }
      }
    };

    initializeApp();

    return () => {
      mounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []);

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

  // Critical failure - use minimal safe app
  if (criticalFailure) {
    console.log('AppInitializer: Using minimal safe app due to critical failure');
    return <MinimalSafeApp />;
  }

  // Show loading only briefly
  if (!initializationComplete) {
    return (
      <div className="css-safe-center">
        <div className="css-safe-card" style={{ textAlign: 'center' }}>
          <div className="css-safe-spinner" style={{ margin: '0 auto 16px' }}></div>
          <h2 className="css-safe-heading">Loading TherapySync</h2>
          <p className="css-safe-text">Initializing your experience...</p>
        </div>
      </div>
    );
  }

  const authValue: AuthContextType = {
    user,
    session,
    loading: authLoading,
    signUp,
    signIn,
    signOut,
    register: signUp,
    login: signIn,
    logout: signOut,
  };

  return (
    <BulletproofErrorBoundary>
      <ProgressiveAppLoader>
        <QueryProviderWrapper client={queryClient}>
          <QueryClientProvider client={queryClient}>
            <RouterWrapper>
              <Router>
                <AuthProviderWrapper authValue={authValue}>
                  <AuthContext.Provider value={authValue}>
                    <div className="min-h-screen css-safe-bg">
                      <AppRouter />
                      <Toaster />
                    </div>
                  </AuthContext.Provider>
                </AuthProviderWrapper>
              </Router>
            </RouterWrapper>
          </QueryClientProvider>
        </QueryProviderWrapper>
      </ProgressiveAppLoader>
    </BulletproofErrorBoundary>
  );
};

export default AppInitializer;