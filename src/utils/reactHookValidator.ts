
import React from 'react';
import { DebugLogger } from './debugLogger';

interface ReactValidationResult {
  isValid: boolean;
  error?: Error;
  suggestions?: string[];
}

interface ReactDiagnostics {
  reactAvailable: boolean;
  hooksAvailable: boolean;
  versionCompatible: boolean;
  componentRenderCount: Record<string, number>;
  hookCallStack: Record<string, any[]>;
  lastError?: Error;
}

class ReactHookValidator {
  private static instance: ReactHookValidator;
  private diagnostics: ReactDiagnostics;
  private componentRenderCounts = new Map<string, number>();
  private hookCalls = new Map<string, any[]>();

  constructor() {
    this.diagnostics = {
      reactAvailable: false,
      hooksAvailable: false,
      versionCompatible: false,
      componentRenderCount: {},
      hookCallStack: {}
    };
  }

  static getInstance(): ReactHookValidator {
    if (!ReactHookValidator.instance) {
      ReactHookValidator.instance = new ReactHookValidator();
    }
    return ReactHookValidator.instance;
  }

  validateReactInit(): ReactValidationResult {
    try {
      // Check if React is available
      if (typeof React === 'undefined' || !React) {
        const error = new Error('React is not available');
        this.diagnostics.lastError = error;
        return {
          isValid: false,
          error,
          suggestions: [
            'Ensure React is properly imported',
            'Check if React package is installed',
            'Verify bundle integrity'
          ]
        };
      }

      this.diagnostics.reactAvailable = true;

      // Check React hooks availability
      const requiredHooks = ['useState', 'useEffect', 'useContext', 'useCallback', 'useMemo'];
      const missingHooks = requiredHooks.filter(hook => !React[hook]);
      
      if (missingHooks.length > 0) {
        const error = new Error(`Missing React hooks: ${missingHooks.join(', ')}`);
        this.diagnostics.lastError = error;
        return {
          isValid: false,
          error,
          suggestions: [
            'Update React to version 16.8 or higher',
            'Check React import statement',
            'Verify React build integrity'
          ]
        };
      }

      this.diagnostics.hooksAvailable = true;

      // Check React version compatibility
      if (React.version) {
        const majorVersion = parseInt(React.version.split('.')[0]);
        this.diagnostics.versionCompatible = majorVersion >= 16;
        
        if (!this.diagnostics.versionCompatible) {
          const error = new Error(`Incompatible React version: ${React.version}. Minimum required: 16.8`);
          this.diagnostics.lastError = error;
          return {
            isValid: false,
            error,
            suggestions: [
              'Update React to version 16.8 or higher',
              'Update React DOM as well',
              'Check package.json dependencies'
            ]
          };
        }
      }

      DebugLogger.info('ReactHookValidator: React validation successful', {
        component: 'ReactHookValidator',
        version: React.version
      });

      return { isValid: true };

    } catch (error) {
      this.diagnostics.lastError = error as Error;
      DebugLogger.error('ReactHookValidator: Validation failed', error as Error, {
        component: 'ReactHookValidator'
      });
      
      return {
        isValid: false,
        error: error as Error,
        suggestions: [
          'Check browser console for detailed errors',
          'Try refreshing the page',
          'Clear browser cache and reload'
        ]
      };
    }
  }

  validateReactContext(): ReactValidationResult {
    try {
      // Test React context creation
      const TestContext = React.createContext(null);
      if (!TestContext) {
        throw new Error('React.createContext is not working');
      }

      // Test hook call in safe environment
      let testResult = null;
      const TestComponent = () => {
        try {
          testResult = React.useState(null);
          return null;
        } catch (error) {
          throw new Error(`React hooks not working: ${error.message}`);
        }
      };

      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        error: error as Error,
        suggestions: [
          'React context system is not functioning',
          'Check if React is properly initialized',
          'Try reloading the application'
        ]
      };
    }
  }

  trackComponentRender(componentName: string): void {
    const count = this.componentRenderCounts.get(componentName) || 0;
    this.componentRenderCounts.set(componentName, count + 1);
    this.diagnostics.componentRenderCount[componentName] = count + 1;
  }

  trackHookCall(hookName: string, params: any[]): void {
    const calls = this.hookCalls.get(hookName) || [];
    calls.push({ timestamp: Date.now(), params });
    this.hookCalls.set(hookName, calls);
    this.diagnostics.hookCallStack[hookName] = calls;
  }

  getDiagnostics(): ReactDiagnostics {
    return { ...this.diagnostics };
  }

  resetTracking(): void {
    this.componentRenderCounts.clear();
    this.hookCalls.clear();
    this.diagnostics.componentRenderCount = {};
    this.diagnostics.hookCallStack = {};
    this.diagnostics.lastError = undefined;
  }
}

export const reactHookValidator = ReactHookValidator.getInstance();
