import { testExecutor } from './testExecutor';
import { supabase } from '@/integrations/supabase/client';

class AutoTestRunner {
  private interval: NodeJS.Timeout | null = null;
  private isEnabled = false;

  start(intervalMinutes: number = 30) {
    if (this.interval) {
      console.log('Auto test runner is already running');
      return;
    }

    this.isEnabled = true;
    console.log(`🔄 Starting auto test runner (every ${intervalMinutes} minutes)`);

    // Run initial test
    this.runHealthCheck();

    // Set up interval
    this.interval = setInterval(() => {
      if (this.isEnabled && !testExecutor.isTestRunning()) {
        this.runHealthCheck();
      }
    }, intervalMinutes * 60 * 1000);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isEnabled = false;
    console.log('🛑 Auto test runner stopped');
  }

  private async runHealthCheck() {
    try {
      console.log('🔍 Running automated health check...');
      const result = await testExecutor.runQuickHealthCheck();
      
      console.log(`✅ Health check completed: ${result.message}`);
      
      // Store auto-run marker
      await this.storeAutoRunResult(result);
      
    } catch (error) {
      console.error('❌ Automated health check failed:', error);
      await this.storeAutoRunError(error);
    }
  }

  private async storeAutoRunResult(result: any) {
    try {
      await supabase
        .from('ai_test_results')
        .insert([{
          test_name: 'automated_health_check',
          test_category: 'monitoring',
          status: result.success ? 'passed' : 'warning',
          duration: result.totalDuration,
          execution_metadata: {
            auto_run: true,
            timestamp: new Date().toISOString(),
            stats: result.stats
          }
        }]);
    } catch (error) {
      console.error('Failed to store auto-run result:', error);
    }
  }

  private async storeAutoRunError(error: any) {
    try {
      await supabase
        .from('ai_test_results')
        .insert([{
          test_name: 'automated_health_check_error',
          test_category: 'monitoring',
          status: 'failed',
          duration: 0,
          error_message: error instanceof Error ? error.message : String(error),
          execution_metadata: {
            auto_run: true,
            timestamp: new Date().toISOString(),
            error_type: 'auto_health_check_failure'
          }
        }]);
    } catch (dbError) {
      console.error('Failed to store auto-run error:', dbError);
    }
  }

  isRunning(): boolean {
    return this.interval !== null;
  }
}

export const autoTestRunner = new AutoTestRunner();

// Start auto testing when module loads (in production/development)
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'test') {
  // Start with a 15-minute interval for development, 30 minutes for production
  const interval = process.env.NODE_ENV === 'development' ? 15 : 30;
  
  // Delay start by 30 seconds to allow app to fully initialize
  setTimeout(() => {
    autoTestRunner.start(interval);
  }, 30000);
}