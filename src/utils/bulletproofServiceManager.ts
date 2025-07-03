import React from 'react';

interface ServiceHealthState {
  initialized: boolean;
  errors: string[];
  services: {
    [key: string]: {
      status: 'loading' | 'ready' | 'error';
      error?: string;
    };
  };
}

// Bulletproof service manager with graceful degradation
export class BulletproofServiceManager {
  private state: ServiceHealthState = {
    initialized: false,
    errors: [],
    services: {}
  };

  private observers: ((state: ServiceHealthState) => void)[] = [];

  async initializeServices(): Promise<void> {
    console.log('BulletproofServiceManager: Starting service initialization');

    const services = [
      { name: 'performanceService', critical: false },
      { name: 'rateLimitService', critical: false },
      { name: 'i18n', critical: false },
      { name: 'cssProtection', critical: false }
    ];

    // Initialize services in parallel with error isolation
    const results = await Promise.allSettled(
      services.map(service => this.initializeService(service.name, service.critical))
    );

    // Process results
    results.forEach((result, index) => {
      const serviceName = services[index].name;
      
      if (result.status === 'rejected') {
        console.warn(`BulletproofServiceManager: ${serviceName} failed:`, result.reason);
        this.updateServiceStatus(serviceName, 'error', result.reason?.message || 'Unknown error');
      } else {
        this.updateServiceStatus(serviceName, 'ready');
      }
    });

    this.state.initialized = true;
    this.notifyObservers();
    
    console.log('BulletproofServiceManager: Service initialization complete', this.state);
  }

  private async initializeService(name: string, critical: boolean): Promise<void> {
    this.updateServiceStatus(name, 'loading');

    try {
      switch (name) {
        case 'performanceService':
          await this.initPerformanceService();
          break;
        case 'rateLimitService':
          await this.initRateLimitService();
          break;
        case 'i18n':
          await this.initI18nService();
          break;
        case 'cssProtection':
          await this.initCSSProtection();
          break;
        default:
          throw new Error(`Unknown service: ${name}`);
      }
    } catch (error) {
      if (critical) {
        throw error;
      }
      // Non-critical services fail gracefully
      console.warn(`BulletproofServiceManager: Non-critical service ${name} failed:`, error);
      throw error;
    }
  }

  private async initPerformanceService(): Promise<void> {
    try {
      const module = await import('../services/performanceService');
      const service = module.performanceService;
      
      if (service && typeof service.startPerformanceMonitoring === 'function') {
        service.startPerformanceMonitoring();
        service.monitorMemoryUsage?.();
        service.recordMetric?.('AppStartup', performance.now());
      }
    } catch (error) {
      console.warn('Performance service not available:', error);
    }
  }

  private async initRateLimitService(): Promise<void> {
    try {
      const module = await import('../services/rateLimitService');
      const service = module.rateLimitService;
      
      if (service && typeof service.startCleanup === 'function') {
        service.startCleanup();
      }
    } catch (error) {
      console.warn('Rate limit service not available:', error);
    }
  }

  private async initI18nService(): Promise<void> {
    try {
      await import('../i18n');
    } catch (error) {
      console.warn('i18n service not available:', error);
    }
  }

  private async initCSSProtection(): Promise<void> {
    try {
      const { CSSProtection } = await import('../utils/cssProtection');
      if (CSSProtection && typeof CSSProtection.init === 'function') {
        CSSProtection.init();
      }
    } catch (error) {
      console.warn('CSS protection not available:', error);
    }
  }

  private updateServiceStatus(name: string, status: 'loading' | 'ready' | 'error', error?: string): void {
    this.state.services[name] = { status, error };
    this.notifyObservers();
  }

  private notifyObservers(): void {
    this.observers.forEach(observer => {
      try {
        observer(this.state);
      } catch (error) {
        console.error('BulletproofServiceManager: Observer error:', error);
      }
    });
  }

  getState(): ServiceHealthState {
    return { ...this.state };
  }

  subscribe(observer: (state: ServiceHealthState) => void): () => void {
    this.observers.push(observer);
    return () => {
      const index = this.observers.indexOf(observer);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    };
  }
}

export const bulletproofServiceManager = new BulletproofServiceManager();