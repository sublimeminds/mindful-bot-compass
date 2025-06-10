interface MemoryMetrics {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  memoryUsagePercentage: number;
}

interface ComponentMetrics {
  componentName: string;
  mountCount: number;
  unmountCount: number;
  leakSuspected: boolean;
  lastMounted: number;
}

class MemoryManager {
  private componentRegistry = new Map<string, ComponentMetrics>();
  private memoryHistory: MemoryMetrics[] = [];
  private listeners = new Set<EventListener>();
  private timers = new Set<NodeJS.Timeout>();
  private intervals = new Set<NodeJS.Timeout>();
  private observers = new Set<MutationObserver | IntersectionObserver | ResizeObserver>();
  private monitoring = false;
  private monitoringInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startMonitoring();
  }

  private startMonitoring() {
    if (this.monitoring) return;
    
    this.monitoring = true;
    this.monitoringInterval = setInterval(() => {
      this.collectMemoryMetrics();
      this.detectMemoryLeaks();
    }, 10000); // Check every 10 seconds
  }

  private stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.monitoring = false;
  }

  private collectMemoryMetrics() {
    if (!(performance as any).memory) return;

    const memory = (performance as any).memory;
    const metrics: MemoryMetrics = {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      memoryUsagePercentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
    };

    this.memoryHistory.push(metrics);
    
    // Keep only last 100 entries
    if (this.memoryHistory.length > 100) {
      this.memoryHistory.shift();
    }

    // Check for memory pressure
    if (metrics.memoryUsagePercentage > 80) {
      console.warn('Memory usage is high:', metrics.memoryUsagePercentage.toFixed(2) + '%');
      this.triggerGarbageCollection();
    }
  }

  private detectMemoryLeaks() {
    // Check for components that mount more than they unmount
    for (const [componentName, metrics] of this.componentRegistry.entries()) {
      const mountUnmountDiff = metrics.mountCount - metrics.unmountCount;
      
      if (mountUnmountDiff > 5) { // Threshold for suspected leak
        metrics.leakSuspected = true;
        console.warn(`Potential memory leak detected in component: ${componentName}`, {
          mounted: metrics.mountCount,
          unmounted: metrics.unmountCount,
          difference: mountUnmountDiff
        });
      }
    }

    // Check for growing memory usage pattern
    if (this.memoryHistory.length >= 10) {
      const recent = this.memoryHistory.slice(-10);
      const trend = this.calculateMemoryTrend(recent);
      
      if (trend > 0.1) { // Memory growing at > 0.1% per measurement
        console.warn('Memory usage is trending upward, possible memory leak');
      }
    }
  }

  private calculateMemoryTrend(metrics: MemoryMetrics[]): number {
    if (metrics.length < 2) return 0;
    
    const first = metrics[0].memoryUsagePercentage;
    const last = metrics[metrics.length - 1].memoryUsagePercentage;
    
    return (last - first) / metrics.length;
  }

  private triggerGarbageCollection() {
    // Force garbage collection if available (development only)
    if (window.gc && typeof window.gc === 'function') {
      window.gc();
    }
  }

  // Component lifecycle tracking
  registerComponentMount(componentName: string) {
    const existing = this.componentRegistry.get(componentName);
    if (existing) {
      existing.mountCount++;
      existing.lastMounted = Date.now();
    } else {
      this.componentRegistry.set(componentName, {
        componentName,
        mountCount: 1,
        unmountCount: 0,
        leakSuspected: false,
        lastMounted: Date.now()
      });
    }
  }

  registerComponentUnmount(componentName: string) {
    const existing = this.componentRegistry.get(componentName);
    if (existing) {
      existing.unmountCount++;
    }
  }

  // Resource tracking and cleanup
  trackEventListener(target: EventTarget, type: string, listener: EventListener) {
    this.listeners.add(listener);
    
    // Return cleanup function
    return () => {
      target.removeEventListener(type, listener);
      this.listeners.delete(listener);
    };
  }

  trackTimer(timer: NodeJS.Timeout) {
    this.timers.add(timer);
    
    // Return cleanup function
    return () => {
      clearTimeout(timer);
      this.timers.delete(timer);
    };
  }

  trackInterval(interval: NodeJS.Timeout) {
    this.intervals.add(interval);
    
    // Return cleanup function
    return () => {
      clearInterval(interval);
      this.intervals.delete(interval);
    };
  }

  trackObserver(observer: MutationObserver | IntersectionObserver | ResizeObserver) {
    this.observers.add(observer);
    
    // Return cleanup function
    return () => {
      observer.disconnect();
      this.observers.delete(observer);
    };
  }

  // Manual cleanup
  cleanupAllResources() {
    // Clear all timers
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();

    // Clear all intervals
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals.clear();

    // Disconnect all observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();

    console.log('All tracked resources cleaned up');
  }

  // Get current memory status
  getCurrentMemoryStatus(): MemoryMetrics | null {
    if (!(performance as any).memory) return null;

    const memory = (performance as any).memory;
    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      memoryUsagePercentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
    };
  }

  // Get memory history
  getMemoryHistory(): MemoryMetrics[] {
    return [...this.memoryHistory];
  }

  // Get component metrics
  getComponentMetrics(): ComponentMetrics[] {
    return Array.from(this.componentRegistry.values());
  }

  // Get suspected leaks
  getSuspectedLeaks(): ComponentMetrics[] {
    return Array.from(this.componentRegistry.values()).filter(metric => metric.leakSuspected);
  }

  // Reset component metrics
  resetComponentMetrics() {
    this.componentRegistry.clear();
  }

  // Get resource counts
  getResourceCounts() {
    return {
      eventListeners: this.listeners.size,
      timers: this.timers.size,
      intervals: this.intervals.size,
      observers: this.observers.size
    };
  }

  // Destroy the manager
  destroy() {
    this.stopMonitoring();
    this.cleanupAllResources();
    this.componentRegistry.clear();
    this.memoryHistory.length = 0;
  }
}

// Create singleton instance
export const memoryManager = new MemoryManager();

// React hook for component lifecycle tracking
import React from 'react';

export const useMemoryTracking = (componentName: string) => {
  React.useEffect(() => {
    memoryManager.registerComponentMount(componentName);
    
    return () => {
      memoryManager.registerComponentUnmount(componentName);
    };
  }, [componentName]);
};

// React hook for resource cleanup
export const useResourceCleanup = () => {
  const cleanupCallbacks = React.useRef<(() => void)[]>([]);

  const addCleanup = React.useCallback((cleanup: () => void) => {
    cleanupCallbacks.current.push(cleanup);
  }, []);

  React.useEffect(() => {
    return () => {
      cleanupCallbacks.current.forEach(cleanup => cleanup());
      cleanupCallbacks.current.length = 0;
    };
  }, []);

  return { addCleanup };
};

export default MemoryManager;
