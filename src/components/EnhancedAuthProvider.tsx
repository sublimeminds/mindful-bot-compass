
import React, { createContext, useContext } from 'react';
import { AuthContextType } from '@/types/auth';
import { useAuthState } from '@/components/auth/AuthStateManager';
import { useAuthActions } from '@/components/auth/AuthActions';
import { DevAuthControls } from '@/components/auth/DevAuthControls';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface EnhancedAuthProviderProps {
  children: React.ReactNode;
}

export const EnhancedAuthProvider: React.FC<EnhancedAuthProviderProps> = ({ children }) => {
  console.log('EnhancedAuthProvider: Rendering provider (non-blocking)');
  
  // PHASE 1: Non-blocking auth state
  const { user, loading, skipAuth, enableAuth } = useAuthState();
  const authActions = useAuthActions();

  console.log('EnhancedAuthProvider: Auth state -', { 
    user: user ? 'Present' : 'None', 
    loading,
    debugMode: localStorage.getItem('auth_debug') === 'true'
  });

  const value: AuthContextType = {
    user,
    session: null,
    loading, // This should now be false by default
    ...authActions,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {/* Development controls */}
      <DevAuthControls user={user} skipAuth={skipAuth} enableAuth={enableAuth} />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error('useAuth must be used within an EnhancedAuthProvider');
    throw new Error('useAuth must be used within an EnhancedAuthProvider');
  }
  return context;
};
