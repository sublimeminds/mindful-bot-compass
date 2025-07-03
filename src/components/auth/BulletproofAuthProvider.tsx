import React from 'react';
import { AuthContextType } from '@/types/auth';
import { useBulletproofAuthState } from '@/components/auth/BulletproofAuthState';
import { useBulletproofAuthActions } from '@/components/auth/BulletproofAuthActions';
import { DevAuthControls } from '@/components/auth/DevAuthControls';
import { AuthContext } from '@/contexts/AuthContext';

interface BulletproofAuthProviderProps {
  children: React.ReactNode;
}

// Bulletproof auth provider with comprehensive error handling and fallbacks
export const BulletproofAuthProvider: React.FC<BulletproofAuthProviderProps> = ({ children }) => {
  console.log('BulletproofAuthProvider: Initializing bulletproof auth system');
  
  // Use bulletproof auth state and actions
  const { user, session, loading, error, setUser, skipAuth, enableAuth } = useBulletproofAuthState();
  const authActions = useBulletproofAuthActions();

  console.log('BulletproofAuthProvider: Auth state -', { 
    user: user ? 'Present' : 'None', 
    loading,
    error: error || 'None',
    debugMode: localStorage.getItem('auth_debug') === 'true'
  });

  // Create bulletproof auth context value with error handling
  const value: AuthContextType = React.useMemo(() => ({
    user,
    session,
    loading,
    ...authActions,
  }), [user, session, loading, authActions]);

  // Show error state if auth initialization failed
  if (error && !user) {
    console.warn('BulletproofAuthProvider: Auth error detected:', error);
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
      {/* Development controls */}
      <DevAuthControls user={user} skipAuth={skipAuth} enableAuth={enableAuth} />
    </AuthContext.Provider>
  );
};

export default BulletproofAuthProvider;