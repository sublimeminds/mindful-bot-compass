import { supabase } from '@/integrations/supabase/client';

interface SecurityEvent {
  eventType: 'failed_login' | 'suspicious_activity' | 'rate_limit_exceeded' | 'session_anomaly' | 'data_breach_attempt';
  userId?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  metadata?: any;
}

interface ThreatAnalysis {
  score: number;
  threats: string[];
  recommendations: string[];
  requiresImmedateAction: boolean;
}

export class SecurityMonitoringService {
  private static readonly THREAT_THRESHOLDS = {
    LOW: 0.3,
    MEDIUM: 0.5,
    HIGH: 0.7,
    CRITICAL: 0.9
  };

  /**
   * Log security events and analyze threats
   */
  static async logSecurityEvent(event: SecurityEvent): Promise<void> {
    try {
      const ipAddress = await this.getCurrentIP();
      const userAgent = navigator.userAgent;

      // Log to security monitor edge function
      const { error } = await supabase.functions.invoke('security-monitor', {
        body: {
          eventType: event.eventType,
          userId: event.userId,
          ipAddress,
          userAgent,
          severity: event.severity,
          metadata: {
            ...event.metadata,
            timestamp: new Date().toISOString(),
            sessionId: this.getSessionId()
          }
        }
      });

      if (error) {
        console.error('Failed to log security event:', error);
      }

      // Perform real-time threat analysis if needed
      if (event.severity === 'critical' || event.severity === 'high') {
        console.log(`High-priority security event: ${event.eventType}`);
      }
    } catch (error) {
      console.error('Security monitoring error:', error);
    }
  }

  /**
   * Analyze session for suspicious patterns
   */
  static async analyzeSessionSecurity(userId: string): Promise<ThreatAnalysis> {
    try {
      const threats: string[] = [];
      let score = 0;

      // Check for multiple simultaneous sessions
      const sessions = await this.getActiveSessions(userId);
      if (sessions.length > 3) {
        threats.push('Multiple simultaneous sessions detected');
        score += 0.4;
      }

      // Check for IP address changes
      const recentIPs = await this.getRecentIPAddresses(userId);
      if (recentIPs.length > 2) {
        threats.push('Multiple IP addresses in short timeframe');
        score += 0.3;
      }

      // Check for unusual activity patterns
      const activityScore = await this.analyzeActivityPatterns(userId);
      if (activityScore > 0.6) {
        threats.push('Unusual activity patterns detected');
        score += activityScore * 0.5;
      }

      const recommendations = this.generateRecommendations(threats, score);

      return {
        score: Math.min(score, 1),
        threats,
        recommendations,
        requiresImmedateAction: score > this.THREAT_THRESHOLDS.HIGH
      };
    } catch (error) {
      console.error('Session security analysis failed:', error);
      return {
        score: 0,
        threats: [],
        recommendations: [],
        requiresImmedateAction: false
      };
    }
  }

  /**
   * Monitor for account takeover attempts
   */
  static async detectAccountTakeover(userId: string): Promise<boolean> {
    try {
      const events = await this.getRecentSecurityEvents(userId);
      
      // Look for patterns indicating account takeover
      const failedLogins = events.filter(e => e.incident_type === 'failed_login').length;
      const deviceChanges = events.filter(e => e.incident_type === 'device_change').length;
      const locationChanges = events.filter(e => e.incident_type === 'location_change').length;

      // Score based on suspicious patterns
      const takeoverScore = (failedLogins * 0.2) + (deviceChanges * 0.4) + (locationChanges * 0.3);

      if (takeoverScore > 0.7) {
        await this.logSecurityEvent({
          eventType: 'suspicious_activity',
          userId,
          severity: 'critical',
          metadata: {
            reason: 'Potential account takeover detected',
            score: takeoverScore,
            failedLogins,
            deviceChanges,
            locationChanges
          }
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Account takeover detection failed:', error);
      return false;
    }
  }

  /**
   * Validate session integrity
   */
  static async validateSessionIntegrity(sessionId: string): Promise<boolean> {
    try {
      // Check session in secure storage
      const sessionData = await this.getSessionData(sessionId);
      if (!sessionData) return false;

      // Verify session hasn't been tampered with
      const expectedFingerprint = await this.generateSessionFingerprint();
      if (sessionData.deviceFingerprint !== expectedFingerprint) {
        await this.logSecurityEvent({
          eventType: 'session_anomaly',
          userId: sessionData.userId,
          severity: 'high',
          metadata: {
            reason: 'Session fingerprint mismatch',
            expected: expectedFingerprint,
            actual: sessionData.deviceFingerprint
          }
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Session integrity validation failed:', error);
      return false;
    }
  }

  // Private helper methods
  private static async getCurrentIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || 'unknown';
    } catch {
      return 'unknown';
    }
  }

  private static getSessionId(): string {
    return crypto.randomUUID();
  }

  private static async getActiveSessions(userId: string): Promise<any[]> {
    // In a real implementation, this would query the database
    return [];
  }

  private static async getRecentIPAddresses(userId: string): Promise<string[]> {
    // In a real implementation, this would query the database
    return [];
  }

  private static async analyzeActivityPatterns(userId: string): Promise<number> {
    // Placeholder for activity pattern analysis
    return 0;
  }

  private static async getRecentSecurityEvents(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('security_incidents')
        .select('*')
        .eq('metadata->>userId', userId)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get recent security events:', error);
      return [];
    }
  }

  private static async getSessionData(sessionId: string): Promise<any> {
    // Placeholder - would integrate with SecureSessionService
    return null;
  }

  private static async generateSessionFingerprint(): Promise<string> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx?.fillText('fingerprint', 10, 10);
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL()
    ].join('|');

    const encoder = new TextEncoder();
    const data = encoder.encode(fingerprint);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private static generateRecommendations(threats: string[], score: number): string[] {
    const recommendations: string[] = [];

    if (threats.includes('Multiple simultaneous sessions detected')) {
      recommendations.push('Consider terminating old sessions');
    }

    if (threats.includes('Multiple IP addresses in short timeframe')) {
      recommendations.push('Verify recent login locations');
    }

    if (score > this.THREAT_THRESHOLDS.HIGH) {
      recommendations.push('Enable additional security measures');
      recommendations.push('Consider requiring MFA verification');
    }

    if (score > this.THREAT_THRESHOLDS.CRITICAL) {
      recommendations.push('Immediately secure account');
      recommendations.push('Force password reset');
    }

    return recommendations;
  }
}