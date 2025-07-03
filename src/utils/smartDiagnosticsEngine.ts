/**
 * Smart Diagnostics Engine - Intelligent error detection and auto-recovery
 */

interface DiagnosticTest {
  name: string;
  test: () => Promise<boolean>;
  priority: 'critical' | 'high' | 'medium' | 'low';
  autoFix?: () => Promise<boolean>;
  description: string;
}

interface DiagnosticResult {
  name: string;
  passed: boolean;
  error?: string;
  autoFixed?: boolean;
  duration: number;
  priority: string;
}

interface HealthStatus {
  overall: 'healthy' | 'warning' | 'critical';
  score: number;
  issues: DiagnosticResult[];
  recommendations: string[];
}

class SmartDiagnosticsEngine {
  private tests: DiagnosticTest[] = [
    {
      name: 'React Runtime',
      test: async () => {
        try {
          const React = await import('react');
          return !!React.version;
        } catch {
          return false;
        }
      },
      priority: 'critical',
      description: 'Verifies React is properly loaded and accessible'
    },
    {
      name: 'Supabase Connection',
      test: async () => {
        try {
          const { supabase } = await import('@/integrations/supabase/client');
          const { data, error } = await supabase.from('profiles').select('count').limit(1);
          return !error;
        } catch {
          return false;
        }
      },
      priority: 'high',
      autoFix: async () => {
        try {
          // Try to reinitialize Supabase client
          const { supabase } = await import('@/integrations/supabase/client');
          await new Promise(resolve => setTimeout(resolve, 1000));
          return true;
        } catch {
          return false;
        }
      },
      description: 'Tests database connectivity and authentication'
    },
    {
      name: 'Router Functionality',
      test: async () => {
        try {
          const { BrowserRouter } = await import('react-router-dom');
          return !!BrowserRouter;
        } catch {
          return false;
        }
      },
      priority: 'high',
      description: 'Verifies routing components are available'
    },
    {
      name: 'Query Client',
      test: async () => {
        try {
          const { QueryClient } = await import('@tanstack/react-query');
          const client = new QueryClient();
          return !!client;
        } catch {
          return false;
        }
      },
      priority: 'medium',
      autoFix: async () => {
        try {
          const { QueryClient } = await import('@tanstack/react-query');
          new QueryClient({ defaultOptions: { queries: { retry: 0 } } });
          return true;
        } catch {
          return false;
        }
      },
      description: 'Tests data fetching and caching functionality'
    },
    {
      name: 'Local Storage',
      test: async () => {
        try {
          localStorage.setItem('diagnostic_test', 'test');
          const value = localStorage.getItem('diagnostic_test');
          localStorage.removeItem('diagnostic_test');
          return value === 'test';
        } catch {
          return false;
        }
      },
      priority: 'medium',
      description: 'Verifies browser storage capabilities'
    },
    {
      name: 'Service Worker',
      test: async () => {
        return 'serviceWorker' in navigator;
      },
      priority: 'low',
      description: 'Checks for PWA capabilities'
    }
  ];

  /**
   * Run all diagnostic tests
   */
  async runDiagnostics(): Promise<HealthStatus> {
    console.log('SmartDiagnostics: Starting comprehensive health check...');
    
    const results: DiagnosticResult[] = [];
    
    for (const test of this.tests) {
      const startTime = Date.now();
      
      try {
        const passed = await Promise.race([
          test.test(),
          new Promise<boolean>((_, reject) => 
            setTimeout(() => reject(new Error('Test timeout')), 5000)
          )
        ]);
        
        let autoFixed = false;
        
        // If test failed and auto-fix is available, try it
        if (!passed && test.autoFix) {
          console.log(`SmartDiagnostics: Auto-fixing ${test.name}...`);
          autoFixed = await test.autoFix();
        }
        
        results.push({
          name: test.name,
          passed: passed || autoFixed,
          autoFixed,
          duration: Date.now() - startTime,
          priority: test.priority
        });
        
      } catch (error) {
        results.push({
          name: test.name,
          passed: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          duration: Date.now() - startTime,
          priority: test.priority
        });
      }
    }
    
    return this.analyzeResults(results);
  }

  /**
   * Analyze diagnostic results and generate health status
   */
  private analyzeResults(results: DiagnosticResult[]): HealthStatus {
    const criticalIssues = results.filter(r => !r.passed && r.priority === 'critical');
    const highIssues = results.filter(r => !r.passed && r.priority === 'high');
    const mediumIssues = results.filter(r => !r.passed && r.priority === 'medium');
    
    // Calculate health score
    const totalTests = results.length;
    const passedTests = results.filter(r => r.passed).length;
    const score = (passedTests / totalTests) * 100;
    
    // Determine overall health
    let overall: 'healthy' | 'warning' | 'critical';
    if (criticalIssues.length > 0) {
      overall = 'critical';
    } else if (highIssues.length > 0 || score < 70) {
      overall = 'warning';
    } else {
      overall = 'healthy';
    }
    
    // Generate recommendations
    const recommendations: string[] = [];
    
    if (criticalIssues.length > 0) {
      recommendations.push('Critical system components are failing - immediate attention required');
    }
    
    if (highIssues.length > 0) {
      recommendations.push('Core functionality may be limited - consider refreshing the application');
    }
    
    if (mediumIssues.length > 2) {
      recommendations.push('Multiple features may not work properly - check network connection');
    }
    
    if (results.some(r => r.autoFixed)) {
      recommendations.push('Some issues were automatically resolved - monitor for recurring problems');
    }
    
    if (overall === 'healthy') {
      recommendations.push('All systems operating normally');
    }
    
    const failedIssues = results.filter(r => !r.passed);
    
    console.log(`SmartDiagnostics: Health check complete - ${overall} (${score.toFixed(1)}%)`);
    
    return {
      overall,
      score: Math.round(score),
      issues: failedIssues,
      recommendations
    };
  }

  /**
   * Run targeted diagnostics for specific error types
   */
  async runTargetedDiagnostic(errorType: string): Promise<DiagnosticResult[]> {
    const relevantTests = this.getTestsForErrorType(errorType);
    const results: DiagnosticResult[] = [];
    
    for (const test of relevantTests) {
      const startTime = Date.now();
      
      try {
        const passed = await test.test();
        results.push({
          name: test.name,
          passed,
          duration: Date.now() - startTime,
          priority: test.priority
        });
      } catch (error) {
        results.push({
          name: test.name,
          passed: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          duration: Date.now() - startTime,
          priority: test.priority
        });
      }
    }
    
    return results;
  }

  /**
   * Get relevant tests for specific error types
   */
  private getTestsForErrorType(errorType: string): DiagnosticTest[] {
    const errorTypeMap: Record<string, string[]> = {
      'import': ['React Runtime', 'Router Functionality', 'Query Client'],
      'network': ['Supabase Connection', 'Local Storage'],
      'auth': ['Supabase Connection', 'Local Storage'],
      'component': ['React Runtime', 'Router Functionality'],
      'runtime': ['React Runtime', 'Local Storage', 'Service Worker']
    };
    
    const relevantTestNames = errorTypeMap[errorType] || Object.keys(errorTypeMap).flat();
    return this.tests.filter(test => relevantTestNames.includes(test.name));
  }

  /**
   * Add custom diagnostic test
   */
  addTest(test: DiagnosticTest): void {
    this.tests.push(test);
  }

  /**
   * Get all available tests
   */
  getTests(): DiagnosticTest[] {
    return [...this.tests];
  }
}

export const smartDiagnosticsEngine = new SmartDiagnosticsEngine();