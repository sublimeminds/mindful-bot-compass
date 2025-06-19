
import React from 'react';
import { DebugLogger } from './debugLogger';

interface ContextRecoveryOptions {
  resetOnError?: boolean;
  fallbackValue?: any;
  onRecovery?: () => void;
}

class ContextReloader {
  private contextRegistry = new Map<string, React.Context<any>>();
  private recoveryStrategies = new Map<string, ContextRecoveryOptions>();

  registerContext<T>(
    name: string, 
    context: React.Context<T>, 
    options: ContextRecoveryOptions = {}
  ): void {
    this.contextRegistry.set(name, context);
    this.recoveryStrategies.set(name, options);
    
    DebugLogger.info(`ContextReloader: Registered context ${name}`, {
      component: 'ContextReloader',
      contextName: name
    });
  }

  async recoverContext(contextName: string): Promise<boolean> {
    try {
      const context = this.contextRegistry.get(contextName);
      const strategy = this.recoveryStrategies.get(contextName);

      if (!context) {
        DebugLogger.warn(`ContextReloader: Context ${contextName} not found in registry`, {
          component: 'ContextReloader'
        });
        return false;
      }

      // Attempt to reset context state
      if (strategy?.resetOnError) {
        // Create a new context instance with fallback value
        const newContext = React.createContext(strategy.fallbackValue);
        this.contextRegistry.set(contextName, newContext);
      }

      // Call recovery callback
      strategy?.onRecovery?.();

      DebugLogger.info(`ContextReloader: Successfully recovered context ${contextName}`, {
        component: 'ContextReloader',
        contextName
      });

      return true;
    } catch (error) {
      DebugLogger.error(`ContextReloader: Failed to recover context ${contextName}`, error as Error, {
        component: 'ContextReloader',
        contextName
      });
      return false;
    }
  }

  async recoverAllContexts(): Promise<{ success: string[], failed: string[] }> {
    const results = { success: [] as string[], failed: [] as string[] };

    for (const [contextName] of this.contextRegistry) {
      const recovered = await this.recoverContext(contextName);
      if (recovered) {
        results.success.push(contextName);
      } else {
        results.failed.push(contextName);
      }
    }

    DebugLogger.info('ContextReloader: Bulk recovery completed', {
      component: 'ContextReloader',
      results
    });

    return results;
  }

  getRegisteredContexts(): string[] {
    return Array.from(this.contextRegistry.keys());
  }

  clearRegistry(): void {
    this.contextRegistry.clear();
    this.recoveryStrategies.clear();
    DebugLogger.info('ContextReloader: Registry cleared', {
      component: 'ContextReloader'
    });
  }
}

export const contextReloader = new ContextReloader();

// Helper hook for automatic context recovery
export const useContextRecovery = (contextName: string, context: React.Context<any>) => {
  React.useEffect(() => {
    contextReloader.registerContext(contextName, context, {
      resetOnError: true,
      onRecovery: () => {
        console.log(`Context ${contextName} recovered automatically`);
      }
    });

    return () => {
      // Cleanup on unmount
    };
  }, [contextName, context]);
};
