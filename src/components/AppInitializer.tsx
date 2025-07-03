import React, { Component, ReactNode } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { AuthContext } from '@/contexts/AuthContext';
import { AuthContextType } from '@/types/auth';
import AppRouter from './AppRouter';

interface Props {
  children?: ReactNode;
}

interface State {
  phase: 'loading' | 'ready' | 'error';
  user: User | null;
  session: Session | null;
  authLoading: boolean;
  error: Error | null;
  queryClient: QueryClient;
}

export class AppInitializer extends Component<Props, State> {
  private authSubscription: any = null;
  private mounted = true;

  constructor(props: Props) {
    super(props);
    
    this.state = {
      phase: 'loading',
      user: null,
      session: null,
      authLoading: true,
      error: null,
      queryClient: new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 5 * 60 * 1000,
          },
        },
      })
    };
  }

  componentDidMount() {
    this.initializeApp();
  }

  componentWillUnmount() {
    this.mounted = false;
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  private initializeApp = async () => {
    try {
      // Get initial session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (this.mounted) {
        this.setState({
          user: session?.user ?? null,
          session: session,
          authLoading: false,
          phase: 'ready',
          error: error || null
        });
      }

      // Set up auth listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (this.mounted) {
            this.setState({
              user: session?.user ?? null,
              session: session,
              authLoading: false
            });
          }
        }
      );
      
      this.authSubscription = subscription;
    } catch (error) {
      console.error('App initialization failed:', error);
      if (this.mounted) {
        this.setState({
          phase: 'ready', // Still show the app, just without auth
          authLoading: false,
          error: error as Error
        });
      }
    }
  };

  private signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    });
    return { error };
  };

  private signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  private signOut = async () => {
    await supabase.auth.signOut();
  };

  // Aliases for compatibility with useSimpleApp
  private register = async (email: string, password: string) => {
    return this.signUp(email, password);
  };

  private login = async (email: string, password: string) => {
    return this.signIn(email, password);
  };

  private logout = async () => {
    return this.signOut();
  };

  render() {
    const { phase, error } = this.state;

    // Always render the app - no more blank pages!
    if (phase === 'loading') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-therapy-700 mb-2">Starting TherapySync</h2>
            <p className="text-therapy-600">Loading your experience...</p>
          </div>
        </div>
      );
    }

    // Create auth context value
    const authValue: AuthContextType = {
      user: this.state.user,
      session: this.state.session,
      loading: this.state.authLoading,
      signUp: this.signUp,
      signIn: this.signIn,
      signOut: this.signOut,
      register: this.register,
      login: this.login,
      logout: this.logout,
    };

    // Always render the app
    return (
      <QueryClientProvider client={this.state.queryClient}>
        <Router>
          <AuthContext.Provider value={authValue}>
            <div className="min-h-screen bg-background">
              <AppRouter />
              <Toaster />
            </div>
          </AuthContext.Provider>
        </Router>
      </QueryClientProvider>
    );
  }
}

export default AppInitializer;