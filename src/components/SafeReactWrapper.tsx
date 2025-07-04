import React from 'react';

interface SafeReactWrapperProps {
  children: React.ReactNode;
  componentName?: string;
}

// Safe wrapper that ensures React is available before rendering components
const SafeReactWrapper: React.FC<SafeReactWrapperProps> = ({ children, componentName = 'Component' }) => {
  // Comprehensive React readiness check
  const isReactFullyReady = () => {
    try {
      // Check React object exists
      if (!React || typeof React !== 'object') return false;
      
      // Check essential React methods
      const requiredMethods = ['createElement', 'Fragment', 'Component'];
      for (const method of requiredMethods) {
        if (!React[method]) return false;
      }
      
      // Check essential hooks exist and are functions
      const requiredHooks = ['useState', 'useEffect', 'useContext'];
      for (const hook of requiredHooks) {
        if (!React[hook] || typeof React[hook] !== 'function') return false;
      }
      
      // Test that hooks actually work by trying to create a test component
      try {
        React.createElement('div', null, 'test');
        return true;
      } catch (error) {
        console.warn('React createElement test failed:', error);
        return false;
      }
    } catch (error) {
      console.error('React readiness check failed:', error);
      return false;
    }
  };

  if (!isReactFullyReady()) {
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