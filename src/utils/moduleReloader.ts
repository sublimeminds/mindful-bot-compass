
interface ModuleCache {
  [key: string]: any;
}

interface ReloadOptions {
  clearCache?: boolean;
  retryCount?: number;
  fallbackModule?: any;
}

class ModuleReloader {
  private cache: ModuleCache = {};
  private failedModules = new Set<string>();
  private reloadAttempts = new Map<string, number>();

  async reloadModule(modulePath: string, options: ReloadOptions = {}): Promise<any> {
    const { clearCache = true, retryCount = 3, fallbackModule } = options;

    try {
      // Clear from cache if requested
      if (clearCache && this.cache[modulePath]) {
        delete this.cache[modulePath];
      }

      // Track reload attempts
      const attempts = this.reloadAttempts.get(modulePath) || 0;
      if (attempts >= retryCount) {
        console.warn(`ModuleReloader: Max retry attempts reached for ${modulePath}`);
        return fallbackModule;
      }

      this.reloadAttempts.set(modulePath, attempts + 1);

      // Dynamic import with cache busting
      const timestamp = Date.now();
      const moduleUrl = `${modulePath}?reload=${timestamp}`;
      
      const module = await import(moduleUrl);
      
      // Cache the successfully loaded module
      this.cache[modulePath] = module;
      this.failedModules.delete(modulePath);
      this.reloadAttempts.delete(modulePath);

      console.log(`ModuleReloader: Successfully reloaded ${modulePath}`);
      return module;

    } catch (error) {
      console.error(`ModuleReloader: Failed to reload ${modulePath}`, error);
      
      this.failedModules.add(modulePath);
      
      // Return fallback if available
      if (fallbackModule) {
        console.log(`ModuleReloader: Using fallback for ${modulePath}`);
        return fallbackModule;
      }

      throw error;
    }
  }

  clearCache(): void {
    this.cache = {};
    this.failedModules.clear();
    this.reloadAttempts.clear();
    console.log('ModuleReloader: Cache cleared');
  }

  getFailedModules(): string[] {
    return Array.from(this.failedModules);
  }

  getCacheStatus(): { cached: string[], failed: string[], attempts: Record<string, number> } {
    return {
      cached: Object.keys(this.cache),
      failed: Array.from(this.failedModules),
      attempts: Object.fromEntries(this.reloadAttempts)
    };
  }

  async preloadModules(modulePaths: string[]): Promise<void> {
    const promises = modulePaths.map(path => 
      this.reloadModule(path, { clearCache: false })
        .catch(error => console.warn(`Failed to preload ${path}:`, error))
    );
    
    await Promise.allSettled(promises);
    console.log(`ModuleReloader: Preloaded ${modulePaths.length} modules`);
  }
}

export const moduleReloader = new ModuleReloader();
