import { supabase } from '@/integrations/supabase/client';

export interface SecurityEvent {
  id: string;
  user_id?: string;
  event_type: 'login' | 'logout' | 'failed_login' | 'password_change' | 'data_access' | 'suspicious_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  ip_address?: string;
  user_agent?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

export interface TwoFactorSetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface AuditLogEntry {
  id: string;
  user_id: string;
  action: string;
  resource: string;
  resource_id?: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  timestamp: Date;
}

class EnterpriseSecurityService {
  private securityEvents: SecurityEvent[] = [];
  private auditLog: AuditLogEntry[] = [];
  private suspiciousActivityThresholds = {
    failedLogins: 5,
    timeWindow: 900000, // 15 minutes
    unusualLocations: 3,
    rapidDataAccess: 100 // requests per minute
  };

  // Security Event Logging
  async logSecurityEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): Promise<void> {
    const securityEvent: SecurityEvent = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      ...event
    };

    // Store locally
    this.securityEvents.push(securityEvent);
    
    // Keep only last 1000 events locally
    if (this.securityEvents.length > 1000) {
      this.securityEvents = this.securityEvents.slice(-1000);
    }

    // Send to backend for persistence
    try {
      await supabase.from('security_events').insert({
        user_id: event.user_id,
        event_type: event.event_type,
        severity: event.severity,
        description: event.description,
        ip_address: event.ip_address,
        user_agent: event.user_agent,
        metadata: event.metadata,
        created_at: securityEvent.timestamp.toISOString()
      });
    } catch (error) {
      console.warn('Failed to log security event to backend:', error);
    }

    // Check for suspicious patterns
    this.analyzeSuspiciousActivity(securityEvent);
  }

  // Audit Logging
  async logAuditEvent(event: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<void> {
    const auditEvent: AuditLogEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      ...event
    };

    this.auditLog.push(auditEvent);
    
    if (this.auditLog.length > 1000) {
      this.auditLog = this.auditLog.slice(-1000);
    }

    try {
      await supabase.from('audit_logs').insert({
        user_id: event.user_id,
        action: event.action,
        resource: event.resource,
        resource_id: event.resource_id,
        old_values: event.old_values,
        new_values: event.new_values,
        ip_address: event.ip_address,
        user_agent: event.user_agent,
        created_at: auditEvent.timestamp.toISOString()
      });
    } catch (error) {
      console.warn('Failed to log audit event to backend:', error);
    }
  }

  // Two-Factor Authentication
  async generateTwoFactorSecret(userId: string): Promise<TwoFactorSetup> {
    // In a real implementation, this would use a proper TOTP library
    const secret = this.generateRandomSecret();
    const appName = 'TherapySync';
    const qrCode = `otpauth://totp/${appName}:${userId}?secret=${secret}&issuer=${appName}`;
    
    const backupCodes = Array.from({ length: 10 }, () => 
      this.generateRandomCode(8)
    );

    return {
      secret,
      qrCode,
      backupCodes
    };
  }

  async verifyTwoFactorCode(secret: string, code: string): Promise<boolean> {
    // Simplified verification - in production use proper TOTP library
    const timeStep = Math.floor(Date.now() / 30000);
    const validCodes = [
      this.generateTOTP(secret, timeStep),
      this.generateTOTP(secret, timeStep - 1), // Allow previous window
      this.generateTOTP(secret, timeStep + 1)  // Allow next window
    ];

    return validCodes.includes(code);
  }

  // Session Management
  async trackSession(userId: string, sessionToken: string): Promise<void> {
    const sessionData = {
      user_id: userId,
      session_token: sessionToken,
      ip_address: await this.getClientIP(),
      user_agent: navigator.userAgent,
      created_at: new Date().toISOString(),
      last_activity: new Date().toISOString()
    };

    try {
      await supabase.from('user_sessions').insert(sessionData);
    } catch (error) {
      console.warn('Failed to track session:', error);
    }
  }

  async updateSessionActivity(sessionToken: string): Promise<void> {
    try {
      await supabase
        .from('user_sessions')
        .update({ last_activity: new Date().toISOString() })
        .eq('session_token', sessionToken);
    } catch (error) {
      console.warn('Failed to update session activity:', error);
    }
  }

  async terminateSession(sessionToken: string): Promise<void> {
    try {
      await supabase
        .from('user_sessions')
        .update({ terminated_at: new Date().toISOString() })
        .eq('session_token', sessionToken);
    } catch (error) {
      console.warn('Failed to terminate session:', error);
    }
  }

  // Suspicious Activity Detection
  private analyzeSuspiciousActivity(event: SecurityEvent): void {
    if (event.event_type === 'failed_login') {
      this.checkFailedLoginPattern(event);
    }
    
    if (event.event_type === 'data_access') {
      this.checkRapidDataAccess(event);
    }

    this.checkUnusualLocation(event);
  }

  private checkFailedLoginPattern(event: SecurityEvent): void {
    const recentFailures = this.securityEvents.filter(e => 
      e.event_type === 'failed_login' &&
      e.user_id === event.user_id &&
      Date.now() - e.timestamp.getTime() < this.suspiciousActivityThresholds.timeWindow
    );

    if (recentFailures.length >= this.suspiciousActivityThresholds.failedLogins) {
      this.logSecurityEvent({
        user_id: event.user_id,
        event_type: 'suspicious_activity',
        severity: 'high',
        description: `Multiple failed login attempts detected (${recentFailures.length} in 15 minutes)`,
        ip_address: event.ip_address,
        user_agent: event.user_agent,
        metadata: { failed_attempts: recentFailures.length }
      });
    }
  }

  private checkRapidDataAccess(event: SecurityEvent): void {
    const oneMinuteAgo = Date.now() - 60000;
    const recentAccess = this.securityEvents.filter(e =>
      e.event_type === 'data_access' &&
      e.user_id === event.user_id &&
      e.timestamp.getTime() > oneMinuteAgo
    );

    if (recentAccess.length > this.suspiciousActivityThresholds.rapidDataAccess) {
      this.logSecurityEvent({
        user_id: event.user_id,
        event_type: 'suspicious_activity',
        severity: 'medium',
        description: `Rapid data access detected (${recentAccess.length} requests in 1 minute)`,
        ip_address: event.ip_address,
        metadata: { access_count: recentAccess.length }
      });
    }
  }

  private checkUnusualLocation(event: SecurityEvent): void {
    if (!event.ip_address) return;

    const recentIPs = new Set(
      this.securityEvents
        .filter(e => 
          e.user_id === event.user_id &&
          e.ip_address &&
          Date.now() - e.timestamp.getTime() < 86400000 // 24 hours
        )
        .map(e => e.ip_address)
    );

    if (recentIPs.size > this.suspiciousActivityThresholds.unusualLocations) {
      this.logSecurityEvent({
        user_id: event.user_id,
        event_type: 'suspicious_activity',
        severity: 'medium',
        description: `Access from multiple locations detected (${recentIPs.size} different IPs in 24 hours)`,
        ip_address: event.ip_address,
        metadata: { unique_ips: Array.from(recentIPs) }
      });
    }
  }

  // Data Protection
  async encryptSensitiveData(data: string, key?: string): Promise<string> {
    // Simplified encryption - use proper encryption library in production
    const encoder = new TextEncoder();
    const dataArray = encoder.encode(data);
    const keyMaterial = key || await this.getEncryptionKey();
    
    // This is a placeholder - implement real encryption
    return btoa(String.fromCharCode(...dataArray));
  }

  async decryptSensitiveData(encryptedData: string, key?: string): Promise<string> {
    // Simplified decryption - use proper encryption library in production
    try {
      const decoded = atob(encryptedData);
      return decoded;
    } catch (error) {
      throw new Error('Failed to decrypt data');
    }
  }

  // Compliance Reporting
  async generateComplianceReport(startDate: Date, endDate: Date) {
    const events = this.securityEvents.filter(e =>
      e.timestamp >= startDate && e.timestamp <= endDate
    );

    const audit = this.auditLog.filter(a =>
      a.timestamp >= startDate && a.timestamp <= endDate
    );

    return {
      period: { start: startDate, end: endDate },
      security_events: {
        total: events.length,
        by_severity: this.groupBy(events, 'severity'),
        by_type: this.groupBy(events, 'event_type')
      },
      audit_events: {
        total: audit.length,
        by_action: this.groupBy(audit, 'action'),
        by_resource: this.groupBy(audit, 'resource')
      },
      compliance_metrics: {
        data_access_requests: audit.filter(a => a.action === 'data_access').length,
        user_consent_changes: audit.filter(a => a.action === 'consent_update').length,
        data_deletions: audit.filter(a => a.action === 'data_deletion').length
      }
    };
  }

  // Utility Methods
  private generateRandomSecret(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 32; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return secret;
  }

  private generateRandomCode(length: number): string {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  private generateTOTP(secret: string, timeStep: number): string {
    // Simplified TOTP - use proper library in production
    const hash = this.simpleHash(secret + timeStep.toString());
    return (hash % 1000000).toString().padStart(6, '0');
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private async getClientIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  }

  private async getEncryptionKey(): Promise<string> {
    // In production, this would retrieve from secure key management
    return 'your-encryption-key';
  }

  private groupBy(array: any[], key: string): Record<string, number> {
    return array.reduce((groups, item) => {
      const group = item[key] || 'unknown';
      groups[group] = (groups[group] || 0) + 1;
      return groups;
    }, {});
  }

  // Public getters for monitoring
  getSecurityEvents(): SecurityEvent[] {
    return [...this.securityEvents];
  }

  getAuditLog(): AuditLogEntry[] {
    return [...this.auditLog];
  }
}

export const enterpriseSecurityService = new EnterpriseSecurityService();
