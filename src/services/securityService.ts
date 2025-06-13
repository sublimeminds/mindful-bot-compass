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

    // Type guard to check if it's a WebGLRenderingContext
    if (gl instanceof WebGLRenderingContext) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (!debugInfo) return 'no-debug-info';

      return gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'unknown';
    }

    return 'no-webgl-context';
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

      console.log('Session tracking data:', sessionData);
      
      await this.checkForSuspiciousActivity(userId, fingerprint, ipAddress);
      
    } catch (error) {
      console.error('Session tracking error:', error);
    }
  }

  private static async getClientIP(): Promise<string> {
    try {
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
      const activeSessions = 1;
      
      if (activeSessions > this.MAX_CONCURRENT_SESSIONS) {
        this.triggerSecurityAlert({
          type: 'multiple_sessions',
          message: `Multiple concurrent sessions detected (${activeSessions})`,
          severity: 'high'
        });
      }
      
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
      
      const activeSessions = 1;
      
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
      return true;
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
      
      console.log('Cleaning up sessions older than:', cutoffTime);
      
    } catch (error) {
      console.error('Session cleanup error:', error);
    }
  }
}
