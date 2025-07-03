import React from 'react';
import SafeErrorBoundary from './SafeErrorBoundary';

interface SafeWrapperProps {
  children: React.ReactNode;
  name?: string;
  fallback?: React.ReactNode;
  className?: string;
}

/**
 * Safe wrapper component that provides error boundary protection
 * Use this around any component that might fail to prevent app crashes
 */
export const SafeWrapper: React.FC<SafeWrapperProps> = ({ 
  children, 
  name, 
  fallback,
  className 
}) => {
  return (
    <div className={className}>
      <SafeErrorBoundary name={name} fallback={fallback}>
        {children}
      </SafeErrorBoundary>
    </div>
  );
};

/**
 * Higher-order component to wrap any component with error boundary
 */
export function withSafeWrapper<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    name?: string;
    fallback?: React.ReactNode;
  }
) {
  const WrappedComponent: React.FC<P> = (props) => (
    <SafeErrorBoundary 
      name={options?.name || Component.displayName || Component.name}
      fallback={options?.fallback}
    >
      <Component {...props} />
    </SafeErrorBoundary>
  );
  
  WrappedComponent.displayName = `SafeWrapper(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

export default SafeWrapper;