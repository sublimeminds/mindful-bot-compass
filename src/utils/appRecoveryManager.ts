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
   * Progressive recovery with enhanced chain
   */
  async attemptRecovery(): Promise<{ component: React.ComponentType; level: string }> {
    this.recoveryState.attempts++;
    this.recoveryState.timestamp = Date.now();
    
    console.log(`AppRecoveryManager: Enhanced recovery attempt ${this.recoveryState.attempts}`);
    
    // Import and use enhanced recovery chain
    const { enhancedRecoveryChain } = await import('./enhancedRecoveryChain');
    
    // Try current level
    let result = await enhancedRecoveryChain.attemptCurrentLevel();
    
    // If failed, escalate through levels
    while (!result.success && enhancedRecoveryChain.escalate()) {
      result = await enhancedRecoveryChain.attemptCurrentLevel();
    }
    
    if (result.success && result.component) {
      const levelName = enhancedRecoveryChain.getCurrentLevel()?.name || 'unknown';
      this.recoveryState.level = levelName as any;
      this.notifyListeners();
      return { component: result.component, level: levelName };
    }
    
    // Complete failure
    throw new Error('All recovery levels failed');
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