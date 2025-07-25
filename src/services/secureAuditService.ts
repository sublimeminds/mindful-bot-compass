import { SecureStorageService } from './secureStorageService';
import { SecurityMonitoringService } from './securityMonitoringService';

interface AuditEvent {
  eventType: 'data_access' | 'data_modification' | 'auth_event' | 'security_event';
  userId?: string;
  description: string;
  metadata?: any;
  timestamp: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface StorageClassification {
  level: 'public' | 'sensitive' | 'confidential' | 'restricted';
  encryption: boolean;
  location: 'memory' | 'session' | 'secure_session' | 'encrypted_storage';
}

export class SecureAuditService {
  private static readonly AUDIT_STORAGE_KEY = 'security_audit_log';
  private static readonly MAX_AUDIT_ENTRIES = 1000;

  /**
   * Log a security audit event
   */
  static async logAuditEvent(event: Omit<AuditEvent, 'timestamp'>): Promise<void> {
    try {
      const auditEvent: AuditEvent = {
        ...event,
        timestamp: Date.now()
      };

      // Store in secure session storage
      const existingLogs = await SecureStorageService.getItem(this.AUDIT_STORAGE_KEY) || [];
      const updatedLogs = [auditEvent, ...existingLogs].slice(0, this.MAX_AUDIT_ENTRIES);

      await SecureStorageService.setItem(this.AUDIT_STORAGE_KEY, updatedLogs, {
        encrypt: true,
        expiration: 24 * 60 * 60 * 1000 // 24 hours
      });

      // Report critical events to monitoring service
      if (event.severity === 'critical') {
        try {
          await SecurityMonitoringService.logSecurityEvent({
            eventType: 'suspicious_activity',
            userId: event.userId,
            metadata: {
              ...event,
              userAgent: navigator.userAgent
            },
            severity: 'critical'
          });
        } catch (error) {
          console.error('Failed to report to security monitoring:', error);
        }
      }
    } catch (error) {
      console.error('Failed to log audit event:', error);
    }
  }

  /**
   * Get audit logs for a user
   */
  static async getAuditLogs(userId?: string): Promise<AuditEvent[]> {
    try {
      const logs = await SecureStorageService.getItem(this.AUDIT_STORAGE_KEY) || [];
      if (userId) {
        return logs.filter((log: AuditEvent) => log.userId === userId);
      }
      return logs;
    } catch (error) {
      console.error('Failed to get audit logs:', error);
      return [];
    }
  }

  /**
   * Classify data storage requirements
   */
  static classifyDataStorage(dataType: string, content?: any): StorageClassification {
    const sensitivePatterns = [
      'password', 'token', 'key', 'secret', 'credential',
      'ssn', 'credit', 'bank', 'medical', 'health',
      'therapy', 'session', 'note', 'diagnosis'
    ];

    const restrictedPatterns = [
      'admin', 'root', 'system', 'database',
      'encryption', 'hash', 'salt', 'pepper'
    ];

    const dataTypeLower = dataType.toLowerCase();
    const contentStr = JSON.stringify(content || '').toLowerCase();

    // Check for restricted data
    if (restrictedPatterns.some(pattern => 
      dataTypeLower.includes(pattern) || contentStr.includes(pattern)
    )) {
      return {
        level: 'restricted',
        encryption: true,
        location: 'encrypted_storage'
      };
    }

    // Check for sensitive data
    if (sensitivePatterns.some(pattern => 
      dataTypeLower.includes(pattern) || contentStr.includes(pattern)
    )) {
      return {
        level: 'sensitive',
        encryption: true,
        location: 'secure_session'
      };
    }

    // Check for confidential data (personal info)
    if (dataTypeLower.includes('user') || dataTypeLower.includes('profile') || 
        dataTypeLower.includes('personal')) {
      return {
        level: 'confidential',
        encryption: true,
        location: 'session'
      };
    }

    // Public data
    return {
      level: 'public',
      encryption: false,
      location: 'memory'
    };
  }

  /**
   * Migrate localStorage data to secure storage
   */
  static async migrateLocalStorageData(): Promise<void> {
    try {
      const localStorageKeys = Object.keys(localStorage);
      const migratedKeys: string[] = [];

      for (const key of localStorageKeys) {
        try {
          const value = localStorage.getItem(key);
          if (!value) continue;

          const classification = this.classifyDataStorage(key, value);
          
          // Only migrate sensitive or confidential data
          if (classification.level === 'sensitive' || classification.level === 'confidential') {
            await SecureStorageService.setItem(`migrated_${key}`, value, {
              encrypt: classification.encryption,
              expiration: 24 * 60 * 60 * 1000 // 24 hours default
            });

            // Remove from localStorage
            localStorage.removeItem(key);
            migratedKeys.push(key);

            await this.logAuditEvent({
              eventType: 'data_modification',
              description: `Migrated localStorage key: ${key}`,
              metadata: { key, classification },
              severity: 'medium'
            });
          }
        } catch (error) {
          console.error(`Failed to migrate localStorage key ${key}:`, error);
        }
      }

      if (migratedKeys.length > 0) {
        console.log(`Migrated ${migratedKeys.length} localStorage keys to secure storage`);
      }
    } catch (error) {
      console.error('localStorage migration failed:', error);
    }
  }

  /**
   * Audit current storage usage
   */
  static auditStorageUsage(): void {
    try {
      const localStorageUsage = Object.keys(localStorage).map(key => ({
        key,
        classification: this.classifyDataStorage(key, localStorage.getItem(key)),
        size: localStorage.getItem(key)?.length || 0
      }));

      const sensitiveInLocalStorage = localStorageUsage.filter(
        item => item.classification.level !== 'public'
      );

      if (sensitiveInLocalStorage.length > 0) {
        console.warn('⚠️ Sensitive data found in localStorage:', sensitiveInLocalStorage);
        
        this.logAuditEvent({
          eventType: 'security_event',
          description: 'Sensitive data detected in localStorage',
          metadata: { sensitiveKeys: sensitiveInLocalStorage.map(item => item.key) },
          severity: 'high'
        });
      }

      console.log('Storage audit completed:', {
        totalKeys: localStorageUsage.length,
        sensitiveKeys: sensitiveInLocalStorage.length,
        totalSize: localStorageUsage.reduce((sum, item) => sum + item.size, 0)
      });
    } catch (error) {
      console.error('Storage audit failed:', error);
    }
  }

  /**
   * Clear audit logs
   */
  static async clearAuditLogs(): Promise<void> {
    try {
      SecureStorageService.removeItem(this.AUDIT_STORAGE_KEY);
      await this.logAuditEvent({
        eventType: 'data_modification',
        description: 'Audit logs cleared',
        severity: 'medium'
      });
    } catch (error) {
      console.error('Failed to clear audit logs:', error);
    }
  }
}