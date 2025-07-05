
import React from 'react';

interface ReactSafeWrapperProps {
  children: React.ReactNode;
}

const ReactSafeWrapper: React.FC<ReactSafeWrapperProps> = ({ children }) => {
  // Use safer React availability checks with try-catch
  try {
    if (typeof React === 'undefined' || !React || 
        typeof React.useState !== 'function' || 
        typeof React.useEffect !== 'function') {
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
  } catch (error) {
    console.error('ReactSafeWrapper error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <p className="text-red-600">React initialization failed</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }
};

export default ReactSafeWrapper;
