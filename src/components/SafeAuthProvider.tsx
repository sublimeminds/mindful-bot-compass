import React, { Component, ReactNode, createContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType } from '@/types/auth';

// Create context at the top level to avoid timing issues
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

interface State {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isInitialized: boolean;
  error: Error | null;
}

// Safe Auth Provider that doesn't rely on hooks during initialization
export class SafeAuthProvider extends Component<Props, State> {
  private authSubscription: any = null;
  private mounted = true;

  public state: State = {
    user: null,
    session: null,
    loading: true,
    isInitialized: false,
    error: null
  };

  public componentDidMount() {
    this.initializeAuth();
  }

  public componentWillUnmount() {
    this.mounted = false;
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  private initializeAuth = async () => {
    try {
      console.log('SafeAuthProvider: Starting auth initialization...');
      
      // Set up auth state listener FIRST
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          console.log('SafeAuthProvider: Auth event:', event, session?.user?.email || 'No user');
          if (this.mounted) {
            this.setState({
              user: session?.user ?? null,
              session: session,
              loading: false,
              isInitialized: true
            });
          }
        }
      );
      this.authSubscription = subscription;

      // Get initial session immediately
      const { data: { session }, error } = await supabase.auth.getSession();
      
      console.log('SafeAuthProvider: Initial session check complete');
      
      if (this.mounted) {
        this.setState({
          user: session?.user ?? null,
          session: session,
          loading: false,
          isInitialized: true,
          error: error || null
        });
      }

    } catch (error) {
      console.error('SafeAuthProvider: Auth initialization failed:', error);
      if (this.mounted) {
        // Always initialize, even on error, to prevent infinite loading
        this.setState({ 
          user: null,
          session: null,
          error: error as Error, 
          loading: false, 
          isInitialized: true 
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

  public render() {
    const { children } = this.props;
    const { user, session, loading, isInitialized, error } = this.state;

    // Show error state
    if (error) {
      return React.createElement('div', {
        style: {
          padding: '20px',
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '6px',
          color: '#991b1b',
          textAlign: 'center'
        }
      }, [
        React.createElement('h3', { key: 'title' }, 'Authentication Error'),
        React.createElement('p', { key: 'message' }, error.message),
        React.createElement('button', {
          key: 'retry',
          onClick: () => {
            this.setState({ error: null, loading: true });
            this.initializeAuth();
          },
          style: {
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px'
          }
        }, 'Retry')
      ]);
    }

    // Show loading state
    if (!isInitialized) {
      return React.createElement('div', {
        style: {
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#6b7280'
        }
      }, 'Loading authentication...');
    }

    // Create context value
    const contextValue: AuthContextType = {
      user,
      session,
      loading,
      signUp: this.signUp,
      signIn: this.signIn,
      signOut: this.signOut,
      register: this.signUp,
      login: this.signIn,
      logout: this.signOut,
    };

    // Create context provider using the same AuthContext instance
    return React.createElement(
      AuthContext.Provider,
      { value: contextValue },
      children
    );
  }
}

// Safe useAuth hook
export const useAuth = (): AuthContextType => {
  try {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
      // Return fallback auth state instead of throwing
      return {
        user: null,
        session: null,
        loading: false,
        signUp: async () => ({ error: new Error('Auth not initialized') }),
        signIn: async () => ({ error: new Error('Auth not initialized') }),
        signOut: async () => {},
        register: async () => ({ error: new Error('Auth not initialized') }),
        login: async () => ({ error: new Error('Auth not initialized') }),
        logout: async () => {},
      };
    }
    return context;
  } catch (error) {
    console.error('useAuth hook error:', error);
    return {
      user: null,
      session: null,
      loading: false,
      signUp: async () => ({ error: new Error('Hook error') }),
      signIn: async () => ({ error: new Error('Hook error') }),
      signOut: async () => {},
      register: async () => ({ error: new Error('Hook error') }),
      login: async () => ({ error: new Error('Hook error') }),
      logout: async () => {},
    };
  }
};

export default SafeAuthProvider;