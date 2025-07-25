
import { useCallback } from 'react';
import { SecureSessionService } from '@/services/secureSessionService';
import { securityMiddleware } from '@/services/securityMiddleware';
import type { User } from '@supabase/supabase-js';

export const useUserSecurity = () => {
  const initializeUserSecurity = useCallback(async (user: User) => {
    try {
      // Generate device fingerprint securely
      const deviceFingerprint = securityMiddleware.generateDeviceFingerprint();
      
      // Get client info safely
      const ipAddress = 'client'; // Will be determined server-side
      const userAgent = navigator.userAgent.substring(0, 500); // Limit length

      // Check for suspicious activity
      const isSuspicious = await SecureSessionService.detectSuspiciousActivity(
        user.id,
        ipAddress,
        userAgent
      );

      if (isSuspicious) {
        console.warn('Suspicious activity detected for user:', user.id);
        // You could trigger additional security measures here
      }

      // Create secure session
      const sessionId = await SecureSessionService.createSession(
        user.id,
        deviceFingerprint,
        ipAddress,
        userAgent
      );

      // Validate the created session
      const validation = await SecureSessionService.validateSession(sessionId);
      
      if (!validation.isValid) {
        throw new Error('Session validation failed: ' + validation.reason);
      }

      console.log('User security initialized successfully');
      return { 
        sessionValid: true, 
        sessionId,
        deviceTrusted: !isSuspicious 
      };
    } catch (error) {
      console.error('Enhanced auth security initialization failed:', error);
      throw error;
    }
  }, []);

  const validateCurrentSession = useCallback(async (sessionId: string) => {
    try {
      const result = await SecureSessionService.validateSession(sessionId);
      if (result.isValid) {
        // Update activity timestamp
        await SecureSessionService.updateSessionActivity(sessionId);
      }
      return result;
    } catch (error) {
      console.error('Session validation failed:', error);
      return { isValid: false, reason: 'Validation error' };
    }
  }, []);

  const revokeSession = useCallback(async (sessionId: string) => {
    try {
      await SecureSessionService.revokeSession(sessionId);
      return true;
    } catch (error) {
      console.error('Session revocation failed:', error);
      return false;
    }
  }, []);

  return { 
    initializeUserSecurity, 
    validateCurrentSession, 
    revokeSession 
  };
};
