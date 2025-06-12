
import React from 'react';
import { DebugLogger } from './debugLogger';

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
      // Check if React is available and properly imported
      if (!React || typeof React !== 'object') {
        const error = new Error('React is not properly imported or available');
        DebugLogger.error('ReactInitValidator: React not available', error, {
          component: 'ReactInitValidator'
        });
        
        this.validationResult = {
          isValid: false,
          error
        };
        return this.validationResult;
      }

      // Check if React hooks are available
      if (!React.useState || !React.useEffect || !React.useContext) {
        const error = new Error('React hooks are not available');
        DebugLogger.error('ReactInitValidator: React hooks not available', error, {
          component: 'ReactInitValidator',
          reactAvailable: !!React,
          useStateAvailable: !!React.useState,
          useEffectAvailable: !!React.useEffect,
          useContextAvailable: !!React.useContext
        });
        
        this.validationResult = {
          isValid: false,
          error
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
        error: error as Error
      };
      return this.validationResult;
    }
  }

  reset(): void {
    this.validationResult = null;
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
      // Return a simple error component instead of trying to import ReactErrorFallback
      return React.createElement('div', {
        style: {
          padding: '20px',
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '6px',
          color: '#991b1b'
        }
      }, `React Error: ${validation.error?.message || 'Unknown error'}`);
    }
    
    return React.createElement(WrappedComponent, props);
  };
  
  ValidatedComponent.displayName = `withReactValidation(${WrappedComponent.displayName || WrappedComponent.name})`;
  return ValidatedComponent;
};
