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
import { serviceHealthManager } from '@/utils/serviceHealthManager';

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
  const [initStage, setInitStage] = useState<'starting' | 'auth' | 'services' | 'complete'>('starting');

  useEffect(() => {
    let mounted = true;
    let authSubscription: any = null;

    const initializeApp = async () => {
      try {
        console.log('AppInitializer: Starting progressive initialization...');
        setInitStage('starting');

        // Stage 1: Core setup (2 second timeout)
        const coreTimeout = setTimeout(() => {
          if (mounted) {
            console.warn('AppInitializer: Core timeout, attempting recovery');
            setInitStage('auth');
          }
        }, 2000);

        try {
          // Test basic functionality first
          const testConnection = await Promise.race([
            supabase.from('profiles').select('count').limit(1),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timeout')), 1500))
          ]);
          clearTimeout(coreTimeout);
          console.log('AppInitializer: Connection test passed');
        } catch (error) {
          clearTimeout(coreTimeout);
          console.warn('AppInitializer: Connection test failed, continuing with offline mode:', error);
        }

        if (!mounted) return;
        setInitStage('auth');

        // Stage 2: Auth setup with retry logic
        let authSetupSuccess = false;
        for (let attempt = 1; attempt <= 3 && !authSetupSuccess; attempt++) {
          try {
            console.log(`AppInitializer: Auth setup attempt ${attempt}`);
            
            // Set up auth listener
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

            // Get initial session with timeout
            const sessionPromise = supabase.auth.getSession();
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Session timeout')), 3000)
            );
            
            const result = await Promise.race([sessionPromise, timeoutPromise]) as any;
            const { data: { session }, error } = result;
            
            if (error) {
              console.error(`AppInitializer: Session error on attempt ${attempt}:`, error);
              if (attempt === 3) throw error;
              continue;
            }
            
            if (mounted) {
              setUser(session?.user ?? null);
              setSession(session);
              setAuthLoading(false);
              authSetupSuccess = true;
              console.log('AppInitializer: Auth setup successful');
            }
            break;
          } catch (error) {
            console.warn(`AppInitializer: Auth attempt ${attempt} failed:`, error);
            if (attempt === 3) {
              // Final fallback - continue without auth
              console.log('AppInitializer: Continuing without auth');
              if (mounted) {
                setAuthLoading(false);
                authSetupSuccess = true;
              }
            } else {
              await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            }
          }
        }

        if (!mounted) return;
        setInitStage('services');

        // Stage 3: Service initialization (non-blocking)
        try {
          const healthSummary = serviceHealthManager.getHealthSummary();
          console.log('AppInitializer: Service health check:', healthSummary);
        } catch (error) {
          console.warn('AppInitializer: Service health check failed:', error);
        }

        if (mounted) {
          setInitStage('complete');
          setInitializationComplete(true);
          console.log('AppInitializer: Progressive initialization complete');
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

  // Show loading with stage information
  if (!initializationComplete) {
    const getStageMessage = () => {
      switch (initStage) {
        case 'starting': return 'Starting up...';
        case 'auth': return 'Setting up authentication...';
        case 'services': return 'Loading services...';
        default: return 'Initializing your experience...';
      }
    };

    return (
      <div className="css-safe-center">
        <div className="css-safe-card" style={{ textAlign: 'center' }}>
          <div className="css-safe-spinner" style={{ margin: '0 auto 16px' }}></div>
          <h2 className="css-safe-heading">Loading TherapySync</h2>
          <p className="css-safe-text">{getStageMessage()}</p>
          {initStage !== 'starting' && (
            <div style={{ marginTop: '12px', fontSize: '12px', color: '#666' }}>
              Stage: {initStage}
            </div>
          )}
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