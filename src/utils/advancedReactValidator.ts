
interface ReactHookTest {
  name: string;
  isAvailable: boolean;
  isExecutable: boolean;
  error?: string;
}

interface ReactValidationReport {
  isReady: boolean;
  hooks: ReactHookTest[];
  overall: 'ready' | 'loading' | 'error';
  timestamp: string;
  retryCount: number;
}

class AdvancedReactValidator {
  private static instance: AdvancedReactValidator;
  private validationCache: ReactValidationReport | null = null;
  private maxRetries = 5;
  private retryDelay = 200;

  static getInstance(): AdvancedReactValidator {
    if (!AdvancedReactValidator.instance) {
      AdvancedReactValidator.instance = new AdvancedReactValidator();
    }
    return AdvancedReactValidator.instance;
  }

  async validateReactReadiness(retryCount = 0): Promise<ReactValidationReport> {
    const timestamp = new Date().toISOString();
    
    try {
      // Check if React exists at all
      if (typeof React === 'undefined' || React === null) {
        return {
          isReady: false,
          hooks: [],
          overall: 'error',
          timestamp,
          retryCount
        };
      }

      // Test each hook individually
      const hooks: ReactHookTest[] = [
        this.testHook('useState', React.useState),
        this.testHook('useEffect', React.useEffect),
        this.testHook('useContext', React.useContext),
        this.testHook('useCallback', React.useCallback),
        this.testHook('useMemo', React.useMemo),
        this.testHook('useRef', React.useRef)
      ];

      const allHooksReady = hooks.every(hook => hook.isAvailable && hook.isExecutable);

      // Additional React functionality tests
      const canCreateElement = this.testCreateElement();
      const canUseFragment = this.testFragment();

      const isReady = allHooksReady && canCreateElement && canUseFragment;

      const report: ReactValidationReport = {
        isReady,
        hooks,
        overall: isReady ? 'ready' : (retryCount < this.maxRetries ? 'loading' : 'error'),
        timestamp,
        retryCount
      };

      // Cache successful validation
      if (isReady) {
        this.validationCache = report;
      }

      return report;

    } catch (error) {
      console.error('React validation error:', error);
      return {
        isReady: false,
        hooks: [],
        overall: retryCount < this.maxRetries ? 'loading' : 'error',
        timestamp,
        retryCount
      };
    }
  }

  private testHook(name: string, hook: any): ReactHookTest {
    try {
      const isAvailable = typeof hook !== 'undefined' && hook !== null;
      
      if (!isAvailable) {
        return {
          name,
          isAvailable: false,
          isExecutable: false,
          error: 'Hook is undefined or null'
        };
      }

      // Test if hook is actually executable (not just defined)
      const isExecutable = typeof hook === 'function' && hook.toString().includes('native code');

      return {
        name,
        isAvailable,
        isExecutable,
        error: isExecutable ? undefined : 'Hook is not executable'
      };
    } catch (error) {
      return {
        name,
        isAvailable: false,
        isExecutable: false,
        error: `Hook test failed: ${error}`
      };
    }
  }

  private testCreateElement(): boolean {
    try {
      if (!React.createElement) return false;
      const testElement = React.createElement('div', null, 'test');
      return testElement !== null && typeof testElement === 'object';
    } catch {
      return false;
    }
  }

  private testFragment(): boolean {
    try {
      if (!React.Fragment) return false;
      const testFragment = React.createElement(React.Fragment, null, 'test');
      return testFragment !== null && typeof testFragment === 'object';
    } catch {
      return false;
    }
  }

  async waitForReactReady(maxWaitTime = 10000): Promise<ReactValidationReport> {
    const startTime = Date.now();
    let retryCount = 0;

    while (Date.now() - startTime < maxWaitTime && retryCount < this.maxRetries) {
      const report = await this.validateReactReadiness(retryCount);
      
      if (report.isReady) {
        console.log('AdvancedReactValidator: React is ready!', report);
        return report;
      }

      console.log(`AdvancedReactValidator: React not ready, retry ${retryCount + 1}/${this.maxRetries}`, report);
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, this.retryDelay * (retryCount + 1)));
      retryCount++;
    }

    // Final attempt
    return await this.validateReactReadiness(retryCount);
  }

  getCachedValidation(): ReactValidationReport | null {
    return this.validationCache;
  }

  clearCache(): void {
    this.validationCache = null;
  }
}

export const advancedReactValidator = AdvancedReactValidator.getInstance();
