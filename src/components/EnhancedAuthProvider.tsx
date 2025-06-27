
import React, { createContext, useContext } from 'react';
import { AuthContextType } from '@/types/auth';
import { useAuthState } from '@/components/auth/AuthStateManager';
import { useAuthActions } from '@/components/auth/AuthActions';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface EnhancedAuthProviderProps {
  children: React.ReactNode;
}

export const EnhancedAuthProvider: React.FC<EnhancedAuthProviderProps> = ({ children }) => {
  console.log('EnhancedAuthProvider: Rendering provider');
  
  const { user, loading } = useAuthState();
  const authActions = useAuthActions();

  console.log('EnhancedAuthProvider: Auth state -', { 
    user: user ? 'Present' : 'None', 
    loading 
  });

  const value: AuthContextType = {
    user,
    loading,
    ...authActions,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error('useAuth must be used within an EnhancedAuthProvider');
    throw new Error('useAuth must be used within an EnhancedAuthProvider');
  }
  return context;
};
