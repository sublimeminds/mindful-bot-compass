import { useState, useEffect } from 'react';
import { serviceManager } from '@/services/serviceManager';

interface ServiceStatus {
  isReady: boolean;
  isLoading: boolean;
  error: string | null;
  services: {
    language: boolean;
    currency: boolean;
    seo: boolean;
    cache: boolean;
  };
}

export const useServiceManager = () => {
  const [status, setStatus] = useState<ServiceStatus>({
    isReady: false,
    isLoading: true,
    error: null,
    services: {
      language: false,
      currency: false,
      seo: false,
      cache: false
    }
  });

  useEffect(() => {
    let mounted = true;

    const initializeServices = async () => {
      try {
        setStatus(prev => ({ ...prev, isLoading: true, error: null }));
        
        await serviceManager.initialize();
        
        if (mounted) {
          const health = serviceManager.getHealthStatus();
          setStatus({
            isReady: health.overall,
            isLoading: false,
            error: null,
            services: {
              language: health.language,
              currency: health.currency,
              seo: health.seo,
              cache: health.cache
            }
          });
        }
      } catch (error) {
        if (mounted) {
          setStatus(prev => ({
            ...prev,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Service initialization failed'
          }));
        }
      }
    };

    initializeServices();

    return () => {
      mounted = false;
    };
  }, []);

  const retry = async () => {
    setStatus(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      await serviceManager.initialize();
      const health = serviceManager.getHealthStatus();
      setStatus({
        isReady: health.overall,
        isLoading: false,
        error: null,
        services: {
          language: health.language,
          currency: health.currency,
          seo: health.seo,
          cache: health.cache
        }
      });
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Service initialization failed'
      }));
    }
  };

  return {
    ...status,
    retry
  };
};