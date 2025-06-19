
interface SecurityEvent {
  userId: string;
  event: string;
  timestamp: Date;
  metadata?: any;
}

export class SecurityService {
  private static events: SecurityEvent[] = [];
  private static isInitialized = false;

  static async trackSession(userId: string): Promise<void> {
    // Non-blocking initialization
    if (!this.isInitialized) {
      this.isInitialized = true;
      console.log('SecurityService: Initialized');
    }

    try {
      const event: SecurityEvent = {
        userId,
        event: 'session_started',
        timestamp: new Date(),
        metadata: {
          userAgent: navigator.userAgent,
          timestamp: Date.now()
        }
      };

      this.events.push(event);
      
      // In a real app, you'd send this to your backend
      console.log('Security event tracked:', event);
    } catch (error) {
      // Don't throw errors - just log them to prevent blocking auth flow
      console.warn('SecurityService: Error tracking security event (non-critical):', error);
    }
  }

  static async trackAuthEvent(userId: string, event: string, metadata?: any): Promise<void> {
    try {
      const securityEvent: SecurityEvent = {
        userId,
        event,
        timestamp: new Date(),
        metadata
      };

      this.events.push(securityEvent);
      console.log('Auth event tracked:', securityEvent);
    } catch (error) {
      console.warn('SecurityService: Error tracking auth event (non-critical):', error);
    }
  }

  static async revokeSession(sessionId: string): Promise<void> {
    try {
      // In a real app, you'd revoke the session on the backend
      console.log('Session revoked:', sessionId);
      
      // Track the security event
      const event: SecurityEvent = {
        userId: 'system',
        event: 'session_revoked',
        timestamp: new Date(),
        metadata: { sessionId }
      };
      
      this.events.push(event);
    } catch (error) {
      console.warn('SecurityService: Error revoking session (non-critical):', error);
    }
  }

  static async cleanupExpiredSessions(): Promise<void> {
    try {
      // In a real app, you'd cleanup expired sessions on the backend
      const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
      
      // Filter out old events as a simple cleanup
      this.events = this.events.filter(event => event.timestamp > cutoffTime);
      
      console.log('Expired sessions cleaned up');
      
      // Track the cleanup event
      const event: SecurityEvent = {
        userId: 'system',
        event: 'sessions_cleanup',
        timestamp: new Date(),
        metadata: { cutoffTime }
      };
      
      this.events.push(event);
    } catch (error) {
      console.warn('SecurityService: Error cleaning up expired sessions (non-critical):', error);
    }
  }

  static getRecentEvents(userId?: string): SecurityEvent[] {
    try {
      if (userId) {
        return this.events.filter(event => event.userId === userId);
      }
      return this.events;
    } catch (error) {
      console.warn('SecurityService: Error getting recent events:', error);
      return [];
    }
  }
}
