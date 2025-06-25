
import { useState, useEffect, useCallback } from 'react';
import { securityMiddleware } from '@/services/securityMiddleware';

interface SecurityAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

interface SecurityMetrics {
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  activeThreats: number;
  blockedAttempts: number;
  systemHealth: number;
}

export const useSecurityMonitoring = () => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    threatLevel: 'low',
    activeThreats: 0,
    blockedAttempts: 0,
    systemHealth: 100
  });
  const [isMonitoring, setIsMonitoring] = useState(false);

  const checkSecurityStatus = useCallback(async () => {
    try {
      const securityData = securityMiddleware.getSecurityMetrics();
      
      // Calculate threat level
      let threatLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
      if (securityData.criticalEvents > 0) {
        threatLevel = 'critical';
      } else if (securityData.rateLimitViolations > 10) {
        threatLevel = 'high';
      } else if (securityData.suspiciousIPs > 5) {
        threatLevel = 'medium';
      }

      // Calculate system health (simplified)
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
        systemHealth: Math.max(baseHealth - healthReduction, 10)
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

    } catch (error) {
      console.error('Security monitoring error:', error);
    }
  }, []);

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, acknowledged: true }
          : alert
      )
    );
  }, []);

  const clearAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
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
    const handleSecurityEvent = (event: CustomEvent) => {
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
