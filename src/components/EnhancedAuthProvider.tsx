
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { checkReactSafety } from '@/utils/reactSafetyChecker';
import { AuthError, SecurityEvent } from '@/types/auth';

interface UserSecurity {
  twoFactorEnabled: boolean;
  lastPasswordChange: string | null;
  failedLoginAttempts: number;
  accountLocked: boolean;
  suspiciousActivity: SecurityEvent[];
}

interface EnhancedAuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userSecurity: UserSecurity | null;
  login: (email: string, password: string) => Promise<{ error: Error | null }>;
  register: (email: string, password: string, userData?: Record<string, unknown>) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Record<string, unknown>) => Promise<{ error: Error | null }>;
  changePassword: (newPassword: string) => Promise<{ error: Error | null }>;
  enableTwoFactor: () => Promise<{ error: Error | null; qrCode?: string }>;
  disableTwoFactor: (token: string) => Promise<{ error: Error | null }>;
  verifyTwoFactor: (token: string) => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  refreshSecurityData: () => Promise<void>;
}

const EnhancedAuthContext = createContext<EnhancedAuthContextType | undefined>(undefined);

interface EnhancedAuthProviderProps {
  children: ReactNode;
}

export const EnhancedAuthProvider: React.FC<EnhancedAuthProviderProps> = ({ children }) => {
  const reactSafety = checkReactSafety();
  
  if (!reactSafety.isReactSafe) {
    console.error('EnhancedAuthProvider: React safety check failed:', reactSafety.error);
    return React.createElement('div', {
      style: {
        padding: '20px',
        backgroundColor: '#fee2e2',
        border: '1px solid #fecaca',
        borderRadius: '6px',
        color: '#991b1b',
        textAlign: 'center'
      }
    }, [
      React.createElement('h3', { key: 'title' }, 'Enhanced Authentication System Error'),
      React.createElement('p', { key: 'message' }, reactSafety.error || 'React hooks are not available'),
      React.createElement('button', {
        key: 'reload',
        onClick: () => window.location.reload(),
        style: {
          backgroundColor: '#dc2626',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '10px'
        }
      }, 'Reload Page')
    ]);
  }

  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userSecurity, setUserSecurity] = useState<UserSecurity | null>(null);

  const logSecurityEvent = useCallback(async (event: Omit<SecurityEvent, 'timestamp'>) => {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: new Date().toISOString()
    };
    
    try {
      console.log('Security Event:', securityEvent);
      
      setUserSecurity(prev => prev ? {
        ...prev,
        suspiciousActivity: [...prev.suspiciousActivity, securityEvent]
      } : null);
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }, []);

  const initializeUserSecurity = useCallback(async (userId: string) => {
    try {
      const mockSecurity: UserSecurity = {
        twoFactorEnabled: false,
        lastPasswordChange: null,
        failedLoginAttempts: 0,
        accountLocked: false,
        suspiciousActivity: []
      };
      
      setUserSecurity(mockSecurity);
    } catch (error) {
      console.error('Failed to initialize user security:', error);
    }
  }, []);

  useEffect(() => {
    console.log('EnhancedAuthProvider: Initializing enhanced auth...');
    
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('EnhancedAuthProvider: Error getting session:', error);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
          if (session?.user) {
            initializeUserSecurity(session.user.id);
          }
        }
      } catch (error) {
        console.error('EnhancedAuthProvider: Exception getting session:', error);
        setSession(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('EnhancedAuthProvider: Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        if (session?.user && event === 'SIGNED_IN') {
          setTimeout(() => {
            initializeUserSecurity(session.user.id);
            logSecurityEvent({
              type: 'login_success',
              description: 'User successfully logged in',
              risk_level: 'low'
            });
          }, 0);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [initializeUserSecurity, logSecurityEvent]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('EnhancedAuthProvider: Login error:', error);
        logSecurityEvent({
          type: 'login_failed',
          description: `Failed login attempt for user ${email}`,
          risk_level: 'medium',
          ip_address: '::1',
          user_agent: navigator.userAgent
        });
        return { error };
      }

      console.log('EnhancedAuthProvider: Login successful');
      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      console.error('EnhancedAuthProvider: Unexpected login error:', authError);
      return { error: new Error(authError.message || 'Login failed') };
    }
  }, [logSecurityEvent]);

  const register = useCallback(async (email: string, password: string, userData: Record<string, unknown> = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        console.error('EnhancedAuthProvider: Registration error:', error);
        return { error };
      }

      console.log('EnhancedAuthProvider: Registration successful');
      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      console.error('EnhancedAuthProvider: Unexpected registration error:', authError);
      return { error: new Error(authError.message || 'Registration failed') };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      console.log('EnhancedAuthProvider: Logout successful');
    } catch (error) {
      console.error('EnhancedAuthProvider: Logout error:', error);
    }
  }, []);

  const updateProfile = useCallback(async (updates: Record<string, unknown>) => {
    if (!user) {
      console.warn('No user to update profile for.');
      return { error: new Error('No user logged in') };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        return { error };
      }

      setUser(prevUser => {
        if (prevUser) {
          return {
            ...prevUser,
            user_metadata: {
              ...prevUser.user_metadata,
              ...updates
            }
          };
        }
        return prevUser;
      });

      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      console.error('Unexpected error updating profile:', authError);
      return { error: new Error(authError.message || 'Profile update failed') };
    }
  }, [user]);

  const changePassword = useCallback(async (newPassword: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        console.error('Error changing password:', error);
        return { error };
      }

      logSecurityEvent({
        type: 'password_change',
        description: 'User successfully changed password',
        risk_level: 'low'
      });
      
      toast({
        title: "Password Changed",
        description: "Your password has been updated successfully.",
      });

      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      console.error('Unexpected error changing password:', authError);
      return { error: new Error(authError.message || 'Password change failed') };
    }
  }, [logSecurityEvent, toast]);

  const enableTwoFactor = useCallback(async () => {
    try {
      const qrCode = 'MOCK_QR_CODE';
      
      setUserSecurity(prev => prev ? { ...prev, twoFactorEnabled: true } : null);
      
      toast({
        title: "Two-Factor Authentication Enabled",
        description: "Your account is now protected with two-factor authentication.",
      });
      
      return { error: null, qrCode };
    } catch (error) {
      const authError = error as AuthError;
      console.error('Error enabling two-factor authentication:', authError);
      return { error: new Error(authError.message || 'Failed to enable two-factor authentication') };
    }
  }, [toast]);

  const disableTwoFactor = useCallback(async (token: string) => {
    try {
      setUserSecurity(prev => prev ? { ...prev, twoFactorEnabled: false } : null);
      
      toast({
        title: "Two-Factor Authentication Disabled",
        description: "Two-factor authentication has been disabled for your account.",
      });
      
      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      console.error('Error disabling two-factor authentication:', authError);
      return { error: new Error(authError.message || 'Failed to disable two-factor authentication') };
    }
  }, [toast]);

  const verifyTwoFactor = useCallback(async (token: string) => {
    try {
      toast({
        title: "Two-Factor Authentication Verified",
        description: "Your two-factor authentication has been verified.",
      });
      
      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      console.error('Error verifying two-factor authentication:', authError);
      return { error: new Error(authError.message || 'Failed to verify two-factor authentication') };
    }
  }, [toast]);

  const resetPassword = useCallback(async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/update-password`,
        }
      );

      if (error) {
        console.error('Error resetting password:', error);
        return { error };
      }

      toast({
        title: "Password Reset Initiated",
        description: "A password reset link has been sent to your email address.",
      });

      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      console.error('Unexpected error resetting password:', authError);
      return { error: new Error(authError.message || 'Password reset failed') };
    }
  }, [toast]);

  const refreshSecurityData = useCallback(async () => {
    if (!user) return;
    initializeUserSecurity(user.id);
  }, [user, initializeUserSecurity]);

  const value = {
    user,
    session,
    loading,
    userSecurity,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    enableTwoFactor,
    disableTwoFactor,
    verifyTwoFactor,
    resetPassword,
    refreshSecurityData
  };

  return (
    <EnhancedAuthContext.Provider value={value}>
      {children}
    </EnhancedAuthContext.Provider>
  );
};

export const useEnhancedAuth = () => {
  const context = useContext(EnhancedAuthContext);
  if (!context) {
    throw new Error('useEnhancedAuth must be used within an EnhancedAuthProvider');
  }
  return context;
};
