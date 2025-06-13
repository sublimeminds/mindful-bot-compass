
import { supabase } from '@/integrations/supabase/client';
import { ToastService } from './toastService';

interface SessionInfo {
  id: string;
  userId: string;
  deviceFingerprint: string;
  ipAddress: string;
  userAgent: string;
  location?: string;
  lastActivity: Date;
  isActive: boolean;
}

interface SecurityAlert {
  type: 'suspicious_login' | 'multiple_sessions' | 'unusual_activity';
  message: string;
  severity: 'low' | 'medium' | 'high';
}

export class SecurityService {
  private static readonly MAX_CONCURRENT_SESSIONS = 3;
  private static readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

  static generateDeviceFingerprint(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Device fingerprint', 2, 2);
    }

    const fingerprint = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      canvas: canvas.toDataURL(),
      webgl: this.getWebGLFingerprint(),
    };

    return btoa(JSON.stringify(fingerprint)).substring(0, 32);
  }

  private static getWebGLFingerprint(): string {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return 'no-webgl';

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) return 'no-debug-info';

    return gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'unknown';
  }

  static async trackSession(userId: string): Promise<void> {
    try {
      const fingerprint = this.generateDeviceFingerprint();
      const ipAddress = await this.getClientIP();

      const sessionData = {
        user_id: userId,
        device_fingerprint: fingerprint,
        ip_address: ipAddress,
        user_agent: navigator.userAgent,
        last_activity: new Date().toISOString(),
        is_active: true
      };

      // Store session in user_sessions table (would need to be created)
      console.log('Session tracking data:', sessionData);
      
      // Check for suspicious activity
      await this.checkForSuspiciousActivity(userId, fingerprint, ipAddress);
      
    } catch (error) {
      console.error('Session tracking error:', error);
    }
  }

  private static async getClientIP(): Promise<string> {
    try {
      // In a real implementation, you'd use a service to get the client IP
      // For now, we'll use a placeholder
      return 'unknown';
    } catch (error) {
      return 'unknown';
    }
  }

  private static async checkForSuspiciousActivity(
    userId: string, 
    fingerprint: string, 
    ipAddress: string
  ): Promise<void> {
    try {
      // Check for multiple concurrent sessions
      // This would query the user_sessions table to count active sessions
      
      // For now, we'll simulate the check
      const activeSessions = 1; // Would be queried from database
      
      if (activeSessions > this.MAX_CONCURRENT_SESSIONS) {
        this.triggerSecurityAlert({
          type: 'multiple_sessions',
          message: `Multiple concurrent sessions detected (${activeSessions})`,
          severity: 'high'
        });
      }

      // Check for rapid location changes (would need geolocation data)
      // Check for unusual login patterns
      // etc.
      
    } catch (error) {
      console.error('Security check error:', error);
    }
  }

  private static triggerSecurityAlert(alert: SecurityAlert): void {
    console.warn('Security Alert:', alert);
    
    if (alert.severity === 'high') {
      ToastService.custom({
        title: "Security Alert",
        description: alert.message,
        variant: "destructive",
        duration: 10000
      });
    }
  }

  static async revokeSession(sessionId: string): Promise<void> {
    try {
      // Would update the user_sessions table to set is_active = false
      console.log('Revoking session:', sessionId);
      
      ToastService.genericSuccess(
        'Session Revoked',
        'The session has been successfully revoked.'
      );
    } catch (error) {
      console.error('Session revocation error:', error);
    }
  }

  static async enforceSessionLimits(userId: string, planType: string): Promise<boolean> {
    try {
      const limits = this.getSessionLimitsForPlan(planType);
      
      // Would query active sessions from database
      const activeSessions = 1; // Placeholder
      
      if (activeSessions >= limits.maxSessions) {
        ToastService.custom({
          title: "Session Limit Reached",
          description: `Your ${planType} plan allows up to ${limits.maxSessions} concurrent sessions.`,
          variant: "destructive",
          duration: 8000
        });
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Session limit enforcement error:', error);
      return true; // Allow by default on error
    }
  }

  private static getSessionLimitsForPlan(planType: string) {
    const limits = {
      'Free': { maxSessions: 1 },
      'Basic': { maxSessions: 2 },
      'Premium': { maxSessions: 3 }
    };

    return limits[planType as keyof typeof limits] || limits.Free;
  }

  static async cleanupExpiredSessions(): Promise<void> {
    try {
      const cutoffTime = new Date(Date.now() - this.SESSION_TIMEOUT);
      
      // Would update expired sessions in database
      console.log('Cleaning up sessions older than:', cutoffTime);
      
    } catch (error) {
      console.error('Session cleanup error:', error);
    }
  }
}
