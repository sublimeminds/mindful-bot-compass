import React, { Component, ReactNode } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { AuthContext } from '@/components/SafeAuthProvider';
import { AuthContextType } from '@/types/auth';
import AppRouter from './AppRouter';

interface Props {
  children?: ReactNode;
}

interface State {
  // App lifecycle states
  phase: 'initializing' | 'auth_ready' | 'app_ready' | 'error';
  
  // Auth state
  user: User | null;
  session: Session | null;
  authLoading: boolean;
  authError: Error | null;
  
  // App infrastructure
  queryClient: QueryClient;
}

export class AppInitializer extends Component<Props, State> {
  private authSubscription: any = null;
  private mounted = true;
  private initializationTimeout: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    
    this.state = {
      phase: 'initializing',
      user: null,
      session: null,
      authLoading: true,
      authError: null,
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
    console.log('AppInitializer: Starting unified initialization...');
    this.initializeApp();
    
    // Safety timeout - if initialization takes too long, show error
    this.initializationTimeout = setTimeout(() => {
      if (this.mounted && this.state.phase === 'initializing') {
        console.error('AppInitializer: Initialization timeout');
        this.setState({
          phase: 'error',
          authError: new Error('App initialization timeout'),
          authLoading: false
        });
      }
    }, 10000);
  }

  componentWillUnmount() {
    this.mounted = false;
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.initializationTimeout) {
      clearTimeout(this.initializationTimeout);
    }
  }

  private initializeApp = async () => {
    try {
      console.log('AppInitializer: Phase 1 - Auth initialization');
      await this.initializeAuth();
      
      if (this.mounted) {
        console.log('AppInitializer: Phase 2 - App ready');
        this.setState({ phase: 'app_ready' });
      }
    } catch (error) {
      console.error('AppInitializer: Initialization failed:', error);
      if (this.mounted) {
        this.setState({
          phase: 'error',
          authError: error as Error,
          authLoading: false
        });
      }
    }
  };

  private initializeAuth = async () => {
    try {
      // Get initial session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }

      if (this.mounted) {
        this.setState({
          user: session?.user ?? null,
          session: session,
          authLoading: false,
          phase: 'auth_ready'
        });
      }

      // Set up auth listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          console.log('AppInitializer: Auth state change:', event);
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
      console.error('AppInitializer: Auth initialization failed:', error);
      throw error;
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

  private renderLoadingState = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-therapy-700 mb-2">Initializing TherapySync</h2>
        <p className="text-therapy-600">
          {this.state.phase === 'initializing' && 'Starting application...'}
          {this.state.phase === 'auth_ready' && 'Preparing interface...'}
        </p>
      </div>
    </div>
  );

  private renderErrorState = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="text-red-500 mb-4">
          <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-red-700 mb-2">Initialization Failed</h2>
        <p className="text-red-600 mb-4">{this.state.authError?.message || 'Unknown error occurred'}</p>
        <button
          onClick={() => {
            this.setState({ 
              phase: 'initializing', 
              authError: null, 
              authLoading: true 
            });
            this.initializeApp();
          }}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry Initialization
        </button>
      </div>
    </div>
  );

  render() {
    const { phase, authError } = this.state;

    // Show error state
    if (phase === 'error' || authError) {
      return this.renderErrorState();
    }

    // Show loading state
    if (phase !== 'app_ready') {
      return this.renderLoadingState();
    }

    // Create auth context value
    const authValue: AuthContextType = {
      user: this.state.user,
      session: this.state.session,
      loading: this.state.authLoading,
      signUp: this.signUp,
      signIn: this.signIn,
      signOut: this.signOut,
      register: this.signUp,
      login: this.signIn,
      logout: this.signOut,
    };

    // Render app
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