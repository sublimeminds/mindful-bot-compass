
import React, { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import { checkReactSafety } from '@/utils/reactSafetyChecker';

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

export const SimpleAuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Check React safety before using hooks
  const reactSafety = checkReactSafety();
  
  if (!reactSafety.isReactSafe) {
    console.error('SimpleAuthProvider: React safety check failed:', reactSafety.error);
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
      React.createElement('h3', { key: 'title' }, 'Authentication System Error'),
      React.createElement('p', { key: 'message' }, reactSafety.error || 'React hooks are not available'),
      React.createElement('button', {
        key: 'reload',
        onClick: () => window.location.reload(),
        style: {
          backgroundColor: '#dc2626',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '10px'
        }
      }, 'Reload Page')
    ]);
  }

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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
