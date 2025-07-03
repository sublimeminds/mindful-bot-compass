/**
 * App Recovery Manager - Handles app-wide recovery and fallback mechanisms
 */

interface RecoveryState {
  level: 'full' | 'minimal' | 'smart' | 'safe';
  attempts: number;
  lastError?: string;
  timestamp: number;
}

interface ModuleLoadResult {
  success: boolean;
  module?: any;
  error?: string;
}

class AppRecoveryManager {
  private recoveryState: RecoveryState;
  private maxAttempts = 3;
  private listeners: Set<(state: RecoveryState) => void> = new Set();

  constructor() {
    this.recoveryState = {
      level: 'full',
      attempts: 0,
      timestamp: Date.now()
    };
    
    console.log('AppRecoveryManager: Initialized');
  }

  /**
   * Clear React's lazy import cache by removing from webpack cache
   */
  private clearLazyImportCache(): void {
    try {
      // Clear webpack module cache for dynamic imports
      const webpackRequire = (window as any).__webpack_require__;
      if (typeof webpackRequire !== 'undefined' && webpackRequire?.cache) {
        Object.keys(webpackRequire.cache).forEach(key => {
          if (key.includes('AppInitializer') || key.includes('components')) {
            delete webpackRequire.cache[key];
          }
        });
      }
      
      // Clear any module resolution cache
      if ('webpackChunkName' in window) {
        delete (window as any).webpackChunkName;
      }
      
      console.log('AppRecoveryManager: Cleared lazy import cache');
    } catch (error) {
      console.warn('AppRecoveryManager: Failed to clear cache:', error);
    }
  }

  /**
   * Force reload the main app component with cache bypass
   */
  async loadAppComponent(): Promise<ModuleLoadResult> {
    try {
      this.clearLazyImportCache();
      
      // Use dynamic import with cache busting
      const timestamp = Date.now();
      
      // Try progressive app loader first
      try {
        const module = await import('@/components/ProgressiveAppLoader');
        if (module?.default) {
          console.log('AppRecoveryManager: Successfully loaded ProgressiveAppLoader');
          return { success: true, module: module.default };
        }
      } catch (error) {
        console.warn('AppRecoveryManager: ProgressiveAppLoader failed, trying AppInitializer:', error);
      }
      
      // Fallback to AppInitializer
      const moduleUrl = `/src/components/AppInitializer.tsx?bust=${timestamp}`;
      let module;
      try {
        module = await import(/* webpackIgnore: true */ moduleUrl);
      } catch {
        // Fallback to normal import
        module = await import('@/components/AppInitializer');
      }
      
      if (module?.default) {
        console.log('AppRecoveryManager: Successfully loaded AppInitializer');
        return { success: true, module: module.default };
      } else {
        throw new Error('Module loaded but no default export');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('AppRecoveryManager: Failed to load app components:', errorMsg);
      return { success: false, error: errorMsg };
    }
  }

  /**
   * Progressive recovery with multiple fallback levels
   */
  async attemptRecovery(): Promise<{ component: React.ComponentType; level: string }> {
    this.recoveryState.attempts++;
    this.recoveryState.timestamp = Date.now();
    
    console.log(`AppRecoveryManager: Recovery attempt ${this.recoveryState.attempts}`);
    
    // Level 1: Try full app
    if (this.recoveryState.attempts <= 2) {
      const result = await this.loadAppComponent();
      if (result.success && result.module) {
        this.recoveryState.level = 'full';
        this.notifyListeners();
        return { component: result.module, level: 'full' };
      }
      this.recoveryState.lastError = result.error;
    }
    
    // Level 2: Try progressive app loader
    if (this.recoveryState.attempts <= 3) {
      try {
        const { default: ProgressiveAppLoader } = await import('@/components/ProgressiveAppLoader');
        this.recoveryState.level = 'minimal';
        this.notifyListeners();
        return { component: ProgressiveAppLoader, level: 'minimal' };
      } catch (error) {
        console.warn('AppRecoveryManager: Progressive loader failed:', error);
      }
    }
    
    // Level 3: Try smart recovery mode
    if (this.recoveryState.attempts <= 4) {
      try {
        const { default: SmartRecoveryMode } = await import('@/components/SmartRecoveryMode');
        this.recoveryState.level = 'smart';
        this.notifyListeners();
        return { component: SmartRecoveryMode, level: 'smart' };
      } catch (error) {
        console.warn('AppRecoveryManager: Smart recovery failed:', error);
      }
    }
    
    // Level 3: Safe minimal app
    try {
      const { default: SafeMinimalApp } = await import('@/components/SafeMinimalApp');
      this.recoveryState.level = 'safe';
      this.notifyListeners();
      return { component: SafeMinimalApp, level: 'safe' };
    } catch (error) {
      console.error('AppRecoveryManager: Even safe mode failed:', error);
      throw new Error('Complete recovery failure');
    }
  }

  /**
   * Force full app restart with cache clearing
   */
  async forceRestart(): Promise<void> {
    console.log('AppRecoveryManager: Force restart initiated');
    
    // Clear all caches
    this.clearLazyImportCache();
    
    // Clear browser caches
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      } catch (error) {
        console.warn('Failed to clear browser caches:', error);
      }
    }
    
    // Reset recovery state
    this.recoveryState = {
      level: 'full',
      attempts: 0,
      timestamp: Date.now()
    };
    
    // Force page reload with cache bypass
    window.location.reload();
  }

  /**
   * Smart retry that attempts different strategies
   */
  async smartRetry(): Promise<{ component: React.ComponentType; level: string }> {
    console.log('AppRecoveryManager: Smart retry initiated');
    
    // Reset attempts for fresh start
    this.recoveryState.attempts = 0;
    this.clearLazyImportCache();
    
    return this.attemptRecovery();
  }

  /**
   * Get current recovery state
   */
  getRecoveryState(): RecoveryState {
    return { ...this.recoveryState };
  }

  /**
   * Add recovery state listener
   */
  onStateChange(callback: (state: RecoveryState) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Notify all listeners of state change
   */
  private notifyListeners(): void {
    this.listeners.forEach(callback => {
      try {
        callback(this.recoveryState);
      } catch (error) {
        console.error('AppRecoveryManager: Listener error:', error);
      }
    });
  }

  /**
   * Check if we should use fallback mode
   */
  shouldUseFallback(): boolean {
    return this.recoveryState.attempts >= this.maxAttempts || 
           this.recoveryState.level !== 'full';
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    this.listeners.clear();
  }
}

// Global recovery manager instance
export const appRecoveryManager = new AppRecoveryManager();