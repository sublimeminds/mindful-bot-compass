
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
  threats: number;
  blocked: number;
  allowed: number;
  totalIncidents: number;
  criticalIncidents: number;
  resolvedIncidents: number;
  averageResolutionTime: number;
}

interface SecurityIncident {
  id: string;
  incident_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detected_at: string;
  detection_method: string;
  status: string;
  affected_users_count: number;
}

interface SecurityConfig {
  enabled: boolean;
  threshold: number;
}

export const useSecurityMonitoring = () => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [incidents, setIncidents] = useState<SecurityIncident[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    threatLevel: 'low',
    activeThreats: 0,
    systemHealth: 100,
    complianceScore: 95,
    threats: 0,
    blocked: 0,
    allowed: 0,
    totalIncidents: 0,
    criticalIncidents: 0,
    resolvedIncidents: 0,
    averageResolutionTime: 0
  });
  const [config, setConfig] = useState<SecurityConfig>({
    enabled: true,
    threshold: 10
  });
  const [isLoading, setIsLoading] = useState(false);
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

      const mockIncidents: SecurityIncident[] = [
        {
          id: '1',
          incident_type: 'authentication',
          severity: 'medium',
          description: 'Multiple failed login attempts detected',
          detected_at: new Date(Date.now() - 300000).toISOString(),
          detection_method: 'automated',
          status: 'investigating',
          affected_users_count: 1
        }
      ];

      const mockMetrics: SecurityMetrics = {
        threatLevel: Math.random() > 0.8 ? 'medium' : 'low',
        activeThreats: Math.floor(Math.random() * 3),
        systemHealth: Math.floor(Math.random() * 10) + 90,
        complianceScore: Math.floor(Math.random() * 5) + 95,
        threats: Math.floor(Math.random() * 50),
        blocked: Math.floor(Math.random() * 20),
        allowed: Math.floor(Math.random() * 100),
        totalIncidents: 12,
        criticalIncidents: 2,
        resolvedIncidents: 8,
        averageResolutionTime: 4.5
      };

      setAlerts(mockAlerts);
      setIncidents(mockIncidents);
      setMetrics(mockMetrics);
      setError(null);
    } catch (err) {
      console.error('Failed to generate mock security data:', err);
      setError('Failed to load security data');
    }
  }, []);

  useEffect(() => {
    if (config.enabled) {
      setIsLoading(true);
      setLoading(true);
      try {
        generateMockData();
      } catch (err) {
        console.error('Security monitoring initialization failed:', err);
        setError('Security monitoring initialization failed');
      } finally {
        setIsLoading(false);
        setLoading(false);
      }
    }
  }, [config.enabled, generateMockData]);

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
    setIsLoading(true);
    setLoading(true);
    try {
      generateMockData();
    } catch (err) {
      console.error('Failed to refresh security data:', err);
      setError('Failed to refresh data');
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  }, [generateMockData]);

  const updateConfig = useCallback((newConfig: Partial<SecurityConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  const fetchIncidents = useCallback(() => {
    refreshData();
  }, [refreshData]);

  const resolveIncident = useCallback((incidentId: string, resolution: string) => {
    setIncidents(prev => prev.map(incident => 
      incident.id === incidentId ? { ...incident, status: 'resolved' } : incident
    ));
  }, []);

  return {
    alerts,
    incidents,
    metrics,
    config,
    isLoading,
    loading,
    error,
    acknowledgeAlert,
    refreshData,
    updateConfig,
    fetchIncidents,
    resolveIncident
  };
};
