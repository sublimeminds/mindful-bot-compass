
import { DebugLogger } from './debugLogger';
import { reactHookValidator } from './reactHookValidator';

interface HealthCheckResult {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  message: string;
  timestamp: number;
  details?: any;
}

interface AppHealthStatus {
  overall: 'healthy' | 'degraded' | 'critical';
  checks: HealthCheckResult[];
  timestamp: number;
}

export class AppHealthChecker {
  private static instance: AppHealthChecker;
  
  static getInstance(): AppHealthChecker {
    if (!AppHealthChecker.instance) {
      AppHealthChecker.instance = new AppHealthChecker();
    }
    return AppHealthChecker.instance;
  }

  async runStartupHealthChecks(): Promise<AppHealthStatus> {
    const checks: HealthCheckResult[] = [];
    const timestamp = Date.now();

    // React Validation
    const reactValidation = reactHookValidator.validateReactInit();
    checks.push({
      name: 'React Initialization',
      status: reactValidation.isValid ? 'pass' : 'fail',
      message: reactValidation.isValid ? 'React is properly initialized' : reactValidation.error?.message || 'React validation failed',
      timestamp,
      details: reactValidation
    });

    // React Context Validation
    const contextValidation = reactHookValidator.validateReactContext();
    checks.push({
      name: 'React Context',
      status: contextValidation.isValid ? 'pass' : 'fail',
      message: contextValidation.isValid ? 'React context system working' : contextValidation.error?.message || 'Context validation failed',
      timestamp,
      details: contextValidation
    });

    // Browser Compatibility
    const browserCheck = this.checkBrowserCompatibility();
    checks.push(browserCheck);

    // Network Connectivity
    const networkCheck = await this.checkNetworkConnectivity();
    checks.push(networkCheck);

    // Local Storage Availability
    const storageCheck = this.checkLocalStorageAvailability();
    checks.push(storageCheck);

    // Bundle Integrity
    const bundleCheck = this.checkBundleIntegrity();
    checks.push(bundleCheck);

    // Determine overall health
    const failedChecks = checks.filter(check => check.status === 'fail');
    const warnChecks = checks.filter(check => check.status === 'warn');

    let overall: 'healthy' | 'degraded' | 'critical';
    if (failedChecks.length > 0) {
      // Critical if React or core systems fail
      const criticalFailures = failedChecks.filter(check => 
        check.name.includes('React') || check.name.includes('Bundle')
      );
      overall = criticalFailures.length > 0 ? 'critical' : 'degraded';
    } else if (warnChecks.length > 0) {
      overall = 'degraded';
    } else {
      overall = 'healthy';
    }

    const healthStatus: AppHealthStatus = {
      overall,
      checks,
      timestamp
    };

    DebugLogger.info('AppHealthChecker: Startup health check completed', {
      component: 'AppHealthChecker',
      overall,
      checkCount: checks.length,
      failures: failedChecks.length
    });

    return healthStatus;
  }

  private checkBrowserCompatibility(): HealthCheckResult {
    const timestamp = Date.now();
    
    try {
      // Check for required browser APIs
      const requiredAPIs = [
        'fetch',
        'Promise',
        'localStorage',
        'sessionStorage',
        'addEventListener'
      ];

      const missingAPIs = requiredAPIs.filter(api => !(api in window));
      
      if (missingAPIs.length > 0) {
        return {
          name: 'Browser Compatibility',
          status: 'fail',
          message: `Missing browser APIs: ${missingAPIs.join(', ')}`,
          timestamp,
          details: { missingAPIs }
        };
      }

      // Check modern JavaScript features
      try {
        eval('const test = () => {}; const {a = 1} = {}; class Test {}');
      } catch (error) {
        return {
          name: 'Browser Compatibility',
          status: 'fail',
          message: 'Browser does not support modern JavaScript features',
          timestamp,
          details: { error: error.message }
        };
      }

      return {
        name: 'Browser Compatibility',
        status: 'pass',
        message: 'Browser supports all required features',
        timestamp
      };
    } catch (error) {
      return {
        name: 'Browser Compatibility',
        status: 'fail',
        message: `Browser compatibility check failed: ${error.message}`,
        timestamp,
        details: { error }
      };
    }
  }

  private async checkNetworkConnectivity(): Promise<HealthCheckResult> {
    const timestamp = Date.now();
    
    try {
      if (!navigator.onLine) {
        return {
          name: 'Network Connectivity',
          status: 'warn',
          message: 'Browser reports offline status',
          timestamp,
          details: { online: false }
        };
      }

      // Test network with a simple request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      try {
        await fetch('/favicon.ico', { 
          method: 'HEAD',
          signal: controller.signal,
          cache: 'no-cache'
        });
        clearTimeout(timeoutId);
        
        return {
          name: 'Network Connectivity',
          status: 'pass',
          message: 'Network connectivity confirmed',
          timestamp
        };
      } catch (error) {
        clearTimeout(timeoutId);
        return {
          name: 'Network Connectivity',
          status: 'warn',
          message: 'Network connectivity test failed',
          timestamp,
          details: { error: error.message }
        };
      }
    } catch (error) {
      return {
        name: 'Network Connectivity',
        status: 'warn',
        message: `Network check failed: ${error.message}`,
        timestamp,
        details: { error }
      };
    }
  }

  private checkLocalStorageAvailability(): HealthCheckResult {
    const timestamp = Date.now();
    
    try {
      const testKey = '_app_health_test';
      const testValue = 'test';
      
      localStorage.setItem(testKey, testValue);
      const retrieved = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      
      if (retrieved !== testValue) {
        return {
          name: 'Local Storage',
          status: 'warn',
          message: 'Local storage not functioning properly',
          timestamp
        };
      }

      return {
        name: 'Local Storage',
        status: 'pass',
        message: 'Local storage available and working',
        timestamp
      };
    } catch (error) {
      return {
        name: 'Local Storage',
        status: 'warn',
        message: `Local storage unavailable: ${error.message}`,
        timestamp,
        details: { error }
      };
    }
  }

  private checkBundleIntegrity(): HealthCheckResult {
    const timestamp = Date.now();
    
    try {
      // Check if critical modules are available
      const criticalModules = [
        'React',
        'ReactDOM'
      ];

      const missingModules = criticalModules.filter(module => {
        try {
          return typeof window[module] === 'undefined' && typeof eval(module) === 'undefined';
        } catch {
          return true;
        }
      });

      if (missingModules.length > 0) {
        return {
          name: 'Bundle Integrity',
          status: 'fail',
          message: `Missing critical modules: ${missingModules.join(', ')}`,
          timestamp,
          details: { missingModules }
        };
      }

      return {
        name: 'Bundle Integrity',
        status: 'pass',
        message: 'All critical modules loaded successfully',
        timestamp
      };
    } catch (error) {
      return {
        name: 'Bundle Integrity',
        status: 'fail',
        message: `Bundle integrity check failed: ${error.message}`,
        timestamp,
        details: { error }
      };
    }
  }
}

export const appHealthChecker = AppHealthChecker.getInstance();
