import React from 'react';

interface SafeReactWrapperProps {
  children: React.ReactNode;
  componentName?: string;
}

// Safe wrapper that ensures React is available before rendering components
const SafeReactWrapper: React.FC<SafeReactWrapperProps> = ({ children, componentName = 'Component' }) => {
  // Check if React is properly initialized
  if (!React || typeof React.useState !== 'function' || typeof React.useContext !== 'function') {
    console.error(`SafeReactWrapper: React hooks not available for ${componentName}`);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-red-600 mb-4">React Loading Error</h2>
          <p className="text-gray-600 mb-6">
            React is not properly initialized. Please refresh the page.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default SafeReactWrapper;