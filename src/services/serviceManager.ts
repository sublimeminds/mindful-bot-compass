// Service Manager - Single initialization point for all services
import { cacheService } from './cachingService';
import { LanguageRouter } from '@/utils/languageRouting';

interface ServiceState {
  language: boolean;
  currency: boolean;
  seo: boolean;
  cache: boolean;
}

interface ServiceConfig {
  timeouts: {
    language: number;
    currency: number;
    seo: number;
  };
  retries: {
    max: number;
    delay: number;
  };
}

class ServiceManager {
  private state: ServiceState = {
    language: false,
    currency: false,
    seo: false,
    cache: false
  };

  private config: ServiceConfig = {
    timeouts: {
      language: 2000,
      currency: 3000,
      seo: 1000
    },
    retries: {
      max: 2,
      delay: 500
    }
  };

  private initPromise: Promise<void> | null = null;
  private healthTimer: NodeJS.Timeout | null = null;

  async initialize(): Promise<void> {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this.runInitialization();
    return this.initPromise;
  }

  private async runInitialization(): Promise<void> {
    console.log('[ServiceManager] Starting sequential initialization...');
    
    try {
      // Initialize services one by one to prevent cascading failures
      console.log('[ServiceManager] Initializing cache...');
      await this.initializeCache();
      
      console.log('[ServiceManager] Initializing language...');
      await this.initializeLanguage();
      
      console.log('[ServiceManager] Essential services ready');
      
      // Phase 2: Secondary services (completely background, no await)
      setTimeout(() => this.initializeSecondaryServices(), 1000);
      
    } catch (error) {
      console.warn('[ServiceManager] Service initialization had issues, continuing with defaults:', error);
      // Don't throw, allow app to continue with defaults
    }
  }

  private async initializeCache(): Promise<void> {
    try {
      // Cache is always available, just mark as ready
      this.state.cache = true;
      console.log('[ServiceManager] Cache service ready');
    } catch (error) {
      console.warn('[ServiceManager] Cache initialization failed:', error);
    }
  }

  private async initializeLanguage(): Promise<void> {
    try {
      await this.withTimeout(
        () => {
          LanguageRouter.initializeLanguageRouting();
          this.state.language = true;
        },
        this.config.timeouts.language
      );
      console.log('[ServiceManager] Language service ready');
    } catch (error) {
      console.warn('[ServiceManager] Language initialization failed:', error);
      // Set default fallback
      document.documentElement.lang = 'en';
      this.state.language = true;
    }
  }

  private async initializeSecondaryServices(): Promise<void> {
    // Run secondary services in background without blocking
    setTimeout(async () => {
      try {
        // Initialize SEO in background
        await this.initializeSEO();
      } catch (error) {
        console.warn('[ServiceManager] SEO initialization failed:', error);
      }
    }, 100);
  }

  private async initializeSEO(): Promise<void> {
    try {
      // Only do basic SEO setup, no async DB calls
      this.state.seo = true;
      console.log('[ServiceManager] SEO service ready (basic)');
    } catch (error) {
      console.warn('[ServiceManager] SEO initialization failed:', error);
    }
  }

  private async withTimeout<T>(
    operation: () => Promise<T> | T,
    timeout: number
  ): Promise<T> {
    return Promise.race([
      Promise.resolve(operation()),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Service timeout')), timeout)
      )
    ]);
  }

  isReady(service?: keyof ServiceState): boolean {
    if (service) {
      return this.state[service];
    }
    return this.state.language && this.state.cache;
  }

  getHealthStatus() {
    return {
      ...this.state,
      overall: this.isReady(),
      timestamp: Date.now()
    };
  }

  startHealthMonitoring(): void {
    this.healthTimer = setInterval(() => {
      const health = this.getHealthStatus();
      if (!health.overall) {
        console.warn('[ServiceManager] Health check failed:', health);
      }
    }, 30000); // Check every 30 seconds
  }

  stopHealthMonitoring(): void {
    if (this.healthTimer) {
      clearInterval(this.healthTimer);
      this.healthTimer = null;
    }
  }

  destroy(): void {
    this.stopHealthMonitoring();
    this.initPromise = null;
    this.state = {
      language: false,
      currency: false,
      seo: false,
      cache: false
    };
  }
}

export const serviceManager = new ServiceManager();
export default ServiceManager;