
import { DebugLogger } from './debugLogger';
import ReactErrorFallback from '@/components/fallback/ReactErrorFallback';

interface ReactValidationResult {
  isValid: boolean;
  error?: Error;
  fallbackComponent?: React.ComponentType<any>;
}

class ReactInitValidator {
  private static instance: ReactInitValidator;
  private validationResult: ReactValidationResult | null = null;

  static getInstance(): ReactInitValidator {
    if (!ReactInitValidator.instance) {
      ReactInitValidator.instance = new ReactInitValidator();
    }
    return ReactInitValidator.instance;
  }

  validateReactInit(): ReactValidationResult {
    if (this.validationResult) {
      return this.validationResult;
    }

    try {
      // Check if React is available globally
      if (typeof React === 'undefined') {
        const error = new Error('React is not defined globally');
        DebugLogger.error('ReactInitValidator: React not available', error, {
          component: 'ReactInitValidator'
        });
        
        this.validationResult = {
          isValid: false,
          error,
          fallbackComponent: ReactErrorFallback
        };
        return this.validationResult;
      }

      // Check if React hooks are available
      if (!React.useState || !React.useEffect || !React.useContext) {
        const error = new Error('React hooks are not available');
        DebugLogger.error('ReactInitValidator: React hooks not available', error, {
          component: 'ReactInitValidator',
          reactAvailable: typeof React !== 'undefined',
          useStateAvailable: !!React.useState,
          useEffectAvailable: !!React.useEffect,
          useContextAvailable: !!React.useContext
        });
        
        this.validationResult = {
          isValid: false,
          error,
          fallbackComponent: ReactErrorFallback
        };
        return this.validationResult;
      }

      // Check React version compatibility
      if (React.version && parseInt(React.version.split('.')[0]) < 18) {
        const error = new Error(`Incompatible React version: ${React.version}`);
        DebugLogger.warn('ReactInitValidator: React version compatibility warning', {
          component: 'ReactInitValidator',
          version: React.version
        });
      }

      DebugLogger.info('ReactInitValidator: React initialization successful', {
        component: 'ReactInitValidator',
        version: React.version
      });

      this.validationResult = { isValid: true };
      return this.validationResult;

    } catch (error) {
      DebugLogger.error('ReactInitValidator: Validation failed with exception', error as Error, {
        component: 'ReactInitValidator'
      });
      
      this.validationResult = {
        isValid: false,
        error: error as Error,
        fallbackComponent: ReactErrorFallback
      };
      return this.validationResult;
    }
  }

  reset(): void {
    this.validationResult = null;
  }

  getFallbackComponent(): React.ComponentType<any> {
    return ReactErrorFallback;
  }
}

export const reactInitValidator = ReactInitValidator.getInstance();

// Validation HOC for components
export const withReactValidation = <P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.ComponentType<P> => {
  const ValidatedComponent: React.FC<P> = (props) => {
    const validation = reactInitValidator.validateReactInit();
    
    if (!validation.isValid) {
      const FallbackComponent = validation.fallbackComponent || ReactErrorFallback;
      return <FallbackComponent error={validation.error} />;
    }
    
    return <WrappedComponent {...props} />;
  };
  
  ValidatedComponent.displayName = `withReactValidation(${WrappedComponent.displayName || WrappedComponent.name})`;
  return ValidatedComponent;
};
