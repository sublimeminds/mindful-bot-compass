
import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { securityMiddleware } from '@/services/securityMiddleware';
import type { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { useSecurityLogger } from '@/hooks/useSecurityLogger';
import { useUserSecurity } from '@/hooks/useUserSecurity';
import { SecurityMetrics } from '@/types/auth';

interface SecurityInitResult {
  isTrusted: boolean;
  mfaStatus: boolean;
}

interface EnhancedAuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  mfaEnabled: boolean;
  deviceTrusted: boolean;
  login: (email: string, password: string, mfaCode?: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  enableMFA: () => Promise<boolean>;
  disableMFA: (password: string) => Promise<boolean>;
  trustDevice: () => void;
  getSecurityMetrics: () => SecurityMetrics;
}

const EnhancedAuthContext = createContext<EnhancedAuthContextType | undefined>(undefined);

interface EnhancedAuthProviderProps {
  children: React.ReactNode;
}

export const EnhancedAuthProvider: React.FC<EnhancedAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [deviceTrusted, setDeviceTrusted] = useState(false);

  const { logSecurityEvent } = useSecurityLogger(user);
  const { initializeUserSecurity } = useUserSecurity();

  const handleAuthStateChange = useCallback(async (event: string, session: Session | null) => {
    console.log('EnhancedAuthProvider: Auth state changed:', event);
    
    // Log authentication events with proper event property
    await logSecurityEvent('auth_state_change', 'low', { 
      event,
      user_id: session?.user?.id,
      timestamp: new Date().toISOString()
    });

    setSession(session);
    setUser(session?.user ?? null);
    
    if (session?.user) {
      try {
        const securityResult: SecurityInitResult = await initializeUserSecurity(session.user);
        setDeviceTrusted(securityResult.isTrusted);
        setMfaEnabled(securityResult.mfaStatus);
      } catch (error) {
        console.error('Security initialization failed:', error);
      }
    } else {
      // Clear security state on logout
      setMfaEnabled(false);
      setDeviceTrusted(false);
    }
    
    setLoading(false);
  }, [logSecurityEvent, initializeUserSecurity]);

  useEffect(() => {
    console.log('EnhancedAuthProvider: Initializing enhanced auth...');
    
    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('EnhancedAuthProvider: Error getting session:', error);
          logSecurityEvent('auth_error', 'medium', { error: error.message });
        } else {
          console.log('EnhancedAuthProvider: Initial session:', initialSession ? 'Found' : 'Not found');
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          
          if (initialSession?.user) {
            try {
              const securityResult: SecurityInitResult = await initializeUserSecurity(initialSession.user);
              setDeviceTrusted(securityResult.isTrusted);
              setMfaEnabled(securityResult.mfaStatus);
            } catch (error) {
              console.error('Security initialization failed:', error);
              await logSecurityEvent('security_init_error', 'high', { error: (error as Error).message });
            }
          }
        }
      } catch (error) {
        console.error('EnhancedAuthProvider: Exception during initialization:', error);
        setUser(null);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes with enhanced security
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    return () => {
      console.log('EnhancedAuthProvider: Cleaning up auth listener...');
      subscription.unsubscribe();
    };
  }, [handleAuthStateChange, initializeUserSecurity, logSecurityEvent]);

  const login = async (email: string, password: string, mfaCode?: string) => {
    console.log('EnhancedAuthProvider: Attempting enhanced login...');
    
    // Check rate limiting
    if (!securityMiddleware.checkRateLimit('login', email)) {
      throw new Error('Too many login attempts. Please try again later.');
    }

    // Validate input
    const emailValidation = securityMiddleware.validateAndSanitizeInput(email, 'email');
    const passwordValidation = securityMiddleware.validateAndSanitizeInput(password, 'password');

    if (!emailValidation.isValid) {
      await logSecurityEvent('auth_validation_failed', 'medium', { 
        errors: emailValidation.errors,
        type: 'email'
      });
      throw new Error(emailValidation.errors.join(', '));
    }

    if (!passwordValidation.isValid) {
      await logSecurityEvent('auth_validation_failed', 'medium', { 
        errors: passwordValidation.errors,
        type: 'password'
      });
      throw new Error(passwordValidation.errors.join(', '));
    }

    try {
      // Check if MFA is required for this user
      const userMfaEnabled = localStorage.getItem(`mfa_enabled_${email}`) === 'true';
      
      if (userMfaEnabled && !mfaCode) {
        await logSecurityEvent('mfa_required', 'low', { email });
        throw new Error('MFA_REQUIRED');
      }

      if (userMfaEnabled && mfaCode) {
        // Validate MFA code (mock validation)
        if (mfaCode.length !== 6 || !/^\d{6}$/.test(mfaCode)) {
          await logSecurityEvent('mfa_invalid', 'medium', { email });
          throw new Error('Invalid MFA code format');
        }
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: emailValidation.sanitized,
        password: passwordValidation.sanitized,
      });

      if (error) {
        await logSecurityEvent('auth_failure', 'medium', { 
          email: emailValidation.sanitized,
          error: error.message 
        });
        throw error;
      }

      await logSecurityEvent('auth_success', 'low', { 
        email: emailValidation.sanitized 
      });
      
      console.log('EnhancedAuthProvider: Enhanced login successful');
      toast.success('Login successful - Enhanced security active');
      
    } catch (error) {
      console.error('EnhancedAuthProvider: Enhanced login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    console.log('EnhancedAuthProvider: Attempting enhanced registration...');
    
    // Validate inputs
    const validations = {
      email: securityMiddleware.validateAndSanitizeInput(email, 'email'),
      password: securityMiddleware.validateAndSanitizeInput(password, 'password'),
      name: securityMiddleware.validateAndSanitizeInput(name, 'text')
    };

    const errors = Object.entries(validations)
      .filter(([_, validation]) => !validation.isValid)
      .flatMap(([field, validation]) => validation.errors.map(error => `${field}: ${error}`));

    if (errors.length > 0) {
      await logSecurityEvent('registration_validation_failed', 'medium', { errors });
      throw new Error(errors.join(', '));
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: validations.email.sanitized,
        password: validations.password.sanitized,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name: validations.name.sanitized
          }
        }
      });

      if (error) {
        await logSecurityEvent('registration_failure', 'medium', { 
          email: validations.email.sanitized,
          error: error.message 
        });
        throw error;
      }

      await logSecurityEvent('registration_success', 'low', { 
        email: validations.email.sanitized 
      });
      
      console.log('EnhancedAuthProvider: Enhanced registration successful');
      toast.success('Registration successful - Please check your email to verify your account');
      
    } catch (error) {
      console.error('EnhancedAuthProvider: Enhanced registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    console.log('EnhancedAuthProvider: Attempting enhanced logout...');
    
    try {
      // Clear security data
      if (user) {
        await logSecurityEvent('logout', 'low', { user_id: user.id });
        
        // Clear session data
        const sessionId = sessionStorage.getItem('currentSessionId');
        if (sessionId) {
          localStorage.removeItem(`session:${sessionId}`);
          sessionStorage.removeItem('currentSessionId');
        }
      }

      await supabase.auth.signOut();
      console.log('EnhancedAuthProvider: Enhanced logout successful');
      toast.success('Logged out successfully');
      
    } catch (error) {
      console.error('EnhancedAuthProvider: Enhanced logout error:', error);
      throw error;
    }
  };

  const enableMFA = async (): Promise<boolean> => {
    if (!user) return false;

    try {
      // In a real implementation, this would set up TOTP with the backend
      localStorage.setItem(`mfa_enabled_${user.id}`, 'true');
      setMfaEnabled(true);
      
      await logSecurityEvent('mfa_enabled', 'low', { user_id: user.id });
      toast.success('Two-factor authentication has been enabled');
      
      return true;
    } catch (error) {
      console.error('MFA enablement failed:', error);
      await logSecurityEvent('mfa_enable_failed', 'medium', { 
        user_id: user.id,
        error: (error as Error).message 
      });
      return false;
    }
  };

  const disableMFA = async (password: string): Promise<boolean> => {
    if (!user) return false;

    try {
      // Verify password before disabling MFA
      const { error } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password
      });

      if (error) {
        await logSecurityEvent('mfa_disable_failed', 'medium', { 
          user_id: user.id,
          reason: 'password_verification_failed'
        });
        throw new Error('Password verification failed');
      }

      localStorage.removeItem(`mfa_enabled_${user.id}`);
      setMfaEnabled(false);
      
      await logSecurityEvent('mfa_disabled', 'medium', { user_id: user.id });
      toast.success('Two-factor authentication has been disabled');
      
      return true;
    } catch (error) {
      console.error('MFA disabling failed:', error);
      return false;
    }
  };

  const trustDevice = () => {
    if (!user) return;

    const deviceFingerprint = securityMiddleware.generateDeviceFingerprint();
    const trustedDevices = JSON.parse(localStorage.getItem(`trusted_devices_${user.id}`) || '[]');
    
    if (!trustedDevices.includes(deviceFingerprint)) {
      trustedDevices.push(deviceFingerprint);
      localStorage.setItem(`trusted_devices_${user.id}`, JSON.stringify(trustedDevices));
      setDeviceTrusted(true);
      
      logSecurityEvent('device_trusted', 'low', { 
        user_id: user.id,
        device_fingerprint: deviceFingerprint 
      });
      
      toast.success('Device has been trusted');
    }
  };

  const getSecurityMetrics = (): SecurityMetrics => {
    // Get the actual metrics from securityMiddleware and map to our interface
    const rawMetrics = securityMiddleware.getSecurityMetrics();
    
    return {
      totalEvents: rawMetrics.totalEvents || 0,
      failedLogins: rawMetrics.criticalEvents || 0, // Map criticalEvents to failedLogins
      successfulLogins: 0, // Default value since not available in raw metrics
      suspiciousActivity: rawMetrics.suspiciousIPs || 0, // Map suspiciousIPs to suspiciousActivity
      lastActivity: rawMetrics.lastUpdate || new Date() // Map lastUpdate to lastActivity
    };
  };

  const value = {
    user,
    session,
    loading,
    mfaEnabled,
    deviceTrusted,
    login,
    register,
    logout,
    enableMFA,
    disableMFA,
    trustDevice,
    getSecurityMetrics,
  };

  console.log('EnhancedAuthProvider: Rendering with user:', user ? 'Authenticated' : 'Not authenticated', 'loading:', loading);

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
