
import React from 'react';

interface HealthCheck {
  name: string;
  status: 'pass' | 'warn' | 'fail';
  message: string;
  timestamp: string;
}

interface HealthCheckResult {
  overall: 'healthy' | 'degraded' | 'unhealthy';
  checks: HealthCheck[];
  timestamp: string;
}

class AppHealthChecker {
  async runStartupHealthChecks(): Promise<HealthCheckResult> {
    const checks: HealthCheck[] = [];
    const timestamp = new Date().toISOString();

    // React availability check
    try {
      if (typeof React !== 'undefined' && typeof React.useState !== 'undefined') {
        checks.push({
          name: 'React Availability',
          status: 'pass',
          message: 'React and hooks are available',
          timestamp
        });
      } else {
        checks.push({
          name: 'React Availability',
          status: 'fail',
          message: 'React or hooks are not available',
          timestamp
        });
      }
    } catch (error) {
      checks.push({
        name: 'React Availability',
        status: 'fail',
        message: `React check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp
      });
    }

    // DOM availability check
    try {
      if (typeof document !== 'undefined' && document.body) {
        checks.push({
          name: 'DOM Availability',
          status: 'pass',
          message: 'DOM is ready',
          timestamp
        });
      } else {
        checks.push({
          name: 'DOM Availability',
          status: 'warn',
          message: 'DOM may not be fully ready',
          timestamp
        });
      }
    } catch (error) {
      checks.push({
        name: 'DOM Availability',
        status: 'fail',
        message: `DOM check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp
      });
    }

    // Memory check
    try {
      if (typeof window !== 'undefined' && (window.performance as any).memory) {
        const memory = (window.performance as any).memory;
        const usagePercent = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
        
        if (usagePercent < 0.8) {
          checks.push({
            name: 'Memory Usage',
            status: 'pass',
            message: `Memory usage is healthy: ${Math.round(usagePercent * 100)}%`,
            timestamp
          });
        } else {
          checks.push({
            name: 'Memory Usage',
            status: 'warn',
            message: `Memory usage is high: ${Math.round(usagePercent * 100)}%`,
            timestamp
          });
        }
      } else {
        checks.push({
          name: 'Memory Usage',
          status: 'warn',
          message: 'Memory information not available',
          timestamp
        });
      }
    } catch (error) {
      checks.push({
        name: 'Memory Usage',
        status: 'fail',
        message: `Memory check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp
      });
    }

    // Determine overall health
    const failCount = checks.filter(c => c.status === 'fail').length;
    const warnCount = checks.filter(c => c.status === 'warn').length;
    
    let overall: 'healthy' | 'degraded' | 'unhealthy';
    if (failCount > 0) {
      overall = 'unhealthy';
    } else if (warnCount > 0) {
      overall = 'degraded';
    } else {
      overall = 'healthy';
    }

    return {
      overall,
      checks,
      timestamp
    };
  }
}

export const appHealthChecker = new AppHealthChecker();
