
import { useState, useEffect } from 'react';
import { SystemHealthService, SystemMetrics, SystemAlert } from '@/services/systemHealthService';

export const useSystemHealth = (refreshInterval: number = 30000) => {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchSystemData = async () => {
    try {
      setError(null);
      const [metricsData, alertsData] = await Promise.all([
        SystemHealthService.getSystemMetrics(),
        SystemHealthService.getSystemAlerts()
      ]);
      
      setMetrics(metricsData);
      setAlerts(alertsData);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Error fetching system data:', err);
      setError('Failed to fetch system data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemData();
    
    if (refreshInterval > 0) {
      const interval = setInterval(fetchSystemData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval]);

  const refresh = () => {
    setLoading(true);
    fetchSystemData();
  };

  const createAlert = async (alert: Omit<SystemAlert, 'id' | 'timestamp'>) => {
    await SystemHealthService.createAlert(alert);
    fetchSystemData(); // Refresh to show new alert
  };

  const resolveAlert = async (alertId: string) => {
    await SystemHealthService.resolveAlert(alertId);
    fetchSystemData(); // Refresh to show resolved alert
  };

  const getOverallStatus = () => {
    if (!metrics) return 'unknown';
    return SystemHealthService.getHealthStatus(metrics);
  };

  return {
    metrics,
    alerts,
    loading,
    error,
    lastUpdate,
    refresh,
    createAlert,
    resolveAlert,
    overallStatus: getOverallStatus()
  };
};
