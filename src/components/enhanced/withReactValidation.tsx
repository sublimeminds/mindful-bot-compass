
import React from 'react';
import { reactHookValidator } from '@/utils/reactHookValidator';
import { validateComponentImports } from '@/utils/importValidator';
import { DebugLogger } from '@/utils/debugLogger';
import ReactHookErrorBoundary from './ReactHookErrorBoundary';

interface ValidationProps {
  componentName?: string;
}

export function withReactValidation<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
) {
  const displayName = componentName || WrappedComponent.displayName || WrappedComponent.name || 'Component';
  
  const ValidatedComponent = React.forwardRef<any, P & ValidationProps>((props, ref) => {
    const { componentName: propComponentName, ...restProps } = props as P & ValidationProps;
    const finalComponentName = propComponentName || displayName;

    // Track component render for diagnostics (async to avoid blocking)
    React.useEffect(() => {
      const trackAsync = async () => {
        await new Promise(resolve => setTimeout(resolve, 50));
        reactHookValidator.trackComponentRender(finalComponentName);
        validateComponentImports(finalComponentName);
      };
      trackAsync();
    }, [finalComponentName]);

  // Validate React context on mount and when deps change (but only post-mount)
  React.useEffect(() => {
    // Add delay to ensure React context is fully established
    const validateAsync = async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const validation = reactHookValidator.validateReactContext();
      
      if (!validation.isValid) {
        const error = validation.error ? new Error(validation.error) : new Error('Validation failed');
        DebugLogger.error(`Component validation failed for ${finalComponentName}`, error, {
          component: finalComponentName,
          suggestions: validation.suggestions
        });
      }
    };
    
    validateAsync();
  }, [finalComponentName]);

    return (
      <ReactHookErrorBoundary componentName={finalComponentName}>
        <WrappedComponent {...(restProps as P)} ref={ref} />
      </ReactHookErrorBoundary>
    );
  });

  ValidatedComponent.displayName = `withReactValidation(${displayName})`;

  return ValidatedComponent;
}

// Utility hook for manual validation (async to avoid blocking)
export const useReactValidation = (componentName: string) => {
  React.useEffect(() => {
    // Delay validation to avoid interfering with component startup
    const validateAsync = async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      reactHookValidator.trackComponentRender(componentName);
      validateComponentImports(componentName);
      
      const validation = reactHookValidator.validateReactContext();
      if (!validation.isValid) {
        DebugLogger.warn(`Manual validation failed for ${componentName}`, {
          component: componentName,
          error: validation.error,
          suggestions: validation.suggestions
        });
      }
    };
    
    validateAsync();
  }, [componentName]);
};
