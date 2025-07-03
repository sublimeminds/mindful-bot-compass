/**
 * Safe Service Manager - Phase 3
 * Non-blocking service initialization with proper error handling
 */

interface SafeServiceConfig {
  name: string;
  loader: () => Promise<any>;
  required: boolean;
  timeout: number;
}

class SafeServiceManager {
  private services = new Map<string, any>();
  private isInitialized = false;

  async initializeServices() {
    if (this.isInitialized) return;
    
    console.log('SafeServiceManager: Starting background service initialization...');
    
    // Initialize services in background without blocking render
    setTimeout(async () => {
      await this.loadService('i18n', async () => {
        const module = await import('@/i18n');
        return module;
      });
      
      console.log('SafeServiceManager: Background services loaded');
    }, 100);
    
    this.isInitialized = true;
  }

  private async loadService(name: string, loader: () => Promise<any>) {
    try {
      const service = await Promise.race([
        loader(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Service timeout')), 3000)
        )
      ]);
      
      this.services.set(name, service);
      console.log(`SafeServiceManager: ${name} loaded successfully`);
    } catch (error) {
      console.warn(`SafeServiceManager: ${name} failed to load:`, error);
      // App continues without this service
    }
  }

  getService<T = any>(name: string): T | null {
    return this.services.get(name) || null;
  }
}

export const safeServiceManager = new SafeServiceManager();