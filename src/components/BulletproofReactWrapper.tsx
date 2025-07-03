import React from 'react';

interface BulletproofReactWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

// Bulletproof React wrapper with comprehensive validation
export const BulletproofReactWrapper: React.FC<BulletproofReactWrapperProps> = ({ 
  children, 
  fallback 
}) => {
  // Critical: Validate React is fully loaded and functional
  if (!React || 
      typeof React.useState !== 'function' || 
      typeof React.useEffect !== 'function' ||
      typeof React.createElement !== 'function') {
    
    console.error('React not fully loaded, showing fallback UI');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
          <p className="text-therapy-600 font-medium">Initializing TherapySync...</p>
          <p className="text-sm text-gray-500 mt-2">Loading React components...</p>
        </div>
      </div>
    );
  }

  try {
    return <>{children}</>;
  } catch (error) {
    console.error('BulletproofReactWrapper: Render error:', error);
    
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-slate-700 font-medium mb-2">Component loading failed</p>
          <p className="text-sm text-gray-500">Please refresh the page</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-therapy-600 text-white rounded hover:bg-therapy-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }
};

export default BulletproofReactWrapper;