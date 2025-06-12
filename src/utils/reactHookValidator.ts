
import React from 'react';
import { DebugLogger } from './debugLogger';

interface HookValidationResult {
  isValid: boolean;
  error?: string;
  suggestions?: string[];
}

class ReactHookValidator {
  private static instance: ReactHookValidator;
  private hookCallStack: Map<string, number> = new Map();
  private componentRenderCount: Map<string, number> = new Map();

  static getInstance(): ReactHookValidator {
    if (!ReactHookValidator.instance) {
      ReactHookValidator.instance = new ReactHookValidator();
    }
    return ReactHookValidator.instance;
  }

  validateReactContext(): HookValidationResult {
    try {
      // Check if React is properly imported and available
      if (typeof React === 'undefined') {
        return {
          isValid: false,
          error: 'React is not defined - check import statement',
          suggestions: ['Use: import React from "react"', 'Ensure React is properly installed']
        };
      }

      // Check if React hooks are available
      if (!React.useState || !React.useEffect || !React.useContext) {
        return {
          isValid: false,
          error: 'React hooks are not available',
          suggestions: ['Check React version compatibility', 'Ensure proper React import pattern']
        };
      }

      return { isValid: true };
    } catch (error) {
      DebugLogger.error('ReactHookValidator: Error during validation', error as Error, {
        component: 'ReactHookValidator',
        method: 'validateReactContext'
      });
      
      return {
        isValid: false,
        error: `Validation failed: ${(error as Error).message}`,
        suggestions: ['Check React installation', 'Verify import statements', 'Check for circular dependencies']
      };
    }
  }

  validateHookUsage(hookName: string, componentName: string): HookValidationResult {
    const key = `${componentName}-${hookName}`;
    const currentCount = this.hookCallStack.get(key) || 0;
    this.hookCallStack.set(key, currentCount + 1);

    // Check for conditional hook usage (basic detection)
    if (currentCount > 10) {
      return {
        isValid: false,
        error: `Possible conditional hook usage detected in ${componentName}`,
        suggestions: ['Ensure hooks are called at the top level', 'Check for hooks inside loops or conditions']
      };
    }

    return { isValid: true };
  }

  trackComponentRender(componentName: string): void {
    const currentCount = this.componentRenderCount.get(componentName) || 0;
    this.componentRenderCount.set(componentName, currentCount + 1);

    if (currentCount > 100) {
      DebugLogger.warn(`ReactHookValidator: Excessive renders detected for ${componentName}`, {
        component: 'ReactHookValidator',
        componentName,
        renderCount: currentCount
      });
    }
  }

  resetTracking(): void {
    this.hookCallStack.clear();
    this.componentRenderCount.clear();
  }

  getDiagnostics(): Record<string, any> {
    return {
      hookCallStack: Object.fromEntries(this.hookCallStack),
      componentRenderCount: Object.fromEntries(this.componentRenderCount),
      reactAvailable: typeof React !== 'undefined',
      hooksAvailable: typeof React !== 'undefined' && !!React.useState
    };
  }
}

export const reactHookValidator = ReactHookValidator.getInstance();

// Development-only hook validation wrapper
export const withHookValidation = <T extends (...args: any[]) => any>(
  hookFn: T,
  hookName: string,
  componentName: string
): T => {
  if (import.meta.env.DEV) {
    return ((...args: Parameters<T>) => {
      const validation = reactHookValidator.validateHookUsage(hookName, componentName);
      
      if (!validation.isValid) {
        DebugLogger.error(`Hook validation failed: ${validation.error}`, new Error(validation.error), {
          component: componentName,
          hook: hookName,
          suggestions: validation.suggestions
        });
      }

      return hookFn(...args);
    }) as T;
  }
  
  return hookFn;
};
