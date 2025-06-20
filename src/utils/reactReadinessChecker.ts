
import React from 'react';

/**
 * Simplified React readiness checker to prevent hook initialization errors
 */
export class ReactReadinessChecker {
  private static instance: ReactReadinessChecker;
  private isReactReady: boolean = false;
  private readinessChecked: boolean = false;

  static getInstance(): ReactReadinessChecker {
    if (!ReactReadinessChecker.instance) {
      ReactReadinessChecker.instance = new ReactReadinessChecker();
    }
    return ReactReadinessChecker.instance;
  }

  checkReactReadiness(): boolean {
    if (this.readinessChecked) {
      return this.isReactReady;
    }

    try {
      // Check if React is available and properly structured
      if (typeof React === 'undefined' || React === null || typeof React !== 'object') {
        console.warn('ReactReadinessChecker: React is not available or properly structured');
        return false;
      }

      // Check essential React methods
      const requiredMethods = ['createElement', 'Fragment', 'Component'];
      for (const method of requiredMethods) {
        if (!React[method]) {
          console.warn(`ReactReadinessChecker: React.${method} is not available`);
          return false;
        }
      }

      // Check required hooks
      const requiredHooks = ['useState', 'useEffect', 'useContext'];
      for (const hook of requiredHooks) {
        if (!React[hook] || typeof React[hook] !== 'function') {
          console.warn(`ReactReadinessChecker: React.${hook} is not available or not a function`);
          return false;
        }
      }

      this.isReactReady = true;
      this.readinessChecked = true;
      console.log('ReactReadinessChecker: React is ready and safe to use');
      return true;
      
    } catch (error) {
      console.error('ReactReadinessChecker: Validation failed', error);
      this.isReactReady = false;
      this.readinessChecked = true;
      return false;
    }
  }

  reset(): void {
    this.isReactReady = false;
    this.readinessChecked = false;
  }

  getReadinessStatus(): { isReady: boolean; checked: boolean } {
    return {
      isReady: this.isReactReady,
      checked: this.readinessChecked
    };
  }
}

// Export singleton instance
export const reactChecker = ReactReadinessChecker.getInstance();
