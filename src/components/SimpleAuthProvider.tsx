
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

// Safe wrapper that ensures React hooks are available before using them
export const SimpleAuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Use class component approach to avoid hook issues during initialization
  return React.createElement(SafeAuthProviderClass, { children });
};

// Class component that doesn't use hooks until React is ready
class SafeAuthProviderClass extends React.Component<AuthProviderProps, { isReactReady: boolean }> {
  constructor(props: AuthProviderProps) {
    super(props);
    this.state = { isReactReady: false };
  }

  componentDidMount() {
    // Check if React hooks are available
    this.checkReactReadiness();
  }

  checkReactReadiness = () => {
    try {
      // Test if React hooks are available
      if (
        typeof React !== 'undefined' &&
        React.useState &&
        React.useEffect &&
        React.useContext &&
        typeof React.useState === 'function'
      ) {
        console.log('SimpleAuthProvider: React hooks are ready');
        this.setState({ isReactReady: true });
      } else {
        console.log('SimpleAuthProvider: React hooks not ready, retrying...');
        setTimeout(this.checkReactReadiness, 50);
      }
    } catch (error) {
      console.error('SimpleAuthProvider: Error checking React readiness:', error);
      setTimeout(this.checkReactReadiness, 100);
    }
  };

  render() {
    if (!this.state.isReactReady) {
      return React.createElement('div', {
        style: {
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8fafc',
          fontFamily: 'system-ui, sans-serif'
        }
      }, 'Initializing authentication...');
    }

    // Now it's safe to use the hook-based component
    return React.createElement(AuthProviderWithHooks, this.props);
  }
}

// Hook-based component that only renders when React is fully ready
const AuthProviderWithHooks: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('SimpleAuthProvider: Initializing auth...');
    
    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('SimpleAuthProvider: Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('SimpleAuthProvider: Error getting session:', error);
        } else {
          console.log('SimpleAuthProvider: Initial session:', session ? 'Found' : 'Not found');
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('SimpleAuthProvider: Exception getting session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    console.log('SimpleAuthProvider: Setting up auth state listener...');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('SimpleAuthProvider: Auth state changed:', event, session ? 'User logged in' : 'User logged out');
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      console.log('SimpleAuthProvider: Cleaning up auth listener...');
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    console.log('SimpleAuthProvider: Attempting login...');
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error('SimpleAuthProvider: Login error:', error);
      throw error;
    }
    console.log('SimpleAuthProvider: Login successful');
  };

  const register = async (email: string, password: string) => {
    console.log('SimpleAuthProvider: Attempting registration...');
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`
      }
    });
    if (error) {
      console.error('SimpleAuthProvider: Registration error:', error);
      throw error;
    }
    console.log('SimpleAuthProvider: Registration successful');
  };

  const logout = async () => {
    console.log('SimpleAuthProvider: Attempting logout...');
    await supabase.auth.signOut();
    console.log('SimpleAuthProvider: Logout successful');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  console.log('SimpleAuthProvider: Rendering with user:', user ? 'Authenticated' : 'Not authenticated', 'loading:', loading);

  return React.createElement(AuthContext.Provider, { value }, children);
};
