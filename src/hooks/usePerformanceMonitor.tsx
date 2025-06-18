
import { useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  fps: number;
  networkLatency: number;
  cacheHitRate: number;
}

interface PerformanceConfig {
  enableMetrics: boolean;
  sampleRate: number;
  thresholds: {
    renderTime: number;
    memoryUsage: number;
    fps: number;
  };
}

export const usePerformanceMonitor = (config: PerformanceConfig) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    memoryUsage: 0,
    fps: 0,
    networkLatency: 0,
    cacheHitRate: 0,
  });
  
  const [warnings, setWarnings] = useState<string[]>([]);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const renderStartTime = useRef(0);

  useEffect(() => {
    if (!config.enableMetrics) return;

    renderStartTime.current = performance.now();

    const measureRenderTime = () => {
      const renderTime = performance.now() - renderStartTime.current;
      setMetrics(prev => ({ ...prev, renderTime }));

      if (renderTime > config.thresholds.renderTime) {
        setWarnings(prev => [...prev, `Slow render detected: ${renderTime.toFixed(2)}ms`]);
      }
    };

    const measureFPS = () => {
      const now = performance.now();
      frameCount.current++;
      
      if (now - lastTime.current >= 1000) {
        const fps = frameCount.current;
        setMetrics(prev => ({ ...prev, fps }));
        
        if (fps < config.thresholds.fps) {
          setWarnings(prev => [...prev, `Low FPS detected: ${fps}`]);
        }
        
        frameCount.current = 0;
        lastTime.current = now;
      }
      
      requestAnimationFrame(measureFPS);
    };

    const measureMemory = () => {
      if ('memory' in performance) {
        const memoryInfo = (performance as any).memory;
        const memoryUsage = memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit;
        setMetrics(prev => ({ ...prev, memoryUsage: memoryUsage * 100 }));

        if (memoryUsage > config.thresholds.memoryUsage) {
          setWarnings(prev => [...prev, `High memory usage: ${(memoryUsage * 100).toFixed(1)}%`]);
        }
      }
    };

    // Initial measurements
    measureRenderTime();
    requestAnimationFrame(measureFPS);
    
    // Set up periodic memory monitoring
    const memoryInterval = setInterval(measureMemory, 5000);

    return () => {
      clearInterval(memoryInterval);
    };
  }, [config]);

  const clearWarnings = () => setWarnings([]);

  const logPerformanceEntry = (name: string, duration: number) => {
    console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`);
  };

  return {
    metrics,
    warnings,
    clearWarnings,
    logPerformanceEntry,
  };
};
