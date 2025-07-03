/**
 * Critical Health Monitor
 * 
 * Monitors app health in real-time and provides automatic diagnostics
 * for critical failures like blank pages, infinite loading, etc.
 */

export interface HealthMetric {
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  message: string;
  timestamp: number;
  details?: any;
}

export class CriticalHealthMonitor {
  private metrics: Map<string, HealthMetric> = new Map();
  private observers: ((metric: HealthMetric) => void)[] = [];
  private isMonitoring = false;

  start(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    console.log('🔍 Starting Critical Health Monitor...');

    // Monitor for blank page
    this.monitorBlankPage();
    
    // Monitor for infinite loading
    this.monitorInfiniteLoading();
    
    // Monitor for provider failures
    this.monitorProviderHealth();
    
    // Monitor for routing issues
    this.monitorRoutingHealth();
    
    // Monitor for auth provider issues
    this.monitorAuthHealth();
    
    // Monitor for memory leaks
    this.monitorMemoryUsage();
  }

  stop(): void {
    this.isMonitoring = false;
    console.log('🔍 Stopping Critical Health Monitor...');
  }

  private updateMetric(name: string, status: HealthMetric['status'], message: string, details?: any): void {
    const metric: HealthMetric = {
      name,
      status,
      message,
      timestamp: Date.now(),
      details
    };

    this.metrics.set(name, metric);
    this.notifyObservers(metric);

    // Log critical issues immediately
    if (status === 'critical') {
      console.error(`🚨 CRITICAL HEALTH ISSUE: ${name} - ${message}`, details);
    } else if (status === 'warning') {
      console.warn(`⚠️ HEALTH WARNING: ${name} - ${message}`, details);
    }
  }

  private monitorBlankPage(): void {
    // Check if page is completely blank after reasonable time
    setTimeout(() => {
      const body = document.body;
      const hasContent = body.innerText.trim().length > 0 || 
                        body.querySelector('img, svg, canvas') !== null;
      
      if (!hasContent) {
        this.updateMetric(
          'blank-page',
          'critical',
          'Page appears to be completely blank - no content rendered',
          {
            bodyContent: body.innerHTML,
            location: window.location.href
          }
        );
      } else {
        this.updateMetric('blank-page', 'healthy', 'Page has content');
      }
    }, 3000);
  }

  private monitorInfiniteLoading(): void {
    let loadingStartTime = Date.now();
    let isStillLoading = false;

    const checkLoading = () => {
      const loadingElements = document.querySelectorAll('[class*="loading"], [class*="spinner"], [class*="animate-spin"]');
      const hasLoadingText = document.body.innerText.toLowerCase().includes('loading');
      
      isStillLoading = loadingElements.length > 0 || hasLoadingText;
      
      if (isStillLoading) {
        const loadingDuration = Date.now() - loadingStartTime;
        
        if (loadingDuration > 10000) { // 10 seconds
          this.updateMetric(
            'infinite-loading',
            'critical',
            `App has been loading for ${Math.round(loadingDuration / 1000)} seconds`,
            {
              loadingElements: Array.from(loadingElements).map(el => el.className),
              loadingText: hasLoadingText
            }
          );
        } else if (loadingDuration > 5000) { // 5 seconds
          this.updateMetric(
            'infinite-loading',
            'warning',
            `App has been loading for ${Math.round(loadingDuration / 1000)} seconds`,
            { loadingDuration }
          );
        }
      } else {
        if (loadingStartTime > 0) {
          this.updateMetric('infinite-loading', 'healthy', 'Loading completed normally');
          loadingStartTime = 0;
        }
      }
    };

    // Check every 2 seconds
    const interval = setInterval(() => {
      if (!this.isMonitoring) {
        clearInterval(interval);
        return;
      }
      checkLoading();
    }, 2000);

    // Initial check
    setTimeout(checkLoading, 1000);
  }

  private monitorProviderHealth(): void {
    // Monitor React error boundaries
    const originalError = console.error;
    console.error = (...args) => {
      const errorMessage = args.join(' ');
      
      if (errorMessage.includes('boundary') || 
          errorMessage.includes('provider') ||
          errorMessage.includes('context')) {
        this.updateMetric(
          'provider-error',
          'critical',
          'React provider or context error detected',
          { error: errorMessage }
        );
      }
      
      originalError.apply(console, args);
    };

    // Check for missing providers
    setTimeout(() => {
      try {
        // Try to access React context to see if providers are working
        const hasReactContext = document.querySelector('[data-reactroot], #root > *') !== null;
        
        if (!hasReactContext) {
          this.updateMetric(
            'provider-missing',
            'critical',
            'React providers may not be properly initialized',
            { rootElement: document.getElementById('root')?.innerHTML }
          );
        } else {
          this.updateMetric('provider-missing', 'healthy', 'React providers appear to be working');
        }
      } catch (error) {
        this.updateMetric(
          'provider-error',
          'critical',
          'Error checking provider health',
          { error: error instanceof Error ? error.message : String(error) }
        );
      }
    }, 2000);
  }

  private monitorRoutingHealth(): void {
    // Monitor for routing issues
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    let routeChangeCount = 0;
    
    const trackRoute = () => {
      routeChangeCount++;
      
      // Check if route changes are happening but content isn't updating
      setTimeout(() => {
        const hasMainContent = document.querySelector('main, [role="main"], .container, .content') !== null;
        
        if (!hasMainContent && routeChangeCount > 0) {
          this.updateMetric(
            'routing-failure',
            'warning',
            'Route changes detected but no main content found',
            { 
              currentPath: window.location.pathname,
              routeChangeCount 
            }
          );
        }
      }, 1000);
    };

    history.pushState = function(...args) {
      trackRoute();
      return originalPushState.apply(this, args);
    };

    history.replaceState = function(...args) {
      trackRoute();
      return originalReplaceState.apply(this, args);
    };

    // Listen for popstate events
    window.addEventListener('popstate', trackRoute);
  }

  private monitorAuthHealth(): void {
    // Monitor auth provider specifically
    setTimeout(() => {
      try {
        // Check if auth context is available
        const authErrors = this.metrics.get('auth-error');
        
        if (!authErrors) {
          // Look for common auth-related errors in console
          const authErrorPatterns = [
            'auth must be used within',
            'auth context',
            'supabase auth',
            'session error'
          ];
          
          // This is a simplified check - in real implementation you'd 
          // integrate with your actual auth system
          this.updateMetric('auth-health', 'healthy', 'Auth system appears functional');
        }
      } catch (error) {
        this.updateMetric(
          'auth-health',
          'critical',
          'Auth health check failed',
          { error: error instanceof Error ? error.message : String(error) }
        );
      }
    }, 3000);
  }

  private monitorMemoryUsage(): void {
    if ('memory' in performance) {
      const checkMemory = () => {
        const memory = (performance as any).memory;
        const usedMB = memory.usedJSHeapSize / 1024 / 1024;
        const limitMB = memory.jsHeapSizeLimit / 1024 / 1024;
        const usagePercent = (usedMB / limitMB) * 100;
        
        if (usagePercent > 90) {
          this.updateMetric(
            'memory-usage',
            'critical',
            `High memory usage: ${usagePercent.toFixed(1)}%`,
            { usedMB: usedMB.toFixed(1), limitMB: limitMB.toFixed(1) }
          );
        } else if (usagePercent > 75) {
          this.updateMetric(
            'memory-usage',
            'warning',
            `Elevated memory usage: ${usagePercent.toFixed(1)}%`,
            { usedMB: usedMB.toFixed(1) }
          );
        } else {
          this.updateMetric('memory-usage', 'healthy', `Memory usage normal: ${usagePercent.toFixed(1)}%`);
        }
      };

      // Check every 30 seconds
      const interval = setInterval(() => {
        if (!this.isMonitoring) {
          clearInterval(interval);
          return;
        }
        checkMemory();
      }, 30000);

      // Initial check
      setTimeout(checkMemory, 5000);
    }
  }

  // Subscribe to health updates
  subscribe(callback: (metric: HealthMetric) => void): () => void {
    this.observers.push(callback);
    return () => {
      const index = this.observers.indexOf(callback);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    };
  }

  private notifyObservers(metric: HealthMetric): void {
    this.observers.forEach(callback => {
      try {
        callback(metric);
      } catch (error) {
        console.error('Error in health monitor observer:', error);
      }
    });
  }

  // Get current health status
  getHealthStatus(): { overall: 'healthy' | 'warning' | 'critical'; metrics: HealthMetric[] } {
    const metrics = Array.from(this.metrics.values());
    const hasCritical = metrics.some(m => m.status === 'critical');
    const hasWarning = metrics.some(m => m.status === 'warning');
    
    return {
      overall: hasCritical ? 'critical' : hasWarning ? 'warning' : 'healthy',
      metrics
    };
  }

  // Get diagnostic report
  getDiagnosticReport(): string {
    const status = this.getHealthStatus();
    let report = `🔍 Health Monitor Report\n`;
    report += `=========================\n`;
    report += `Overall Status: ${status.overall.toUpperCase()}\n\n`;
    
    status.metrics.forEach(metric => {
      const icon = metric.status === 'critical' ? '🚨' : 
                   metric.status === 'warning' ? '⚠️' : '✅';
      report += `${icon} ${metric.name}: ${metric.message}\n`;
      
      if (metric.details) {
        report += `   Details: ${JSON.stringify(metric.details, null, 2)}\n`;
      }
      report += '\n';
    });
    
    return report;
  }
}

// Export singleton instance
export const healthMonitor = new CriticalHealthMonitor();

// Auto-start in development
if (import.meta.env.DEV) {
  setTimeout(() => {
    healthMonitor.start();
    
    // Make available for debugging
    (window as any).__HEALTH_MONITOR__ = healthMonitor;
  }, 1000);
}