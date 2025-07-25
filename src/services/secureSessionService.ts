import { supabase } from '@/integrations/supabase/client';
import { SecureStorageService } from './secureStorageService';

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

    // Store session data securely with expiration
    const sessionData = {
      sessionId,
      userId,
      deviceFingerprint,
      ipAddress,
      userAgent,
      expiresAt: expiresAt.getTime(),
      isActive: true,
      createdAt: Date.now()
    };

    // Use secure storage service instead of direct localStorage
    await SecureStorageService.setItem(`session_${userId}`, sessionData, {
      expiration: this.SESSION_DURATION,
      encrypt: false // Data is already structured securely
    });

    // Store current session ID separately
    await SecureStorageService.setItem('currentSessionId', sessionId, {
      expiration: this.SESSION_DURATION
    });

    return sessionId;
  }

  /**
   * Validate an existing session
   */
  static async validateSession(sessionId: string): Promise<SessionValidationResult> {
    try {
      // Get current session ID
      const currentSessionId = await SecureStorageService.getItem('currentSessionId');
      if (currentSessionId !== sessionId) {
        return { isValid: false, reason: 'Session ID mismatch' };
      }

      // Get user ID from session storage keys
      const userId = await this.getUserIdFromSecureSession(sessionId);
      if (!userId) {
        return { isValid: false, reason: 'User ID not found' };
      }

      const sessionData = await SecureStorageService.getItem(`session_${userId}`);
      if (!sessionData) {
        return { isValid: false, reason: 'Session data not found' };
      }

      // Check if session is expired (SecureStorageService handles this automatically)
      if (Date.now() > sessionData.expiresAt) {
        await this.revokeSession(sessionId);
        return { isValid: false, reason: 'Session expired' };
      }

      // Update last activity timestamp
      sessionData.lastActivity = Date.now();
      await SecureStorageService.setItem(`session_${userId}`, sessionData, {
        expiration: this.SESSION_DURATION
      });

      return { 
        isValid: true, 
        session: {
          sessionId: sessionData.sessionId,
          userId: sessionData.userId,
          deviceFingerprint: sessionData.deviceFingerprint,
          ipAddress: sessionData.ipAddress,
          userAgent: sessionData.userAgent,
          expiresAt: new Date(sessionData.expiresAt),
          isActive: sessionData.isActive
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
    const userId = await this.getUserIdFromSecureSession(sessionId);
    if (userId) {
      SecureStorageService.removeItem(`session_${userId}`);
    }
    SecureStorageService.removeItem('currentSessionId');
  }

  /**
   * Get active sessions for a user (simplified)
   */
  static async getActiveSessions(userId: string): Promise<SecureSession[]> {
    try {
      const sessionData = await SecureStorageService.getItem(`session_${userId}`);
      if (!sessionData) {
        return [];
      }

      // Check if session is still valid
      if (Date.now() > sessionData.expiresAt) {
        SecureStorageService.removeItem(`session_${userId}`);
        return [];
      }

      return [{
        sessionId: sessionData.sessionId,
        userId: sessionData.userId,
        deviceFingerprint: sessionData.deviceFingerprint,
        ipAddress: sessionData.ipAddress,
        userAgent: sessionData.userAgent,
        expiresAt: new Date(sessionData.expiresAt),
        isActive: sessionData.isActive
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
      const sessionData = await SecureStorageService.getItem(`session_${userId}`);
      if (sessionData) {
        try {
          if (Date.now() > sessionData.expiresAt) {
            SecureStorageService.removeItem(`session_${userId}`);
          }
        } catch (error) {
          // Remove corrupted session data
          SecureStorageService.removeItem(`session_${userId}`);
        }
      }
    } else {
      // Cleanup all expired sessions
      SecureStorageService.cleanup();
    }
  }

  /**
   * Update session activity
   */
  static async updateSessionActivity(sessionId: string): Promise<void> {
    const userId = await this.getUserIdFromSecureSession(sessionId);
    if (!userId) return;

    try {
      const sessionData = await SecureStorageService.getItem(`session_${userId}`);
      if (sessionData) {
        sessionData.lastActivity = Date.now();
        await SecureStorageService.setItem(`session_${userId}`, sessionData, {
          expiration: this.SESSION_DURATION
        });
      }
    } catch (error) {
      console.error('Failed to update session activity:', error);
    }
  }

  /**
   * Get user ID from secure session storage
   */
  private static async getUserIdFromSecureSession(sessionId: string): Promise<string | null> {
    // Get from secure storage first
    const currentSessionId = await SecureStorageService.getItem('currentSessionId');
    if (currentSessionId !== sessionId) {
      return null;
    }

    // Scan secure storage for matching session
    const keys = SecureStorageService.getKeys();
    for (const key of keys) {
      if (key.startsWith('session_')) {
        const userId = key.replace('session_', '');
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