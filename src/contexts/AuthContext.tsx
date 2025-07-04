import React, { createContext } from 'react';
import { AuthContextType } from '@/types/auth';

// Unified AuthContext with React null safety
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Ultra-safe useAuth hook with bulletproof fallbacks
export const useAuth = (): AuthContextType => {
  // Create safe fallback auth state
  const createFallbackAuth = (reason: string): AuthContextType => {
    console.warn(`Auth fallback activated: ${reason}`);
    return {
      user: null,
      session: null,
      loading: false,
      signUp: async () => ({ error: new Error(`Auth not available: ${reason}`) }),
      signIn: async () => ({ error: new Error(`Auth not available: ${reason}`) }),
      signOut: async () => {},
      register: async () => ({ error: new Error(`Auth not available: ${reason}`) }),
      login: async () => ({ error: new Error(`Auth not available: ${reason}`) }),
      logout: async () => {},
    };
  };

  try {
    // Phase 1: Check React availability
    if (!React || typeof React.useContext !== 'function') {
      return createFallbackAuth('React hooks not available');
    }

    // Phase 2: Check context availability
    let context;
    try {
      context = React.useContext(AuthContext);
    } catch (contextError) {
      console.error('Context access error:', contextError);
      return createFallbackAuth('Context access failed');
    }

    // Phase 3: Validate context
    if (context === undefined || context === null) {
      return createFallbackAuth('Context not initialized');
    }

    // Phase 4: Validate context structure
    if (typeof context !== 'object' || !context.signIn || !context.signUp) {
      return createFallbackAuth('Invalid context structure');
    }

    return context;
  } catch (error) {
    console.error('useAuth critical error:', error);
    return createFallbackAuth('Critical hook error');
  }
};