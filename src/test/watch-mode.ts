/**
 * Watch Mode Test Runner
 * 
 * Automatically runs tests when files change and provides
 * real-time feedback on app health
 */

import { testRunner } from './test-runner';
import { healthMonitor } from './critical-health-monitor';

export class WatchModeRunner {
  private isRunning = false;
  private lastRunTime = 0;
  private debounceTimeout: NodeJS.Timeout | null = null;

  start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('👀 Starting Watch Mode Test Runner...');

    // Start health monitoring
    healthMonitor.start();

    // Subscribe to health updates
    healthMonitor.subscribe((metric) => {
      if (metric.status === 'critical') {
        console.log(`🚨 Critical issue detected: ${metric.name}`);
        this.runTestsDebounced();
      }
    });

    // Watch for file changes (simplified - in real implementation you'd use proper file watching)
    this.watchForChanges();

    // Run initial tests
    setTimeout(() => {
      this.runTests();
    }, 2000);
  }

  stop(): void {
    this.isRunning = false;
    healthMonitor.stop();
    
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }
    
    console.log('👀 Stopping Watch Mode Test Runner...');
  }

  private watchForChanges(): void {
    // In a real implementation, you'd use proper file system watching
    // For now, we'll just poll for changes in development
    if (import.meta.env.DEV) {
      // Watch for error changes in localStorage (simple change detection)
      let lastErrorCount = 0;
      
      const checkForChanges = () => {
        if (!this.isRunning) return;
        
        try {
          const errors = localStorage.getItem('last_app_error');
          const currentErrorCount = errors ? 1 : 0;
          
          if (currentErrorCount !== lastErrorCount) {
            lastErrorCount = currentErrorCount;
            console.log('📝 Error state changed, running tests...');
            this.runTestsDebounced();
          }
        } catch (error) {
          // Ignore localStorage errors
        }
        
        setTimeout(checkForChanges, 5000); // Check every 5 seconds
      };
      
      setTimeout(checkForChanges, 5000);
    }
  }

  private runTestsDebounced(): void {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }
    
    this.debounceTimeout = setTimeout(() => {
      this.runTests();
    }, 1000); // Wait 1 second before running tests
  }

  private async runTests(): Promise<void> {
    const now = Date.now();
    
    // Don't run tests too frequently
    if (now - this.lastRunTime < 10000) { // 10 seconds minimum between runs
      return;
    }
    
    this.lastRunTime = now;
    
    console.log('🔄 Running automated tests...');
    
    try {
      const results = await testRunner.runAllTests();
      const health = healthMonitor.getHealthStatus();
      
      // Combine test results with health monitoring
      const criticalIssues = results.filter(r => r.status === 'fail' && r.importance === 'CRITICAL');
      const healthIssues = health.metrics.filter(m => m.status === 'critical');
      
      if (criticalIssues.length > 0 || healthIssues.length > 0) {
        console.log('🚨 CRITICAL ISSUES DETECTED');
        console.log('===========================');
        
        if (criticalIssues.length > 0) {
          console.log('Test Failures:');
          criticalIssues.forEach(issue => {
            console.log(`  - ${issue.testName}: ${issue.error}`);
          });
        }
        
        if (healthIssues.length > 0) {
          console.log('Health Issues:');
          healthIssues.forEach(issue => {
            console.log(`  - ${issue.name}: ${issue.message}`);
          });
        }
        
        // Show recommended actions
        this.showRecommendedActions(criticalIssues, healthIssues);
      } else {
        console.log('✅ All systems healthy!');
      }
      
    } catch (error) {
      console.error('❌ Test runner failed:', error);
    }
  }

  private showRecommendedActions(testFailures: any[], healthIssues: any[]): void {
    console.log('\n🔧 RECOMMENDED ACTIONS:');
    console.log('========================');
    
    // Analyze issues and provide specific recommendations
    const allIssues = [...testFailures, ...healthIssues];
    
    if (allIssues.some(issue => 
      issue.testName?.includes('Component Loads') || 
      issue.name?.includes('blank-page')
    )) {
      console.log('📋 Component Loading Issues:');
      console.log('  1. Check browser console for import errors');
      console.log('  2. Verify all file paths are correct');
      console.log('  3. Check for circular dependencies');
      console.log('  4. Ensure all required dependencies are installed');
    }
    
    if (allIssues.some(issue => 
      issue.testName?.includes('Auth') || 
      issue.name?.includes('auth')
    )) {
      console.log('🔐 Authentication Issues:');
      console.log('  1. Check Supabase connection');
      console.log('  2. Verify auth provider is properly wrapped');
      console.log('  3. Check for auth context errors');
      console.log('  4. Review auth hooks implementation');
    }
    
    if (allIssues.some(issue => 
      issue.name?.includes('infinite-loading')
    )) {
      console.log('⏳ Loading Issues:');
      console.log('  1. Check for provider initialization deadlocks');
      console.log('  2. Add timeout protection to async operations');
      console.log('  3. Implement fallback loading states');
      console.log('  4. Review async hook dependencies');
    }
    
    if (allIssues.some(issue => 
      issue.name?.includes('memory')
    )) {
      console.log('💾 Memory Issues:');
      console.log('  1. Check for memory leaks in useEffect cleanup');
      console.log('  2. Review large component re-renders');
      console.log('  3. Implement proper component unmounting');
      console.log('  4. Use React DevTools Profiler');
    }
    
    console.log('\n🔍 For detailed diagnostics, run:');
    console.log('  console.log(__HEALTH_MONITOR__.getDiagnosticReport())');
    console.log('  console.log(__TEST_RESULTS__)');
  }
}

// Export singleton instance
export const watchRunner = new WatchModeRunner();

// Auto-start in development with delay
if (import.meta.env.DEV) {
  setTimeout(() => {
    watchRunner.start();
    
    // Make available for debugging
    (window as any).__WATCH_RUNNER__ = watchRunner;
  }, 3000);
}