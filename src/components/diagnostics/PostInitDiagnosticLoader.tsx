import React, { useState, useEffect } from 'react';

// Post-initialization diagnostic system loader
// Only loads after React Router and auth context are fully initialized
const PostInitDiagnosticLoader: React.FC = () => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [loadedSystems, setLoadedSystems] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Wait for app to be fully stable before loading diagnostics
    const initTimer = setTimeout(() => {
      // Check if we have a stable DOM and React context
      if (document.readyState === 'complete' && 
          typeof React !== 'undefined' && 
          React.version) {
        console.log('PostInitDiagnosticLoader: App stable, enabling diagnostics');
        setShouldLoad(true);
      }
    }, 3000); // Wait 3 seconds after initial load

    return () => clearTimeout(initTimer);
  }, []);

  // Don't load diagnostics in production or if app isn't stable
  if (import.meta.env.PROD || !shouldLoad) {
    return null;
  }

  return (
    <div className="fixed top-0 right-0 z-50 p-2 bg-blue-50 border border-blue-200 rounded-bl-lg text-xs">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-blue-700">Diagnostics Active</span>
      </div>
      <div className="text-blue-600 mt-1">
        Systems: {loadedSystems.size}
      </div>
    </div>
  );
};

export default PostInitDiagnosticLoader;