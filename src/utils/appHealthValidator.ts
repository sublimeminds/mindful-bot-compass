/**
 * App Health Validator
 * Comprehensive testing and validation for app initialization
 */

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: any;
}

interface ValidationReport {
  timestamp: number;
  overallHealth: 'healthy' | 'warning' | 'critical';
  tests: TestResult[];
  recommendations: string[];
}

export class AppHealthValidator {
  private testResults: TestResult[] = [];

  /**
   * Run comprehensive health validation
   */
  async runFullValidation(): Promise<ValidationReport> {
    this.testResults = [];
    
    console.log('AppHealthValidator: Starting comprehensive validation...');

    // Core functionality tests
    await this.testReactFunctionality();
    await this.testDOMAccess();
    await this.testLocalStorage();
    await this.testConsoleAccess();

    // Network and connectivity tests
    await this.testNetworkConnectivity();
    await this.testSupabaseConnection();

    // CSS and styling tests
    await this.testCSSLoading();
    await this.testTailwindFunctionality();

    // Error boundary tests
    await this.testErrorBoundaries();

    // Service health tests
    await this.testServiceHealth();

    // Performance tests
    await this.testPerformanceMetrics();

    // Browser compatibility tests
    await this.testBrowserSupport();

    const report = this.generateReport();
    console.log('AppHealthValidator: Validation complete', report);
    
    return report;
  }

  /**
   * Test React functionality
   */
  private async testReactFunctionality(): Promise<void> {
    try {
      // Test React version
      const React = await import('react');
      if (React.version) {
        this.addTest('React Version', 'pass', `React ${React.version} loaded successfully`);
      } else {
        this.addTest('React Version', 'fail', 'React version not detected');
      }

      // Test hooks functionality
      const { useState } = React;
      if (typeof useState === 'function') {
        this.addTest('React Hooks', 'pass', 'useState hook available');
      } else {
        this.addTest('React Hooks', 'fail', 'React hooks not available');
      }

    } catch (error) {
      this.addTest('React Functionality', 'fail', `React test failed: ${error}`);
    }
  }

  /**
   * Test DOM access and manipulation
   */
  private async testDOMAccess(): Promise<void> {
    try {
      // Test document access
      if (typeof document !== 'undefined') {
        this.addTest('DOM Access', 'pass', 'Document object available');
      } else {
        this.addTest('DOM Access', 'fail', 'Document object not available');
        return;
      }

      // Test element creation
      const testElement = document.createElement('div');
      if (testElement) {
        this.addTest('Element Creation', 'pass', 'Can create DOM elements');
      } else {
        this.addTest('Element Creation', 'fail', 'Cannot create DOM elements');
      }

      // Test root element
      const rootElement = document.getElementById('root');
      if (rootElement) {
        this.addTest('Root Element', 'pass', 'Root element found');
      } else {
        this.addTest('Root Element', 'fail', 'Root element not found');
      }

    } catch (error) {
      this.addTest('DOM Access', 'fail', `DOM test failed: ${error}`);
    }
  }

  /**
   * Test localStorage functionality
   */
  private async testLocalStorage(): Promise<void> {
    try {
      const testKey = 'health-validator-test';
      const testValue = 'test-value';

      localStorage.setItem(testKey, testValue);
      const retrieved = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);

      if (retrieved === testValue) {
        this.addTest('LocalStorage', 'pass', 'LocalStorage working correctly');
      } else {
        this.addTest('LocalStorage', 'fail', 'LocalStorage not working correctly');
      }

    } catch (error) {
      this.addTest('LocalStorage', 'fail', `LocalStorage test failed: ${error}`);
    }
  }

  /**
   * Test console access
   */
  private async testConsoleAccess(): Promise<void> {
    try {
      if (typeof console !== 'undefined' && typeof console.log === 'function') {
        this.addTest('Console Access', 'pass', 'Console available');
      } else {
        this.addTest('Console Access', 'fail', 'Console not available');
      }
    } catch (error) {
      this.addTest('Console Access', 'fail', `Console test failed: ${error}`);
    }
  }

  /**
   * Test network connectivity
   */
  private async testNetworkConnectivity(): Promise<void> {
    try {
      if (navigator.onLine) {
        this.addTest('Network Status', 'pass', 'Browser reports online');
      } else {
        this.addTest('Network Status', 'warning', 'Browser reports offline');
      }

      // Test actual connectivity with a simple fetch
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      try {
        const response = await fetch('https://httpbin.org/get', {
          method: 'GET',
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          this.addTest('Network Connectivity', 'pass', 'Network requests working');
        } else {
          this.addTest('Network Connectivity', 'warning', `Network request returned ${response.status}`);
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);
        this.addTest('Network Connectivity', 'warning', `Network test failed: ${fetchError}`);
      }

    } catch (error) {
      this.addTest('Network Connectivity', 'fail', `Network test error: ${error}`);
    }
  }

  /**
   * Test Supabase connection
   */
  private async testSupabaseConnection(): Promise<void> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      if (supabase) {
        this.addTest('Supabase Client', 'pass', 'Supabase client loaded');

        // Test connection with a simple query
        try {
          const { error } = await supabase.from('profiles').select('id').limit(1);
          if (!error) {
            this.addTest('Supabase Connection', 'pass', 'Supabase connection working');
          } else {
            this.addTest('Supabase Connection', 'warning', `Supabase query error: ${error.message}`);
          }
        } catch (queryError) {
          this.addTest('Supabase Connection', 'warning', `Supabase query failed: ${queryError}`);
        }
      } else {
        this.addTest('Supabase Client', 'fail', 'Supabase client not loaded');
      }

    } catch (error) {
      this.addTest('Supabase', 'fail', `Supabase test failed: ${error}`);
    }
  }

  /**
   * Test CSS loading and Tailwind functionality
   */
  private async testCSSLoading(): Promise<void> {
    try {
      // Create test element to check CSS loading
      const testElement = document.createElement('div');
      testElement.className = 'hidden';
      testElement.style.position = 'absolute';
      testElement.style.top = '-9999px';
      document.body.appendChild(testElement);

      const styles = window.getComputedStyle(testElement);
      document.body.removeChild(testElement);

      if (styles.display === 'none') {
        this.addTest('CSS Loading', 'pass', 'CSS styles are loading correctly');
      } else {
        this.addTest('CSS Loading', 'warning', 'CSS styles may not be loading correctly');
      }

    } catch (error) {
      this.addTest('CSS Loading', 'fail', `CSS test failed: ${error}`);
    }
  }

  /**
   * Test Tailwind CSS functionality
   */
  private async testTailwindFunctionality(): Promise<void> {
    try {
      // Test Tailwind color classes
      const testElement = document.createElement('div');
      testElement.className = 'bg-blue-500 text-white';
      testElement.style.position = 'absolute';
      testElement.style.top = '-9999px';
      document.body.appendChild(testElement);

      const styles = window.getComputedStyle(testElement);
      document.body.removeChild(testElement);

      const hasBackgroundColor = styles.backgroundColor !== 'rgba(0, 0, 0, 0)' && styles.backgroundColor !== 'transparent';
      const hasTextColor = styles.color !== 'rgba(0, 0, 0, 0)' && styles.color !== 'transparent';

      if (hasBackgroundColor && hasTextColor) {
        this.addTest('Tailwind CSS', 'pass', 'Tailwind CSS working correctly');
      } else {
        this.addTest('Tailwind CSS', 'warning', 'Tailwind CSS may not be fully loaded');
      }

    } catch (error) {
      this.addTest('Tailwind CSS', 'fail', `Tailwind test failed: ${error}`);
    }
  }

  /**
   * Test error boundaries
   */
  private async testErrorBoundaries(): Promise<void> {
    try {
      // Check if error boundary components are available
      const { default: SafeErrorBoundary } = await import('@/components/SafeErrorBoundary');
      const { default: BulletproofErrorBoundary } = await import('@/components/BulletproofErrorBoundary');

      if (SafeErrorBoundary) {
        this.addTest('Safe Error Boundary', 'pass', 'SafeErrorBoundary component available');
      } else {
        this.addTest('Safe Error Boundary', 'fail', 'SafeErrorBoundary component not available');
      }

      if (BulletproofErrorBoundary) {
        this.addTest('Bulletproof Error Boundary', 'pass', 'BulletproofErrorBoundary component available');
      } else {
        this.addTest('Bulletproof Error Boundary', 'fail', 'BulletproofErrorBoundary component not available');
      }

    } catch (error) {
      this.addTest('Error Boundaries', 'fail', `Error boundary test failed: ${error}`);
    }
  }

  /**
   * Test service health
   */
  private async testServiceHealth(): Promise<void> {
    try {
      const { serviceHealthManager } = await import('@/utils/serviceHealthManager');
      
      if (serviceHealthManager) {
        this.addTest('Service Health Manager', 'pass', 'Service health manager available');
        
        const healthSummary = serviceHealthManager.getHealthSummary();
        const healthPercentage = Math.round(healthSummary.healthy * 100);
        
        if (healthPercentage >= 75) {
          this.addTest('Service Health', 'pass', `${healthPercentage}% of services healthy`);
        } else if (healthPercentage >= 50) {
          this.addTest('Service Health', 'warning', `${healthPercentage}% of services healthy`);
        } else {
          this.addTest('Service Health', 'fail', `Only ${healthPercentage}% of services healthy`);
        }
      } else {
        this.addTest('Service Health Manager', 'fail', 'Service health manager not available');
      }

    } catch (error) {
      this.addTest('Service Health', 'fail', `Service health test failed: ${error}`);
    }
  }

  /**
   * Test performance metrics
   */
  private async testPerformanceMetrics(): Promise<void> {
    try {
      if (typeof performance !== 'undefined') {
        this.addTest('Performance API', 'pass', 'Performance API available');

        // Test timing information
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
          if (loadTime < 3000) {
            this.addTest('Page Load Time', 'pass', `Page loaded in ${loadTime}ms`);
          } else if (loadTime < 5000) {
            this.addTest('Page Load Time', 'warning', `Page loaded in ${loadTime}ms (slow)`);
          } else {
            this.addTest('Page Load Time', 'fail', `Page loaded in ${loadTime}ms (very slow)`);
          }
        }

        // Test memory usage
        if ('memory' in performance) {
          const memory = (performance as any).memory;
          const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
          if (usedMB < 50) {
            this.addTest('Memory Usage', 'pass', `Using ${usedMB}MB memory`);
          } else if (usedMB < 100) {
            this.addTest('Memory Usage', 'warning', `Using ${usedMB}MB memory`);
          } else {
            this.addTest('Memory Usage', 'fail', `Using ${usedMB}MB memory (high)`);
          }
        }
      } else {
        this.addTest('Performance API', 'fail', 'Performance API not available');
      }

    } catch (error) {
      this.addTest('Performance Metrics', 'fail', `Performance test failed: ${error}`);
    }
  }

  /**
   * Test browser support
   */
  private async testBrowserSupport(): Promise<void> {
    try {
      const features: Record<string, boolean> = {
        'Fetch API': typeof fetch !== 'undefined',
        'Promises': typeof Promise !== 'undefined',
        'LocalStorage': typeof localStorage !== 'undefined',
        'Flexbox': typeof CSS !== 'undefined' && CSS.supports('display: flex'),
        'Grid': typeof CSS !== 'undefined' && CSS.supports('display: grid'),
        'CSS Variables': typeof CSS !== 'undefined' && CSS.supports('color: var(--test)')
      };

      let supportedCount = 0;
      const totalCount = Object.keys(features).length;

      Object.entries(features).forEach(([feature, supported]) => {
        if (supported) {
          supportedCount++;
          this.addTest(feature, 'pass', `${feature} supported`);
        } else {
          this.addTest(feature, 'fail', `${feature} not supported`);
        }
      });

      const supportPercentage = Math.round((supportedCount / totalCount) * 100);
      if (supportPercentage >= 90) {
        this.addTest('Browser Compatibility', 'pass', `${supportPercentage}% feature support`);
      } else if (supportPercentage >= 75) {
        this.addTest('Browser Compatibility', 'warning', `${supportPercentage}% feature support`);
      } else {
        this.addTest('Browser Compatibility', 'fail', `Only ${supportPercentage}% feature support`);
      }

    } catch (error) {
      this.addTest('Browser Support', 'fail', `Browser support test failed: ${error}`);
    }
  }

  /**
   * Add a test result
   */
  private addTest(name: string, status: 'pass' | 'fail' | 'warning', message: string, details?: any): void {
    this.testResults.push({ name, status, message, details });
  }

  /**
   * Generate comprehensive validation report
   */
  private generateReport(): ValidationReport {
    const passCount = this.testResults.filter(t => t.status === 'pass').length;
    const failCount = this.testResults.filter(t => t.status === 'fail').length;
    const warningCount = this.testResults.filter(t => t.status === 'warning').length;
    
    let overallHealth: 'healthy' | 'warning' | 'critical';
    const recommendations: string[] = [];

    if (failCount === 0 && warningCount === 0) {
      overallHealth = 'healthy';
      recommendations.push('All systems operating normally');
    } else if (failCount === 0 && warningCount > 0) {
      overallHealth = 'warning';
      recommendations.push('Some minor issues detected, monitor closely');
    } else if (failCount <= 2) {
      overallHealth = 'warning';
      recommendations.push('Several issues detected, investigate and resolve');
    } else {
      overallHealth = 'critical';
      recommendations.push('Critical issues detected, immediate attention required');
    }

    // Add specific recommendations based on failures
    if (this.testResults.find(t => t.name === 'Network Connectivity' && t.status === 'fail')) {
      recommendations.push('Check internet connection and network settings');
    }
    
    if (this.testResults.find(t => t.name === 'CSS Loading' && t.status !== 'pass')) {
      recommendations.push('Verify CSS files are loading correctly');
    }
    
    if (this.testResults.find(t => t.name === 'Service Health' && t.status === 'fail')) {
      recommendations.push('Review service configuration and restart failed services');
    }

    return {
      timestamp: Date.now(),
      overallHealth,
      tests: this.testResults,
      recommendations
    };
  }
}

// Global health validator instance
export const appHealthValidator = new AppHealthValidator();