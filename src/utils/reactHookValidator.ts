
interface ReactValidationResult {
  isValid: boolean;
  error?: Error;
  suggestions?: string[];
}

class ReactHookValidator {
  private componentRenderCount: Record<string, number> = {};
  private hookCallStack: Record<string, string[]> = {};

  validateReactInit(): ReactValidationResult {
    try {
      // Check if React is available
      if (typeof React === 'undefined') {
        return {
          isValid: false,
          error: new Error('React is not available'),
          suggestions: ['Ensure React is properly imported', 'Check if React is installed']
        };
      }

      // Check if hooks are available
      if (typeof React.useState === 'undefined') {
        return {
          isValid: false,
          error: new Error('React hooks are not available'),
          suggestions: ['Update to React 16.8 or higher', 'Check React import']
        };
      }

      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        error: error as Error,
        suggestions: ['Check React installation', 'Verify React version compatibility']
      };
    }
  }

  validateReactContext(): ReactValidationResult {
    try {
      if (typeof React.useContext === 'undefined') {
        return {
          isValid: false,
          error: new Error('React.useContext is not available'),
          suggestions: ['Update React version', 'Check if hooks are properly imported']
        };
      }

      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        error: error as Error,
        suggestions: ['Check React context implementation', 'Verify provider setup']
      };
    }
  }

  trackComponentRender(componentName: string): void {
    this.componentRenderCount[componentName] = (this.componentRenderCount[componentName] || 0) + 1;
  }

  trackHookCall(hookName: string, dependencies: string[]): void {
    if (!this.hookCallStack[hookName]) {
      this.hookCallStack[hookName] = [];
    }
    this.hookCallStack[hookName].push(...dependencies);
  }

  getDiagnostics() {
    return {
      reactAvailable: typeof React !== 'undefined',
      hooksAvailable: typeof React !== 'undefined' && typeof React.useState !== 'undefined',
      componentRenderCount: this.componentRenderCount,
      hookCallStack: this.hookCallStack
    };
  }

  resetTracking(): void {
    this.componentRenderCount = {};
    this.hookCallStack = {};
  }
}

export const reactHookValidator = new ReactHookValidator();
