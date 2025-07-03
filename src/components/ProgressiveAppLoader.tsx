import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { dependencyManager } from '@/utils/dependencyManager';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { AuthContext } from '@/contexts/AuthContext';
import { AuthContextType } from '@/types/auth';
import AppRouter from './AppRouter';

interface Dependencies {
  queryClient: QueryClient;
  router: typeof Router;
  authContext: AuthContextType;
  appRouter: typeof AppRouter;
}

interface LoadingState {
  phase: 'initializing' | 'dependencies' | 'auth' | 'components' | 'complete' | 'error';
  progress: number;
  message: string;
  dependencies: Record<string, any>;
}

const ProgressiveAppLoader: React.FC = () => {
  const [state, setState] = useState<LoadingState>({
    phase: 'initializing',
    progress: 0,
    message: 'Starting up...',
    dependencies: {}
  });
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let authSubscription: any = null;

    const loadApp = async () => {
      try {
        console.log('ProgressiveAppLoader: Starting progressive load...');

        // Phase 1: Initialize dependencies
        if (mounted) {
          setState(s => ({ ...s, phase: 'dependencies', progress: 10, message: 'Loading core dependencies...' }));
        }

        // Register dependencies with fallbacks
        dependencyManager.register({
          name: 'queryClient',
          loader: async () => {
            const { QueryClient } = await import('@tanstack/react-query');
            return new QueryClient({
              defaultOptions: {
                queries: { retry: 1, staleTime: 5 * 60 * 1000 },
              },
            });
          },
          required: true,
          timeout: 5000,
          retryAttempts: 2,
          fallback: new QueryClient({ defaultOptions: { queries: { retry: 0 } } })
        });

        dependencyManager.register({
          name: 'router',
          loader: async () => {
            const { BrowserRouter } = await import('react-router-dom');
            return BrowserRouter;
          },
          required: true,
          timeout: 3000,
          retryAttempts: 2,
          fallback: Router
        });

        dependencyManager.register({
          name: 'appRouter',
          loader: async () => {
            const module = await import('./AppRouter');
            return module.default;
          },
          required: true,
          timeout: 5000,
          retryAttempts: 3,
          fallback: () => React.createElement('div', { 
            className: 'css-safe-center' 
          }, React.createElement('div', { 
            className: 'css-safe-card' 
          }, 'Minimal routing fallback'))
        });

        // Load dependencies
        const loadResult = await dependencyManager.loadAll();
        
        if (mounted) {
          setState(s => ({ 
            ...s, 
            phase: 'auth', 
            progress: 40, 
            message: 'Setting up authentication...',
            dependencies: loadResult.dependencies
          }));
        }

        if (!loadResult.success) {
          throw new Error(`Required dependencies failed: ${Object.keys(loadResult.errors).join(', ')}`);
        }

        // Phase 2: Auth setup
        let authSetupSuccess = false;
        for (let attempt = 1; attempt <= 3 && !authSetupSuccess; attempt++) {
          try {
            console.log(`ProgressiveAppLoader: Auth setup attempt ${attempt}`);
            
            const { data: { subscription } } = supabase.auth.onAuthStateChange(
              (event, session) => {
                if (mounted) {
                  console.log('ProgressiveAppLoader: Auth state changed:', event);
                  setUser(session?.user ?? null);
                  setSession(session);
                  setAuthLoading(false);
                }
              }
            );
            authSubscription = subscription;

            const sessionResult = await Promise.race([
              supabase.auth.getSession(),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Auth timeout')), 3000)
              )
            ]) as any;
            
            const { data: { session }, error } = sessionResult;
            
            if (error) {
              console.error(`ProgressiveAppLoader: Session error on attempt ${attempt}:`, error);
              if (attempt === 3) throw error;
              continue;
            }
            
            if (mounted) {
              setUser(session?.user ?? null);
              setSession(session);
              setAuthLoading(false);
              authSetupSuccess = true;
              console.log('ProgressiveAppLoader: Auth setup successful');
            }
            break;
          } catch (error) {
            console.warn(`ProgressiveAppLoader: Auth attempt ${attempt} failed:`, error);
            if (attempt === 3) {
              console.log('ProgressiveAppLoader: Continuing without auth');
              if (mounted) {
                setAuthLoading(false);
                authSetupSuccess = true;
              }
            } else {
              await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            }
          }
        }

        // Phase 3: Component loading
        if (mounted) {
          setState(s => ({ 
            ...s, 
            phase: 'components', 
            progress: 80, 
            message: 'Loading application components...' 
          }));
        }

        // Small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 500));

        // Phase 4: Complete
        if (mounted) {
          setState(s => ({ 
            ...s, 
            phase: 'complete', 
            progress: 100, 
            message: 'Ready!' 
          }));
        }

        console.log('ProgressiveAppLoader: Load complete');

      } catch (error) {
        console.error('ProgressiveAppLoader: Load failed:', error);
        if (mounted) {
          setState(s => ({ 
            ...s, 
            phase: 'error', 
            progress: 0, 
            message: `Load failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
          }));
        }
      }
    };

    loadApp();

    return () => {
      mounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []);

  // Auth helper functions
  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` }
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

  // Show loading or error
  if (state.phase !== 'complete') {
    return (
      <div className="css-safe-center">
        <div className="css-safe-card" style={{ textAlign: 'center', minWidth: '300px' }}>
          <div className="css-safe-spinner" style={{ margin: '0 auto 16px' }}></div>
          <h2 className="css-safe-heading">Loading TherapySync</h2>
          <p className="css-safe-text" style={{ marginBottom: '16px' }}>{state.message}</p>
          
          {/* Progress bar */}
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#e0e0e0',
            borderRadius: '4px',
            overflow: 'hidden',
            marginBottom: '12px'
          }}>
            <div style={{
              width: `${state.progress}%`,
              height: '100%',
              backgroundColor: state.phase === 'error' ? '#dc3545' : '#007bff',
              transition: 'width 0.3s ease'
            }} />
          </div>
          
          <div style={{ fontSize: '12px', color: '#666' }}>
            Phase: {state.phase} ({state.progress}%)
          </div>
          
          {state.phase === 'error' && (
            <button 
              className="css-safe-button" 
              style={{ marginTop: '16px' }}
              onClick={() => window.location.reload()}
            >
              🔄 Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  // Render the full app
  const { queryClient, router: RouterComponent, appRouter: AppRouterComponent } = state.dependencies;

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
    <QueryClientProvider client={queryClient}>
      <RouterComponent>
        <AuthContext.Provider value={authValue}>
          <div className="min-h-screen css-safe-bg">
            <AppRouterComponent />
            <Toaster />
          </div>
        </AuthContext.Provider>
      </RouterComponent>
    </QueryClientProvider>
  );
};

export default ProgressiveAppLoader;