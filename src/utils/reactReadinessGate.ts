import React from 'react';

// React Readiness Gate - ensures hooks are only called when React dispatcher is ready
class ReactReadinessGate {
  private static instance: ReactReadinessGate;
  private isReady = false;
  private readyPromise: Promise<void>;
  private readyResolve!: () => void;
  private hookCallQueue: Array<() => void> = [];
  private warningsEnabled = process.env.NODE_ENV === 'development';

  constructor() {
    this.readyPromise = new Promise<void>((resolve) => {
      this.readyResolve = resolve;
    });
    this.initializeReadinessCheck();
  }

  static getInstance(): ReactReadinessGate {
    if (!ReactReadinessGate.instance) {
      ReactReadinessGate.instance = new ReactReadinessGate();
    }
    return ReactReadinessGate.instance;
  }

  private initializeReadinessCheck() {
    // Check if React dispatcher is available
    const checkReactReady = () => {
      try {
        // Try to access React's internal dispatcher
        const react = React as any;
        const dispatcher = react.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED?.ReactCurrentDispatcher?.current;
        
        if (dispatcher && typeof dispatcher.useState === 'function') {
          this.markAsReady();
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    };

    // Immediate check
    if (checkReactReady()) return;

    // Polling check with exponential backoff
    let attempts = 0;
    const maxAttempts = 20;
    
    const pollReactReady = () => {
      attempts++;
      
      if (checkReactReady()) {
        return;
      }
      
      if (attempts < maxAttempts) {
        const delay = Math.min(1000, 50 * Math.pow(2, attempts));
        setTimeout(pollReactReady, delay);
      } else {
        // Force ready after max attempts to prevent hanging
        console.warn('ReactReadinessGate: Max attempts reached, forcing ready state');
        this.markAsReady();
      }
    };

    // Start with a small delay to let React initialize
    setTimeout(pollReactReady, 100);
  }

  private markAsReady() {
    this.isReady = true;
    this.readyResolve();
    
    // Process queued hook calls
    this.hookCallQueue.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('ReactReadinessGate: Error processing queued hook call:', error);
      }
    });
    this.hookCallQueue = [];
  }

  // Public API
  public isReactReady(): boolean {
    return this.isReady;
  }

  public async waitForReady(): Promise<void> {
    return this.readyPromise;
  }

  public safeHookCall<T>(hookCall: () => T, fallback?: T): T | undefined {
    if (this.isReady) {
      try {
        return hookCall();
      } catch (error) {
        if (this.warningsEnabled) {
          console.warn('ReactReadinessGate: Hook call failed even when ready:', error);
        }
        return fallback;
      }
    } else {
      if (this.warningsEnabled) {
        console.warn('ReactReadinessGate: Hook called before React ready, returning fallback');
      }
      return fallback;
    }
  }

  public queueHookCall(callback: () => void): void {
    if (this.isReady) {
      callback();
    } else {
      this.hookCallQueue.push(callback);
    }
  }

  // Developer utilities
  public enableWarnings(enabled: boolean = true): void {
    this.warningsEnabled = enabled;
  }

  public getReadinessStats(): {
    isReady: boolean;
    queuedCalls: number;
    warningsEnabled: boolean;
  } {
    return {
      isReady: this.isReady,
      queuedCalls: this.hookCallQueue.length,
      warningsEnabled: this.warningsEnabled
    };
  }
}

// Singleton instance
export const reactReadinessGate = ReactReadinessGate.getInstance();

// Safe hook wrappers
export const safeUseState = <T>(initialState: T | (() => T)): [T, React.Dispatch<React.SetStateAction<T>>] | [T, () => void] => {
  return reactReadinessGate.safeHookCall(
    () => React.useState(initialState),
    [typeof initialState === 'function' ? (initialState as () => T)() : initialState, () => {}]
  ) as [T, React.Dispatch<React.SetStateAction<T>>] | [T, () => void];
};

export const safeUseEffect = (effect: React.EffectCallback, deps?: React.DependencyList): void => {
  reactReadinessGate.safeHookCall(
    () => React.useEffect(effect, deps),
    undefined
  );
};

export const safeUseMemo = <T>(factory: () => T, deps: React.DependencyList | undefined): T => {
  return reactReadinessGate.safeHookCall(
    () => React.useMemo(factory, deps),
    factory() // Fallback to direct call
  ) as T;
};

export const safeUseCallback = <T extends (...args: any[]) => any>(callback: T, deps: React.DependencyList): T => {
  return reactReadinessGate.safeHookCall(
    () => React.useCallback(callback, deps),
    callback // Fallback to original callback
  ) as T;
};

// Hook readiness checker for debugging
export const useReactReadiness = () => {
  const [stats, setStats] = React.useState(reactReadinessGate.getReadinessStats());
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setStats(reactReadinessGate.getReadinessStats());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return stats;
};

export default reactReadinessGate;