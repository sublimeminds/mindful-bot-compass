
import { useState, useEffect, useCallback } from 'react';

interface SecurityAlert {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

interface SecurityMetrics {
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  activeThreats: number;
  systemHealth: number;
  complianceScore: number;
}

export const useSecurityMonitoring = () => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    threatLevel: 'low',
    activeThreats: 0,
    systemHealth: 100,
    complianceScore: 95
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateMockData = useCallback(() => {
    try {
      const mockAlerts: SecurityAlert[] = [
        {
          id: '1',
          type: 'authentication',
          severity: 'medium',
          title: 'Multiple Failed Login Attempts',
          message: 'User attempted to login 5 times with incorrect credentials',
          timestamp: new Date(Date.now() - 300000),
          acknowledged: false
        },
        {
          id: '2',
          type: 'access',
          severity: 'low',
          title: 'Admin Panel Access',
          message: 'Administrator logged into admin panel',
          timestamp: new Date(Date.now() - 600000),
          acknowledged: true
        }
      ];

      const mockMetrics: SecurityMetrics = {
        threatLevel: Math.random() > 0.8 ? 'medium' : 'low',
        activeThreats: Math.floor(Math.random() * 3),
        systemHealth: Math.floor(Math.random() * 10) + 90,
        complianceScore: Math.floor(Math.random() * 5) + 95
      };

      setAlerts(mockAlerts);
      setMetrics(mockMetrics);
      setError(null);
    } catch (err) {
      console.error('Failed to generate mock security data:', err);
      setError('Failed to load security data');
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    try {
      generateMockData();
    } catch (err) {
      console.error('Security monitoring initialization failed:', err);
      setError('Security monitoring initialization failed');
    } finally {
      setLoading(false);
    }
  }, [generateMockData]);

  const acknowledgeAlert = useCallback((alertId: string) => {
    try {
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      ));
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
    }
  }, []);

  const refreshData = useCallback(() => {
    setLoading(true);
    try {
      generateMockData();
    } catch (err) {
      console.error('Failed to refresh security data:', err);
      setError('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  }, [generateMockData]);

  return {
    alerts,
    metrics,
    loading,
    error,
    acknowledgeAlert,
    refreshData
  };
};
