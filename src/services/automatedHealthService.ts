
interface AutomatedHealthConfig {
  checkInterval: number; // in milliseconds
  failureThreshold: number;
  recoveryActions: boolean;
}

interface HealthMetrics {
  uptime: number;
  errorRate: number;
  avgResponseTime: number;
  memoryUsage: number;
  lastCheckTime: Date;
}

class AutomatedHealthService {
  private config: AutomatedHealthConfig;
  private isMonitoring = false;
  private intervalId?: NodeJS.Timeout;
  private failureCount = 0;
  private metrics: HealthMetrics;

  constructor() {
    this.config = {
      checkInterval: 60000, // 1 minute
      failureThreshold: 3,
      recoveryActions: true
    };

    this.metrics = {
      uptime: 0,
      errorRate: 0,
      avgResponseTime: 0,
      memoryUsage: 0,
      lastCheckTime: new Date()
    };
  }

  async startMonitoring(): Promise<void> {
    if (this.isMonitoring) {
      console.log('Health monitoring already active');
      return;
    }

    this.isMonitoring = true;
    console.log('Starting automated health monitoring...');

    // Initial health check
    await this.performHealthCheck();

    // Set up periodic checks
    this.intervalId = setInterval(async () => {
      await this.performHealthCheck();
    }, this.config.checkInterval);
  }

  stopMonitoring(): void {
    if (!this.isMonitoring) return;

    this.isMonitoring = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
    console.log('Health monitoring stopped');
  }

  private async performHealthCheck(): Promise<void> {
    const startTime = Date.now();

    try {
      // Check edge function health
      const healthResponse = await this.checkEdgeFunctionHealth();
      
      // Check local application health
      const appHealth = await this.checkApplicationHealth();
      
      // Update metrics
      this.updateMetrics({
        responseTime: Date.now() - startTime,
        success: healthResponse.overall === 'healthy' && appHealth.success,
        errorDetails: healthResponse.checks.filter(c => c.status !== 'healthy')
      });

      // Handle failures
      if (healthResponse.overall !== 'healthy' || !appHealth.success) {
        this.failureCount++;
        await this.handleHealthFailure(healthResponse, appHealth);
      } else {
        this.failureCount = 0;
      }

    } catch (error) {
      console.error('Health check failed:', error);
      this.failureCount++;
      await this.handleHealthFailure(null, { success: false, error: error as Error });
    }
  }

  private async checkEdgeFunctionHealth(): Promise<any> {
    try {
      const response = await fetch('/functions/v1/automated-health-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Edge function health check failed:', error);
      return {
        overall: 'down',
        checks: [],
        recommendations: ['Edge function is unreachable']
      };
    }
  }

  private async checkApplicationHealth(): Promise<{ success: boolean; error?: Error }> {
    try {
      // Check React app health
      const reactHealth = this.checkReactHealth();
      
      // Check performance metrics
      const performanceHealth = this.checkPerformanceHealth();
      
      // Check error count
      const errorHealth = this.checkErrorHealth();

      return {
        success: reactHealth && performanceHealth && errorHealth
      };
    } catch (error) {
      return {
        success: false,
        error: error as Error
      };
    }
  }

  private checkReactHealth(): boolean {
    // Check if React is properly initialized
    if (typeof window === 'undefined') return true;
    
    // Check for React errors in console
    const errorCount = this.getRecentErrorCount();
    return errorCount < 5; // Allow some errors but not too many
  }

  private checkPerformanceHealth(): boolean {
    if (typeof window === 'undefined') return true;
    
    // Check memory usage if available
    const performance = window.performance as any;
    if (performance.memory) {
      const memoryUsage = performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit;
      return memoryUsage < 0.9; // Less than 90% memory usage
    }
    
    return true;
  }

  private checkErrorHealth(): boolean {
    // This would integrate with our error tracking
    return this.getRecentErrorCount() < 10;
  }

  private getRecentErrorCount(): number {
    // This would integrate with our error tracker
    // For now, return a simulated count
    return Math.floor(Math.random() * 3);
  }

  private updateMetrics(checkResult: { responseTime: number; success: boolean; errorDetails?: any[] }): void {
    const now = new Date();
    
    // Update uptime calculation
    const timeSinceLastCheck = now.getTime() - this.metrics.lastCheckTime.getTime();
    if (checkResult.success) {
      this.metrics.uptime = Math.min(this.metrics.uptime + timeSinceLastCheck, timeSinceLastCheck);
    }

    // Update average response time
    this.metrics.avgResponseTime = (this.metrics.avgResponseTime + checkResult.responseTime) / 2;
    
    // Update error rate
    this.metrics.errorRate = checkResult.success ? 
      Math.max(0, this.metrics.errorRate - 0.1) : 
      Math.min(1, this.metrics.errorRate + 0.1);

    // Update memory usage if available
    if (typeof window !== 'undefined' && (window.performance as any).memory) {
      const memory = (window.performance as any).memory;
      this.metrics.memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
    }

    this.metrics.lastCheckTime = now;
  }

  private async handleHealthFailure(edgeHealth: any, appHealth: { success: boolean; error?: Error }): Promise<void> {
    console.warn(`Health check failure #${this.failureCount}:`, {
      edgeHealth,
      appHealth
    });

    if (this.failureCount >= this.config.failureThreshold && this.config.recoveryActions) {
      await this.triggerRecoveryActions(edgeHealth, appHealth);
    }
  }

  private async triggerRecoveryActions(edgeHealth: any, appHealth: { success: boolean; error?: Error }): Promise<void> {
    console.log('Triggering automated recovery actions...');

    try {
      // Clear caches
      if (typeof window !== 'undefined') {
        localStorage.removeItem('app-cache');
        sessionStorage.clear();
      }

      // Trigger garbage collection if available
      if (typeof window !== 'undefined' && (window as any).gc) {
        (window as any).gc();
      }

      // Dispatch recovery event for other systems to listen to
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('automated-recovery', {
          detail: { edgeHealth, appHealth, failureCount: this.failureCount }
        }));
      }

      console.log('Recovery actions completed');
    } catch (error) {
      console.error('Recovery actions failed:', error);
    }
  }

  getMetrics(): HealthMetrics {
    return { ...this.metrics };
  }

  isActive(): boolean {
    return this.isMonitoring;
  }

  updateConfig(newConfig: Partial<AutomatedHealthConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Restart monitoring with new config if currently active
    if (this.isMonitoring) {
      this.stopMonitoring();
      this.startMonitoring();
    }
  }
}

export const automatedHealthService = new AutomatedHealthService();
