
import { useCallback } from 'react';
import { encryptionService } from '@/services/encryptionService';
import { securityMiddleware } from '@/services/securityMiddleware';
import type { User } from '@supabase/supabase-js';

export const useUserSecurity = () => {
  const initializeUserSecurity = useCallback(async (user: User) => {
    try {
      // Check device trust
      const deviceFingerprint = securityMiddleware.generateDeviceFingerprint();
      const trustedDevices = JSON.parse(localStorage.getItem(`trusted_devices_${user.id}`) || '[]');
      const isTrusted = trustedDevices.includes(deviceFingerprint);

      // Check MFA status
      const mfaStatus = localStorage.getItem(`mfa_enabled_${user.id}`) === 'true';

      // Validate session security
      const sessionId = crypto.randomUUID();
      sessionStorage.setItem('currentSessionId', sessionId);
      
      // Store encrypted session data
      const sessionData = await encryptionService.encryptSensitiveData(
        JSON.stringify({
          userId: user.id,
          sessionId,
          deviceFingerprint,
          timestamp: Date.now(),
          expiresAt: Date.now() + 30 * 60 * 1000 // 30 minutes
        }),
        'session_data'
      );

      if (sessionData) {
        localStorage.setItem(`session:${sessionId}`, sessionData);
      }

      console.log('User security initialized');
      return { isTrusted, mfaStatus };
    } catch (error) {
      console.error('Enhanced auth security initialization failed:', error);
      throw error;
    }
  }, []);

  return { initializeUserSecurity };
};
