import { useEffect, useRef, useCallback } from 'react';
import { performanceMonitor } from '@/utils/performanceMonitor';

interface MemoryLeakDetectionOptions {
  componentName: string;
  enableTracking: boolean;
  memoryThreshold: number; // in MB
  checkInterval: number; // in milliseconds
}

interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

export const useMemoryLeakDetection = (options: MemoryLeakDetectionOptions) => {
  const eventListenersRef = useRef<Set<() => void>>(new Set());
  const timeoutsRef = useRef<Set<NodeJS.Timeout>>(new Set());
  const intervalsRef = useRef<Set<NodeJS.Timeout>>(new Set());
  const initialMemoryRef = useRef<number>(0);
  const checkIntervalRef = useRef<NodeJS.Timeout>();

  // Get current memory usage
  const getCurrentMemoryUsage = useCallback((): number => {
    if ('memory' in performance) {
      const memoryInfo = (performance as any).memory as MemoryInfo;
      return memoryInfo.usedJSHeapSize / (1024 * 1024); // Convert to MB
    }
    return 0;
  }, []);

  // Register event listener for cleanup tracking
  const registerEventListener = useCallback((cleanup: () => void) => {
    eventListenersRef.current.add(cleanup);
    return () => {
      eventListenersRef.current.delete(cleanup);
    };
  }, []);

  // Register timeout for cleanup tracking
  const registerTimeout = useCallback((timeoutId: NodeJS.Timeout) => {
    timeoutsRef.current.add(timeoutId);
    return () => {
      clearTimeout(timeoutId);
      timeoutsRef.current.delete(timeoutId);
    };
  }, []);

  // Register interval for cleanup tracking
  const registerInterval = useCallback((intervalId: NodeJS.Timeout) => {
    intervalsRef.current.add(intervalId);
    return () => {
      clearInterval(intervalId);
      intervalsRef.current.delete(intervalId);
    };
  }, []);

  // Memory leak detection
  useEffect(() => {
    if (!options.enableTracking) return;

    // Record initial memory usage
    initialMemoryRef.current = getCurrentMemoryUsage();
    
    const checkMemoryLeak = () => {
      const currentMemory = getCurrentMemoryUsage();
      const memoryDelta = currentMemory - initialMemoryRef.current;
      
      // Track memory usage
      performanceMonitor.recordMetric(
        options.componentName, 
        'memoryUsage', 
        currentMemory
      );

      // Check for potential memory leak
      if (memoryDelta > options.memoryThreshold) {
        console.warn(
          `🗑️ Potential memory leak detected in ${options.componentName}: +${memoryDelta.toFixed(2)}MB`
        );
        
        performanceMonitor.recordMetric(
          options.componentName, 
          'memoryLeak', 
          memoryDelta
        );

        // Log cleanup info for debugging
        console.group(`Memory Leak Debug Info for ${options.componentName}`);
        console.log(`Event listeners: ${eventListenersRef.current.size}`);
        console.log(`Active timeouts: ${timeoutsRef.current.size}`);
        console.log(`Active intervals: ${intervalsRef.current.size}`);
        console.log(`Memory delta: ${memoryDelta.toFixed(2)}MB`);
        console.groupEnd();
      }
    };

    // Start periodic memory checking
    checkIntervalRef.current = setInterval(checkMemoryLeak, options.checkInterval);

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [options, getCurrentMemoryUsage]);

  // Cleanup all registered resources
  useEffect(() => {
    return () => {
      // Clean up event listeners
      eventListenersRef.current.forEach(cleanup => {
        try {
          cleanup();
        } catch (error) {
          console.warn(`Error cleaning up event listener in ${options.componentName}:`, error);
        }
      });
      eventListenersRef.current.clear();

      // Clean up timeouts
      timeoutsRef.current.forEach(timeoutId => {
        clearTimeout(timeoutId);
      });
      timeoutsRef.current.clear();

      // Clean up intervals
      intervalsRef.current.forEach(intervalId => {
        clearInterval(intervalId);
      });
      intervalsRef.current.clear();

      // Stop memory checking
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }

      console.log(`🧹 Cleaned up resources for ${options.componentName}`);
    };
  }, [options.componentName]);

  return {
    getCurrentMemoryUsage,
    registerEventListener,
    registerTimeout,
    registerInterval,
    memoryInfo: {
      eventListeners: eventListenersRef.current.size,
      timeouts: timeoutsRef.current.size,
      intervals: intervalsRef.current.size,
    }
  };
};