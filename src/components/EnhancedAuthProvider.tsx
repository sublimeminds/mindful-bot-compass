
import React from 'react';
import { AuthContextType } from '@/types/auth';
import { useAuthState } from '@/components/auth/AuthStateManager';
import { useAuthActions } from '@/components/auth/AuthActions';
import { DevAuthControls } from '@/components/auth/DevAuthControls';
import { AuthContext } from '@/contexts/AuthContext';

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

// Export the unified useAuth from AuthContext
export { useAuth } from '@/contexts/AuthContext';
