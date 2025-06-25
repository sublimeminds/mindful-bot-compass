
interface AuditEvent {
  id: string;
  event: string;
  system: string;
  userId?: string;
  metadata?: any;
  timestamp: Date;
}

export class ComplianceFramework {
  private static instance: ComplianceFramework;
  private auditLog: AuditEvent[] = [];

  static getInstance(): ComplianceFramework {
    if (!ComplianceFramework.instance) {
      ComplianceFramework.instance = new ComplianceFramework();
    }
    return ComplianceFramework.instance;
  }

  async logAuditEvent(
    event: string,
    system: string,
    userId?: string,
    metadata?: any
  ): Promise<void> {
    try {
      const auditEvent: AuditEvent = {
        id: crypto.randomUUID(),
        event,
        system,
        userId,
        metadata,
        timestamp: new Date()
      };

      this.auditLog.push(auditEvent);
      console.log(`Audit event logged: ${event} for system: ${system}`);
      
      // Store in localStorage for persistence
      localStorage.setItem('compliance_audit_log', JSON.stringify(this.auditLog));
    } catch (error) {
      console.error('Failed to log audit event:', error);
    }
  }

  getAuditLog(): AuditEvent[] {
    return [...this.auditLog];
  }

  async initialize(): Promise<void> {
    try {
      // Load existing audit log from localStorage
      const storedLog = localStorage.getItem('compliance_audit_log');
      if (storedLog) {
        this.auditLog = JSON.parse(storedLog);
      }
      console.log('Compliance framework initialized');
    } catch (error) {
      console.error('Failed to initialize compliance framework:', error);
    }
  }
}

export const complianceFramework = ComplianceFramework.getInstance();
