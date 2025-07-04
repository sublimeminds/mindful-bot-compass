import React from 'react';

interface ReactValidationResult {
  isValid: boolean;
  error?: string;
  suggestions?: string[];
  diagnostics?: Record<string, any>;
}

class ReactHookValidator {
  private componentRenderCount: Record<string, number> = {};
  private hookCallStack: Record<string, string[]> = {};
  private lastValidationTime = 0;

  public validateReactContext(): ReactValidationResult {
    try {
      // Check if React is available and properly initialized
      if (typeof React === 'undefined' || React === null) {
        return {
          isValid: false,
          error: 'React is not available in global scope',
          suggestions: [
            'Ensure React is properly imported',
            'Check for circular dependencies',
            'Verify React installation'
          ]
        };
      }

      // Check React internal dispatcher
      const ReactInternals = (React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      if (!ReactInternals) {
        return {
          isValid: false,
          error: 'React internals not accessible',
          suggestions: [
            'React may not be properly initialized',
            'Check React version compatibility',
            'Ensure React is loaded before components'
          ]
        };
      }

      const dispatcher = ReactInternals.ReactCurrentDispatcher?.current;
      if (!dispatcher) {
        return {
          isValid: false,
          error: 'React dispatcher is null - hooks cannot be called outside component render cycle',
          suggestions: [
            'Ensure hooks are only called inside function components',
            'Check for hooks called in class components',
            'Verify component is properly wrapped in React context'
          ]
        };
      }

      // Check essential hooks availability
      const essentialHooks = ['useState', 'useEffect', 'useContext', 'useMemo', 'useCallback'];
      for (const hook of essentialHooks) {
        if (typeof dispatcher[hook] !== 'function') {
          return {
            isValid: false,
            error: `Hook ${hook} is not available in current dispatcher`,
            suggestions: [
              `Ensure ${hook} is imported from React`,
              'Check React version supports this hook',
              'Verify component render context'
            ]
          };
        }
      }

      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        error: `React validation failed: ${(error as Error).message}`,
        suggestions: [
          'Check browser console for additional errors',
          'Verify React and ReactDOM versions match',
          'Clear browser cache and reload'
        ]
      };
    }
  }

  public getDiagnostics(): Record<string, any> {
    return {
      reactAvailable: typeof React !== 'undefined' && React !== null,
      hooksAvailable: typeof React !== 'undefined' && typeof React.useState === 'function',
      componentRenderCount: this.componentRenderCount,
      hookCallStack: this.hookCallStack,
      lastValidationTime: this.lastValidationTime,
      dispatcher: this.getDispatcherInfo(),
      timestamp: new Date().toISOString()
    };
  }

  private getDispatcherInfo(): Record<string, any> {
    try {
      const ReactInternals = (React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      const dispatcher = ReactInternals?.ReactCurrentDispatcher?.current;
      
      return {
        available: !!dispatcher,
        hasUseState: !!dispatcher?.useState,
        hasUseEffect: !!dispatcher?.useEffect,
        hasUseContext: !!dispatcher?.useContext,
        hasUseMemo: !!dispatcher?.useMemo,
        type: dispatcher ? 'active' : 'null'
      };
    } catch {
      return { error: 'Cannot access dispatcher info' };
    }
  }

  public trackComponentRender(componentName: string): void {
    this.componentRenderCount[componentName] = (this.componentRenderCount[componentName] || 0) + 1;
  }

  public trackHookCall(componentName: string, hookName: string): void {
    if (!this.hookCallStack[componentName]) {
      this.hookCallStack[componentName] = [];
    }
    this.hookCallStack[componentName].push(hookName);
  }

  public resetTracking(): void {
    this.componentRenderCount = {};
    this.hookCallStack = {};
    this.lastValidationTime = Date.now();
  }

  public isReactSafe(): boolean {
    const validation = this.validateReactContext();
    this.lastValidationTime = Date.now();
    return validation.isValid;
  }

  public validateReactInit(): ReactValidationResult {
    return this.validateReactContext();
  }
}

export const reactHookValidator = new ReactHookValidator();

// Hook safety wrapper
export const safeUseState = <T>(initialState: T | (() => T)): [T, React.Dispatch<React.SetStateAction<T>>] | [T, () => void] => {
  try {
    if (!reactHookValidator.isReactSafe()) {
      console.warn('React hooks not safe, returning fallback state');
      return [typeof initialState === 'function' ? (initialState as () => T)() : initialState, () => {}];
    }
    return React.useState(initialState);
  } catch (error) {
    console.error('useState failed, using fallback:', error);
    return [typeof initialState === 'function' ? (initialState as () => T)() : initialState, () => {}];
  }
};

export const safeUseEffect = (effect: React.EffectCallback, deps?: React.DependencyList): void => {
  try {
    if (!reactHookValidator.isReactSafe()) {
      console.warn('React hooks not safe, skipping useEffect');
      return;
    }
    React.useEffect(effect, deps);
  } catch (error) {
    console.error('useEffect failed:', error);
  }
};