/**
 * Dependency Manager - Handles progressive loading of app dependencies
 */

interface DependencyConfig {
  name: string;
  loader: () => Promise<any>;
  required: boolean;
  timeout: number;
  retryAttempts: number;
  fallback?: any;
  healthCheck?: () => Promise<boolean>;
}

interface DependencyStatus {
  name: string;
  status: 'pending' | 'loading' | 'loaded' | 'failed' | 'fallback';
  dependency?: any;
  error?: string;
  loadTime?: number;
  attempts: number;
}

interface LoadResult {
  success: boolean;
  dependencies: Record<string, any>;
  fallbacks: string[];
  errors: Record<string, string>;
}

class DependencyManager {
  private dependencies: Map<string, DependencyStatus> = new Map();
  private configs: Map<string, DependencyConfig> = new Map();
  private listeners: Set<(status: Map<string, DependencyStatus>) => void> = new Set();

  constructor() {
    console.log('DependencyManager: Initializing...');
  }

  /**
   * Register a dependency for management
   */
  register(config: DependencyConfig): void {
    this.configs.set(config.name, config);
    this.dependencies.set(config.name, {
      name: config.name,
      status: 'pending',
      attempts: 0
    });

    console.log(`DependencyManager: Registered ${config.name}`);
  }

  /**
   * Load a single dependency with timeout and retry logic
   */
  private async loadDependency(name: string): Promise<void> {
    const config = this.configs.get(name);
    const status = this.dependencies.get(name);
    
    if (!config || !status) return;

    status.status = 'loading';
    status.attempts++;
    this.notifyListeners();

    const startTime = Date.now();

    try {
      console.log(`DependencyManager: Loading ${name} (attempt ${status.attempts})`);

      // Race between dependency loading and timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`${name} timeout`)), config.timeout)
      );

      const dependency = await Promise.race([
        config.loader(),
        timeoutPromise
      ]);

      // Health check if provided
      if (config.healthCheck) {
        const isHealthy = await config.healthCheck();
        if (!isHealthy) {
          throw new Error(`${name} failed health check`);
        }
      }

      // Success
      status.status = 'loaded';
      status.dependency = dependency;
      status.loadTime = Date.now() - startTime;
      status.error = undefined;
      
      console.log(`DependencyManager: ${name} loaded successfully in ${status.loadTime}ms`);
      this.notifyListeners();

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.warn(`DependencyManager: ${name} failed (attempt ${status.attempts}):`, errorMsg);
      
      status.error = errorMsg;
      status.loadTime = Date.now() - startTime;

      // Retry logic
      if (status.attempts < config.retryAttempts) {
        console.log(`DependencyManager: Retrying ${name} in ${status.attempts * 1000}ms`);
        setTimeout(() => this.loadDependency(name), status.attempts * 1000);
        return;
      }

      // Use fallback if available
      if (config.fallback) {
        console.log(`DependencyManager: Using fallback for ${name}`);
        status.status = 'fallback';
        status.dependency = config.fallback;
      } else if (config.required) {
        status.status = 'failed';
        console.error(`DependencyManager: Required dependency ${name} failed`);
      } else {
        status.status = 'failed';
        console.log(`DependencyManager: Optional dependency ${name} failed, continuing`);
      }

      this.notifyListeners();
    }
  }

  /**
   * Load all dependencies progressively
   */
  async loadAll(): Promise<LoadResult> {
    console.log('DependencyManager: Loading all dependencies...');
    
    const startTime = Date.now();
    const loadPromises: Promise<void>[] = [];

    // Start loading all dependencies
    for (const [name] of this.configs) {
      loadPromises.push(this.loadDependency(name));
    }

    // Wait for all to complete
    await Promise.allSettled(loadPromises);

    // Compile results
    const dependencies: Record<string, any> = {};
    const fallbacks: string[] = [];
    const errors: Record<string, string> = {};
    let hasRequiredFailures = false;

    for (const [name, status] of this.dependencies) {
      if (status.status === 'loaded' || status.status === 'fallback') {
        dependencies[name] = status.dependency;
        if (status.status === 'fallback') {
          fallbacks.push(name);
        }
      } else if (status.status === 'failed') {
        errors[name] = status.error || 'Unknown error';
        const config = this.configs.get(name);
        if (config?.required) {
          hasRequiredFailures = true;
        }
      }
    }

    const totalTime = Date.now() - startTime;
    const success = !hasRequiredFailures;

    console.log(`DependencyManager: Load complete in ${totalTime}ms. Success: ${success}`);
    console.log(`Dependencies: ${Object.keys(dependencies).length}, Fallbacks: ${fallbacks.length}, Errors: ${Object.keys(errors).length}`);

    return {
      success,
      dependencies,
      fallbacks,
      errors
    };
  }

  /**
   * Get dependency status
   */
  getStatus(name: string): DependencyStatus | null {
    return this.dependencies.get(name) || null;
  }

  /**
   * Get all statuses
   */
  getAllStatuses(): Map<string, DependencyStatus> {
    return new Map(this.dependencies);
  }

  /**
   * Get health summary
   */
  getHealthSummary() {
    const statuses = Array.from(this.dependencies.values());
    return {
      total: statuses.length,
      loaded: statuses.filter(s => s.status === 'loaded').length,
      fallback: statuses.filter(s => s.status === 'fallback').length,
      failed: statuses.filter(s => s.status === 'failed').length,
      loading: statuses.filter(s => s.status === 'loading').length,
      pending: statuses.filter(s => s.status === 'pending').length,
      healthy: statuses.filter(s => s.status === 'loaded' || s.status === 'fallback').length / statuses.length
    };
  }

  /**
   * Add status change listener
   */
  onStatusChange(callback: (status: Map<string, DependencyStatus>) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Notify listeners of status changes
   */
  private notifyListeners(): void {
    this.listeners.forEach(callback => {
      try {
        callback(new Map(this.dependencies));
      } catch (error) {
        console.error('DependencyManager: Listener error:', error);
      }
    });
  }

  /**
   * Clear all dependencies and reset
   */
  reset(): void {
    this.dependencies.clear();
    this.configs.clear();
    this.listeners.clear();
    console.log('DependencyManager: Reset complete');
  }

  /**
   * Reload a specific dependency
   */
  async reload(name: string): Promise<boolean> {
    const status = this.dependencies.get(name);
    if (!status) return false;

    // Reset status
    status.status = 'pending';
    status.attempts = 0;
    status.error = undefined;

    // Reload
    await this.loadDependency(name);
    
    // Check final status after reload
    const finalStatus = this.dependencies.get(name);
    return finalStatus?.status === 'loaded' || finalStatus?.status === 'fallback';
  }
}

export const dependencyManager = new DependencyManager();