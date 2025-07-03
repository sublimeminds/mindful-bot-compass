/**
 * Service Health Manager
 * Handles service loading, health checks, and graceful degradation
 */

interface ServiceConfig {
  name: string;
  loader: () => Promise<any>;
  required: boolean;
  timeout: number;
  retryAttempts: number;
}

interface ServiceStatus {
  name: string;
  status: 'loading' | 'loaded' | 'failed' | 'unavailable';
  service?: any;
  error?: string;
  lastCheck: number;
  attempts: number;
}

export class ServiceHealthManager {
  private services: Map<string, ServiceStatus> = new Map();
  private healthCheckInterval: number | null = null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    console.log('ServiceHealthManager: Initializing...');
  }

  /**
   * Register a service for health monitoring
   */
  registerService(config: ServiceConfig): void {
    this.services.set(config.name, {
      name: config.name,
      status: 'loading',
      lastCheck: Date.now(),
      attempts: 0
    });

    // Load service asynchronously
    this.loadService(config);
  }

  /**
   * Load a service with timeout and retry logic
   */
  private async loadService(config: ServiceConfig): Promise<void> {
    const status = this.services.get(config.name);
    if (!status) return;

    try {
      console.log(`ServiceHealthManager: Loading ${config.name}...`);
      status.attempts++;

      // Race between service loading and timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Service timeout')), config.timeout)
      );

      const service = await Promise.race([
        config.loader(),
        timeoutPromise
      ]);

      // Service loaded successfully
      status.status = 'loaded';
      status.service = service;
      status.lastCheck = Date.now();
      
      console.log(`ServiceHealthManager: ${config.name} loaded successfully`);
      this.notifyListeners();

    } catch (error) {
      console.warn(`ServiceHealthManager: ${config.name} failed to load:`, error);
      
      status.error = error instanceof Error ? error.message : 'Unknown error';
      status.lastCheck = Date.now();

      // Retry logic for non-required services
      if (!config.required && status.attempts < config.retryAttempts) {
        console.log(`ServiceHealthManager: Retrying ${config.name} (${status.attempts}/${config.retryAttempts})`);
        setTimeout(() => this.loadService(config), 2000 * status.attempts); // Exponential backoff
      } else {
        status.status = config.required ? 'failed' : 'unavailable';
        if (config.required) {
          console.error(`ServiceHealthManager: Required service ${config.name} failed to load`);
        }
        this.notifyListeners();
      }
    }
  }

  /**
   * Get service by name
   */
  getService<T = any>(name: string): T | null {
    const status = this.services.get(name);
    return status?.service || null;
  }

  /**
   * Check if a service is available
   */
  isServiceAvailable(name: string): boolean {
    const status = this.services.get(name);
    return status?.status === 'loaded';
  }

  /**
   * Get service status
   */
  getServiceStatus(name: string): ServiceStatus | null {
    return this.services.get(name) || null;
  }

  /**
   * Get all service statuses
   */
  getAllServices(): ServiceStatus[] {
    return Array.from(this.services.values());
  }

  /**
   * Get health summary
   */
  getHealthSummary() {
    const services = this.getAllServices();
    return {
      total: services.length,
      loaded: services.filter(s => s.status === 'loaded').length,
      failed: services.filter(s => s.status === 'failed').length,
      loading: services.filter(s => s.status === 'loading').length,
      unavailable: services.filter(s => s.status === 'unavailable').length,
      healthy: services.filter(s => s.status === 'loaded').length / services.length
    };
  }

  /**
   * Start periodic health checks
   */
  startHealthChecks(interval: number = 30000): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    this.healthCheckInterval = window.setInterval(() => {
      this.performHealthCheck();
    }, interval);

    console.log('ServiceHealthManager: Health checks started');
  }

  /**
   * Stop health checks
   */
  stopHealthChecks(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }

  /**
   * Perform health check on all services
   */
  private performHealthCheck(): void {
    const summary = this.getHealthSummary();
    console.log('ServiceHealthManager: Health check -', summary);

    // Notify listeners of health status
    this.notifyListeners();
  }

  /**
   * Add status change listener
   */
  onStatusChange(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(): void {
    this.listeners.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('ServiceHealthManager: Listener error:', error);
      }
    });
  }

  /**
   * Safe service call - returns null if service unavailable
   */
  safeCall<T>(serviceName: string, method: string, ...args: any[]): T | null {
    try {
      const service = this.getService(serviceName);
      if (!service || typeof service[method] !== 'function') {
        return null;
      }
      return service[method](...args);
    } catch (error) {
      console.warn(`ServiceHealthManager: Safe call failed for ${serviceName}.${method}:`, error);
      return null;
    }
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    this.stopHealthChecks();
    this.listeners.clear();
    this.services.clear();
  }
}

// Global service health manager instance
export const serviceHealthManager = new ServiceHealthManager();