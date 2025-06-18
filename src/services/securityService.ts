
interface SecurityEvent {
  userId: string;
  event: string;
  timestamp: Date;
  metadata?: any;
}

export class SecurityService {
  private static events: SecurityEvent[] = [];

  static async trackSession(userId: string): Promise<void> {
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
      console.error('Error tracking security event:', error);
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
      console.error('Error tracking auth event:', error);
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
      console.error('Error revoking session:', error);
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
      console.error('Error cleaning up expired sessions:', error);
    }
  }

  static getRecentEvents(userId?: string): SecurityEvent[] {
    if (userId) {
      return this.events.filter(event => event.userId === userId);
    }
    return this.events;
  }
}
