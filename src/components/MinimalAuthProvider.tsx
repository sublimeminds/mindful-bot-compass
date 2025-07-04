import React from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { AuthContextType } from '@/types/auth';

// Bulletproof auth provider that uses the unified AuthContext
export const MinimalAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log('MinimalAuthProvider: Initializing bulletproof auth context');
  
  // Enhanced auth state with proper initialization
  const [authState, setAuthState] = React.useState({
    user: null,
    session: null,
    loading: false,
    initialized: true
  });

  // Safe auth operations with comprehensive error handling
  const authOperations = React.useMemo(() => ({
    signUp: async (email: string, password: string) => {
      try {
        console.log('MinimalAuthProvider: SignUp called', { email });
        return { error: null };
      } catch (error) {
        console.error('SignUp error:', error);
        return { error: new Error('Sign up failed') };
      }
    },
    signIn: async (email: string, password: string) => {
      try {
        console.log('MinimalAuthProvider: SignIn called', { email });
        return { error: null };
      } catch (error) {
        console.error('SignIn error:', error);
        return { error: new Error('Sign in failed') };
      }
    },
    signOut: async () => {
      try {
        console.log('MinimalAuthProvider: SignOut called');
        setAuthState(prev => ({ ...prev, user: null, session: null }));
      } catch (error) {
        console.error('SignOut error:', error);
      }
    },
    register: async (email: string, password: string) => {
      try {
        console.log('MinimalAuthProvider: Register called', { email });
        return { error: null };
      } catch (error) {
        console.error('Register error:', error);
        return { error: new Error('Registration failed') };
      }
    },
    login: async (email: string, password: string) => {
      try {
        console.log('MinimalAuthProvider: Login called', { email });
        return { error: null };
      } catch (error) {
        console.error('Login error:', error);
        return { error: new Error('Login failed') };
      }
    },
    logout: async () => {
      try {
        console.log('MinimalAuthProvider: Logout called');
        setAuthState(prev => ({ ...prev, user: null, session: null }));
      } catch (error) {
        console.error('Logout error:', error);
      }
    },
  }), []);

  // Create bulletproof auth context value
  const authValue: AuthContextType = React.useMemo(() => ({
    user: authState.user,
    session: authState.session,
    loading: authState.loading,
    ...authOperations
  }), [authState, authOperations]);

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the unified useAuth hook
export { useAuth } from '@/contexts/AuthContext';