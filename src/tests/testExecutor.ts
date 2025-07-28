import { supabase } from '@/integrations/supabase/client';
import { aiTestOrchestrator } from '@/services/aiTestOrchestrator';

export interface TestExecutionConfig {
  categories: string[];
  maxConcurrentTests: number;
  timeoutMs: number;
  retryAttempts: number;
  detailedLogging: boolean;
}

export interface TestExecutionResult {
  success: boolean;
  stats: {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    warningTests: number;
    timeoutTests: number;
    overallSuccessRate: number;
  };
  totalDuration: number;
  results: Array<{
    testName: string;
    status: string;
    duration: number;
    error?: string;
  }>;
  message: string;
}

class TestExecutor {
  private isRunning = false;

  async executeTests(config: TestExecutionConfig): Promise<TestExecutionResult> {
    if (this.isRunning) {
      throw new Error('Tests are already running');
    }

    this.isRunning = true;
    console.log('🚀 Starting test execution with config:', config);

    try {
      // Execute tests using the orchestrator
      const results = await aiTestOrchestrator.executeComprehensiveTests(config);
      
      // Store execution summary
      await this.storeExecutionSummary(config, results);
      
      const message = `Tests completed: ${results.stats.passedTests} passed, ${results.stats.failedTests} failed, ${results.stats.warningTests} warnings`;
      
      return {
        success: results.stats.failedTests === 0,
        stats: results.stats,
        totalDuration: results.totalDuration,
        results: results.results.map((r: any) => ({
          testName: r.testName,
          status: r.status,
          duration: r.duration || 0,
          error: r.error
        })),
        message
      };

    } catch (error) {
      console.error('❌ Test execution failed:', error);
      
      // Store error result
      await this.storeErrorResult(config, error);
      
      throw new Error(`Test execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      this.isRunning = false;
    }
  }

  private async storeExecutionSummary(config: TestExecutionConfig, results: any): Promise<void> {
    try {
      const { error } = await supabase
        .from('ai_test_results')
        .insert({
          test_name: 'test_execution_summary',
          test_category: 'execution',
          status: results.stats.failedTests === 0 ? 'passed' : 'warning',
          duration: results.totalDuration,
          execution_metadata: {
            config: JSON.parse(JSON.stringify(config)),
            stats: results.stats,
            timestamp: new Date().toISOString(),
            execution_id: crypto.randomUUID()
          } as any
        });

      if (error) {
        console.error('Failed to store execution summary:', error);
      } else {
        console.log('✅ Execution summary stored successfully');
      }
    } catch (error) {
      console.error('Error storing execution summary:', error);
    }
  }

  private async storeErrorResult(config: TestExecutionConfig, error: any): Promise<void> {
    try {
      const { error: dbError } = await supabase
        .from('ai_test_results')
        .insert({
          test_name: 'test_execution_error',
          test_category: 'execution',
          status: 'failed',
          duration: 0,
          error_message: error instanceof Error ? error.message : String(error),
          execution_metadata: {
            config: JSON.parse(JSON.stringify(config)),
            timestamp: new Date().toISOString(),
            error_type: 'execution_failure'
          } as any
        });

      if (dbError) {
        console.error('Failed to store error result:', dbError);
      }
    } catch (err) {
      console.error('Error storing error result:', err);
    }
  }

  async getTestHistory(limit: number = 50): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('ai_test_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching test history:', error);
      return [];
    }
  }

  async runQuickHealthCheck(): Promise<TestExecutionResult> {
    const config: TestExecutionConfig = {
      categories: ['infrastructure'],
      maxConcurrentTests: 2,
      timeoutMs: 10000,
      retryAttempts: 1,
      detailedLogging: false
    };

    return this.executeTests(config);
  }

  async runComprehensiveTests(): Promise<TestExecutionResult> {
    const config: TestExecutionConfig = {
      categories: ['infrastructure', 'edge-functions', 'crisis-scenarios'],
      maxConcurrentTests: 4,
      timeoutMs: 25000,
      retryAttempts: 2,
      detailedLogging: true
    };

    return this.executeTests(config);
  }

  isTestRunning(): boolean {
    return this.isRunning;
  }
}

export const testExecutor = new TestExecutor();