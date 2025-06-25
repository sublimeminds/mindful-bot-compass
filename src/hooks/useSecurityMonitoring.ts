
import { useState, useEffect, useCallback } from 'react';
import { securityMiddleware } from '@/services/securityMiddleware';
import { complianceFramework } from '@/services/complianceFramework';

interface SecurityAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  complianceRelated?: boolean;
}

interface SecurityMetrics {
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  activeThreats: number;
  blockedAttempts: number;
  systemHealth: number;
  complianceScore: number;
  auditEventsToday: number;
}

export const useSecurityMonitoring = () => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    threatLevel: 'low',
    activeThreats: 0,
    blockedAttempts: 0,
    systemHealth: 100,
    complianceScore: 0,
    auditEventsToday: 0
  });
  const [isMonitoring, setIsMonitoring] = useState(false);

  const checkSecurityStatus = useCallback(async () => {
    try {
      const securityData = securityMiddleware.getSecurityMetrics();
      const complianceConfig = complianceFramework.getComplianceConfig();
      const auditLogs = complianceFramework.getAuditLogs();
      
      // Calculate compliance score
      let complianceScore = 0;
      if (complianceConfig.hipaa.enabled) complianceScore += 40;
      if (complianceConfig.gdpr.enabled) complianceScore += 40;
      if (complianceConfig.auditLogging.enabled) complianceScore += 20;
      
      // Count today's audit events
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const auditEventsToday = auditLogs.filter(log => 
        new Date(log.timestamp) >= todayStart
      ).length;
      
      // Calculate threat level
      let threatLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
      if (securityData.criticalEvents > 0) {
        threatLevel = 'critical';
      } else if (securityData.rateLimitViolations > 10) {
        threatLevel = 'high';
      } else if (securityData.suspiciousIPs > 5) {
        threatLevel = 'medium';
      }

      // Calculate system health
      const baseHealth = 100;
      const healthReduction = Math.min(
        securityData.criticalEvents * 20 + 
        securityData.rateLimitViolations * 2 + 
        securityData.suspiciousIPs * 5,
        90
      );

      setMetrics({
        threatLevel,
        activeThreats: securityData.criticalEvents,
        blockedAttempts: securityData.rateLimitViolations,
        systemHealth: Math.max(baseHealth - healthReduction, 10),
        complianceScore,
        auditEventsToday
      });

      // Generate alerts for critical events
      if (securityData.criticalEvents > 0) {
        const newAlert: SecurityAlert = {
          id: crypto.randomUUID(),
          type: 'critical',
          title: 'Critical Security Events Detected',
          message: `${securityData.criticalEvents} critical security events require immediate attention.`,
          timestamp: new Date(),
          acknowledged: false
        };

        setAlerts(prev => {
          const exists = prev.some(alert => 
            alert.title === newAlert.title && 
            Date.now() - alert.timestamp.getTime() < 60000 // Don't duplicate within 1 minute
          );
          return exists ? prev : [newAlert, ...prev.slice(0, 9)]; // Keep last 10 alerts
        });
      }

      // Generate compliance alerts
      if (complianceScore < 70) {
        const newAlert: SecurityAlert = {
          id: crypto.randomUUID(),
          type: 'warning',
          title: 'Compliance Score Below Threshold',
          message: `Current compliance score is ${complianceScore}%. Review compliance settings.`,
          timestamp: new Date(),
          acknowledged: false,
          complianceRelated: true
        };

        setAlerts(prev => {
          const exists = prev.some(alert => 
            alert.title === newAlert.title && 
            Date.now() - alert.timestamp.getTime() < 300000 // Don't duplicate within 5 minutes
          );
          return exists ? prev : [newAlert, ...prev.slice(0, 9)];
        });
      }

      // Generate alerts for high rate limiting
      if (securityData.rateLimitViolations > 20) {
        const newAlert: SecurityAlert = {
          id: crypto.randomUUID(),
          type: 'warning',
          title: 'High Rate Limiting Activity',
          message: `${securityData.rateLimitViolations} rate limit violations detected in the last 24 hours.`,
          timestamp: new Date(),
          acknowledged: false
        };

        setAlerts(prev => {
          const exists = prev.some(alert => 
            alert.title === newAlert.title && 
            Date.now() - alert.timestamp.getTime() < 300000 // Don't duplicate within 5 minutes
          );
          return exists ? prev : [newAlert, ...prev.slice(0, 9)];
        });
      }

      // Log security monitoring event
      await complianceFramework.logAuditEvent(
        'security_monitoring_check',
        'security_system',
        undefined,
        {
          threatLevel,
          activeThreats: securityData.criticalEvents,
          complianceScore,
          auditEventsToday
        }
      );

    } catch (error) {
      console.error('Security monitoring error:', error);
      
      // Log monitoring error
      await complianceFramework.logAuditEvent(
        'security_monitoring_error',
        'security_system',
        undefined,
        { error: error.message }
      );
    }
  }, []);

  const acknowledgeAlert = useCallback(async (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, acknowledged: true }
          : alert
      )
    );

    // Log alert acknowledgment
    await complianceFramework.logAuditEvent(
      'security_alert_acknowledged',
      'security_alert',
      undefined,
      { alertId }
    );
  }, []);

  const clearAlert = useCallback(async (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    
    // Log alert clearing
    await complianceFramework.logAuditEvent(
      'security_alert_cleared',
      'security_alert',
      undefined,
      { alertId }
    );
  }, []);

  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);
    checkSecurityStatus();
    
    const interval = setInterval(checkSecurityStatus, 30000); // Check every 30 seconds
    return () => {
      clearInterval(interval);
      setIsMonitoring(false);
    };
  }, [checkSecurityStatus]);

  useEffect(() => {
    const cleanup = startMonitoring();
    return cleanup;
  }, [startMonitoring]);

  // Real-time security event listener
  useEffect(() => {
    const handleSecurityEvent = async (event: CustomEvent) => {
      const securityEvent = event.detail;
      
      if (securityEvent.severity === 'critical') {
        const alert: SecurityAlert = {
          id: crypto.randomUUID(),
          type: 'critical',
          title: 'Real-time Security Alert',
          message: `${securityEvent.type.replace('_', ' ')} detected from ${securityEvent.ipAddress}`,
          timestamp: new Date(),
          acknowledged: false
        };
        
        setAlerts(prev => [alert, ...prev.slice(0, 9)]);
        
        // Log the real-time event
        await complianceFramework.logAuditEvent(
          'realtime_security_event',
          'security_system',
          undefined,
          {
            eventType: securityEvent.type,
            severity: securityEvent.severity,
            ipAddress: securityEvent.ipAddress
          }
        );
      }
    };

    window.addEventListener('securityEvent', handleSecurityEvent);
    return () => window.removeEventListener('securityEvent', handleSecurityEvent);
  }, []);

  return {
    alerts,
    metrics,
    isMonitoring,
    acknowledgeAlert,
    clearAlert,
    checkSecurityStatus
  };
};
