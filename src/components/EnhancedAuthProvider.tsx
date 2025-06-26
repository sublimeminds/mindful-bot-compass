
import React, { createContext, useContext } from 'react';
import { AuthContextType } from '@/types/auth';
import { useAuthState } from '@/components/auth/AuthStateManager';
import { useAuthActions } from '@/components/auth/AuthActions';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface EnhancedAuthProviderProps {
  children: React.ReactNode;
}

export const EnhancedAuthProvider: React.FC<EnhancedAuthProviderProps> = ({ children }) => {
  const { user, loading } = useAuthState();
  const authActions = useAuthActions();

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
    throw new Error('useAuth must be used within an EnhancedAuthProvider');
  }
  return context;
};
