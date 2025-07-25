import { supabase } from '@/integrations/supabase/client';
import { encryptionService } from './encryptionService';

interface SecureSession {
  sessionId: string;
  userId: string;
  deviceFingerprint: string;
  ipAddress: string;
  userAgent: string;
  expiresAt: Date;
  isActive: boolean;
}

interface SessionValidationResult {
  isValid: boolean;
  session?: SecureSession;
  reason?: string;
}

export class SecureSessionService {
  private static readonly SESSION_DURATION = 30 * 60 * 1000; // 30 minutes
  private static readonly MAX_SESSIONS_PER_USER = 5;

  /**
   * Create a new secure session (simplified version for existing schema)
   */
  static async createSession(
    userId: string,
    deviceFingerprint: string,
    ipAddress: string,
    userAgent: string
  ): Promise<string> {
    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + this.SESSION_DURATION);

    // Store encrypted session data in localStorage
    const sessionData = await encryptionService.encryptSensitiveData(
      JSON.stringify({
        sessionId,
        userId,
        deviceFingerprint,
        ipAddress,
        userAgent,
        expiresAt: expiresAt.getTime(),
        isActive: true
      }),
      'session_data'
    );

    if (sessionData) {
      localStorage.setItem(`secure_session_${userId}`, sessionData);
      sessionStorage.setItem('currentSessionId', sessionId);
    }

    return sessionId;
  }

  /**
   * Validate an existing session
   */
  static async validateSession(sessionId: string): Promise<SessionValidationResult> {
    try {
      // Get session from localStorage first
      const userId = this.getUserIdFromLocalSession(sessionId);
      if (!userId) {
        return { isValid: false, reason: 'Session not found in storage' };
      }

      const sessionData = localStorage.getItem(`secure_session_${userId}`);
      if (!sessionData) {
        return { isValid: false, reason: 'Session data not found' };
      }

      const decryptedData = await encryptionService.decryptSensitiveData(sessionData, 'session_data');
      if (!decryptedData) {
        return { isValid: false, reason: 'Failed to decrypt session' };
      }

      const session = JSON.parse(decryptedData);
      
      // Check if session is expired
      if (Date.now() > session.expiresAt) {
        this.revokeSession(sessionId);
        return { isValid: false, reason: 'Session expired' };
      }

      // Update last activity timestamp
      session.lastActivity = Date.now();
      const updatedSessionData = await encryptionService.encryptSensitiveData(
        JSON.stringify(session),
        'session_data'
      );
      
      if (updatedSessionData) {
        localStorage.setItem(`secure_session_${userId}`, updatedSessionData);
      }

      return { 
        isValid: true, 
        session: {
          sessionId: session.sessionId,
          userId: session.userId,
          deviceFingerprint: session.deviceFingerprint,
          ipAddress: session.ipAddress,
          userAgent: session.userAgent,
          expiresAt: new Date(session.expiresAt),
          isActive: session.isActive
        }
      };
    } catch (error) {
      console.error('Session validation error:', error);
      return { isValid: false, reason: 'Validation failed' };
    }
  }

  /**
   * Revoke a session
   */
  static async revokeSession(sessionId: string): Promise<void> {
    const userId = this.getUserIdFromLocalSession(sessionId);
    if (userId) {
      localStorage.removeItem(`secure_session_${userId}`);
    }
    sessionStorage.removeItem('currentSessionId');
  }

  /**
   * Get active sessions for a user (simplified)
   */
  static async getActiveSessions(userId: string): Promise<SecureSession[]> {
    try {
      const sessionData = localStorage.getItem(`secure_session_${userId}`);
      if (!sessionData) {
        return [];
      }

      const decryptedData = await encryptionService.decryptSensitiveData(sessionData, 'session_data');
      if (!decryptedData) {
        return [];
      }

      const session = JSON.parse(decryptedData);
      
      // Check if session is still valid
      if (Date.now() > session.expiresAt) {
        localStorage.removeItem(`secure_session_${userId}`);
        return [];
      }

      return [{
        sessionId: session.sessionId,
        userId: session.userId,
        deviceFingerprint: session.deviceFingerprint,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        expiresAt: new Date(session.expiresAt),
        isActive: session.isActive
      }];
    } catch (error) {
      console.error('Failed to get active sessions:', error);
      return [];
    }
  }

  /**
   * Clean up expired sessions
   */
  static async cleanupExpiredSessions(userId?: string): Promise<void> {
    if (userId) {
      const sessionData = localStorage.getItem(`secure_session_${userId}`);
      if (sessionData) {
        try {
          const decryptedData = await encryptionService.decryptSensitiveData(sessionData, 'session_data');
          if (decryptedData) {
            const session = JSON.parse(decryptedData);
            if (Date.now() > session.expiresAt) {
              localStorage.removeItem(`secure_session_${userId}`);
            }
          }
        } catch (error) {
          // Remove corrupted session data
          localStorage.removeItem(`secure_session_${userId}`);
        }
      }
    }
  }

  /**
   * Update session activity
   */
  static async updateSessionActivity(sessionId: string): Promise<void> {
    const userId = this.getUserIdFromLocalSession(sessionId);
    if (!userId) return;

    try {
      const sessionData = localStorage.getItem(`secure_session_${userId}`);
      if (sessionData) {
        const decryptedData = await encryptionService.decryptSensitiveData(sessionData, 'session_data');
        if (decryptedData) {
          const session = JSON.parse(decryptedData);
          session.lastActivity = Date.now();
          
          const updatedSessionData = await encryptionService.encryptSensitiveData(
            JSON.stringify(session),
            'session_data'
          );
          
          if (updatedSessionData) {
            localStorage.setItem(`secure_session_${userId}`, updatedSessionData);
          }
        }
      }
    } catch (error) {
      console.error('Failed to update session activity:', error);
    }
  }

  /**
   * Get user ID from session token (from localStorage)
   */
  private static getUserIdFromLocalSession(sessionId: string): string | null {
    // Get from sessionStorage first
    const currentSessionId = sessionStorage.getItem('currentSessionId');
    if (currentSessionId !== sessionId) {
      return null;
    }

    // Scan localStorage for matching session
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('secure_session_')) {
        const userId = key.replace('secure_session_', '');
        return userId;
      }
    }
    return null;
  }

  /**
   * Detect suspicious session activity
   */
  static async detectSuspiciousActivity(
    userId: string,
    currentIp: string,
    currentUserAgent: string
  ): Promise<boolean> {
    try {
      const sessions = await this.getActiveSessions(userId);
      
      // For now, just check if there are multiple concurrent sessions
      // In a real implementation, you'd check IP changes, etc.
      return sessions.length > 2;
    } catch (error) {
      console.error('Failed to detect suspicious activity:', error);
      return false;
    }
  }
}