
import React from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { AuthContextType } from '@/types/auth';

// Safe useAuth hook that works with the unified AuthContext
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
