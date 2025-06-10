
import { useState, useEffect, useCallback } from 'react';
import { performanceOptimizer } from '@/utils/performanceOptimizer';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  cls: number; // Cumulative Layout Shift
  fid: number; // First Input Delay
}

export const usePerformanceMetrics = (collectInterval: number = 5000) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isCollecting, setIsCollecting] = useState(false);

  const collectMetrics = useCallback(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paintEntries = performance.getEntriesByType('paint');
    const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
    
    // Get memory usage
    const memoryInfo = performanceOptimizer.getMemoryUsage();
    const memoryUsage = memoryInfo ? memoryInfo.percentage : 0;

    // Calculate metrics
    const loadTime = navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0;
    const renderTime = navigation ? navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart : 0;
    
    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;
    const lcp = lcpEntries[lcpEntries.length - 1]?.startTime || 0;

    // Note: CLS and FID would require more complex measurement in a real implementation
    const cls = 0; // Placeholder
    const fid = 0; // Placeholder

    const newMetrics: PerformanceMetrics = {
      loadTime,
      renderTime,
      memoryUsage,
      fcp,
      lcp,
      cls,
      fid
    };

    setMetrics(newMetrics);
    console.log('Performance metrics collected:', newMetrics);
  }, []);

  const startCollecting = useCallback(() => {
    setIsCollecting(true);
    collectMetrics(); // Collect immediately
    
    const interval = setInterval(collectMetrics, collectInterval);
    
    return () => {
      clearInterval(interval);
      setIsCollecting(false);
    };
  }, [collectMetrics, collectInterval]);

  const stopCollecting = useCallback(() => {
    setIsCollecting(false);
  }, []);

  useEffect(() => {
    const cleanup = startCollecting();
    return cleanup;
  }, [startCollecting]);

  // Performance observer for real-time monitoring
  useEffect(() => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log('LCP updated:', entry.startTime);
          }
        }
      });

      try {
        observer.observe({ entryTypes: ['largest-contentful-paint', 'layout-shift', 'first-input'] });
      } catch (error) {
        console.warn('Performance observer not supported for some entry types');
      }

      return () => observer.disconnect();
    }
  }, []);

  return {
    metrics,
    isCollecting,
    startCollecting,
    stopCollecting,
    collectMetrics
  };
};
