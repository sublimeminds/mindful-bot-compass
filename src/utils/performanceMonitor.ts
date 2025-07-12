/**
 * Performance Monitoring for Bulletproof Architecture
 * Tracks component render times, memory usage, and error recovery performance
 */

interface PerformanceMetric {
  component: string;
  metric: string;
  value: number;
  timestamp: number;
  context?: Record<string, any>;
}

interface PerformanceReport {
  summary: {
    totalMetrics: number;
    averageRenderTime: number;
    memoryUsage: number;
    errorRecoveryTime: number;
  };
  slowComponents: Array<{
    component: string;
    averageTime: number;
    count: number;
  }>;
  memoryLeaks: Array<{
    component: string;
    leakSize: number;
    instances: number;
  }>;
  recommendations: string[];
}

export class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private componentRenderTimes = new Map<string, number[]>();
  private memorySnapshots = new Map<string, number>();
  private isMonitoring = false;
  
  /**
   * Start performance monitoring
   */
  startMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    
    // Monitor component render performance
    this.observeComponentRenders();
    
    // Monitor memory usage
    this.observeMemoryUsage();
    
    // Monitor error recovery times
    this.observeErrorRecovery();
    
    console.log('🚀 Performance monitoring started');
  }
  
  /**
   * Stop performance monitoring
   */
  stopMonitoring(): void {
    this.isMonitoring = false;
    
    // Clear any pending memory monitoring timeouts
    if ((this as any).memoryTimeoutId) {
      clearTimeout((this as any).memoryTimeoutId);
      (this as any).memoryTimeoutId = null;
    }
    
    console.log('🛑 Performance monitoring stopped');
  }
  
  /**
   * Record a performance metric
   */
  recordMetric(component: string, metric: string, value: number, context?: Record<string, any>): void {
    const performanceMetric: PerformanceMetric = {
      component,
      metric,
      value,
      timestamp: Date.now(),
      context
    };
    
    this.metrics.push(performanceMetric);
    
    // Track render times separately for analysis
    if (metric === 'renderTime') {
      if (!this.componentRenderTimes.has(component)) {
        this.componentRenderTimes.set(component, []);
      }
      this.componentRenderTimes.get(component)?.push(value);
    }
    
    // Log slow components
    if (metric === 'renderTime' && value > 100) {
      console.warn(`🐌 Slow component detected: ${component} (${value}ms)`);
    }
  }
  
  /**
   * Measure component render time
   */
  measureRenderTime<T>(component: string, renderFn: () => T): T {
    const startTime = performance.now();
    const result = renderFn();
    const endTime = performance.now();
    
    this.recordMetric(component, 'renderTime', endTime - startTime);
    return result;
  }
  
  /**
   * Track memory usage for a component
   */
  trackMemoryUsage(component: string): void {
    if ('memory' in performance) {
      const memoryInfo = (performance as any).memory;
      const currentMemory = memoryInfo.usedJSHeapSize;
      
      const previousMemory = this.memorySnapshots.get(component) || 0;
      const memoryDelta = currentMemory - previousMemory;
      
      this.memorySnapshots.set(component, currentMemory);
      this.recordMetric(component, 'memoryUsage', memoryDelta);
      
      // Detect potential memory leaks
      if (memoryDelta > 5 * 1024 * 1024) { // 5MB threshold
        console.warn(`🗑️ Potential memory leak in ${component}: +${(memoryDelta / 1024 / 1024).toFixed(2)}MB`);
      }
    }
  }
  
  /**
   * Measure error recovery time
   */
  measureErrorRecovery(component: string, recoveryFn: () => Promise<void>): Promise<void> {
    const startTime = performance.now();
    
    return recoveryFn().finally(() => {
      const recoveryTime = performance.now() - startTime;
      this.recordMetric(component, 'errorRecoveryTime', recoveryTime);
      
      if (recoveryTime > 2000) { // 2 second threshold
        console.warn(`⚠️ Slow error recovery in ${component}: ${recoveryTime}ms`);
      }
    });
  }
  
  /**
   * Generate performance report
   */
  generateReport(): PerformanceReport {
    const renderMetrics = this.metrics.filter(m => m.metric === 'renderTime');
    const memoryMetrics = this.metrics.filter(m => m.metric === 'memoryUsage');
    const errorRecoveryMetrics = this.metrics.filter(m => m.metric === 'errorRecoveryTime');
    
    // Calculate averages
    const averageRenderTime = renderMetrics.length > 0 
      ? renderMetrics.reduce((sum, m) => sum + m.value, 0) / renderMetrics.length 
      : 0;
    
    const totalMemoryUsage = memoryMetrics.reduce((sum, m) => sum + Math.abs(m.value), 0);
    
    const averageErrorRecoveryTime = errorRecoveryMetrics.length > 0
      ? errorRecoveryMetrics.reduce((sum, m) => sum + m.value, 0) / errorRecoveryMetrics.length
      : 0;
    
    // Find slow components
    const slowComponents = Array.from(this.componentRenderTimes.entries())
      .map(([component, times]) => ({
        component,
        averageTime: times.reduce((sum, time) => sum + time, 0) / times.length,
        count: times.length
      }))
      .filter(item => item.averageTime > 50)
      .sort((a, b) => b.averageTime - a.averageTime);
    
    // Detect memory leaks
    const memoryLeaks = Array.from(this.memorySnapshots.entries())
      .map(([component, memory]) => ({
        component,
        leakSize: memory,
        instances: memoryMetrics.filter(m => m.component === component).length
      }))
      .filter(item => item.leakSize > 10 * 1024 * 1024) // 10MB threshold
      .sort((a, b) => b.leakSize - a.leakSize);
    
    // Generate recommendations
    const recommendations: string[] = [];
    
    if (averageRenderTime > 50) {
      recommendations.push('Consider code splitting for heavy components');
    }
    
    if (slowComponents.length > 0) {
      recommendations.push(`Optimize slow components: ${slowComponents.slice(0, 3).map(c => c.component).join(', ')}`);
    }
    
    if (memoryLeaks.length > 0) {
      recommendations.push(`Investigate memory leaks in: ${memoryLeaks.slice(0, 3).map(c => c.component).join(', ')}`);
    }
    
    if (averageErrorRecoveryTime > 1000) {
      recommendations.push('Improve error recovery mechanisms for faster failover');
    }
    
    return {
      summary: {
        totalMetrics: this.metrics.length,
        averageRenderTime,
        memoryUsage: totalMemoryUsage,
        errorRecoveryTime: averageErrorRecoveryTime
      },
      slowComponents,
      memoryLeaks,
      recommendations
    };
  }
  
  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics = [];
    this.componentRenderTimes.clear();
    this.memorySnapshots.clear();
    console.log('📊 Performance metrics cleared');
  }
  
  // Private monitoring methods
  private observeComponentRenders(): void {
    // Use React DevTools profiler API if available
    if ('performance' in window && 'mark' in performance) {
      // Monitor React component renders
      const originalConsoleTime = console.time;
      const originalConsoleTimeEnd = console.timeEnd;
      
      console.time = (label?: string) => {
        if (label?.includes('Component')) {
          performance.mark(`${label}-start`);
        }
        return originalConsoleTime.call(console, label);
      };
      
      console.timeEnd = (label?: string) => {
        if (label?.includes('Component')) {
          performance.mark(`${label}-end`);
          performance.measure(label, `${label}-start`, `${label}-end`);
        }
        return originalConsoleTimeEnd.call(console, label);
      };
    }
  }
  
  private observeMemoryUsage(): void {
    if (this.isMonitoring) {
      // Check memory every 2 minutes to reduce overhead
      const timeoutId = setTimeout(() => {
        if ('memory' in performance && this.isMonitoring) {
          const memoryInfo = (performance as any).memory;
          this.recordMetric('global', 'totalMemory', memoryInfo.usedJSHeapSize);
        }
        this.observeMemoryUsage();
      }, 120000); // Changed from 30s to 2 minutes
      
      // Store timeout ID for cleanup
      (this as any).memoryTimeoutId = timeoutId;
    }
  }
  
  private observeErrorRecovery(): void {
    // Hook into error boundary recovery mechanisms
    const originalError = console.error;
    console.error = (...args) => {
      if (args[0]?.includes?.('Error boundary')) {
        const startTime = performance.now();
        setTimeout(() => {
          const recoveryTime = performance.now() - startTime;
          this.recordMetric('ErrorBoundary', 'recoveryTime', recoveryTime);
        }, 100);
      }
      return originalError.apply(console, args);
    };
  }
}

export const performanceMonitor = new PerformanceMonitor();