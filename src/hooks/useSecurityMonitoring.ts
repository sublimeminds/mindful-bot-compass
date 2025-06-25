
import { useState, useEffect } from 'react';

interface SecurityConfig {
  enabled: boolean;
  threshold: number;
}

interface SecurityMetrics {
  threats: number;
  blocked: number;
  allowed: number;
}

export const useSecurityMonitoring = () => {
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    threats: 0,
    blocked: 0,
    allowed: 0
  });

  const [config, setConfig] = useState<SecurityConfig>({
    enabled: true,
    threshold: 10
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMetrics = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setMetrics({
          threats: Math.floor(Math.random() * 50),
          blocked: Math.floor(Math.random() * 20),
          allowed: Math.floor(Math.random() * 100)
        });
      } catch (error) {
        console.error('Failed to fetch security metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (config.enabled) {
      fetchMetrics();
    }
  }, [config.enabled]);

  const updateConfig = (newConfig: Partial<SecurityConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  return {
    metrics,
    config,
    isLoading,
    updateConfig
  };
};
