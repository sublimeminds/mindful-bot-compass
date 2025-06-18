
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

  static getRecentEvents(userId?: string): SecurityEvent[] {
    if (userId) {
      return this.events.filter(event => event.userId === userId);
    }
    return this.events;
  }
}
