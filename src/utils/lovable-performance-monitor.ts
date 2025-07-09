// Performance monitoring and metrics collection for lovable-tagger system
export class LovablePerformanceMonitor {
  private static metrics = {
    pageLoadTime: 0,
    initializationTime: 0,
    componentRenderTimes: new Map<string, number>(),
    errorCounts: {
      lovableTagger: 0,
      componentRender: 0,
      total: 0
    },
    recoveryEvents: 0,
    healthChecks: {
      passed: 0,
      failed: 0
    }
  };

  private static observers: PerformanceObserver[] = [];

  static startMonitoring(): void {
    this.monitorPageLoad();
    this.monitorLongTasks();
    this.monitorErrors();
    
    console.log('🔍 Lovable performance monitoring started');
  }

  private static monitorPageLoad(): void {
    try {
      // Monitor navigation timing
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
              const navEntry = entry as PerformanceNavigationTiming;
              this.metrics.pageLoadTime = navEntry.loadEventEnd - navEntry.fetchStart;
              
              console.log('📊 Page load metrics:', {
                loadTime: this.metrics.pageLoadTime,
                domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.fetchStart,
                firstPaint: this.getFirstPaint()
              });
            }
          }
        });
        
        observer.observe({ entryTypes: ['navigation'] });
        this.observers.push(observer);
      }
    } catch (error) {
      console.warn('Failed to set up page load monitoring:', error);
    }
  }

  private static monitorLongTasks(): void {
    try {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) { // Tasks longer than 50ms
              console.warn('⚠️ Long task detected:', {
                duration: entry.duration,
                startTime: entry.startTime
              });
            }
          }
        });
        
        observer.observe({ entryTypes: ['longtask'] });
        this.observers.push(observer);
      }
    } catch (error) {
      console.warn('Failed to set up long task monitoring:', error);
    }
  }

  private static monitorErrors(): void {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.metrics.errorCounts.total++;
      
      if (event.error?.stack?.includes('lovable') || event.error?.stack?.includes('lov')) {
        this.metrics.errorCounts.lovableTagger++;
        console.error('💥 Lovable-tagger error detected:', event.error);
      } else {
        this.metrics.errorCounts.componentRender++;
      }
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.metrics.errorCounts.total++;
      console.error('💥 Unhandled promise rejection:', event.reason);
    });
  }

  private static getFirstPaint(): number {
    try {
      const paintEntries = performance.getEntriesByType('paint');
      const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
      return firstPaint ? firstPaint.startTime : 0;
    } catch (error) {
      return 0;
    }
  }

  static recordComponentRender(componentName: string, renderTime: number): void {
    this.metrics.componentRenderTimes.set(componentName, renderTime);
    
    if (renderTime > 100) { // Renders longer than 100ms
      console.warn(`⚠️ Slow component render: ${componentName} took ${renderTime}ms`);
    }
  }

  static recordRecoveryEvent(): void {
    this.metrics.recoveryEvents++;
    console.log('🔧 Recovery event recorded, total:', this.metrics.recoveryEvents);
  }

  static recordHealthCheck(passed: boolean): void {
    if (passed) {
      this.metrics.healthChecks.passed++;
    } else {
      this.metrics.healthChecks.failed++;
    }
  }

  static getMetrics() {
    return {
      ...this.metrics,
      componentRenderTimes: Object.fromEntries(this.metrics.componentRenderTimes),
      timestamp: Date.now(),
      memoryUsage: this.getMemoryUsage()
    };
  }

  private static getMemoryUsage() {
    try {
      const memory = (performance as any).memory;
      if (memory) {
        return {
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit
        };
      }
    } catch (error) {
      // Memory API not available
    }
    return null;
  }

  static generateReport(): string {
    const metrics = this.getMetrics();
    const errorRate = metrics.errorCounts.total / (metrics.healthChecks.passed + metrics.healthChecks.failed || 1);
    const averageRenderTime = Array.from(this.metrics.componentRenderTimes.values())
      .reduce((sum, time) => sum + time, 0) / (this.metrics.componentRenderTimes.size || 1);

    return `
🔍 Lovable Performance Report
=============================
Page Load: ${metrics.pageLoadTime}ms
Error Rate: ${(errorRate * 100).toFixed(2)}%
Recoveries: ${metrics.recoveryEvents}
Avg Render: ${averageRenderTime.toFixed(2)}ms
Health Checks: ${metrics.healthChecks.passed}✅ ${metrics.healthChecks.failed}❌

Component Performance:
${Object.entries(metrics.componentRenderTimes).map(([name, time]) => 
  `  ${name}: ${time}ms`
).join('\n')}

${metrics.memoryUsage ? `
Memory Usage:
  Used: ${(metrics.memoryUsage.usedJSHeapSize / 1048576).toFixed(2)}MB
  Total: ${(metrics.memoryUsage.totalJSHeapSize / 1048576).toFixed(2)}MB
  Limit: ${(metrics.memoryUsage.jsHeapSizeLimit / 1048576).toFixed(2)}MB
` : ''}
    `.trim();
  }

  static stopMonitoring(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    console.log('🔍 Lovable performance monitoring stopped');
  }
}

// Auto-start monitoring in development
if (process.env.NODE_ENV === 'development') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      LovablePerformanceMonitor.startMonitoring();
    });
  } else {
    LovablePerformanceMonitor.startMonitoring();
  }
}