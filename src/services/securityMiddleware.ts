interface SecurityConfig {
  rateLimiting: {
    enabled: boolean;
    windowMs: number;
    maxRequests: number;
    skipSuccessfulRequests: boolean;
  };
  authentication: {
    sessionTimeout: number;
    maxConcurrentSessions: number;
    requireMFA: boolean;
  };
  encryption: {
    algorithm: string;
    keyRotationInterval: number;
  };
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
  lastRequest: number;
}

interface SecurityEvent {
  id: string;
  timestamp: Date;
  type: 'auth_failure' | 'rate_limit_exceeded' | 'suspicious_activity' | 'security_violation';
  userId?: string;
  ipAddress: string;
  userAgent: string;
  details: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export class SecurityMiddleware {
  private static instance: SecurityMiddleware;
  private rateLimitStore = new Map<string, RateLimitEntry>();
  private suspiciousIPs = new Set<string>();
  private securityEvents: SecurityEvent[] = [];
  private config: SecurityConfig;

  private constructor() {
    this.config = {
      rateLimiting: {
        enabled: true,
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 100,
        skipSuccessfulRequests: false
      },
      authentication: {
        sessionTimeout: 30 * 60 * 1000, // 30 minutes
        maxConcurrentSessions: 3,
        requireMFA: false
      },
      encryption: {
        algorithm: 'AES-256-GCM',
        keyRotationInterval: 30 * 24 * 60 * 60 * 1000 // 30 days
      }
    };
  }

  static getInstance(): SecurityMiddleware {
    if (!SecurityMiddleware.instance) {
      SecurityMiddleware.instance = new SecurityMiddleware();
    }
    return SecurityMiddleware.instance;
  }

  // Rate limiting with adaptive thresholds
  checkRateLimit(identifier: string, endpoint: string): boolean {
    const key = `${identifier}:${endpoint}`;
    const now = Date.now();
    const windowStart = now - this.config.rateLimiting.windowMs;

    const entry = this.rateLimitStore.get(key) || {
      count: 0,
      resetTime: now + this.config.rateLimiting.windowMs,
      lastRequest: now
    };

    // Reset if window has passed
    if (now >= entry.resetTime) {
      entry.count = 0;
      entry.resetTime = now + this.config.rateLimiting.windowMs;
    }

    // Check if IP is suspicious (increase restrictions)
    const maxRequests = this.suspiciousIPs.has(identifier) 
      ? Math.floor(this.config.rateLimiting.maxRequests * 0.3)
      : this.config.rateLimiting.maxRequests;

    if (entry.count >= maxRequests) {
      this.logSecurityEvent({
        id: crypto.randomUUID(),
        timestamp: new Date(),
        type: 'rate_limit_exceeded',
        ipAddress: identifier,
        userAgent: navigator.userAgent || 'Unknown',
        details: { endpoint, count: entry.count, limit: maxRequests },
        severity: 'medium'
      });
      
      // Mark as suspicious after multiple violations
      if (entry.count > maxRequests * 2) {
        this.suspiciousIPs.add(identifier);
      }
      
      return false;
    }

    entry.count++;
    entry.lastRequest = now;
    this.rateLimitStore.set(key, entry);
    return true;
  }

  // Input validation and sanitization
  validateAndSanitizeInput(input: any, type: 'email' | 'password' | 'text' | 'html'): { isValid: boolean; sanitized: string; errors: string[] } {
    const errors: string[] = [];
    let sanitized = String(input || '').trim();

    switch (type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(sanitized)) {
          errors.push('Invalid email format');
        }
        break;

      case 'password':
        if (sanitized.length < 8) {
          errors.push('Password must be at least 8 characters');
        }
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(sanitized)) {
          errors.push('Password must contain uppercase, lowercase, and numbers');
        }
        break;

      case 'text':
        // Remove potentially dangerous characters
        sanitized = sanitized.replace(/[<>'"&]/g, '');
        if (sanitized.length > 1000) {
          errors.push('Text too long');
        }
        break;

      case 'html':
        // Basic HTML sanitization (in production, use DOMPurify)
        sanitized = sanitized
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '');
        break;
    }

    return {
      isValid: errors.length === 0,
      sanitized,
      errors
    };
  }

  // XSS Protection
  sanitizeForXSS(input: string): string {
    const map: { [key: string]: string } = {
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;',
      '&': '&amp;'
    };
    
    return input.replace(/[<>"'/&]/g, (s) => map[s]);
  }

  // CSRF Token generation and validation
  generateCSRFToken(): string {
    const token = crypto.randomUUID() + Date.now().toString(36);
    sessionStorage.setItem('csrfToken', token);
    return token;
  }

  validateCSRFToken(token: string): boolean {
    const storedToken = sessionStorage.getItem('csrfToken');
    return storedToken === token;
  }

  // Security event logging
  logSecurityEvent(event: SecurityEvent): void {
    this.securityEvents.push(event);
    
    // Keep only last 1000 events
    if (this.securityEvents.length > 1000) {
      this.securityEvents = this.securityEvents.slice(-1000);
    }

    // Log critical events immediately
    if (event.severity === 'critical') {
      console.error('CRITICAL SECURITY EVENT:', event);
      this.notifyAdministrators(event);
    }

    // Store in localStorage for persistence
    try {
      localStorage.setItem('securityEvents', JSON.stringify(this.securityEvents.slice(-100)));
    } catch (error) {
      console.warn('Failed to store security events:', error);
    }
  }

  // Anomaly detection
  detectAnomalies(userId: string, activity: any): boolean {
    const userEvents = this.securityEvents.filter(e => e.userId === userId);
    const recentEvents = userEvents.filter(e => 
      Date.now() - e.timestamp.getTime() < 60 * 60 * 1000 // Last hour
    );

    // Check for suspicious patterns
    const failedLogins = recentEvents.filter(e => e.type === 'auth_failure').length;
    const rapidRequests = recentEvents.length > 50;
    const offHours = new Date().getHours() < 6 || new Date().getHours() > 22;

    if (failedLogins > 5 || (rapidRequests && offHours)) {
      this.logSecurityEvent({
        id: crypto.randomUUID(),
        timestamp: new Date(),
        type: 'suspicious_activity',
        userId,
        ipAddress: 'unknown',
        userAgent: navigator.userAgent || 'Unknown',
        details: { failedLogins, rapidRequests, offHours, activity },
        severity: 'high'
      });
      return true;
    }

    return false;
  }

  // Session security
  validateSession(sessionId: string, userId: string): boolean {
    const sessionKey = `session:${sessionId}`;
    const sessionData = localStorage.getItem(sessionKey);
    
    if (!sessionData) return false;

    try {
      const session = JSON.parse(sessionData);
      const now = Date.now();
      
      // Check if session has expired
      if (now > session.expiresAt) {
        localStorage.removeItem(sessionKey);
        return false;
      }

      // Check if session belongs to user
      if (session.userId !== userId) {
        this.logSecurityEvent({
          id: crypto.randomUUID(),
          timestamp: new Date(),
          type: 'security_violation',
          userId,
          ipAddress: 'unknown',
          userAgent: navigator.userAgent || 'Unknown',
          details: { reason: 'Session userId mismatch', sessionId },
          severity: 'critical'
        });
        return false;
      }

      // Update last activity
      session.lastActivity = now;
      localStorage.setItem(sessionKey, JSON.stringify(session));
      return true;
    } catch (error) {
      console.error('Session validation error:', error);
      return false;
    }
  }

  // Device fingerprinting for anomaly detection (secure version)
  generateDeviceFingerprint(): string {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('Device fingerprint', 2, 2);
      }

      const fingerprint = {
        userAgent: navigator.userAgent.substring(0, 500), // Limit length
        language: navigator.language,
        platform: navigator.platform,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        canvas: canvas.toDataURL().substring(0, 100), // Limit canvas data
        cookieEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack || 'unspecified'
      };

      // Create a more secure hash
      const fingerprintString = JSON.stringify(fingerprint);
      let hash = 0;
      for (let i = 0; i < fingerprintString.length; i++) {
        const char = fingerprintString.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      
      return Math.abs(hash).toString(36).substring(0, 16);
    } catch (error) {
      console.error('Fingerprint generation failed:', error);
      return 'fallback_' + Date.now().toString(36);
    }
  }

  // Get security metrics
  getSecurityMetrics(): {
    totalEvents: number;
    criticalEvents: number;
    suspiciousIPs: number;
    rateLimitViolations: number;
    lastUpdate: Date;
  } {
    const now = new Date();
    const last24h = this.securityEvents.filter(e => 
      now.getTime() - e.timestamp.getTime() < 24 * 60 * 60 * 1000
    );

    return {
      totalEvents: last24h.length,
      criticalEvents: last24h.filter(e => e.severity === 'critical').length,
      suspiciousIPs: this.suspiciousIPs.size,
      rateLimitViolations: last24h.filter(e => e.type === 'rate_limit_exceeded').length,
      lastUpdate: now
    };
  }

  private notifyAdministrators(event: SecurityEvent): void {
    // In production, this would send alerts to administrators
    console.warn('Administrator notification:', event);
  }

  // Cleanup old data periodically
  cleanup(): void {
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    // Clean rate limit store
    for (const [key, entry] of this.rateLimitStore.entries()) {
      if (entry.resetTime < now) {
        this.rateLimitStore.delete(key);
      }
    }

    // Clean old security events
    this.securityEvents = this.securityEvents.filter(e => 
      e.timestamp.getTime() > oneDayAgo
    );

    // Reset suspicious IPs after 24 hours of good behavior
    // (In production, this would be more sophisticated)
    if (Math.random() < 0.1) { // 10% chance on each cleanup
      this.suspiciousIPs.clear();
    }
  }
}

export const securityMiddleware = SecurityMiddleware.getInstance();

// Auto-cleanup every 5 minutes
setInterval(() => {
  securityMiddleware.cleanup();
}, 5 * 60 * 1000);
