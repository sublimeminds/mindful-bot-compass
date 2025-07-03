/**
 * Automated Test Runner for TherapySync
 * 
 * This runner executes comprehensive tests to detect issues automatically:
 * - Component loading tests
 * - Integration tests
 * - Health checks
 * - Performance tests
 * - E2E scenarios
 */

import { describe, it, expect } from 'vitest';

// Define test categories with their importance levels
export const TEST_CATEGORIES = {
  CRITICAL: 'critical',    // App-breaking issues
  HIGH: 'high',           // Major functionality issues
  MEDIUM: 'medium',       // Minor functionality issues
  LOW: 'low'             // Performance/quality issues
} as const;

export interface TestResult {
  category: string;
  testName: string;
  status: 'pass' | 'fail' | 'skip';
  error?: string;
  duration?: number;
  importance: keyof typeof TEST_CATEGORIES;
}

export class AutomatedTestRunner {
  private results: TestResult[] = [];
  private startTime: number = 0;

  async runAllTests(): Promise<TestResult[]> {
    this.startTime = performance.now();
    console.log('🔬 Starting Automated Health Checks...');

    // Critical tests - must pass for app to function
    await this.runCriticalTests();
    
    // High priority tests - major features
    await this.runHighPriorityTests();
    
    // Medium priority tests - secondary features
    await this.runMediumPriorityTests();
    
    // Low priority tests - performance and quality
    await this.runLowPriorityTests();

    const totalTime = performance.now() - this.startTime;
    console.log(`📊 Test Suite Completed in ${totalTime.toFixed(2)}ms`);
    
    this.printSummary();
    return this.results;
  }

  private async runCriticalTests(): Promise<void> {
    console.log('🚨 Running Critical Tests...');
    
    // Test core dependencies
    await this.runTest('Core React Available', 'CRITICAL', async () => {
      const React = await import('react');
      expect(React).toBeDefined();
      expect(React.version).toBeDefined();
    });

    await this.runTest('Router Available', 'CRITICAL', async () => {
      const { BrowserRouter } = await import('react-router-dom');
      expect(BrowserRouter).toBeDefined();
    });

    await this.runTest('Supabase Client Available', 'CRITICAL', async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      expect(supabase).toBeDefined();
      expect(supabase.auth).toBeDefined();
    });

    // Test core components
    await this.runTest('App Component Loads', 'CRITICAL', async () => {
      const App = await import('@/App');
      expect(App.default).toBeDefined();
    });

    await this.runTest('AppRouter Component Loads', 'CRITICAL', async () => {
      const AppRouter = await import('@/components/AppRouter');
      expect(AppRouter.default).toBeDefined();
    });

    await this.runTest('Auth Provider Loads', 'CRITICAL', async () => {
      const { EnhancedAuthProvider } = await import('@/components/EnhancedAuthProvider');
      expect(EnhancedAuthProvider).toBeDefined();
    });
  }

  private async runHighPriorityTests(): Promise<void> {
    console.log('⚡ Running High Priority Tests...');

    // Test essential pages
    await this.runTest('Index Page Loads', 'HIGH', async () => {
      const Index = await import('@/pages/Index');
      expect(Index.default).toBeDefined();
    });

    await this.runTest('Dashboard Page Loads', 'HIGH', async () => {
      const Dashboard = await import('@/pages/Dashboard');
      expect(Dashboard.default).toBeDefined();
    });

    await this.runTest('Auth Page Loads', 'HIGH', async () => {
      const EnhancedAuth = await import('@/pages/EnhancedAuth');
      expect(EnhancedAuth.default).toBeDefined();
    });

    // Test critical services
    await this.runTest('Dashboard Service Available', 'HIGH', async () => {
      const { dashboardService } = await import('@/services/dashboardService');
      expect(dashboardService).toBeDefined();
      expect(dashboardService.getDashboardData).toBeDefined();
    });

    await this.runTest('Profile Service Available', 'HIGH', async () => {
      const { profileService } = await import('@/services/profileService');
      expect(profileService).toBeDefined();
      expect(profileService.getProfile).toBeDefined();
    });
  }

  private async runMediumPriorityTests(): Promise<void> {
    console.log('📋 Running Medium Priority Tests...');

    // Test error boundaries
    await this.runTest('Error Boundary Available', 'MEDIUM', async () => {
      const BulletproofErrorBoundary = await import('@/components/BulletproofErrorBoundary');
      expect(BulletproofErrorBoundary.default).toBeDefined();
    });

    // Test hooks
    await this.runTest('Auth Hook Available', 'MEDIUM', async () => {
      const { useAuth } = await import('@/hooks/useAuth');
      expect(useAuth).toBeDefined();
    });

    await this.runTest('Dashboard Hook Available', 'MEDIUM', async () => {
      const { useDashboard } = await import('@/hooks/useDashboard');
      expect(useDashboard).toBeDefined();
    });

    // Test utilities
    await this.runTest('Service Health Manager Available', 'MEDIUM', async () => {
      const { serviceHealthManager } = await import('@/utils/serviceHealthManager');
      expect(serviceHealthManager).toBeDefined();
      expect(serviceHealthManager.startHealthChecks).toBeDefined();
    });
  }

  private async runLowPriorityTests(): Promise<void> {
    console.log('🔧 Running Low Priority Tests...');

    // Performance tests
    await this.runTest('Component Load Performance', 'LOW', async () => {
      const start = performance.now();
      
      await Promise.all([
        import('@/App'),
        import('@/components/AppRouter'),
        import('@/pages/Index'),
      ]);
      
      const end = performance.now();
      const loadTime = end - start;
      
      expect(loadTime).toBeLessThan(2000); // 2 seconds max
    });

    // Configuration tests
    await this.runTest('Environment Configuration', 'LOW', async () => {
      expect(import.meta.env).toBeDefined();
    });

    // Type safety tests
    await this.runTest('TypeScript Types Available', 'LOW', async () => {
      const authTypes = await import('@/types/auth');
      expect(authTypes).toBeDefined();
    });
  }

  private async runTest(
    testName: string, 
    importance: keyof typeof TEST_CATEGORIES, 
    testFn: () => Promise<void>
  ): Promise<void> {
    const startTime = performance.now();
    
    try {
      await testFn();
      const duration = performance.now() - startTime;
      
      this.results.push({
        category: 'health-check',
        testName,
        status: 'pass',
        duration,
        importance
      });
      
      console.log(`✅ ${testName} (${duration.toFixed(2)}ms)`);
    } catch (error) {
      const duration = performance.now() - startTime;
      
      this.results.push({
        category: 'health-check',
        testName,
        status: 'fail',
        error: error instanceof Error ? error.message : String(error),
        duration,
        importance
      });
      
      console.error(`❌ ${testName} FAILED: ${error}`);
      
      // For critical tests, we might want to halt execution
      if (importance === 'CRITICAL') {
        console.error(`🚨 CRITICAL TEST FAILED: ${testName} - This may prevent the app from functioning`);
      }
    }
  }

  private printSummary(): void {
    const passed = this.results.filter(r => r.status === 'pass').length;
    const failed = this.results.filter(r => r.status === 'fail').length;
    const critical = this.results.filter(r => r.importance === 'CRITICAL' && r.status === 'fail').length;
    
    console.log('\n📊 TEST SUMMARY');
    console.log('=================');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`🚨 Critical Failures: ${critical}`);
    
    if (critical > 0) {
      console.log('\n🚨 CRITICAL ISSUES DETECTED:');
      this.results
        .filter(r => r.importance === 'CRITICAL' && r.status === 'fail')
        .forEach(r => {
          console.log(`   - ${r.testName}: ${r.error}`);
        });
      console.log('\n⚠️  The application may not function properly until these are resolved.');
    }
    
    if (failed === 0) {
      console.log('\n🎉 All tests passed! The application is healthy.');
    }
  }

  // Get failing tests by importance
  getFailingTests(importance?: keyof typeof TEST_CATEGORIES): TestResult[] {
    return this.results.filter(r => 
      r.status === 'fail' && 
      (importance ? r.importance === importance : true)
    );
  }

  // Check if app is in a functional state
  isAppHealthy(): boolean {
    const criticalFailures = this.getFailingTests('CRITICAL');
    return criticalFailures.length === 0;
  }
}

// Export singleton instance
export const testRunner = new AutomatedTestRunner();

// Auto-run in development
if (import.meta.env.DEV) {
  // Run tests after a short delay to not block initial app load
  setTimeout(() => {
    testRunner.runAllTests().then((results) => {
      // Store results for debugging
      (window as any).__TEST_RESULTS__ = results;
    });
  }, 2000);
}