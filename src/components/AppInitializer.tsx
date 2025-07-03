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

  useEffect(() => {
    let mounted = true;
    let authSubscription: any = null;

    const initializeApp = async () => {
      try {
        console.log('AppInitializer: Starting initialization...');

        // Set timeout to prevent infinite loading
        const timeoutId = setTimeout(() => {
          if (mounted) {
            console.log('AppInitializer: Initialization timeout, continuing without auth');
            setAuthLoading(false);
            setInitializationComplete(true);
          }
        }, 8000);

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
        console.error('AppInitializer: Initialization error:', error);
        if (mounted) {
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

  // Show loading only briefly
  if (!initializationComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading TherapySync</h2>
          <p className="text-gray-600">Initializing your experience...</p>
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
      <QueryProviderWrapper client={queryClient}>
        <QueryClientProvider client={queryClient}>
          <RouterWrapper>
            <Router>
              <AuthProviderWrapper authValue={authValue}>
                <AuthContext.Provider value={authValue}>
                  <div className="min-h-screen bg-background">
                    <AppRouter />
                    <Toaster />
                  </div>
                </AuthContext.Provider>
              </AuthProviderWrapper>
            </Router>
          </RouterWrapper>
        </QueryClientProvider>
      </QueryProviderWrapper>
    </BulletproofErrorBoundary>
  );
};

export default AppInitializer;