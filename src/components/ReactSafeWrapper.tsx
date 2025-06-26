
import React from 'react';

interface ReactSafeWrapperProps {
  children: React.ReactNode;
}

const ReactSafeWrapper: React.FC<ReactSafeWrapperProps> = ({ children }) => {
  // Check if React and its hooks are available
  if (!React || typeof React.useState !== 'function' || typeof React.useEffect !== 'function') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading React...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ReactSafeWrapper;
