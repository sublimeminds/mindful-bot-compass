
import React from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  componentName?: string;
}

const SafeHookWrapper: React.FC<Props> = ({ children, fallback, componentName = 'Component' }) => {
  // Double-check React availability at runtime
  if (typeof React === 'undefined' || !React.useState || !React.useEffect) {
    console.warn(`SafeHookWrapper: React hooks not available for ${componentName}, using fallback`);
    return fallback ? <>{fallback}</> : null;
  }

  try {
    return <>{children}</>;
  } catch (error) {
    console.error(`SafeHookWrapper: Error in ${componentName}`, error);
    return fallback ? <>{fallback}</> : null;
  }
};

export default SafeHookWrapper;
