/**
 * Auto-Recovery System - Intelligent retry logic with exponential backoff
 */

interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
  jitter: boolean;
}

interface RecoveryStrategy {
  name: string;
  condition: (error: any) => boolean;
  action: () => Promise<boolean>;
  priority: number;
}

interface AutoRecoveryState {
  isRunning: boolean;
  currentStrategy?: string;
  attempts: number;
  lastAttempt: number;
  successfulRecoveries: string[];
  failedRecoveries: string[];
}

class AutoRecoverySystem {
  private config: RetryConfig = {
    maxAttempts: 5,
    baseDelay: 1000,
    maxDelay: 30000,
    backoffFactor: 2,
    jitter: true
  };

  private state: AutoRecoveryState = {
    isRunning: false,
    attempts: 0,
    lastAttempt: 0,
    successfulRecoveries: [],
    failedRecoveries: []
  };

  private strategies: RecoveryStrategy[] = [
    {
      name: 'clearCache',
      condition: (error) => error?.message?.includes('cache') || error?.message?.includes('import'),
      action: async () => {
        try {
          // Clear various caches
          if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map(name => caches.delete(name)));
          }
          
          // Clear localStorage recovery flags
          localStorage.removeItem('app_recovery_state');
          localStorage.removeItem('last_error');
          
          return true;
        } catch {
          return false;
        }
      },
      priority: 1
    },
    {
      name: 'reinitializeServices',
      condition: (error) => error?.message?.includes('service') || error?.message?.includes('dependency'),
      action: async () => {
        try {
          // Reinitialize service health manager
          const { serviceHealthManager } = await import('./serviceHealthManager');
          serviceHealthManager.cleanup();
          serviceHealthManager.startHealthChecks(5000);
          
          return true;
        } catch {
          return false;
        }
      },
      priority: 2
    },
    {
      name: 'resetModuleCache',
      condition: (error) => error?.message?.includes('module') || error?.message?.includes('Component'),
      action: async () => {
        try {
          // Reset module reloader
          const { moduleReloader } = await import('./moduleReloader');
          moduleReloader.clearCache();
          
          return true;
        } catch {
          return false;
        }
      },
      priority: 3
    },
    {
      name: 'forceComponentReload',
      condition: (error) => error?.message?.includes('render') || error?.message?.includes('Element'),
      action: async () => {
        try {
          // Force re-render by clearing React cache
          if ('__REACT_DEVTOOLS_GLOBAL_HOOK__' in window) {
            const hook = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
            if (hook && hook.renderers) {
              hook.renderers.clear();
            }
          }
          
          return true;
        } catch {
          return false;
        }
      },
      priority: 4
    },
    {
      name: 'networkRecovery',
      condition: (error) => error?.message?.includes('network') || error?.message?.includes('fetch'),
      action: async () => {
        try {
          // Test network connectivity
          await fetch('/', { method: 'HEAD', cache: 'no-cache' });
          
          // Wait for network to stabilize
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          return true;
        } catch {
          return false;
        }
      },
      priority: 5
    }
  ];

  /**
   * Attempt automatic recovery for a given error
   */
  async attemptRecovery(error: any): Promise<boolean> {
    if (this.state.isRunning) {
      console.log('AutoRecovery: Recovery already in progress');
      return false;
    }

    this.state.isRunning = true;
    this.state.attempts = 0;
    this.state.lastAttempt = Date.now();

    console.log('AutoRecovery: Starting recovery process for error:', error?.message);

    try {
      // Find applicable strategies
      const applicableStrategies = this.strategies
        .filter(strategy => strategy.condition(error))
        .sort((a, b) => a.priority - b.priority);

      if (applicableStrategies.length === 0) {
        console.log('AutoRecovery: No applicable strategies found');
        return false;
      }

      // Try each strategy with retry logic
      for (const strategy of applicableStrategies) {
        const success = await this.executeStrategyWithRetry(strategy);
        
        if (success) {
          this.state.successfulRecoveries.push(strategy.name);
          console.log(`AutoRecovery: Successfully recovered using strategy: ${strategy.name}`);
          return true;
        } else {
          this.state.failedRecoveries.push(strategy.name);
        }
      }

      console.log('AutoRecovery: All strategies failed');
      return false;

    } finally {
      this.state.isRunning = false;
    }
  }

  /**
   * Execute a recovery strategy with exponential backoff retry
   */
  private async executeStrategyWithRetry(strategy: RecoveryStrategy): Promise<boolean> {
    this.state.currentStrategy = strategy.name;
    
    for (let attempt = 1; attempt <= this.config.maxAttempts; attempt++) {
      this.state.attempts = attempt;
      
      try {
        console.log(`AutoRecovery: Attempting ${strategy.name} (${attempt}/${this.config.maxAttempts})`);
        
        const success = await Promise.race([
          strategy.action(),
          new Promise<boolean>((_, reject) => 
            setTimeout(() => reject(new Error('Strategy timeout')), 10000)
          )
        ]);

        if (success) {
          console.log(`AutoRecovery: Strategy ${strategy.name} succeeded on attempt ${attempt}`);
          return true;
        }

      } catch (error) {
        console.warn(`AutoRecovery: Strategy ${strategy.name} failed on attempt ${attempt}:`, error);
      }

      // Wait before next attempt (exponential backoff with jitter)
      if (attempt < this.config.maxAttempts) {
        const delay = this.calculateDelay(attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    return false;
  }

  /**
   * Calculate delay for exponential backoff with optional jitter
   */
  private calculateDelay(attempt: number): number {
    let delay = this.config.baseDelay * Math.pow(this.config.backoffFactor, attempt - 1);
    delay = Math.min(delay, this.config.maxDelay);

    if (this.config.jitter) {
      // Add random jitter (±25%)
      const jitterRange = delay * 0.25;
      delay += (Math.random() - 0.5) * 2 * jitterRange;
    }

    return Math.max(delay, 100); // Minimum delay of 100ms
  }

  /**
   * Add custom recovery strategy
   */
  addStrategy(strategy: RecoveryStrategy): void {
    this.strategies.push(strategy);
    this.strategies.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Update retry configuration
   */
  updateConfig(newConfig: Partial<RetryConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get current recovery state
   */
  getState(): AutoRecoveryState {
    return { ...this.state };
  }

  /**
   * Reset recovery state
   */
  reset(): void {
    this.state = {
      isRunning: false,
      attempts: 0,
      lastAttempt: 0,
      successfulRecoveries: [],
      failedRecoveries: []
    };
  }

  /**
   * Get recovery statistics
   */
  getStats() {
    return {
      totalRecoveries: this.state.successfulRecoveries.length + this.state.failedRecoveries.length,
      successRate: this.state.successfulRecoveries.length / 
        (this.state.successfulRecoveries.length + this.state.failedRecoveries.length) * 100,
      successfulStrategies: [...new Set(this.state.successfulRecoveries)],
      failedStrategies: [...new Set(this.state.failedRecoveries)],
      isActive: this.state.isRunning
    };
  }
}

export const autoRecoverySystem = new AutoRecoverySystem();