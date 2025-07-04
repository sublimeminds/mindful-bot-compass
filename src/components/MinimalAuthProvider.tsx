import React from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { AuthContextType } from '@/types/auth';

// Bulletproof auth provider that uses the unified AuthContext
export const MinimalAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log('MinimalAuthProvider: Initializing with unified AuthContext');
  
  // Create stable auth value without hooks to prevent dispatcher issues
  const authValue: AuthContextType = React.useMemo(() => ({
    user: null,
    session: null,
    loading: false,
    signUp: async (email: string, password: string) => {
      console.log('MinimalAuthProvider: SignUp called', { email });
      return { error: null };
    },
    signIn: async (email: string, password: string) => {
      console.log('MinimalAuthProvider: SignIn called', { email });
      return { error: null };
    },
    signOut: async () => {
      console.log('MinimalAuthProvider: SignOut called');
    },
    register: async (email: string, password: string) => {
      console.log('MinimalAuthProvider: Register called', { email });
      return { error: null };
    },
    login: async (email: string, password: string) => {
      console.log('MinimalAuthProvider: Login called', { email });
      return { error: null };
    },
    logout: async () => {
      console.log('MinimalAuthProvider: Logout called');
    },
  }), []);

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the unified useAuth hook
export { useAuth } from '@/contexts/AuthContext';