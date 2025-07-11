
import React, { useEffect } from 'react';
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

    // Track component render for diagnostics
    useEffect(() => {
      reactHookValidator.trackComponentRender(finalComponentName);
      validateComponentImports(finalComponentName);
    });

    // Validate React context on mount and when deps change
    useEffect(() => {
      const validation = reactHookValidator.validateReactContext();
      
      if (!validation.isValid) {
        DebugLogger.error(`Component validation failed for ${finalComponentName}`, validation.error || new Error('Validation failed'), {
          component: finalComponentName,
          suggestions: validation.suggestions
        });
      }
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

// Utility hook for manual validation
export const useReactValidation = (componentName: string) => {
  useEffect(() => {
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
  }, [componentName]);
};
