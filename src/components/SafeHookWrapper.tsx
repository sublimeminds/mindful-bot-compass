
import React from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  componentName?: string;
}

const SafeHookWrapper: React.FC<Props> = ({ children, fallback, componentName = 'Component' }) => {
  try {
    // Safer React availability checks
    if (typeof React === 'undefined' || !React || 
        typeof React.useState !== 'function' || 
        typeof React.useEffect !== 'function') {
      console.warn(`SafeHookWrapper: React hooks not available for ${componentName}, using fallback`);
      return fallback ? <>{fallback}</> : (
        <div className="p-4 text-center text-gray-500">
          Loading {componentName}...
        </div>
      );
    }

    return <>{children}</>;
  } catch (error) {
    console.error(`SafeHookWrapper: Error in ${componentName}`, error);
    return fallback ? <>{fallback}</> : (
      <div className="p-4 text-center text-red-500">
        Error loading {componentName}
      </div>
    );
  }
};

export default SafeHookWrapper;
