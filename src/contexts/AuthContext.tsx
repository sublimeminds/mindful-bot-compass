import React, { createContext } from 'react';
import { AuthContextType } from '@/types/auth';

// Unified AuthContext with React null safety
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Safe useAuth hook with comprehensive fallbacks
export const useAuth = (): AuthContextType => {
  try {
    // Ensure React is available before using hooks
    if (!React || typeof React.useContext !== 'function') {
      console.warn('React hooks not available, returning fallback auth state');
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

    const context = React.useContext(AuthContext);
    if (context === undefined) {
      console.warn('useAuth used outside provider, returning fallback auth state');
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